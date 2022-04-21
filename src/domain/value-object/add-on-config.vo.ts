interface Property {
  key: string;
  propertyTye: string;
}

export interface AddOnConfig {
  name: string;
  type: string;
  databaseName: string;
  additionalProperties: Property[];
}