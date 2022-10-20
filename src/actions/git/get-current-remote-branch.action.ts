import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { checkCurrentRemoteBranch } from "@/domain/git-command/command.functions";
import { IMessageService } from "@/domain/service/i_message.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";

export const getCurrentRemoteBranch = async (): Promise<string | undefined> => {
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  messageService.showWaiting("Checking remote branch");
  const branchName = await checkCurrentRemoteBranch(commanderService.executeGitCommand)();
  messageService.endWaiting();
  return branchName;
};
