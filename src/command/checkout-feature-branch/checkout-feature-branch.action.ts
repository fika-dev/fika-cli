import { IPromptService } from "@/domain/service/i-prompt.service";
import { IMessageService } from "@/domain/service/i_message.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IGitPlatformService } from "src/domain/entity/i_git_platform.service";
import { IConfigService } from "@/domain/service/i_config.service";

export const checkoutFeatureBranchAction = async (issueNumber?: number) => {
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const isChangeExist = await gitPlatformService.checkUnstagedChanges();
  let featureBranch: string;
  if (issueNumber && !isNaN(issueNumber)) {
    featureBranch = configService.getIssueBranch(issueNumber);
  } else if (issueNumber && isNaN(issueNumber)) {
    messageService.showWarning("Could not understand your request, please provide a valid number");
    return;
  } else {
    featureBranch = await gitPlatformService.getLatestBranchByCommitDate();
  }
  if (isChangeExist) {
    const proceed = await promptService.confirmAction(
      "There is uncommited changes\nDo you wanna continue? (y or n)"
    );
    if (!proceed) return;
  }
  if (featureBranch && featureBranch !== "") {
    await gitPlatformService.checkoutToFeatureBranch(featureBranch);
    messageService.showSuccess(`Checkout to branch: ${featureBranch}`);
  } else {
    messageService.showWarning("Could not find a feature branch that matches your request");
  }
};
