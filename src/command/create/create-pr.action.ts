import { Issue } from "@/domain/entity/issue.entity";
import { IMessageService } from "@/domain/service/i_message.service";
import { NotionUrl } from "@/domain/value_object/notion_url.vo";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IGitPlatformService } from "src/domain/entity/i_git_platform.service";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";

export const createPRAction = async (baseBranch?: string)=>{
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  messageService.showGettingIssueForPR();
  const gitPlatformConfig = configService.getGitPlatformConfig();
  const gitPlatformService = container.get<IGitPlatformService>(SERVICE_IDENTIFIER.GitPlatformService);
  const botId = configService.getNotionBotId();
  const branchName = await gitPlatformService.getBranchName();
  const gitRepoUrl = await gitPlatformService.getGitRepoUrl();
  const issue = await connectService.getIssueRecord(branchName, gitRepoUrl);
  messageService.showGitPush(branchName);
  await gitPlatformService.pushBranch(branchName);
  gitPlatformService.configGitPlatform(gitPlatformConfig);
  messageService.showCreatingPR(issue, branchName);
  const updatedIssue = await gitPlatformService.createPR(issue, branchName);
  await connectService.updateIssue(updatedIssue, botId);
  const issueNumber = configService.parseIssueNumber(branchName);
  const prNumber = Issue.parseNumberFromUrl(updatedIssue.prUrl);
  await connectService.createPullRequest(gitRepoUrl, issue.notionUrl, issueNumber, prNumber);
  messageService.showCreatePRSuccess(updatedIssue);
}