import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { pullFrom } from "@/domain/git-command/command.functions";
import { GitOutputStatus } from "@/domain/git-command/parser/parser.type";
import { IMessageService } from "@/domain/service/i_message.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";

export const gitPullAction = async (branchName: string): Promise<GitOutputStatus> => {
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  messageService.showWaiting(`Pulling ${branchName} from remote`);
  const gitStatus = (await pullFrom(commanderService.executeGitCommand)(
    branchName
  )) as GitOutputStatus;
  messageService.endWaiting();
  if (gitStatus === "FF_UPDATED") {
    messageService.showSuccess(`Synced from origin ${branchName}`);
  } else if (gitStatus === "NO_CHANGE") {
    messageService.showSuccess(`nothing to update from origin ${branchName}`);
  } else if (gitStatus === "NO_REMOTE_REF") {
    throw {
      type: "GitError",
      subType: "GitErrorNoRemoteBranch",
      value: branchName,
    };
  } else if (gitStatus === "MERGE_CONFLICT") {
    throw {
      type: "GitError",
      subType: "GitErrorMergeConflict",
      value: branchName,
    };
  } else {
    throw {
      type: "GitError",
      subType: "GitErrorFailedToPull",
      value: `branchName: ${branchName}, gitStatus: ${gitStatus}`,
    };
  }
  return gitStatus;
};
