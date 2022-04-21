import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { IConfigService } from "./i_config.service";
import fs from 'fs';
import path from 'path';

export class ConfigService implements IConfigService{
  updateNotionWorkspace(notionWorkspace: NotionWorkspace): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async createConfig(currentPath: string): Promise<void> {
    const fikaPath = path.join(currentPath, FIKA_PATH);
    fs.mkdirSync(fikaPath);
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