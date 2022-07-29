import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { LocalConfig } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";

export const validateStartBranch = async (
  localConfig: LocalConfig,
  currentBranch: string
): Promise<boolean> => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  if (localConfig.start.fromDevelopOnly && currentBranch !== localConfig.branchNames.develop) {
    messageService.showWarning(
      `(current branch is ${currentBranch}) ${localConfig.branchNames.develop} is the only allowed branch to start`
    );
    return false;
  } else {
    if (currentBranch !== localConfig.branchNames.develop) {
      const answer = await promptService.confirmAction(
        `Current branch (${currentBranch}) is not ${localConfig.branchNames.develop}\nDo you want to ignore and start? (y or n)`
      );
      if (!answer) return false;
    }
  }
  return true;
};
