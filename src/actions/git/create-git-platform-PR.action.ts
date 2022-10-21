import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { GitPlatform } from "@/domain/entity/add_on/git_platform.entity";
import { Issue } from "@/domain/entity/issue.entity";
import { pushBranch } from "@/domain/git-command/command.functions";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
import BaseException from "@/domain/value_object/exceptions/base_exception";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";

export const createGitPlatformPR = async (branchName: string, issue: Issue): Promise<Issue> => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatform = container.get<GitPlatform>(SERVICE_IDENTIFIER.GitPlatform);
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  const remoteAlias = await configService.getGitRemoteAlias();
  await pushBranch(commanderService.executeGitCommand)(branchName, remoteAlias);
  try {
    const baseBranch = await configService.getBaseBranch();
    const updatedIssue = await gitPlatform.createPR(issue, branchName, baseBranch);
    return updatedIssue;
  } catch (e) {
    const exception = e as BaseException;
    if (exception.name === "GhPrAlreadyExists") {
      await messageService.endWaiting();
      messageService.showSuccess("PR link", undefined, issue.gitPrUrl);
      // setTimeout(() => {
      //   messageService.showSuccess("PR link", undefined, issue.gitPrUrl);
      // }, 100);

      throw exception;
    } else {
      throw exception;
    }
  }
};
