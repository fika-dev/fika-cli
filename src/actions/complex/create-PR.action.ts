import { Issue } from "@/domain/entity/issue.entity";
import { getCurrentBranch, getRemoteAddress } from "@/domain/git-command/command.functions";
import { IMessageService } from "@/domain/service/i_message.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";
import { getFikaIssue } from "../fika/get-fika-issue.action";
import { createGitPlatformPR } from "../git/create-git-platform-PR.action";

export const createPR = async (): Promise<void> => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);

  const branchName = await getCurrentBranch(commanderService.executeGitCommand)();
  const remoteAlias = await configService.getGitRemoteAlias();
  const gitRepoUrl = await getRemoteAddress(commanderService.executeGitCommand)(remoteAlias);
  const issue = await getFikaIssue(gitRepoUrl, branchName);
  messageService.showWaiting("Creating Pull Request");
  const updatedIssue = await createGitPlatformPR(branchName, issue);
  messageService.endWaiting();
  messageService.showWaiting("Updating Notion Issue");
  const workspaceId = configService.getWorkspaceId();
  const workspaceType = configService.getWorkspaceType();
  await connectService.updateWorkspaceIssue(updatedIssue, workspaceId, workspaceType);
  const issueNumber = await configService.parseIssueNumber(branchName);
  const prNumber = Issue.parseNumberFromUrl(updatedIssue.gitPrUrl);
  // [TODO] if base branch
  await connectService.createPullRequestRecord(gitRepoUrl, issue.issueUrl, issueNumber, prNumber);
  messageService.endWaiting();
  messageService.showSuccess("Pull Request Created", undefined, updatedIssue.gitPrUrl);
  messageService.showSuccess("Notion Issue Updated", undefined, updatedIssue.issueUrl);
};
