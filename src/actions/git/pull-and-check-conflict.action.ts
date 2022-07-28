import { Issue } from "@/domain/entity/issue.entity";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { NotionUrl } from "@/domain/value_object/notion_url.vo";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";
import { getFikaIssue } from "../fika/get-fika-issue.action";
import { createGitPlatformIssue } from "../git/create-git-platform-issue.action";
import { createGitPlatformPR } from "../git/create-git-platform-PR.action";
import { getNotionIssue } from "../notion/get-notion-issue.action";
import { gitPullAction } from "./pull.action";

export const pullAndCheckConflict = async (baseBranch: string): Promise<void> => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const isUpdated = await gitPullAction(baseBranch);
  const isConflictExist = await gitPlatformService.checkConflict();
  if (isConflictExist) {
    messageService.showWarning("There is conflict. Try again after resolving conflict");
    return;
  } else if (isUpdated) {
    messageService.showSuccess("Successfuly Merged");
  } else {
    messageService.showSuccess("Nothing to update");
  }
};
