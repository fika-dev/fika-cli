import { PARAMETER_IDENTIFIER } from "@/config/constants/identifiers";
import fs from "fs";
import { inject, injectable } from "inversify";
import path from "path";
import { defaultConfig, defaultLocalConfig } from "src/config/constants/default_config";
import { CONFIG_FILE_NAME, LOCAL_CONFIG_NAME } from "src/config/constants/path";
import { version } from "../../../package.json";
import { AddOnType } from "../entity/add_on.entity";
import { Config } from "../entity/config.entity";
import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { NotionNotConnected } from "../value_object/exceptions/notion_not_connected";
import { GitConfig } from "../value_object/git_config.vo";
import { Uuid } from "../value_object/uuid.vo";
import { IConfigService, InitialConfigInput, LocalConfig } from "./i_config.service";

@injectable()
export class ConfigService implements IConfigService {
  private config: Config = defaultConfig;
  private fikaConfigFilePath?: string;
  private fikaLocalConfigPath?: string;
  private fikaPath: string;
  private localPath: string;

  constructor(
    @inject(PARAMETER_IDENTIFIER.FikaPath) fikaPath: string,
    @inject(PARAMETER_IDENTIFIER.GitRepoPath) localPath: string
  ) {
    this.updateNotionWorkspace = this.updateNotionWorkspace.bind(this);
    this.createConfig = this.createConfig.bind(this);
    this.fikaPath = fikaPath;
    this.localPath = localPath;
    this.readConfig();
  }
  createLocalConfig(initialConfigInput: InitialConfigInput): void {
    const localConfig: LocalConfig = defaultLocalConfig;
    localConfig.branchNames = initialConfigInput.branchNames;
    this._createConfig(this.localPath, LOCAL_CONFIG_NAME, localConfig);
  }
  filterFromCandidates(filterIn: string[], candidates: string[]) {
    return filterIn.filter(item => candidates.includes(item));
  }
  getIssueBranchPattern(): string {
    if (!this.config.git) {
      this.updateGitConfig();
    }
    return this.config.git.issueBranchTemplate;
  }
  parseIssueNumber(branch: string): number {
    if (!this.config.git) {
      this.updateGitConfig();
    }
    const fragments = this.config.git.issueBranchTemplate.split("<ISSUE_NUMBER>");
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
    if (!this.config.git) {
      this.updateGitConfig();
    }
    return this.config.git.baseBranch;
  }
  getIssueBranch(issueNumber: number): string {
    if (!this.config.git) {
      this.updateGitConfig();
    }
    const branchTemplate = this.config.git.issueBranchTemplate;
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

  private updateGitConfig(): void {
    this.config = {
      ...this.config,
      git: {
        baseBranch: "develop",
        issueBranchTemplate: "feature/iss/#<ISSUE_NUMBER>",
      },
    };
    const configString = JSON.stringify(this.config, undefined, 4);
    if (!this.fikaConfigFilePath) {
      this.createConfig();
    }
    fs.writeFileSync(this.fikaConfigFilePath, configString);
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

  getNotionBotId(): Uuid {
    if (this.config.notionWorkspace !== "NOT_CONNECTED") {
      const botId = new Uuid(this.config.notionWorkspace.botId);
      return botId;
    } else {
      throw new NotionNotConnected("NOTION_NOT_CONNECTED");
    }
  }

  updateNotionWorkspace(notionWorkspace: NotionWorkspace): void {
    this.config = {
      ...this.config,
      notionWorkspace: notionWorkspace,
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
