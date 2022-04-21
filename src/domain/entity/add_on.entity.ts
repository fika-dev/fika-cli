export enum AddOnType {
  analyzer,
  morpher,
}

export class AddOn {
  name: string;
  addonType: AddOnType;
  public getAddOnTypeAsString(): string{
    return AddOnType[this.addonType] as string;
  }
  public setAddOnTypeFromString(addonTypeString: string){
    this.addonType = AddOnType[addonTypeString as keyof typeof AddOnType];
  }
}