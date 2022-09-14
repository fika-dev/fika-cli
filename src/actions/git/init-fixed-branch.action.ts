import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IPromptService } from "@/domain/service/i-prompt.service";

export const initFixedBranch = async (branchName: string): Promise<void> => {
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  await gitPlatformService.checkoutToBranchWithoutReset(branchName);
  await gitPlatformService.pushBranchWithUpstream(branchName);
};
