import { PARAMETER_IDENTIFIER } from "@/config/constants/identifiers";
import container, { GitRepoPathProvider } from "@/config/ioc_config";
import { timeStamp } from "console";
import fs from "fs";
import { inject, injectable } from "inversify";
import path from "path";
import {
  defaultConfig,
  defaultLocalConfig,
  issueNumberTag,
} from "src/config/constants/default_config";
import { CONFIG_FILE_NAME, LOCAL_CONFIG_NAME } from "src/config/constants/path";
import { Worker } from "worker_threads";
import { version } from "../../../package.json";
import { AddOnType } from "../entity/add_on/add_on.entity";
import { WorkspaceType } from "../entity/add_on/workspace_platform.entity";
import { Config } from "../entity/config.entity";
import { Workspace } from "../entity/workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { WorkspaceNotConnected } from "../value_object/exceptions/workspace_not_connected";
import { Uuid } from "../value_object/uuid.vo";
import { IConfigService, InitialConfigInput, LocalConfig } from "./i_config.service";
import { NotConnected } from "../entity/notion_workspace.entity";

@injectable()
export class ConfigService implements IConfigService {
  private config: Config = JSON.parse(JSON.stringify(defaultConfig));
  private fikaConfigFilePath?: string;
  private fikaPath: string;
  private localWorkspace: Workspace | NotConnected;

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
    if (this.localWorkspace !== "NOT_CONNECTED") {
      //let workspaceTypeList: WorkspaceType[] = [];
      //workspaceTypeList = this.config.workspaces.map(
      //  workspace => workspace.workspaceType as WorkspaceType
      //);
      const workspaceType = this.localWorkspace.workspaceType as WorkspaceType;
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
  async createLocalConfig(
    developBranchName: string,
    mainBranchName: string,
    releaseBranchName: string
  ): Promise<void> {
    const gitRepoPath = await container.get<GitRepoPathProvider>(
      PARAMETER_IDENTIFIER.GitRepoPath
    )();
    const localConfig: LocalConfig = JSON.parse(JSON.stringify(defaultLocalConfig));
    localConfig.branchNames = {
      develop: developBranchName,
      main: mainBranchName,
      release: releaseBranchName,
      issueBranchTemplate: localConfig.branchNames.issueBranchTemplate,
    };
    this._createFile(gitRepoPath, LOCAL_CONFIG_NAME, localConfig);
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
  getWorkspaceList(): Workspace[] | "NOT_CONNECTED" {
    return this.config.workspaces;
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
    if (this.localWorkspace !== "NOT_CONNECTED") {
      const workspaceId = new Uuid(this.localWorkspace.id);
      return workspaceId;
    } else {
      throw new WorkspaceNotConnected("WORKSPACE_NOT_CONNECTED");
    }
  }

  updateWorkspace(workspace: Workspace): void {
    console.log("inside update");
    if (this.config.workspaces == "NOT_CONNECTED") {
      console.log("case 1");
      this.config = {
        ...this.config,
        workspaces: [workspace],
        currentWorkspaceId: workspace.id,
      };
    } else {
      const idList = this.config.workspaces.map(space => space.id);
      if (idList.includes(workspace.id)) {
        console.log("case 2");
        this.config = {
          ...this.config,
          workspaces: this.config.workspaces.map(spaceElem =>
            spaceElem.id == workspace.id ? workspace : spaceElem
          ),
          currentWorkspaceId: workspace.id,
        };
      } else {
        console.log("case 3");
        this.config = {
          ...this.config,
          workspaces: [...this.config.workspaces, workspace],
          currentWorkspaceId: workspace.id,
        };
      }
    }
    const configString = JSON.stringify(this.config, undefined, 4);
    if (!this.fikaConfigFilePath) {
      this.createConfig();
    }
    fs.writeFileSync(this.fikaConfigFilePath, configString);
  }
  updateCurrentWorkspaceId(id: string): void {
    this.config = {
      ...this.config,
      currentWorkspaceId: id,
    };
    const configString = JSON.stringify(this.config, undefined, 4);
    if (!this.fikaConfigFilePath) {
      this.createConfig();
    }
    fs.writeFileSync(this.fikaConfigFilePath, configString);
  }
  // For global config
  createConfig(): void {
    // if (!fs.existsSync(this.fikaPath)) {
    //   fs.mkdirSync(this.fikaPath);
    // }
    // this.fikaConfigFilePath = path.join(this.fikaPath, CONFIG_FILE_NAME);
    // if (!fs.existsSync(this.fikaConfigFilePath)) {
    //   const configString = JSON.stringify(defaultConfig, undefined, 4);
    //   fs.writeFileSync(this.fikaConfigFilePath, configString);
    // }
    //const configString = JSON.stringify(defaultConfig, undefined, 4);
    this.fikaConfigFilePath = this._createFile(this.fikaPath, CONFIG_FILE_NAME, defaultConfig);
  }
  readConfig(): void {
    if (!this.fikaConfigFilePath) {
      this.createConfig();
    }
    //console.log("loading the config file");
    const configString = fs.readFileSync(this.fikaConfigFilePath, "utf-8");
    // console.log(typeof configString);
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
        configFromFile.workspaces = [workspace];
        configFromFile.currentWorkspaceId = workspace.id;
        delete configFromFile.workspace;
        this.config = configFromFile as Config;
        this.updateWorkspace(workspace);
        this.updateCurrentWorkspaceId(workspace.id);
      }
    } else if (!configFromFile.hasOwnProperty("currentWorkspaceId")) {
      if (configFromFile.workspace == "NOT_CONNECTED") {
        configFromFile.currentWorkspaceId = "NOT_CONNECTED";
      } else {
        //console.log("reading 3");
        configFromFile.currentWorkspaceId = configFromFile.workspace.id;
      }
      const workspace = configFromFile.workspace;
      configFromFile.workspaces = [configFromFile.workspace];
      delete configFromFile.workspace;
      this.config = configFromFile as Config;
      if (workspace !== "NOT_CONNECTED") {
        this.updateWorkspace(workspace);
      }
      this.updateCurrentWorkspaceId(configFromFile.currrentWorkspaceId);
    }
    let localWorkspace: Workspace | NotConnected;
    if (configFromFile.currentWorkspaceId !== "NOT_CONNECTED") {
      localWorkspace = configFromFile.workspaces.find(
        (space: Workspace) => space.id == configFromFile.currentWorkspaceId
      );
    } else {
      localWorkspace = "NOT_CONNECTED";
    }
    //console.log(configFromFile);
    this.config = configFromFile as Config;
    //console.log(this.config);
    this.localWorkspace = localWorkspace;
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

  _createFile(directory: string, fileName: string, contents: any): string {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    const filePath = path.join(directory, fileName);
    if (!fs.existsSync(filePath)) {
      //console.log("in create file", contents);
      const configString = JSON.stringify(contents, undefined, 4);
      //console.log("again in the createFile", configString);
      fs.writeFileSync(filePath, configString);
    }
    return filePath;
  }
}
