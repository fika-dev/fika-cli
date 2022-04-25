import { AddOnConfig } from "../value_object/add_on_config.vo";
import { AddOn } from "./add_on.entity";
import { ComponentType } from "./component.entity";
import { INode } from "./i_node";

export interface MorpherConfig extends AddOnConfig{

}
export abstract class Morpher extends AddOn{
  nodeStore: Map<ComponentType, INode[]>
  constructor(morpherConfig: MorpherConfig){
    super(morpherConfig);
    this.nodeStore = new Map<ComponentType, INode[]>();
  }
}