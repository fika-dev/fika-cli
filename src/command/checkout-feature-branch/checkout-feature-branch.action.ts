import { askToContinueWithUncommitedChanges } from "@/actions/git/ask-to-continue-with-uncommited-changes.action";
import { Issue } from "@/domain/entity/issue.entity";
import {
  checkoutToIssue,
  checkoutWithChanges,
  getLatestBranchByCommit,
  getRemoteAddress,
} from "@/domain/git-command/command.functions";
import { validateIssueNumber } from "@/domain/rules/validation-rules/validate.functions";
import { IConnectService } from "@/domain/service/i_connect.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IPromptService } from "src/domain/service/i-prompt.service";
import { IConfigService } from "src/domain/service/i_config.service";
import { IGitPlatformService } from "src/domain/service/i_git_platform.service";
import { IMessageService } from "src/domain/service/i_message.service";

// import { checkoutToIssueBuilder } from "@/domain/git-command/command.functions";

const _checkoutFeatureBranchLegacy = async (issueNumber?: number) => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);

  let featureBranch: string;
  if (issueNumber && !isNaN(issueNumber)) {
    featureBranch = await configService.getIssueBranch(issueNumber);
  } else if (issueNumber && isNaN(issueNumber)) {
    messageService.showWarning("Could not understand your request, please provide a valid number");
    return;
  } else {
    featureBranch = await gitPlatformService.getLatestBranchByCommitDate();
  }
  await askToContinueWithUncommitedChanges();
  if (featureBranch && featureBranch !== "") {
    await gitPlatformService.checkoutToFeatureBranch(featureBranch);
    messageService.showSuccess(`Checkout to branch: ${featureBranch}`);
  } else {
    messageService.showWarning("Could not find a feature branch that matches your request");
  }
};

const _checkoutFeatureBranchFunctional = async (issueNumber?: number) => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const execute = commanderService.executeGitCommand;
  if (issueNumber === undefined) {
    const branchName = await getLatestBranchByCommit(execute)(
      await configService.getIssueBranchPattern()
    );
    await checkoutWithChanges(execute)(branchName);
  } else {
    const validIssueNumber = pipe(
      issueNumber,
      validateIssueNumber,
      E.getOrElse(e => {
        throw e;
      })
    );
    const remoteAlias = await configService.getGitRemoteAlias();
    const remoteOrigin = await getRemoteAddress(execute)(remoteAlias);
    const issue = await connectService.getIssueRecord(validIssueNumber, remoteOrigin);
    const confirmedIssue = await _checkIssueBranch(configService.getIssueBranch)(issue);
    await checkoutToIssue(execute)(confirmedIssue, remoteAlias);
    messageService.showSuccess(`Checkout to branch: ${confirmedIssue.branchName}`);
  }
};

const _checkIssueBranch =
  (getIssueBranch: (number: number) => Promise<string>) =>
  async (issue: Issue): Promise<Issue> => {
    if (issue.branchName) {
      return issue;
    } else {
      const issueNumber = Issue.parseNumberFromUrl(issue.gitIssueUrl);
      const branchName = await getIssueBranch(issueNumber);
      return {
        ...issue,
        branchName,
      };
    }
  };

export const checkoutFeatureBranchAction = _checkoutFeatureBranchFunctional;
