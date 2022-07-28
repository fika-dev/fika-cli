import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IConfigService, LocalConfig } from "@/domain/service/i_config.service";

export const checkoutIssueBranch = async (
  issue: Issue,
  stashId: string | undefined
): Promise<void> => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const issueNumber = Issue.parseNumberFromUrl(issue.issueUrl!);
  const issueBranch = configService.getIssueBranch(issueNumber);
  await gitPlatformService.checkoutToBranchWithoutReset(issueBranch);
  if (stashId) {
    gitPlatformService.applyStash(stashId);
  }
};
