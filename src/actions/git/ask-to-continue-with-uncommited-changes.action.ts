import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import { MESSAGE_TO_CONTINUE_WITH_UNCOMMITED_CHANGES } from "@/config/constants/messages";
import container from "@/config/ioc_config";
import { isThereSomthingToStash } from "@/domain/rules/validation-rules/validation-rules.functions";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";

export const askToContinueWithUncommitedChanges = async () => {
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  const isChangeExist = await isThereSomthingToStash(commanderService.executeGitCommand);
  if (isChangeExist) {
    const proceed = await promptService.confirmAction(MESSAGE_TO_CONTINUE_WITH_UNCOMMITED_CHANGES);
    if (!proceed)
      throw {
        type: "UserCancel",
        value: "because of uncommited changes",
      };
  }
};
