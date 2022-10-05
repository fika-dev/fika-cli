import { gitPullAction } from "@/actions/git/git-pull.action";
import { MESSAGE_TO_CONTINUE_WITH_UNCOMMITED_CHANGES } from "@/config/constants/messages";
import { getCurrentBranch } from "@/domain/git-command/command.functions";
import { isThereSomthingToStash } from "@/domain/rules/validation-rules/validation-rules.functions";
import { IPromptService } from "@/domain/service/i-prompt.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";

export const pullAction = async (branchName?: string) => {
  const promptService = container.get<IPromptService>(SERVICE_IDENTIFIER.PromptService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  const isChangeExist = await isThereSomthingToStash(commanderService.executeGitCommand);
  if (isChangeExist) {
    const proceed = await promptService.confirmAction(MESSAGE_TO_CONTINUE_WITH_UNCOMMITED_CHANGES);
    if (!proceed)
      throw {
        type: "UserCancel",
        value: "because of uncommited changes",
      };
  }
  let targetBranch: string;
  if (branchName) {
    targetBranch = branchName;
  } else {
    targetBranch = await getCurrentBranch(commanderService.executeGitCommand)();
  }
  const gitStatus = await gitPullAction(targetBranch);
  if (gitStatus === "FF_UPDATED") {
    messageService.showSuccess(`Synced from origin ${targetBranch}`);
  } else if (gitStatus === "NO_CHANGE") {
    messageService.showSuccess(`nothing to update from origin ${targetBranch}`);
  } else if (gitStatus === "NO_REMOTE_REF") {
    throw {
      type: "GitErrorNoRemoteBranch",
      value: targetBranch,
    };
  } else if (gitStatus === "MERGE_CONFLICT") {
    throw {
      type: "GitErrorMergeConflict",
      value: targetBranch,
    };
  } else {
    throw {
      type: "GitErrorFailedToPull",
      value: `targetBranch: ${targetBranch}, gitStatus: ${gitStatus}`,
    };
  }
};
