import { Issue } from "@/domain/entity/issue.entity";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IMessageService } from "@/domain/service/i_message.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IGitPlatformService } from "src/domain/entity/i_git_platform.service";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";

export const finishAction = async (baseBranch?: string) => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const gitPlatformConfig = configService.getGitPlatformConfig();
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const localConfig = configService.getLocalConfig();
  const isChangeExist = await gitPlatformService.checkUnstagedChanges();
  if (isChangeExist) {
    const proceed = promptService.confirmAction(
      "There is uncommited changes, Do you wanna proceed to push and create pull request?"
    );
    if (!proceed) return;
  }
  if (localConfig.finish.checkMergeConflict) {
    const isUpdated = await gitPlatformService.pullFrom(
      baseBranch ? baseBranch : localConfig.branchNames.develop
    );
    const isConflictExist = await gitPlatformService.checkConflict();
    if (isConflictExist) {
      messageService.showWarning("There is conflict. Try again after resolving conflict");
      return;
    } else if (isUpdated) {
      messageService.showSuccess("Successfuly Merged");
    } else {
      messageService.showSuccess("Nothing to update");
    }
  }

  messageService.showGettingIssueForPR();
  const botId = configService.getNotionBotId();
  const branchName = await gitPlatformService.getBranchName();
  const gitRepoUrl = await gitPlatformService.getGitRepoUrl();
  const issue = await connectService.getIssueRecord(
    configService.parseIssueNumber(branchName),
    gitRepoUrl
  );
  messageService.showGitPush(branchName);
  await gitPlatformService.pushBranch(branchName);
  gitPlatformService.configGitPlatform(gitPlatformConfig);
  messageService.showCreatingPR(issue, branchName);
  // [TODO] if base branch
  const updatedIssue = await gitPlatformService.createPR(issue, branchName);
  await connectService.updateIssue(updatedIssue, botId);
  const issueNumber = configService.parseIssueNumber(branchName);
  const prNumber = Issue.parseNumberFromUrl(updatedIssue.prUrl);
  // [TODO] if base branch
  await connectService.createPullRequest(gitRepoUrl, issue.notionUrl, issueNumber, prNumber);
  messageService.showCreatePRSuccess(updatedIssue);
  if (localConfig.finish.checkOutToDevelop) {
    await gitPlatformService.checkoutToBranchWithoutReset(
      baseBranch ? baseBranch : localConfig.branchNames.develop
    );
  }
};
