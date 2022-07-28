import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IConfigService } from "@/domain/service/i_config.service";
import { IMessageService } from "@/domain/service/i_message.service";

export const createGitPlatformIssue = async (issue: Issue): Promise<Issue> => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const gitPlatformConfig = configService.getGitPlatformConfig();
  messageService.showCreatingGitIssue();
  gitPlatformService.configGitPlatform(gitPlatformConfig);
  const updatedIssue = await gitPlatformService.createIssue(issue);
  return updatedIssue;
};
