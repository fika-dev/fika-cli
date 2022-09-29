import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import * as T from "fp-ts/Task";
import { IPromptService } from "src/domain/service/i-prompt.service";
import { Issue } from "@/domain/entity/issue.entity";
import { DomainError } from "@/domain/general/general.types";

import { ExecuteGitCommand, GitCommand } from "@/domain/git-command/command.types";
import {
  applyStashCmd,
  checkoutCmd,
  createBranchCmd,
  getBranchesCmd,
  stashCmd,
} from "@/domain/git-command/git-command.values";
import { checkNoError, parseBranches } from "@/domain/git-command/parser/parser.functions";
import {
  existsLocalBranch,
  existsRemoteBranch,
  isThereSomthingToStash,
} from "@/domain/rules/validation-rules/validation-rules.functions";
import { UserStopped } from "@/domain/value_object/exceptions/user_stopped";
import { pipe } from "fp-ts/lib/function";
import { CommandAndParser, ContextValue } from "../context/context.types";
import { checkContext } from "../context/context.functions";

export const getGitCommandWithArgument =
  (gitCommand: GitCommand) =>
  (...params: string[]) => {
    return {
      ...gitCommand,
      argument: params.join(" "),
    };
  };

export const executeAndParseGitCommand =
  (excuteGitCommand: ExecuteGitCommand) =>
  (commandAndParser: CommandAndParser): T.Task<ContextValue | DomainError> => {
    return pipe(
      commandAndParser.command,
      excuteGitCommand,
      T.map(output => commandAndParser.parser(output))
    );
  };

const _createTrackingLocalBranch = (execute: ExecuteGitCommand) => async (branchName: string) => {
  const createTackingBranchCmd = getGitCommandWithArgument(createBranchCmd)(
    branchName,
    `origin/${branchName}`
  );
  await executeAndParseGitCommand(execute)({
    command: createTackingBranchCmd,
    parser: checkNoError,
  })();
};

const _createLocalBranch =
  (execute: ExecuteGitCommand) => async (branchName: string, baseBranchName: string) => {
    const createLocalBranchCmd = getGitCommandWithArgument(createBranchCmd)(
      branchName,
      baseBranchName
    );
    await executeAndParseGitCommand(execute)({
      command: createLocalBranchCmd,
      parser: checkNoError,
    })();
  };

const _checkoutToBranch = (execute: ExecuteGitCommand) => async (branchName: string) => {
  const checkoutToBranchCmd = getGitCommandWithArgument(checkoutCmd)(branchName);
  await executeAndParseGitCommand(execute)({
    command: checkoutToBranchCmd,
    parser: checkNoError,
  })();
};

const _checkNeedToStash = (execute: ExecuteGitCommand) => async () => {
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const needToStash = await isThereSomthingToStash(execute);
  if (needToStash) {
    const moveChanges = await promptService.confirmAction(
      "There is unstaged changes.\nDo you wanna move these changes to the new started branch?: "
    );
    if (moveChanges) {
      return true;
    } else {
      throw new UserStopped("UserStopped:UnstagedChange");
    }
  } else {
    return false;
  }
};

const _stashUnstagedChange = (execute: ExecuteGitCommand) => async () => {
  await executeAndParseGitCommand(execute)({
    command: stashCmd,
    parser: checkNoError,
  })();
};

const _checkoutToBranchWithStash = (execute: ExecuteGitCommand) => async (branchName: string) => {
  await _stashUnstagedChange(execute)();
  await _checkoutToBranch(execute)(branchName);
  await _stashApply(execute)();
};

const _stashApply = (execute: ExecuteGitCommand) => async () => {
  return await executeAndParseGitCommand(execute)({
    command: applyStashCmd,
    parser: checkNoError,
  })();
};

const _createTrackingBranchIfNeeded =
  (execute: ExecuteGitCommand) => async (branchName: string) => {
    const doesExistLocalBranch = await existsLocalBranch(execute)(branchName);
    if (!doesExistLocalBranch) {
      const doesExistRemoteBranch = await existsRemoteBranch(execute)(`origin/${branchName}`);
      if (doesExistRemoteBranch) {
        await _createTrackingLocalBranch(execute)(branchName);
      } else {
        throw {
          type: "NoLocalAndRemoteBranch",
        } as DomainError;
      }
    }
  };

export const getLatestBranchByCommit = (execute: ExecuteGitCommand) => async () => {
  const getSortedBranchesCmd = getGitCommandWithArgument(getBranchesCmd)("--sort=-committerdate ");
  const branches = await executeAndParseGitCommand(execute)({
    command: getSortedBranchesCmd,
    parser: parseBranches,
  })();
  return branches[0];
};

export const checkoutWithChanges = (execute: ExecuteGitCommand) => async (branchName: string) => {
  const needToStash = await _checkNeedToStash(execute)();
  if (needToStash) {
    await _checkoutToBranchWithStash(execute)(branchName);
  } else {
    await _checkoutToBranch(execute)(branchName);
  }
};

export const checkoutToIssue = (execute: ExecuteGitCommand) => async (issue: Issue) => {
  if (issue.branchName) {
    await _createTrackingBranchIfNeeded(execute)(issue.branchName);
    await checkoutWithChanges(execute)(issue.branchName);
  } else {
    throw {
      type: "NoBranchNameInIssue",
    } as DomainError;
  }
};

export const getRemoteOrigin = (execute: ExecuteGitCommand) => async (): Promise<string> => {
  const originOrError = await checkContext(execute)({ domain: "git", field: "remote" })();
  if (typeof originOrError === "string") {
    return originOrError as string;
  } else {
    throw originOrError;
  }
};
