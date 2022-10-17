import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import {
  MESSAGE_OF_STAYING_FEATURE_BRANCH,
  MESSAGE_TO_STAY_FEATURE_BRANCH,
} from "@/config/constants/messages";
import container from "@/config/ioc_config";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { LocalConfig } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { checkoutBaseBranch } from "../git/checkout-base-branch.action";

export const checkoutDependingOnConfig =
  (localConfig: LocalConfig) => async (baseBranch: string) => {
    const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
    const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
    if (localConfig.finish.checkOutToDevelop) {
      await checkoutBaseBranch(baseBranch);
    } else {
      const proceed = await promptService.confirmAction(MESSAGE_TO_STAY_FEATURE_BRANCH);
      if (proceed === true) {
        messageService.showSuccess(MESSAGE_OF_STAYING_FEATURE_BRANCH);
      } else {
        await checkoutBaseBranch(baseBranch);
      }
    }
  };
