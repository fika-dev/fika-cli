import { AddOnType } from "src/domain/entity/add_on.entity";
import { Analyzer } from "src/domain/entity/analyzer.entity";

class ReactComponentAnalyzer extends Analyzer{
  constructor(){
    super();
    this.addonType = AddOnType.analyzer;
    this.analyze = this.analyze.bind(this);
  }
  async analyze(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}