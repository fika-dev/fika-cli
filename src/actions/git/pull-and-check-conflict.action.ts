import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { GitError } from "@/domain/value_object/exceptions/git_error";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { gitPullAction } from "./git-pull.action";

// NEED TO BE REMOVED
export const pullAndCheckConflict = async (baseBranch: string): Promise<void> => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const gitStatus = await gitPullAction(baseBranch);
  const isConflictExist = await gitPlatformService.checkConflict();
  if (isConflictExist) {
    throw new GitError("GitError:MergeConflict");
  } else if (gitStatus === "FF_UPDATED") {
    messageService.showSuccess("Successfuly Synced");
  } else if (gitStatus === "NO_CHANGE") {
    messageService.showSuccess("Nothing to update from remote");
  } else {
    messageService.showWarning(`Couldn't finish pull: ${gitStatus}`);
  }
};
