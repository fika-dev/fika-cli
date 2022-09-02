import { gitPullAction } from "@/actions/git/pull.action";
import { IPromptService } from "@/domain/service/i-prompt.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IGitPlatformService } from "src/domain/entity/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";

export const pullAction = async () => {
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const isChangeExist = await gitPlatformService.checkUnstagedChanges();
  const currentBranch = await gitPlatformService.getBranchName();
  if (isChangeExist) {
    const proceed = await promptService.confirmAction(
      "There is uncommited changes\nDo you wanna continue? (y or n)"
    );
    if (!proceed) return;
  }
  const gitStatus = await gitPullAction(currentBranch);
  if (gitStatus === "UPDATED") {
    messageService.showSuccess(`Synced from origin ${currentBranch}`);
  } else if (gitStatus === "NO_CHANGE") {
    messageService.showSuccess(`nothing to update from origin ${currentBranch}`);
  } else if (gitStatus === "NO_REMOTE_BRANCH") {
    messageService.showWarning(
      `failed to pull because the ${currentBranch} branch could not be found`
    );
  } else {
    messageService.showWarning(`failed to pull on the ${currentBranch} branch`);
  }
};
