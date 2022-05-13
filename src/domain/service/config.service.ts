import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { IConfigService } from "./i_config.service";
import fs from 'fs';
import path from 'path';
import { defaultConfig } from "src/config/constants/default_config";
import { Config } from "../entity/config.entity";
import { AddOnType } from "../entity/add_on.entity";
import { injectable } from "inversify";
import { CONFIG_FILE_NAME, FIKA_PATH } from "src/config/constants/path";
import { FikaPathExistsError } from "../exceptions";

@injectable()
export class ConfigService implements IConfigService{
  constructor(){
    this.updateNotionWorkspace = this.updateNotionWorkspace.bind(this);
    this.createConfig = this.createConfig.bind(this);
  }
  getNotionBotId(): string {
    if (this.config.notionWorkspace instanceof NotionWorkspace){
      return this.config.notionWorkspace.botId
    }else{
      throw new Error("Notion bot ID is not configured");
    }
  }
  
  
  private config: Config = defaultConfig;
  private fikaConfigFilePath?: string;
  updateNotionWorkspace(notionWorkspace: NotionWorkspace): void {

    this.config = {
      ...this.config,
      notionWorkspace: notionWorkspace,
    }
    const configString = JSON.stringify(this.config);
    fs.writeFileSync(this.fikaConfigFilePath, configString);
  }
  createConfig(homePath: string): void {
    const fikaPath = path.join(homePath, FIKA_PATH);
    if (!fs.existsSync(fikaPath)){
      fs.mkdirSync(fikaPath);
    }
    this.fikaConfigFilePath  = path.join(fikaPath, CONFIG_FILE_NAME);
    if (!fs.existsSync(this.fikaConfigFilePath)){
      const configString = JSON.stringify(defaultConfig, undefined, 4);
      fs.writeFileSync(this.fikaConfigFilePath, configString);
    }else{
      throw new FikaPathExistsError();
    }
  }
  readConfig(homePath: string):void {
    if (!this.fikaConfigFilePath){
      this.createConfig(homePath);
    }
    const configString = fs.readFileSync(this.fikaConfigFilePath, 'utf-8');
    this.config = JSON.parse(configString) as Config;
  }
  updateConfig(): void {
    throw new Error("Method not implemented.");
  }
  getAnalyzerConfigs(): AddOnConfig[] {
    return this.config.addOns.filter((addOn)=>addOn.type === AddOnType.Analyzer);
  }

  getMorpherConfig(): AddOnConfig {
    const [morpherConfig] = this.config.addOns.filter((addOn)=>addOn.type === AddOnType.Morpher);
    if (morpherConfig){
      return morpherConfig;
    }else{
      throw Error("Morpher Config is not found");
    }
  }

  getGitPlatformConfig(): AddOnConfig {
    const [gitPlatformConfig] = this.config.addOns.filter((addOn)=>addOn.type === AddOnType.GitPlatform);
    if (gitPlatformConfig){
      return gitPlatformConfig;
    }else{
      throw Error("Morpher Config is not found");
    }
  }

}