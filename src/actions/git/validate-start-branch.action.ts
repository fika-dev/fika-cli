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
      `current branch: ${currentBranch}: ${localConfig.branchNames.develop} is the only allowed branch to start from`
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
