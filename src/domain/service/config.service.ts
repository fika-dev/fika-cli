import { AddOnConfig } from "../value-object/add-on-config.vo";
import { IConfigService } from "./i-config.service";

export class ConfigService implements IConfigService{
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