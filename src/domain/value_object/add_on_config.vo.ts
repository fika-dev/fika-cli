import { AddOnType } from "../entity/add_on.entity";
import { ObjectType } from "../entity/dev_object.entity";


export interface Property {
  key: string;
  propertyTye: string;
}

export interface AddOnConfig {
  name: string;
  type: AddOnType;
  objectType?: ObjectType;
  databaseName?: string;
  additionalProperties?: Property[]; 
}