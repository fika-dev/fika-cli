import { Issue } from "@/domain/entity/issue.entity";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { NotionUrl } from "@/domain/value_object/notion_url.vo";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IGitPlatformService } from "src/domain/entity/i_git_platform.service";
import { IConfigService, LocalConfig } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";

export const startAction = async (documentUrlString: string) => {
  const _checkOutToFeature = async (
    localConfig: LocalConfig,
    issue: Issue,
    stashId: string | undefined
  ): Promise<void> => {
    if (localConfig.start.checkoutToFeature) {
      const issueNumber = Issue.parseNumberFromUrl(issue.issueUrl!);
      const issueBranch = configService.getIssueBranch(issueNumber);
      await gitPlatformService.checkoutToBranchWithoutReset(issueBranch);
      if (stashId) {
        gitPlatformService.applyStash(stashId);
      }
    }
  };

  const _checkCurrentBranch = async (
    localConfig: LocalConfig,
    currentBranch: string
  ): Promise<boolean> => {
    if (localConfig.start.fromDevelopOnly && currentBranch !== localConfig.branchNames.develop) {
      messageService.showWarning(
        `${localConfig.branchNames.develop} is the only allowed branch to start from`
      );
      return false;
    } else {
      if (currentBranch !== localConfig.branchNames.develop) {
        const answer = await promptService.confirmAction(
          `current branch: ${currentBranch}\nIs it OK not to start from ${localConfig.branchNames.develop}`
        );
        if (!answer) return false;
      }
    }
    return true;
  };

  const _checkNeedStash = async (
    localConfig: LocalConfig,
    currentBranch: string
  ): Promise<string> => {
    if (localConfig.start.pullBeforeAlways) {
      await gitPlatformService.pullFrom(currentBranch);
      const isChangeExist = await gitPlatformService.checkUnstagedChanges();
      if (isChangeExist) {
        const moveChanges = promptService.confirmAction(
          "There is unstaged changes. Do you wanna move these changes to the new started branch?"
        );
        if (moveChanges) {
          const stashId = `${currentBranch}:${new Date().toISOString()}`;
          gitPlatformService.stash(stashId);
          return stashId;
        }
      }
    }
    return;
  };

  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const gitPlatformConfig = configService.getGitPlatformConfig();
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const gitRepoUrl = await gitPlatformService.getGitRepoUrl();
  const notionDocumentUrl = new NotionUrl(documentUrlString);
  const existingIssue = await connectService.getIssueRecordByPage(notionDocumentUrl, gitRepoUrl);
  const currentBranch = await gitPlatformService.getBranchName();
  if (existingIssue) {
    const branch = configService.getIssueBranch(Issue.parseNumberFromUrl(existingIssue.issueUrl));
    gitPlatformService.checkoutToBranchWithoutReset(branch);
    messageService.showCheckoutToExistingIssue(existingIssue, branch);
  } else {
    const localConfig = configService.getLocalConfig();

    const isOKToProceed = await _checkCurrentBranch(localConfig, currentBranch);
    if (!isOKToProceed) return;
    const stashId = await _checkNeedStash(localConfig, currentBranch);

    messageService.showGettingIssue();
    const botId = configService.getNotionBotId();
    const issue = await connectService.getIssue(notionDocumentUrl, botId);
    messageService.showCreatingGitIssue();
    gitPlatformService.configGitPlatform(gitPlatformConfig);
    const updatedIssue = await gitPlatformService.createIssue(issue);
    await connectService.updateIssue(updatedIssue, botId);
    await connectService.createIssueRecord(updatedIssue);
    messageService.showCreateIssueSuccess(updatedIssue);
    await _checkOutToFeature(localConfig, updatedIssue, stashId);
  }
};
