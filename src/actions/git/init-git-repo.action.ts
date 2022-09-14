import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IPromptService } from "@/domain/service/i-prompt.service";

export const initGitRepo = async (): Promise<void> => {
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  if (!gitPlatformService.isGitRepo()) {
    await gitPlatformService.gitInit();
  }
  if (!(await gitPlatformService.isThereRemoteUrl())) {
    const remoteUrl = await promptService.askRemoteUrl();
    await gitPlatformService.setRemoteUrl(remoteUrl);
  }
};
