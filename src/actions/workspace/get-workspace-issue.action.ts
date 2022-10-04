import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { IConfigService } from "@/domain/service/i_config.service";
import { IConnectService } from "@/domain/service/i_connect.service";

export const getWorkspaceIssue = async (documentUrl: string): Promise<Issue> => {
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const workpaceId = configService.getWorkspaceId();
  const workspaceType = configService.getWorkspaceType();
  const issue = await connectService.getWorkspaceIssue(documentUrl, workpaceId, workspaceType);
  return issue;
};
