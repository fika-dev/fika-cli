import { Issue } from "@/domain/entity/issue.entity";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";
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
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );

  const branchName = await gitPlatformService.getBranchName();
  const gitRepoUrl = await gitPlatformService.getGitRepoUrl();

  const issue = await getFikaIssue(gitRepoUrl, branchName);
  messageService.showWaiting("Creating Pull Request");
  const updatedIssue = await createGitPlatformPR(branchName, issue);
  messageService.endWaiting();
  messageService.showWaiting("Updating Notion Issue");
  const botId = configService.getWorkspaceId();
  await connectService.updateIssue(updatedIssue, botId);
  const issueNumber = configService.parseIssueNumber(branchName);
  const prNumber = Issue.parseNumberFromUrl(updatedIssue.prUrl);
  // [TODO] if base branch
  await connectService.createPullRequest(gitRepoUrl, issue.issueUrl, issueNumber, prNumber);
  messageService.endWaiting();
  messageService.showSuccess("Pull Request Created", undefined, updatedIssue.prUrl);
  messageService.showSuccess("Notion Issue Updated", undefined, updatedIssue.issueUrl);
};
