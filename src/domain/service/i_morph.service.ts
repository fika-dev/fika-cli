import { Morpher } from "../entity/add_on/morpher.entity";
import { AddOnConfig } from "../value_object/add_on_config.vo";

export interface IMorphService {
  addFikaUri(uri: string, nodeId: string): Promise<void>;
  configMorpher(config: AddOnConfig): void;
  getMorpher(): Morpher;
}
