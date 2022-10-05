import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { pullFrom } from "@/domain/git-command/command.functions";
import { GitOutputStatus } from "@/domain/git-command/parser/parser.type";
import { IMessageService } from "@/domain/service/i_message.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";

export const gitPullAction = async (branchName: string): Promise<GitOutputStatus> => {
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  messageService.showWaiting(`Pulling ${branchName} from remote`);
  const isUpdated = (await pullFrom(commanderService.executeGitCommand)(
    branchName
  )) as GitOutputStatus;
  messageService.endWaiting();
  return isUpdated;
};
