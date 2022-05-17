import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { Uuid } from "../value_object/uuid.vo";

export interface IConfigService {
  getNotionBotId(): Uuid;
  createConfig(homePath: string): void;
  readConfig(homePath: string): void;
  updateConfig(): void;
  getAnalyzerConfigs(): AddOnConfig[];
  getMorpherConfig(): AddOnConfig;
  updateNotionWorkspace(notionWorkspace: NotionWorkspace): void;
  getGitPlatformConfig(): AddOnConfig;
}