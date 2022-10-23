import { createIssue } from "@/actions/complex/create-issue.action";
import { askToContinueWithUncommitedChanges } from "@/actions/git/ask-to-continue-with-uncommited-changes.action";
import { gitPullAction } from "@/actions/git/git-pull.action";
import { validateStartBranch } from "@/actions/git/validate-start-branch.action";
import { getExistingIssue } from "@/actions/workspace/get-existing-issue.action";
import {
  checkoutToIssue,
  createLocalBranch,
  getCurrentBranch,
} from "@/domain/git-command/command.functions";
import { IMessageService } from "@/domain/service/i_message.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";

export const startAction = async (documentUrl: string) => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const existingIssue = await getExistingIssue(documentUrl);
  const remoteAlias = await configService.getGitRemoteAlias();
  await askToContinueWithUncommitedChanges();
  if (existingIssue) {
    await checkoutToIssue(commanderService.executeGitCommand)(existingIssue, remoteAlias);
    await messageService.showSuccess(`Checkout to branch: ${existingIssue.branchName!}`);
  } else {
    const currentBranch = await getCurrentBranch(commanderService.executeGitCommand)();
    const localConfig = await configService.getLocalConfig();
    const isOKToProceed = await validateStartBranch(localConfig, currentBranch);
    if (!isOKToProceed) return;
    if (localConfig.start.pullBeforeAlways) {
      await gitPullAction(currentBranch);
    }
    const updatedIssue = await createIssue(documentUrl);
    await createLocalBranch(commanderService.executeGitCommand)(
      updatedIssue.branchName,
      currentBranch
    );
    if (localConfig.start.checkoutToFeature) {
      await checkoutToIssue(commanderService.executeGitCommand)(updatedIssue, remoteAlias);
      await messageService.showSuccess(`Checkout to branch: ${updatedIssue.branchName!}`);
    } else {
      await messageService.showSuccess(
        "Please checkout using below command",
        `git checkout -b ${updatedIssue.branchName!}`
      );
    }
  }
};
