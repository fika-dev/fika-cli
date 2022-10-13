//import { createPR } from "@/actions/complex/create-PR.action";
//import { pullAndCheckConflict } from "@/actions/git/pull-and-check-conflict.action";
import { askToContinueWithUncommitedChanges } from "@/actions/git/ask-to-continue-with-uncommited-changes.action";
import { checkoutBaseBranch } from "@/actions/git/checkout-base-branch.action";
import { IMessageService } from "@/domain/service/i_message.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";

export const checkoutDevelopBranchAction = async () => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const localConfig = await configService.getLocalConfig();
  await askToContinueWithUncommitedChanges();
  if (localConfig.branchNames.develop && localConfig.branchNames.develop !== "") {
    await checkoutBaseBranch(localConfig.branchNames.develop);
  } else {
    messageService.showWarning(
      "Could not complete the action because your Fika config file does not contain any value for the develop branch."
    );
  }
};
