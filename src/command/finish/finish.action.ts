import { checkoutDependingOnConfig } from "@/actions/complex/checkout-depending-on-config.action";
import { createPR } from "@/actions/complex/create-PR.action";
import { askToContinueWithUncommitedChanges } from "@/actions/git/ask-to-continue-with-uncommited-changes.action";
import { getCurrentRemoteBranch } from "@/actions/git/get-current-remote-branch.action";
import { gitPullAction } from "@/actions/git/git-pull.action";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";

export const finishAction = async (baseBranch?: string) => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const localConfig = await configService.getLocalConfig();
  const developBranch = baseBranch ? baseBranch : localConfig.branchNames.develop;
  await askToContinueWithUncommitedChanges();
  if (localConfig.finish.checkMergeConflict) {
    const currentRemoteBranch = await getCurrentRemoteBranch();
    if (currentRemoteBranch) {
      await gitPullAction(currentRemoteBranch); // pull from current branch;
    }
    await gitPullAction(developBranch);
  }
  await createPR();
  await checkoutDependingOnConfig(localConfig)(developBranch);
};
