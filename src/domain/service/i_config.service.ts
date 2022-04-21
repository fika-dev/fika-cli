import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add-on-config.vo";

export interface IConfigService {
  createConfig(): Promise<void>;
  readConfig(): Promise<void>;
  updateConfig(): Promise<void>;
  getAnalyzerConfigs(): AddOnConfig[];
  updateNotionWorkspace(notionWorkspace: NotionWorkspace): Promise<void>;
}