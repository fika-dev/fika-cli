import { Morpher } from "../entity/morpher.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";

export interface IMorphService {
  addFikaUri(uri: string): void;
  configMorpher(config: AddOnConfig): void;
  getMorpher(): Morpher;
}