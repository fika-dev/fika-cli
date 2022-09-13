import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { UserStopped } from "@/domain/value_object/exceptions/user_stopped";

export const stashUnstagedChange = async (currentBranch: string): Promise<string> => {
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const isChangeExist = await gitPlatformService.checkUnstagedChanges();
  if (isChangeExist) {
    const moveChanges = await promptService.confirmAction(
      "There is unstaged changes.\nDo you wanna move these changes to the new started branch?: "
    );
    if (moveChanges) {
      const stashId = `${currentBranch}:${new Date().toISOString()}`;
      gitPlatformService.stash(stashId);
      return stashId;
    } else {
      throw new UserStopped("UserStopped:UnstagedChange");
    }
  }
  return;
};
