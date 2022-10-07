import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { IGitPlatformService } from "@/domain/service/i_git_platform.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";
import BaseException from "@/domain/value_object/exceptions/base_exception";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";
import { pushBranch } from "@/domain/git-command/command.functions";

export const createGitPlatformPR = async (branchName: string, issue: Issue): Promise<Issue> => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const gitPlatformConfig = configService.getGitPlatformConfig();
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  await pushBranch(commanderService.executeGitCommand)(branchName);
  gitPlatformService.configGitPlatform(gitPlatformConfig);
  try {
    const updatedIssue = await gitPlatformService.createPR(issue, branchName);
    return updatedIssue;
  } catch (e) {
    const exception = e as BaseException;
    if (exception.name === "GhPrAlreadyExists") {
      messageService.endWaiting();
      messageService.showSuccess("PR link", undefined, issue.gitPrUrl);
      throw exception;
    } else {
      throw exception;
    }
  }
};
