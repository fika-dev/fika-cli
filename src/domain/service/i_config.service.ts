import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";

export interface IConfigService {
  getNotionBotId(): string;
  createConfig(homePath: string): void;
  readConfig(homePath: string): void;
  updateConfig(): void;
  getAnalyzerConfigs(): AddOnConfig[];
  getMorpherConfig(): AddOnConfig;
  updateNotionWorkspace(notionWorkspace: NotionWorkspace): void;
  getGitPlatformConfig(): AddOnConfig;
}