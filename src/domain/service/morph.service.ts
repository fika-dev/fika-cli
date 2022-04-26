import { TypescriptMorpher } from "plug_in/morpher/typescript_morpher";
import { AddOnType } from "../entity/add_on.entity";
import { Morpher } from "../entity/morpher.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { IMorphService } from "./i_morph.service";

export class MorphService implements IMorphService{
  private _morpher: Morpher | undefined;
  constructor(){
    this.configMorpher = this.configMorpher.bind(this);
  }
  
  configMorpher(config: AddOnConfig): void {
    if (config.type === AddOnType.Morpher){
      if (config.name === 'Typescript.Morpher'){
        this._morpher = new TypescriptMorpher(config);
      }
    }
  }
  getMorpher(): Morpher {
    if (this._morpher){
      return this._morpher;
    }else{
      throw new Error("Morpher is not configured");
    }
  }
  
  public addFikaUri(uri: string): void {
    throw new Error("Method not implemented.");
  }
}