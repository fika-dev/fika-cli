import { DevObject } from "../entity/dev_object.entity";
import { NotionWorkspace } from "../entity/notion_workspace.entity";

export interface IConnectService {
  guideNotionAuthentication(): void;
  requestNotionWorkspace(botId: string): NotionWorkspace;
  create(devObj: DevObject): Promise<string>;
  update(devObj: DevObject): Promise<string>;
  remove(devObj: DevObject): Promise<string>;
}