import { AddOnConfig } from "../value_object/add_on_config.vo";

export enum AddOnType {
  analyzer,
  morpher,
}

export class AddOn {
  name: string;
  addonType: AddOnType;
  config: AddOnConfig;
  constructor(config: AddOnConfig){}
  public getAddOnTypeAsString(): string{
    return AddOnType[this.addonType] as string;
  }
  public setAddOnTypeFromString(addonTypeString: string){
    this.addonType = AddOnType[addonTypeString as keyof typeof AddOnType];
  }
}