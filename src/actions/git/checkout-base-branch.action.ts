import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { checkoutToBranchName } from "@/domain/git-command/command.functions";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";

export const checkoutBaseBranch = async (baseBranch: string): Promise<void> => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  const remoteAlias = await configService.getGitRemoteAlias();
  await checkoutToBranchName(commanderService.executeGitCommand)(baseBranch, remoteAlias);
  messageService.showSuccess(`Checkout to branch: ${baseBranch}`);
};
