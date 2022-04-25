import { Morpher } from "../entity/morpher.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";
import { IMorphService } from "./i_morph.service";

export class MorphService implements IMorphService{
  private _morpher: Morpher | undefined;
  
  configMorpher(config: AddOnConfig): void {
    throw new Error("Method not implemented.");
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