import { Issue } from "@/domain/entity/issue.entity";
import { IMessageService } from "@/domain/service/i_message.service";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { IConfigService } from "src/domain/service/i_config.service";
import { IConnectService } from "src/domain/service/i_connect.service";
import { createGitPlatformIssue } from "../git/create-git-platform-issue.action";
import { getWorkspaceIssue } from "../workspace/get-workspace-issue.action";

export const createIssue = async (documentUrl: string): Promise<Issue> => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const connectService = container.get<IConnectService>(SERVICE_IDENTIFIER.ConnectService);
  const messageService = container.get<IMessageService>(SERVICE_IDENTIFIER.MessageService);
  messageService.showWaiting("Getting issue from Workspace");
  const issue = await getWorkspaceIssue(documentUrl);
  messageService.endWaiting();
  messageService.showWaiting(`Creating Github issue of [${issue.title}]`);
  const updatedIssue = await createGitPlatformIssue(issue);
  messageService.endWaiting();
  messageService.showWaiting(`Linking Github issue to Workspace`);
  const botId = configService.getWorkspaceId();
  await connectService.updateIssue(updatedIssue, botId);
  await connectService.createIssueRecord(updatedIssue);
  messageService.endWaiting();
  messageService.showSuccess("Github Issue Created", undefined, updatedIssue.gitIssueUrl);
  messageService.showSuccess("Notion Issue Updated", undefined, updatedIssue.issueUrl);
  return updatedIssue;
};
