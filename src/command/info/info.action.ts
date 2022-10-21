import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { getCurrentBranch, getRemoteAddress } from "@/domain/git-command/command.functions";
import { IConfigService } from "@/domain/service/i_config.service";
import { IConnectService } from "@/domain/service/i_connect.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";

export const infoAction = async () => {
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const localConfig = await configService.getLocalConfig();
  const remoteAlias = await configService.getGitRemoteAlias();
  const repoUrl = await getRemoteAddress(commanderService.executeGitCommand)(remoteAlias);
  const currentBranch = await getCurrentBranch(commanderService.executeGitCommand)();
  if (
    currentBranch !== localConfig.branchNames.develop &&
    currentBranch !== localConfig.branchNames.release &&
    currentBranch !== localConfig.branchNames.main
  ) {
    const branchNumber = await configService.parseIssueNumber(currentBranch);
    const issue = await connectService.getIssueRecord(branchNumber, repoUrl);
    if (issue) {
      messageService.showSuccess(
        `The current branch is ${currentBranch}, ${issue.title}`,
        `The Git issue URL is `,
        issue.gitIssueUrl
      );
      messageService.showSuccess(
        `For more Information, please take a look at the page linked below:`,
        undefined,
        issue.issueUrl
      );
      if (issue.gitPrUrl) {
        messageService.showSuccess(
          `And finally, you can take a look at the PR with the link below`,
          undefined,
          issue.gitPrUrl
        );
      }
    } else {
      messageService.showSuccess(
        "We failed to retrive some information on your branch, please again later"
      );
    }
  } else if (currentBranch === localConfig.branchNames.develop) {
    messageService.showSuccess(
      'You are on the develop branch, you can start a new branch with "fika start <issue url>"',
      undefined
    );
  } else if (currentBranch === localConfig.branchNames.release) {
    messageService.showSuccess(
      'You are on the release branch, you can start a new branch with "fika start <issue url>"',
      undefined
    );
  } else if (currentBranch === localConfig.branchNames.main) {
    messageService.showSuccess(
      'You are on the main branch, you can start a new branch with "fika start <issue url>"',
      undefined
    );
  } else {
    messageService.showSuccess(
      "We failed to retrive some information on your branch, please again later"
    );
  }
};
