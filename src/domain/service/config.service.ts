import { PARAMETER_IDENTIFIER } from "@/config/constants/identifiers";
import container, { GitRepoPathProvider } from "@/config/ioc_config";
import fs from "fs";
import { inject, injectable } from "inversify";
import path from "path";
import {
  defaultConfig,
  defaultLocalConfig,
  issueNumberTag,
} from "src/config/constants/default_config";
import { CONFIG_FILE_NAME, LOCAL_CONFIG_NAME } from "src/config/constants/path";
import { version } from "../../../package.json";
import { AddOnType } from "../entity/add_on/add_on.entity";
import { WorkspaceType } from "../entity/add_on/workspace_platform.entity";
import { Config } from "../entity/config.entity";
import { Workspace } from "../entity/workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { WorkspaceNotConnected } from "../value_object/exceptions/workspace_not_connected";
import { Uuid } from "../value_object/uuid.vo";
import { IConfigService, InitialConfigInput, LocalConfig } from "./i_config.service";

@injectable()
export class ConfigService implements IConfigService {
  private config: Config = JSON.parse(JSON.stringify(defaultConfig));
  private fikaConfigFilePath?: string;
  private fikaPath: string;

  constructor(@inject(PARAMETER_IDENTIFIER.FikaPath) fikaPath: string) {
    this.fikaPath = fikaPath;
    this.readConfig();
  }
  async getGitRemoteAlias(): Promise<string> {
    const localConfig = await this.getLocalConfig();
    if (localConfig.git?.remoteAlias) {
      return localConfig.git.remoteAlias;
    } else {
      const copiedLocalConfig = JSON.parse(JSON.stringify(defaultLocalConfig));
      return copiedLocalConfig.git.remoteAlias;
    }
  }
  getWorkspaceType(): WorkspaceType {
    if (this.config.workspace !== "NOT_CONNECTED") {
      const workspaceType = this.config.workspace.workspaceType as WorkspaceType;
      return workspaceType;
    } else {
      throw new WorkspaceNotConnected("WORKSPACE_NOT_CONNECTED");
    }
  }
  async getLocalConfig(): Promise<LocalConfig> {
    const gitRepoPath = await container.get<GitRepoPathProvider>(
      PARAMETER_IDENTIFIER.GitRepoPath
    )();
    const localConfigFilePath = path.join(gitRepoPath, LOCAL_CONFIG_NAME);
    if (fs.existsSync(localConfigFilePath)) {
      const configString = fs.readFileSync(localConfigFilePath, "utf-8");
      const localConfig = JSON.parse(configString) as LocalConfig;
      return localConfig;
    } else {
      const copiedLocalConfig = JSON.parse(JSON.stringify(defaultLocalConfig));
      return copiedLocalConfig;
    }
  }
  async createLocalConfig(initialConfigInput: InitialConfigInput): Promise<void> {
    const gitRepoPath = await container.get<GitRepoPathProvider>(
      PARAMETER_IDENTIFIER.GitRepoPath
    )();
    const localConfig: LocalConfig = JSON.parse(JSON.stringify(defaultLocalConfig));
    localConfig.branchNames = {
      ...initialConfigInput.branchNames,
      issueBranchTemplate: localConfig.branchNames.issueBranchTemplate,
    };
    this._createConfig(gitRepoPath, LOCAL_CONFIG_NAME, localConfig);
  }
  filterFromCandidates(filterIn: string[], candidates: string[]) {
    return filterIn.filter(item => candidates.includes(item));
  }
  async getIssueBranchPattern(): Promise<string> {
    const localConfig = await this.getLocalConfig();
    if (localConfig.branchNames.issueBranchTemplate) {
      return localConfig.branchNames.issueBranchTemplate;
    } else {
      const copiedLocalConfig = JSON.parse(JSON.stringify(defaultLocalConfig));
      return copiedLocalConfig.branchNames.issueBranchTemplate;
    }
  }
  async parseIssueNumber(branch: string): Promise<number> {
    const issueBranchTemplate = await this.getIssueBranchPattern();
    const fragments = issueBranchTemplate.split(issueNumberTag);
    if (fragments.length == 1) {
      return parseInt(branch.replace(fragments[0], ""));
    } else {
      return parseInt(branch.replace(fragments[0], "").replace(fragments[1], ""));
    }
  }
  getFikaVersion(): string {
    return version;
  }
  async getBaseBranch(): Promise<string> {
    const localConfig = await this.getLocalConfig();
    if (localConfig.branchNames.develop) {
      return localConfig.branchNames.develop;
    } else {
      const copiedLocalConfig = JSON.parse(JSON.stringify(defaultLocalConfig));
      return copiedLocalConfig.branchNames.develop;
    }
  }
  async getIssueBranch(issueNumber: number): Promise<string> {
    let branchTemplate: string;
    const localConfig = await this.getLocalConfig();
    if (localConfig.branchNames.issueBranchTemplate) {
      branchTemplate = localConfig.branchNames.issueBranchTemplate;
    } else {
      const copiedLocalConfig = JSON.parse(JSON.stringify(defaultLocalConfig));
      branchTemplate = copiedLocalConfig.branchNames.issueBranchTemplate;
    }
    const isValidTemplate = branchTemplate.includes(issueNumberTag);
    if (!isValidTemplate) {
      throw Error("Not Valid Issue Branch Template");
    }
    return branchTemplate.replace(issueNumberTag, `${issueNumber}`);
  }

  getFikaToken(): string | undefined {
    if (this.config.fikaToken !== "UN_AUTHENTICATED") {
      const accessToken = this.config.fikaToken?.accessToken;
      return accessToken;
    } else {
      return;
    }
  }

  updateFikaToken(token: string): void {
    this.config = {
      ...this.config,
      fikaToken: {
        accessToken: token,
      },
    };
    const configString = JSON.stringify(this.config, undefined, 4);
    if (!this.fikaConfigFilePath) {
      this.createConfig();
    }
    fs.writeFileSync(this.fikaConfigFilePath, configString);
  }

  getWorkspaceId(): Uuid {
    if (this.config.workspace !== "NOT_CONNECTED") {
      const workspaceId = new Uuid(this.config.workspace.id);
      return workspaceId;
    } else {
      throw new WorkspaceNotConnected("WORKSPACE_NOT_CONNECTED");
    }
  }

  updateWorkspace(workspace: Workspace): void {
    this.config = {
      ...this.config,
      workspace: workspace,
    };
    const configString = JSON.stringify(this.config, undefined, 4);
    if (!this.fikaConfigFilePath) {
      this.createConfig();
    }
    fs.writeFileSync(this.fikaConfigFilePath, configString);
  }
  createConfig(): void {
    if (!fs.existsSync(this.fikaPath)) {
      fs.mkdirSync(this.fikaPath);
    }
    this.fikaConfigFilePath = path.join(this.fikaPath, CONFIG_FILE_NAME);
    if (!fs.existsSync(this.fikaConfigFilePath)) {
      const configString = JSON.stringify(defaultConfig, undefined, 4);
      fs.writeFileSync(this.fikaConfigFilePath, configString);
    }
  }
  readConfig(): void {
    if (!this.fikaConfigFilePath) {
      this.createConfig();
    }
    const configString = fs.readFileSync(this.fikaConfigFilePath, "utf-8");
    const configFromFile = JSON.parse(configString);
    if (configFromFile.hasOwnProperty("notionWorkspace")) {
      const notionWorkspace = configFromFile.notionWorkspace;
      if (notionWorkspace.hasOwnProperty("botId")) {
        const workspace: Workspace = {
          id: notionWorkspace.botId,
          workspaceType: "notion",
          workspaceIcon: notionWorkspace.icon ?? "",
          workspaceName: notionWorkspace.name ?? "",
        };
        delete configFromFile.notionWorkspace;
        configFromFile.workspace = workspace;
        this.config = configFromFile as Config;
        this.updateWorkspace(workspace);
      }
    }
    this.config = configFromFile as Config;
  }
  updateConfig(): void {
    throw new Error("Method not implemented.");
  }
  getAnalyzerConfigs(): AddOnConfig[] {
    return this.config.addOns.filter(addOn => addOn.type === AddOnType.Analyzer);
  }

  getMorpherConfig(): AddOnConfig {
    const [morpherConfig] = this.config.addOns.filter(addOn => addOn.type === AddOnType.Morpher);
    if (morpherConfig) {
      return morpherConfig;
    } else {
      throw Error("Morpher Config is not found");
    }
  }

  getGitPlatformConfig(): AddOnConfig {
    const [gitPlatformConfig] = this.config.addOns.filter(
      addOn => addOn.type === AddOnType.GitPlatform
    );
    if (gitPlatformConfig) {
      return gitPlatformConfig;
    } else {
      throw Error("Git Platform Config is not found");
    }
  }

  _createConfig(directory: string, fileName: string, contents: any): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    const filePath = path.join(directory, fileName);
    if (!fs.existsSync(filePath)) {
      const configString = JSON.stringify(contents, undefined, 2);
      fs.writeFileSync(filePath, configString);
    }
  }
}
