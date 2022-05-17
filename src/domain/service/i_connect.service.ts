import { DevObject } from "../entity/dev_object.entity";
import { Issue } from "../entity/issue.entity";
import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { NotionUrl } from "../value_object/notion_url.vo";
import { Uuid } from "../value_object/uuid.vo";

export interface IConnectService {
  getNotionAuthenticationUri(): string;
  requestNotionWorkspace(botId: Uuid): Promise<NotionWorkspace>;
  create(devObj: DevObject): Promise<string>;
  update(devObj: DevObject): Promise<string>;
  remove(devObj: DevObject): Promise<string>;
  getIssue(documentUrl: NotionUrl, botId: Uuid) : Promise<Issue>;
  updateIssue(updatedIssue: Issue, botId: Uuid): Promise<Issue>;
}