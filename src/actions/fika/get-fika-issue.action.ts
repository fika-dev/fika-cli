import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { IConfigService } from "@/domain/service/i_config.service";
import { IConnectService } from "@/domain/service/i_connect.service";
import { IMessageService } from "@/domain/service/i_message.service";

export const getFikaIssue = async (gitRepoUrl: string, branchName: string): Promise<Issue> => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  messageService.showGettingIssueForPR();
  const issue = await connectService.getIssueRecord(
    configService.parseIssueNumber(branchName),
    gitRepoUrl
  );
  return issue;
};
