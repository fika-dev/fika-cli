export enum AddOnType {
  analyzer = 'analyzer'
}

export class AddOn {
  name: string;
  addonType: AddOnType;
  public getAddOnTypeAsString(){
    return AddOnType[this.addonType];
  }
  public setAddOnTypeFromString(addonTypeString: string){
    this.addonType = AddOnType[addonTypeString as keyof typeof AddOnType];
  }
}