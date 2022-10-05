import { gitPullAction } from "@/actions/git/git-pull.action";
import { IPromptService } from "@/domain/service/i-prompt.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";

export const pullAction = async (branchName?: string) => {
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const isChangeExist = await gitPlatformService.checkUnstagedChanges();
  if (isChangeExist) {
    const proceed = await promptService.confirmAction(
      "There is uncommited changes\nDo you wanna continue? (y or n)"
    );
    if (!proceed)
      throw {
        type: "UserCancel",
      };
  }
  let checkoutBranch: string;
  if (branchName) {
    checkoutBranch = branchName;
  } else {
    checkoutBranch = await gitPlatformService.getBranchName();
  }
  const gitStatus = await gitPullAction(checkoutBranch);
  if (gitStatus === "FF_UPDATED") {
    messageService.showSuccess(`Synced from origin ${checkoutBranch}`);
  } else if (gitStatus === "NO_CHANGE") {
    messageService.showSuccess(`nothing to update from origin ${checkoutBranch}`);
  } else if (gitStatus === "NO_REMOTE") {
    throw {
      type: "GitErrorNoRemoteBranch",
      value: checkoutBranch,
    };
  } else if (gitStatus === "CONFLICT") {
    throw {
      type: "GitErrorMergeConflict",
      value: checkoutBranch,
    };
  } else {
    throw {
      type: "GitErrorFailedToPull",
      value: checkoutBranch,
    };
  }
};
