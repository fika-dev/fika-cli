import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";

export const initFixedBranch = async (branchName: string): Promise<void> => {
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  await gitPlatformService.checkoutToBranchWithoutReset(branchName);
  await gitPlatformService.fetchFromRemote();
  const isRemoteBranchExist = await gitPlatformService.checkRemoteBranchExist(branchName);
  if (!isRemoteBranchExist) {
    await gitPlatformService.pushBranchWithUpstream(branchName);
  }
};
