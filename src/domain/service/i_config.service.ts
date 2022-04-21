import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";

export interface IConfigService {
  createConfig(currentPath: string): Promise<void>;
  readConfig(): Promise<void>;
  updateConfig(): Promise<void>;
  getAnalyzerConfigs(): AddOnConfig[];
  updateNotionWorkspace(notionWorkspace: NotionWorkspace): Promise<void>;
}