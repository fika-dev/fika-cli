import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { AddOnConfig } from "../value_object/add-on-config.vo";
import { IConfigService } from "./i_config.service";

export class ConfigService implements IConfigService{
  updateNotionWorkspace(notionWorkspace: NotionWorkspace): Promise<void> {
    throw new Error("Method not implemented.");
  }
  createConfig(): Promise<void> {
    throw new Error("Method not implemented.");
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