import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { Snapshot } from "../entity/snapshot.entity";
import { AddOnConfig } from "../value_object/add-on-config.vo";

export interface IConnectService {
  guideNotionAuthentication(): void;
  requestNotionWorkspace(): NotionWorkspace;
  push(): Promise<void>;
}