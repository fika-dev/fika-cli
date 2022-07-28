import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { Issue } from "@/domain/entity/issue.entity";
import { IConfigService } from "@/domain/service/i_config.service";
import { IConnectService } from "@/domain/service/i_connect.service";
import { IMessageService } from "@/domain/service/i_message.service";
import { NotionUrl } from "@/domain/value_object/notion_url.vo";

export const getNotionIssue = async (notionDocumentUrl: NotionUrl): Promise<Issue> => {
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  messageService.showGettingIssue();
  const botId = configService.getNotionBotId();
  const issue = await connectService.getIssue(notionDocumentUrl, botId);
  return issue;
};
