import { Issue } from "@/domain/entity/issue.entity";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { NotionUrl } from "@/domain/value_object/notion_url.vo";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";
import { getFikaIssue } from "../fika/get-fika-issue.action";
import { createGitPlatformIssue } from "../git/create-git-platform-issue.action";
import { createGitPlatformPR } from "../git/create-git-platform-PR.action";
import { getNotionIssue } from "../notion/get-notion-issue.action";

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
  const updatedIssue = await createGitPlatformPR(branchName, issue);

  const botId = configService.getNotionBotId();
  await connectService.updateIssue(updatedIssue, botId);
  const issueNumber = configService.parseIssueNumber(branchName);
  const prNumber = Issue.parseNumberFromUrl(updatedIssue.prUrl);
  // [TODO] if base branch
  await connectService.createPullRequest(gitRepoUrl, issue.notionUrl, issueNumber, prNumber);
  messageService.showCreatePRSuccess(updatedIssue);
};
