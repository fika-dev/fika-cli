import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";

export const gitPullAction = async (branchName: string): Promise<boolean> => {
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  messageService.showWaiting(`Pulling ${branchName} from remote`);
  const isUpdated = await gitPlatformService.pullFrom(branchName);
  messageService.endWaiting();
  return isUpdated;
};
