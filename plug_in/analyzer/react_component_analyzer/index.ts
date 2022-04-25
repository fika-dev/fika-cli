import { AddOnType } from "src/domain/entity/add_on.entity";
import { Analyzer } from "src/domain/entity/analyzer.entity";
import { DevObject } from "src/domain/entity/dev_object.entity";
import { Morpher } from "src/domain/entity/morpher.entity";
import { AddOnConfig } from "src/domain/value_object/add_on_config.vo";

class ReactComponentAnalyzer extends Analyzer{
  constructor(config: AddOnConfig){
    super(config);
    this.addonType = AddOnType.Analyzer;
    this.analyze = this.analyze.bind(this);
  }
  async analyze(morpher: Morpher): Promise<DevObject[]> {
    throw new Error("Method not implemented.");
  }
}