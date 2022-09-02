import { PARAMETER_IDENTIFIER } from "@/config/constants/identifiers";
import fs from "fs";
import { inject, injectable } from "inversify";
import path from "path";
import { defaultConfig, defaultLocalConfig } from "src/config/constants/default_config";
import { CONFIG_FILE_NAME, LOCAL_CONFIG_NAME } from "src/config/constants/path";
import { json } from "stream/consumers";
import { version } from "../../../package.json";
import { AddOnType } from "../entity/add_on/add_on.entity";
import { Config } from "../entity/config.entity";
import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { Workspace } from "../entity/workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { NotionNotConnected } from "../value_object/exceptions/notion_not_connected";
import { GitConfig } from "../value_object/git_config.vo";
import { Uuid } from "../value_object/uuid.vo";
import { IConfigService, InitialConfigInput, LocalConfig } from "./i_config.service";

@injectable()
export class ConfigService implements IConfigService {
  private config: Config = JSON.parse(JSON.stringify(defaultConfig));
  private localConfig: LocalConfig;
  private fikaConfigFilePath?: string;
  private fikaPath: string;
  private localPath: string;

  constructor(
    @inject(PARAMETER_IDENTIFIER.FikaPath) fikaPath: string,
    @inject(PARAMETER_IDENTIFIER.GitRepoPath) localPath: string
  ) {
    this.fikaPath = fikaPath;
    this.localPath = localPath;
    this.readConfig();
  }
  getLocalConfig(): LocalConfig {
    const localConfigFilePath = path.join(this.localPath, LOCAL_CONFIG_NAME);
    if (fs.existsSync(localConfigFilePath)) {
      const configString = fs.readFileSync(localConfigFilePath, "utf-8");
      this.localConfig = JSON.parse(configString) as LocalConfig;
      return this.localConfig;
    } else {
      const copiedLocalConfig = JSON.parse(JSON.stringify(defaultLocalConfig));
      this.createLocalConfig({ branchNames: copiedLocalConfig.branchNames });
      return copiedLocalConfig;
    }
  }
  createLocalConfig(initialConfigInput: InitialConfigInput): void {
    const localConfig: LocalConfig = JSON.parse(JSON.stringify(defaultLocalConfig));
    localConfig.branchNames = {
      ...initialConfigInput.branchNames,
      issueBranchTemplate: localConfig.branchNames.issueBranchTemplate,
    };
    this._createConfig(this.localPath, LOCAL_CONFIG_NAME, localConfig);
    this.localConfig = localConfig;
  }
  filterFromCandidates(filterIn: string[], candidates: string[]) {
    return filterIn.filter(item => candidates.includes(item));
  }
  getIssueBranchPattern(): string {
    if (!this.localConfig) {
      this.localConfig = this.getLocalConfig();
    }
    return this.localConfig.branchNames.issueBranchTemplate;
  }
  parseIssueNumber(branch: string): number {
    if (!this.localConfig) {
      this.localConfig = this.getLocalConfig();
    }
    const fragments = this.localConfig.branchNames.issueBranchTemplate.split("<ISSUE_NUMBER>");
    if (fragments.length == 1) {
      return parseInt(branch.replace(fragments[0], ""));
    } else {
      return parseInt(branch.replace(fragments[0], "").replace(fragments[1], ""));
    }
  }
  getFikaVersion(): string {
    return version;
  }
  getBaseBranch(): string {
    if (!this.localConfig) {
      this.localConfig = this.getLocalConfig();
    }
    return this.localConfig.branchNames.develop;
  }
  getIssueBranch(issueNumber: number): string {
    if (!this.localConfig) {
      this.localConfig = this.getLocalConfig();
    }
    const branchTemplate = this.localConfig.branchNames.issueBranchTemplate;
    const isValidTemplate = GitConfig.validateIssueBranch(branchTemplate);
    if (!isValidTemplate) {
      throw Error("Not Valid Issue Branch Template");
    }
    return GitConfig.getIssueBranch(issueNumber.toString(), branchTemplate);
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
      const workspaceId = new Uuid(this.config.workspace.workspaceId);
      return workspaceId;
    } else {
      throw new NotionNotConnected("NOTION_NOT_CONNECTED");
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
    this.config = JSON.parse(configString) as Config;
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
