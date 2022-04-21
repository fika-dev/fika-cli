export interface Property {
  key: string;
  propertyTye: string;
}

export interface AddOnConfig {
  name: string;
  type: string;
  objectType?: string;
  databaseName: string;
  additionalProperties: Property[]; 
}