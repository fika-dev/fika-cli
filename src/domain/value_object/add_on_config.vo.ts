export type ObjectType = "repo" | "component"
export type AddOnType = "analyzer" | "morpher"

export interface Property {
  key: string;
  propertyTye: string;
}

export interface AddOnConfig {
  name: string;
  type: string;
  objectType?: ObjectType;
  databaseName?: string;
  additionalProperties?: Property[]; 
}