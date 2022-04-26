import { GitRepoAnalyzer } from "plug_in/analyzer/git_repo_analyzer";
import { ReactComponentAnalyzer } from "plug_in/analyzer/react_component_analyzer";
import { Analyzer } from "../entity/analyzer.entity";
import { Component } from "../entity/component.entity";
import { ObjectType } from "../entity/dev_object.entity";
import { Morpher } from "../entity/morpher.entity";
import { Repo } from "../entity/repo.entity";
import { Snapshot } from "../entity/snapshot.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { IAnalyzeService } from "./i_analyze.service";

export class AnalyzeService implements IAnalyzeService{
  constructor(){
    this.registerAnalyzers = this.registerAnalyzers.bind(this);
  }
  private _analyzers: Analyzer[] = [];
  public registerAnalyzers(configs: AddOnConfig[]){
    this._analyzers = configs.map(config=>{
      if (config.objectType === ObjectType.Repo){
        return new GitRepoAnalyzer(config);
      }
      if (config.objectType === ObjectType.Component){
        if (config.name === "React.Component" ){
          return new ReactComponentAnalyzer(config);
        }
      }else{
        return undefined;
      }
    }).filter(analyzer => analyzer);
  }
  public async analyze(morpher: Morpher): Promise<Snapshot> {
    const devObjs = (await Promise.all(
      this._analyzers.map(
        (analyzer)=> analyzer.analyze(morpher)
      )
    )).flat();
    const [repo] = devObjs.filter(devObj=>devObj.objectType===ObjectType.Repo) as Repo[];
    const components = devObjs.filter(devObj=>devObj.objectType===ObjectType.Component) as Component[];
    const snapshot: Snapshot = {
      repo,
      components,
    }
    return snapshot;
  }
}