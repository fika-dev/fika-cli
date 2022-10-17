import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { checkoutToBranchName } from "@/domain/git-command/command.functions";
import { IMessageService } from "@/domain/service/i_message.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";

export const checkoutBaseBranch = async (baseBranch: string): Promise<void> => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  await checkoutToBranchName(commanderService.executeGitCommand)(baseBranch);
  messageService.showSuccess(`Checkout to branch: ${baseBranch}`);
};
