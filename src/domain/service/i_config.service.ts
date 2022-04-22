import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";

export interface IConfigService {
  createConfig(currentPath: string): void;
  readConfig(): void;
  updateConfig(): void;
  getAnalyzerConfigs(): AddOnConfig[];
  updateNotionWorkspace(notionWorkspace: NotionWorkspace): Promise<void>;
}