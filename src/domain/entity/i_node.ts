import { ComponentType } from "./component.entity";

export abstract class INode {
  componentType: ComponentType; 
  protected _node: any;
  abstract getId(): string;
  abstract setId(id: string): void;
  abstract getNode(): any;
}