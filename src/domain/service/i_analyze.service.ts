import { Analyzer } from "../entity/analyzer.entity";
import { Snapshot } from "../entity/snapshot.entity";
import { AddOnConfig } from "../value_object/add-on-config.vo";

export interface IAnalyzeService {
  registerAnalyzers(configs: AddOnConfig[]);
  analyze(): Snapshot;
}