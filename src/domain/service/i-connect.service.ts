import { Snapshot } from "../entity/snapshot.entity";
import { AddOnConfig } from "../value-object/add-on-config.vo";

export interface IConnectService {
  registerAnalyzers(configs: AddOnConfig[]);
  analyze(): Snapshot;
}