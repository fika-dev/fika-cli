import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { Uuid } from "../value_object/uuid.vo";

export interface InitialConfigInput {
  branchNames: {
    develop: string;
    main: string;
    release: string;
  }
}
export interface IConfigService {
  getNotionBotId(): Uuid;
  createConfig(): void;
  readConfig(): void;

  getBaseBranch(): string;
  getIssueBranch(issueNumber: number): string;
  getAnalyzerConfigs(): AddOnConfig[];
  getMorpherConfig(): AddOnConfig;
  getGitPlatformConfig(): AddOnConfig;
  getFikaToken(): string | undefined;
  getFikaVersion(): string;

  updateConfig(): void;
  updateNotionWorkspace(notionWorkspace: NotionWorkspace): void;
  updateFikaToken(token: string): void;

  parseIssueNumber(branch: string): number;
  getIssueBranchPattern(): string;

  filterFromCandidates(filterIn: string[], candidates: string[]);
  createLocalConfig(initialConfigInput: InitialConfigInput): Promise<boolean>;
}
