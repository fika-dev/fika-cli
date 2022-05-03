import { DevObject, ObjectType } from "./dev_object.entity";

export enum ComponentType {
  ReactComponent
}

export class Component extends DevObject{
  objectType: ObjectType = ObjectType.Component;
  componentType?: ComponentType;
  tags?: string[];

  filePath?: string;
  description?: string;
  methods?: string[];
  props?: string[];

  repoId?: string;

  nodeIndex?: number;

  static getEmptyComponent(): Component{
    return {
      title: '',
      botId: '',
      objectType: ObjectType.Component,
    }
  }
}

