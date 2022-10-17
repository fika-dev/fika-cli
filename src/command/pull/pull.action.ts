import { askToContinueWithUncommitedChanges } from "@/actions/git/ask-to-continue-with-uncommited-changes.action";
import { gitPullAction } from "@/actions/git/git-pull.action";
import { getCurrentBranch } from "@/domain/git-command/command.functions";
import { IMessageService } from "@/domain/service/i_message.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";

export const pullAction = async (branchName?: string) => {
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  await askToContinueWithUncommitedChanges();
  let targetBranch: string;
  if (branchName) {
    targetBranch = branchName;
  } else {
    targetBranch = await getCurrentBranch(commanderService.executeGitCommand)();
  }
  await gitPullAction(targetBranch);
};
