import { createIssue } from "@/actions/complex/create-issue.action";
import { checkoutExistingIssue } from "@/actions/git/checkout-existing-issue.action";
import { checkoutIssueBranch } from "@/actions/git/checkout-issue-branch.action";
import { gitPullAction } from "@/actions/git/pull.action";
import { stashUnstagedChange } from "@/actions/git/stash-unstaged-change.action";
import { validateStartBranch } from "@/actions/git/validate-start-branch.action";
import { getExistingIssue } from "@/actions/workspace/get-existing-issue.action";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IConfigService } from "src/domain/service/i_config.service";

export const startAction = async (documentUrl: string) => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const existingIssue = await getExistingIssue(documentUrl);
  if (existingIssue) {
    await checkoutExistingIssue(existingIssue);
  } else {
    const currentBranch = await gitPlatformService.getBranchName();
    const localConfig = configService.getLocalConfig();
    const isOKToProceed = await validateStartBranch(localConfig, currentBranch);
    if (!isOKToProceed) return;
    if (localConfig.start.pullBeforeAlways) {
      await gitPullAction(currentBranch);
    }
    const stashId = await stashUnstagedChange(currentBranch);
    const updatedIssue = await createIssue(documentUrl);
    if (localConfig.start.checkoutToFeature) {
      await checkoutIssueBranch(updatedIssue, stashId);
    }
  }
};
