import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { IConfigService } from "./i_config.service";
import fs from 'fs';
import path from 'path';
import { defaultConfig } from "src/config/constants/default_config";

export class ConfigService implements IConfigService{
  updateNotionWorkspace(notionWorkspace: NotionWorkspace): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async createConfig(currentPath: string): Promise<void> {
    const fikaPath = path.join(currentPath, FIKA_PATH);
    fs.mkdirSync(fikaPath);
    const fikaConfigFilePath  = path.join(fikaPath, CONFIG_FILE_NAME);
    const configString = JSON.stringify(defaultConfig);
    fs.writeFileSync(fikaConfigFilePath, configString);
  }
  readConfig(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  updateConfig(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getAnalyzerConfigs(): AddOnConfig[] {
    throw new Error("Method not implemented.");
  }

}