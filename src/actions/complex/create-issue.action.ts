import { Issue } from "@/domain/entity/issue.entity";
import { IMessageService } from "@/domain/service/i_message.service";
import { NotionUrl } from "@/domain/value_object/notion_url.vo";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";
import { createGitPlatformIssue } from "../git/create-git-platform-issue.action";
import { getNotionIssue } from "../notion/get-notion-issue.action";

export const createIssue = async (notionDocumentUrl: NotionUrl): Promise<Issue> => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  messageService.showWaiting("Getting issue from Notion");
  const issue = await getNotionIssue(notionDocumentUrl);
  messageService.endWaiting();
  messageService.showWaiting(`Creating Github issue of [${issue.title}]`);
  const updatedIssue = await createGitPlatformIssue(issue);
  messageService.endWaiting();
  messageService.showWaiting(`Linking Github issue to Notion`);
  const botId = configService.getWorkspaceId();
  await connectService.updateIssue(updatedIssue, botId);
  await connectService.createIssueRecord(updatedIssue);
  messageService.endWaiting();
  messageService.showSuccess("Github Issue Created", undefined, updatedIssue.issueUrl);
  messageService.showSuccess("Notion Issue Updated", undefined, updatedIssue.notionUrl);
  return updatedIssue;
};
