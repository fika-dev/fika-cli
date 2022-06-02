import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { Uuid } from "../value_object/uuid.vo";

export interface IConfigService {
  getNotionBotId(): Uuid;
  createConfig(): void;
  readConfig(): void;
  updateConfig(): void;
  getAnalyzerConfigs(): AddOnConfig[];
  getMorpherConfig(): AddOnConfig;
  updateNotionWorkspace(notionWorkspace: NotionWorkspace): void;
  getGitPlatformConfig(): AddOnConfig;
  getFikaToken(): string | undefined;
  updateFikaToken(token: string): void;
}