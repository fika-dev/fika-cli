import { WorkspaceType } from "../entity/add_on/workspace_platform.entity";
import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { Workspace } from "../entity/workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { Uuid } from "../value_object/uuid.vo";

export interface InitialConfigInput {
  branchNames: {
    develop: string;
    main: string;
    release: string;
  };
}

export interface LocalConfig {
  branchNames: {
    develop: string;
    main: string;
    release: string;
    issueBranchTemplate: string;
  };
  start: {
    fromDevelopOnly: boolean;
    pullBeforeAlways: boolean;
    checkoutToFeature: boolean;
  };
  finish: {
    checkOutToDevelop: boolean;
    checkMergeConflict: boolean;
  };
  git?: {
    remoteAlias?: string;
  };
}
export interface IConfigService {
  getWorkspaceId(): Uuid;
  getWorkspaceType(): WorkspaceType;
  createConfig(): void;
  readConfig(): void;

  getBaseBranch(): Promise<string>;
  getIssueBranch(issueNumber: number): Promise<string>;
  getAnalyzerConfigs(): AddOnConfig[];
  getMorpherConfig(): AddOnConfig;
  getGitPlatformConfig(): AddOnConfig;
  getFikaToken(): string | undefined;
  getFikaVersion(): string;

  updateConfig(): void;
  updateWorkspace(workspace: Workspace): void;
  updateFikaToken(token: string): void;

  parseIssueNumber(branch: string): Promise<number>;
  getIssueBranchPattern(): Promise<string>;
  getGitRemoteAlias(): Promise<string>;

  filterFromCandidates(filterIn: string[], candidates: string[]);
  createLocalConfig(initialConfigInput: InitialConfigInput): Promise<void>;
  getLocalConfig(): Promise<LocalConfig>;
}
