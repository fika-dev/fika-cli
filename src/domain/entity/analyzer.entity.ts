import { AddOn } from "./add_on.entity";
import { DevObject } from "./dev_object.entity";
import { Morpher } from "./morpher.entity";

export abstract class Analyzer extends AddOn{
  abstract analyze(morpher: Morpher): Promise<DevObject[]>;
}