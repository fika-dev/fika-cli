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
import { IConfigService } from "src/domain/service/i_config.service";
import { IMessageService } from "src/domain/service/i_message.service";

// import { checkoutToIssueBuilder } from "@/domain/git-command/command.functions";

export const checkoutFeatureBranchAction = async (issueNumber?: number) => {
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
    await messageService.showSuccess(`Checkout to branch: ${confirmedIssue.branchName}`);
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
