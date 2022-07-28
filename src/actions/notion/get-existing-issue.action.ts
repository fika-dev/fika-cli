import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { IGitPlatformService } from "@/domain/entity/i_git_platform.service";
import { IConnectService } from "@/domain/service/i_connect.service";
import { NotionUrl } from "@/domain/value_object/notion_url.vo";

export const getExistingIssue = async (
  notionDocumentUrl: NotionUrl
): Promise<Issue | undefined> => {
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const gitPlatformService = container.get<IGitPlatformService>(
    SERVICE_IDENTIFIER.GitPlatformService
  );
  const gitRepoUrl = await gitPlatformService.getGitRepoUrl();
  const existingIssue = await connectService.getIssueRecordByPage(notionDocumentUrl, gitRepoUrl);
  return existingIssue;
};
