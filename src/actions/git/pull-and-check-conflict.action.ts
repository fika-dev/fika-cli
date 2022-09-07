import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { gitPullAction } from "./pull.action";

export const pullAndCheckConflict = async (baseBranch: string): Promise<void> => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const gitStatus = await gitPullAction(baseBranch);
  const isConflictExist = await gitPlatformService.checkConflict();
  if (isConflictExist) {
    messageService.showWarning("There is conflict. Try again after resolving conflict");
    return;
  } else if (gitStatus === "UPDATED") {
    messageService.showSuccess("Successfuly Merged");
  } else if (gitStatus === "NO_CHANGE") {
    messageService.showSuccess("Nothing to update from remote");
  } else {
    messageService.showWarning(`Couldn't finish pull: ${gitStatus}`);
  }
};
