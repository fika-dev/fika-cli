import { Analyzer } from "src/domain/entity/analyzer.entity";
import { DevObject } from "src/domain/entity/dev_object.entity";
import { Morpher } from "src/domain/entity/morpher.entity";

export class GitRepoAnalyzer extends Analyzer{
  analyze(morpher: Morpher): Promise<DevObject[]> {
    throw new Error("Method not implemented.");
  }

}