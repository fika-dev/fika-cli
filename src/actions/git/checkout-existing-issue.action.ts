import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";

export const checkoutExistingIssue = async (existingIssue: Issue): Promise<void> => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  messageService.showWaiting("Undergoing checkout");
  const branch = configService.getIssueBranch(Issue.parseNumberFromUrl(existingIssue.gitIssueUrl));
  await gitPlatformService.checkoutToBranchWithoutReset(branch);
  messageService.endWaiting();
  messageService.showSuccess(`Checkout to given issue branch: ${branch}`);
};
