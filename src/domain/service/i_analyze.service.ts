import { Snapshot } from "../entity/snapshot.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";

export interface IAnalyzeService {
  registerAnalyzers(configs: AddOnConfig[]);
  analyze(): Snapshot;
}