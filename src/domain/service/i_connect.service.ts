import { DevObject } from "../entity/dev_object.entity";
import { NotionWorkspace } from "../entity/notion_workspace.entity";

export interface IConnectService {
  guideNotionAuthentication(): Promise<void>;
  requestNotionWorkspace(botId: string): Promise<NotionWorkspace>;
  create(devObj: DevObject): Promise<string>;
  update(devObj: DevObject): Promise<string>;
  remove(devObj: DevObject): Promise<string>;
}