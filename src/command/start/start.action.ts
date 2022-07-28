import { checkoutExistingIssue } from "@/actions/checkout-existing-issue.action";
import { createIssueAction } from "@/actions/complex/create-issue.action";
import { checkoutIssueBranch } from "@/actions/git/checkout-issue-branch.action";
import { gitPullAction } from "@/actions/git/pull.action";
import { stashUnstagedChange } from "@/actions/git/stash-unstaged-change.action";
import { validateStartBranch } from "@/actions/git/validate-start-branch.action";
import { getExistingIssue } from "@/actions/notion/get-existing-issue.action";
import { NotionUrl } from "@/domain/value_object/notion_url.vo";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IGitPlatformService } from "src/domain/entity/i_git_platform.service";
import { IConfigService } from "src/domain/service/i_config.service";

export const startAction = async (documentUrlString: string) => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const notionDocumentUrl = new NotionUrl(documentUrlString);
  const existingIssue = await getExistingIssue(notionDocumentUrl);
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
    const updatedIssue = await createIssueAction(notionDocumentUrl);
    if (localConfig.start.checkoutToFeature) {
      await checkoutIssueBranch(updatedIssue, stashId);
    }
  }
};
