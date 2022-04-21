import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { IConfigService } from "./i_config.service";
import fs from 'fs';
import path from 'path';
import { defaultConfig } from "src/config/constants/default_config";
import { Config } from "../entity/config.entity";

export class ConfigService implements IConfigService{
  private config: Config = defaultConfig;
  private fikaConfigFilePath?: string;
  updateNotionWorkspace(notionWorkspace: NotionWorkspace): void {
    this.config = {
      notionWorkspace: notionWorkspace,
      ...this.config
    }
    const configString = JSON.stringify(this.config);
    fs.writeFileSync(this.fikaConfigFilePath, configString);
  }
  createConfig(currentPath: string): void {
    this.config = defaultConfig;
    const fikaPath = path.join(currentPath, FIKA_PATH);
    fs.mkdirSync(fikaPath);
    this.fikaConfigFilePath  = path.join(fikaPath, CONFIG_FILE_NAME);
    const configString = JSON.stringify(defaultConfig);
    fs.writeFileSync(this.fikaConfigFilePath, configString);
  }
  readConfig():void {
    if (this.fikaConfigFilePath){
      const configString = fs.readFileSync(this.fikaConfigFilePath, 'utf-8');
      this.config = JSON.parse(configString) as Config;
    }else{
      throw new Error("Fika config file path is not set");
    }
  }
  updateConfig(): void {
    throw new Error("Method not implemented.");
  }
  getAnalyzerConfigs(): AddOnConfig[] {
    return this.config.addOns.filter((addOn)=>addOn.type === 'analyzer');
  }

}