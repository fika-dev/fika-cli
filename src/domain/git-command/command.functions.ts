import { Issue } from "@/domain/entity/issue.entity";
import { DomainError } from "@/domain/general/general.types";
import * as T from "fp-ts/Task";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IPromptService } from "src/domain/service/i-prompt.service";

import { ExecuteGitCommand } from "@/domain/git-command/command.types";
import {
  abortMergeCmd,
  applyStashCmd,
  checkoutCmd,
  createBranchCmd,
  fetchCmd,
  getBranchesCmd,
  getCurrentBranchCmd,
  getGitCommandWithArgument,
  getGitRepoPathCmd,
  getRemoteUrlCmd,
  pullFromCmd,
  pushBranchCmd,
  stashCmd,
} from "@/domain/git-command/git-command.values";
import {
  checkNoError,
  checkNoErrorAndReturnOutput,
  isFeatureBranch,
  parseMultipleLines,
  parsePullOutput,
  parseRemoteAddress,
} from "@/domain/git-command/parser/parser.functions";
import {
  existsLocalBranch,
  existsRemoteBranch,
  isThereSomthingToStash,
} from "@/domain/rules/validation-rules/validation-rules.functions";
import { UserStopped } from "@/domain/value_object/exceptions/user_stopped";
import { pipe } from "fp-ts/lib/function";
import { checkContext } from "../context/context.functions";
import { CommandAndParser, ContextValue } from "../context/context.types";

export const executeAndParseGitCommand =
  (excuteGitCommand: ExecuteGitCommand) =>
  (commandAndParser: CommandAndParser): T.Task<ContextValue | DomainError> => {
    return pipe(
      commandAndParser.command,
      excuteGitCommand,
      T.map(output => commandAndParser.parser(output))
    );
  };

const _createTrackingLocalBranch =
  (execute: ExecuteGitCommand) => async (branchName: string, remoteAlias: string) => {
    const createTackingBranchCmd = getGitCommandWithArgument(createBranchCmd)(
      branchName,
      `${remoteAlias}/${branchName}`
    );
    await executeAndParseGitCommand(execute)({
      command: createTackingBranchCmd,
      parser: checkNoError,
    })();
  };

export const createLocalBranch =
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

const _fetch = (execute: ExecuteGitCommand) => async () => {
  return await executeAndParseGitCommand(execute)({
    command: fetchCmd,
    parser: checkNoError,
  })();
};

const _createTrackingBranchIfNeeded =
  (execute: ExecuteGitCommand) => async (branchName: string, remoteAlias: string) => {
    const doesExistLocalBranch = await existsLocalBranch(execute)(branchName);
    if (!doesExistLocalBranch) {
      await _fetch(execute)();
      const doesExistRemoteBranch = await existsRemoteBranch(execute)(
        `${remoteAlias}/${branchName}`
      );
      if (doesExistRemoteBranch) {
        await _createTrackingLocalBranch(execute)(branchName, remoteAlias);
      } else {
        throw {
          type: "GitError",
          subType: "NotExistingBranch",
          value: branchName,
        } as DomainError;
      }
    }
  };
export const pullFrom =
  (execute: ExecuteGitCommand) => async (remoteBranch: string, remoteAlias: string) => {
    const pullFromBranchCmd = getGitCommandWithArgument(pullFromCmd)(remoteAlias, remoteBranch);
    return await executeAndParseGitCommand(execute)({
      command: pullFromBranchCmd,
      parser: parsePullOutput,
    })();
  };

export const getCurrentBranch = (execute: ExecuteGitCommand) => async () => {
  const branches = (await executeAndParseGitCommand(execute)({
    command: getCurrentBranchCmd,
    parser: parseMultipleLines,
  })()) as string[];
  if (branches.length > 0) {
    return branches[0];
  } else {
    throw {
      type: "GitError",
      subType: "NoCurrentBranch",
    };
  }
};

export const getLatestBranchByCommit =
  (execute: ExecuteGitCommand) => async (featureBranchPattern: string) => {
    const getSortedBranchesCmd =
      getGitCommandWithArgument(getBranchesCmd)("--sort=-committerdate ");
    const branches = (await executeAndParseGitCommand(execute)({
      command: getSortedBranchesCmd,
      parser: parseMultipleLines,
    })()) as string[];
    const isFeatureBranchWithPattern = isFeatureBranch(featureBranchPattern);
    const featureBranches = branches.filter(isFeatureBranchWithPattern);
    if (featureBranches.length > 0) {
      return featureBranches[0];
    } else {
      throw {
        type: "GitError",
        subType: "NoLocalFeatureBranch",
        value: featureBranchPattern,
      };
    }
  };

export const checkoutWithChanges = (execute: ExecuteGitCommand) => async (branchName: string) => {
  const needToStash = await _checkNeedToStash(execute)();
  if (needToStash) {
    await _checkoutToBranchWithStash(execute)(branchName);
  } else {
    await _checkoutToBranch(execute)(branchName);
  }
};

export const checkoutToIssue =
  (execute: ExecuteGitCommand) => async (issue: Issue, remoteAlias: string) => {
    if (issue.branchName) {
      await _createTrackingBranchIfNeeded(execute)(issue.branchName, remoteAlias);
      await checkoutWithChanges(execute)(issue.branchName);
    } else {
      throw {
        type: "GitError",
        subType: "NoBranchNameInIssueRecord",
        value: issue.title,
      } as DomainError;
    }
  };

export const checkoutToBranchName =
  (execute: ExecuteGitCommand) => async (branchName: string, remoteAlias: string) => {
    await _createTrackingBranchIfNeeded(execute)(branchName, remoteAlias);
    await checkoutWithChanges(execute)(branchName);
  };

export const getRemoteAddress =
  (execute: ExecuteGitCommand) =>
  async (remoteAlias: string): Promise<string> => {
    const originOrError = await executeAndParseGitCommand(execute)({
      command: getGitCommandWithArgument(getRemoteUrlCmd)(remoteAlias),
      parser: parseRemoteAddress,
    })();
    if (typeof originOrError === "string") {
      return originOrError as string;
    } else {
      throw originOrError;
    }
  };

export const checkCurrentRemoteBranch =
  (execute: ExecuteGitCommand) =>
  async (remoteAlias: string): Promise<string | undefined> => {
    const currentBranch = await getCurrentBranch(execute)();
    await _fetch(execute)();
    const remoteBranches = (await checkContext(execute)({
      domain: "git",
      field: "remoteBranches",
    })()) as string[];
    const currentBranchExistedInRemoteBranches = remoteBranches.find(
      branch => `${remoteAlias}/${currentBranch}` === branch
    );
    if (currentBranchExistedInRemoteBranches) {
      return currentBranch as string;
    } else {
      return undefined;
    }
  };

export const pushBranch =
  (execute: ExecuteGitCommand) => async (branchName: string, remoteAlias: string) => {
    const createTackingBranchCmd = getGitCommandWithArgument(pushBranchCmd)(
      remoteAlias,
      branchName
    );
    return await executeAndParseGitCommand(execute)({
      command: createTackingBranchCmd,
      parser: checkNoError,
    })();
  };

export const abortMerge = (execute: ExecuteGitCommand) => async () => {
  return await executeAndParseGitCommand(execute)({
    command: abortMergeCmd,
    parser: checkNoError,
  })();
};

export const getGitRepoPath = (execute: ExecuteGitCommand) => async (): Promise<string> => {
  const repoPath = (await executeAndParseGitCommand(execute)({
    command: getGitRepoPathCmd,
    parser: checkNoErrorAndReturnOutput,
  })()) as string;
  return repoPath;
};
