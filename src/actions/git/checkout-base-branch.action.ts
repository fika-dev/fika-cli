import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";

export const checkoutBaseBranch = async (baseBranch: string): Promise<void> => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  await gitPlatformService.checkoutToBranchWithoutReset(baseBranch);
  messageService.showSuccess(`Checkout to branch: ${baseBranch}`);
};
