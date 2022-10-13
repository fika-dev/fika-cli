import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
// NEED TO BE REMOVED
export const checkoutIssueBranch = async (
  issue: Issue,
  stashId: string | undefined
): Promise<void> => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const localConfig = await configService.getLocalConfig();
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  if (localConfig.start.checkoutToFeature) {
    await gitPlatformService.checkoutToBranchWithoutReset(issue.branchName!);
    if (stashId) {
      gitPlatformService.applyStash(stashId);
    }
    messageService.showSuccess(`Checkout to branch: ${issue.branchName!}`);
  } else {
    messageService.showSuccess(
      "Please checkout using below command",
      `git checkout -b ${issue.branchName!}`
    );
  }
};
