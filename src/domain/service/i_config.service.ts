import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { Uuid } from "../value_object/uuid.vo";

export interface IConfigService {
  getNotionBotId(): Uuid;
  createConfig(): void;
  readConfig(): void;

  getBaseBranch(): string;
  getIssueBranch(issueNumber: string): string;
  getAnalyzerConfigs(): AddOnConfig[];
  getMorpherConfig(): AddOnConfig;
  getGitPlatformConfig(): AddOnConfig;
  getFikaToken(): string | undefined;
  getFikaVersion(): string;

  updateConfig(): void;
  updateNotionWorkspace(notionWorkspace: NotionWorkspace): void;
  updateFikaToken(token: string): void;
}