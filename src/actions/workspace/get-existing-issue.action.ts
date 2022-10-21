import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { getRemoteAddress } from "@/domain/git-command/command.functions";
import { IConfigService } from "@/domain/service/i_config.service";
import { IConnectService } from "@/domain/service/i_connect.service";
import { ICommanderService } from "@/infrastructure/services/interface/i_commander.service";

export const getExistingIssue = async (documentUrl: string): Promise<Issue | undefined> => {
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const commanderService = container.get<ICommanderService>(SERVICE_IDENTIFIER.CommanderService);
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const remoteAlias = await configService.getGitRemoteAlias();
  const gitRepoUrl = await getRemoteAddress(commanderService.executeGitCommand)(remoteAlias);
  const existingIssue = await connectService.getIssueRecordByPage(documentUrl, gitRepoUrl);
  return existingIssue;
};
