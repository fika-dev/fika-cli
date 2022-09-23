import { createPR } from "@/actions/complex/create-PR.action";
import { pullAndCheckConflict } from "@/actions/git/pull-and-check-conflict.action";
import { checkoutBaseBranch } from "@/actions/git/checkout-base-branch.action";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IMessageService } from "@/domain/service/i_message.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IConfigService } from "src/domain/service/i_config.service";

export const finishAction = async (baseBranch?: string) => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const localConfig = configService.getLocalConfig();
  const isChangeExist = await gitPlatformService.checkUnstagedChanges();
  const developBranch = baseBranch ? baseBranch : localConfig.branchNames.develop;
  if (isChangeExist) {
    const proceed = await promptService.confirmAction(
      "There is uncommited changes\nDo you wanna continue? (y or n)"
    );
    if (!proceed) return;
  }
  if (localConfig.finish.checkMergeConflict) {
    await pullAndCheckConflict(developBranch);
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
