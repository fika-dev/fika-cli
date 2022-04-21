import { Analyzer } from "../entity/analyzer.entity";
import { Snapshot } from "../entity/snapshot.entity";
import { AddOnConfig } from "../value_object/add-on-config.vo";
import { IAnalyzeService } from "./i_analyze.service";

export class AnalyzeService implements IAnalyzeService{
  private _analyzers: Analyzer[] = [];
  public registerAnalyzers(configs: AddOnConfig[]){}
  public analyze(): Snapshot {
    return;
  }
}