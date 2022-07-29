import { createPR } from "@/actions/complex/create-PR.action";
import { pullAndCheckConflict } from "@/actions/git/pull-and-check-conflict.action";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IMessageService } from "@/domain/service/i_message.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IGitPlatformService } from "src/domain/entity/i_git_platform.service";
import { IConfigService } from "src/domain/service/i_config.service";

export const finishAction = async (baseBranch?: string) => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const messageSrvice = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const localConfig = configService.getLocalConfig();
  const isChangeExist = await gitPlatformService.checkUnstagedChanges();
  if (isChangeExist) {
    const proceed = promptService.confirmAction(
      "There is uncommited changes, Do you wanna proceed to push and create pull request?"
    );
    if (!proceed) return;
  }
  if (localConfig.finish.checkMergeConflict) {
    await pullAndCheckConflict(baseBranch ? baseBranch : localConfig.branchNames.develop);
  }
  await createPR();
  if (localConfig.finish.checkOutToDevelop) {
    await gitPlatformService.checkoutToBranchWithoutReset(
      baseBranch ? baseBranch : localConfig.branchNames.develop
    );
  }
};
