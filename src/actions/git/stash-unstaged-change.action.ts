import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IPromptService } from "@/domain/service/i-prompt.service";

export const stashUnstagedChange = async (currentBranch: string): Promise<string> => {
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const isChangeExist = await gitPlatformService.checkUnstagedChanges();
  if (isChangeExist) {
    const moveChanges = promptService.confirmAction(
      "There is unstaged changes. Do you wanna move these changes to the new started branch?"
    );
    if (moveChanges) {
      const stashId = `${currentBranch}:${new Date().toISOString()}`;
      gitPlatformService.stash(stashId);
      return stashId;
    }
  }
  return;
};