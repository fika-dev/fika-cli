import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IMessageService } from "@/domain/service/i_message.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";

export const releaseAction = async () => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const latestTag = await gitPlatformService.getLatestTag();
  const tag = await promptService.askTagInfo(latestTag);
  await gitPlatformService.fetchFromRemote();
  await gitPlatformService.checkoutToBranchWithReset("release");
  await gitPlatformService.tagCommit("release", tag);
  const issueBranchPattern = await configService.getIssueBranchPattern();
  const issueWithPRList = await gitPlatformService.findDifferenceFromMaster(
    "release",
    issueBranchPattern
  );
  const gitRepoUrl = await gitPlatformService.getGitRepoUrl();
  const releaseId = await connectService.createReleaseRecord(gitRepoUrl, tag, issueWithPRList);
  const remoteAlias = await configService.getGitRemoteAlias();
  const baseBranch = await configService.getBaseBranch();
  const commitId = await gitPlatformService.getLatestCommitId(`${remoteAlias}/${baseBranch}`);
  const botId = configService.getWorkspaceId();
  const notionPageUrl = await connectService.createReleaseNotionPage(botId, commitId, releaseId);
  messageService.showNotionPage(notionPageUrl);
};
