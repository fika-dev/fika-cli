import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";

export const gitPullAction = async (branchName: string): Promise<boolean> => {
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const isUpdated = await gitPlatformService.pullFrom(branchName);
  return isUpdated;
};
