import { createPR } from "@/actions/complex/create-PR.action";
import { askToContinueWithUncommitedChanges } from "@/actions/git/ask-to-continue-with-uncommited-changes.action";
import { checkoutBaseBranch } from "@/actions/git/checkout-base-branch.action";
import { gitPullAction } from "@/actions/git/git-pull.action";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IMessageService } from "@/domain/service/i_message.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";

export const finishAction = async (baseBranch?: string) => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const localConfig = configService.getLocalConfig();
  const developBranch = baseBranch ? baseBranch : localConfig.branchNames.develop;
  await askToContinueWithUncommitedChanges();
  if (localConfig.finish.checkMergeConflict) {
    await gitPullAction(developBranch);
  }
  await createPR();
  if (localConfig.finish.checkOutToDevelop) {
    await checkoutBaseBranch(developBranch);
  } else {
    const proceed = await promptService.confirmAction(
      "Do you wanna stay in your current feature branch? (y or n)"
    );
    if (proceed === true) {
      messageService.showSuccess(`Staying in the current branch`);
    } else {
      await checkoutBaseBranch(developBranch);
    }
  }
};
