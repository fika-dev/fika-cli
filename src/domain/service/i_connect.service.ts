import { DevObject } from "../entity/dev_object.entity";
import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { Snapshot } from "../entity/snapshot.entity";
import { AddOnConfig } from "../value_object/add-on-config.vo";

export interface IConnectService {
  guideNotionAuthentication(): void;
  requestNotionWorkspace(botId: string): NotionWorkspace;
  create(devObj: DevObject): Promise<string>;
  update(devObj: DevObject): Promise<string>;
  remove(devObj: DevObject): Promise<string>;
}