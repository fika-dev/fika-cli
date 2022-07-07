import { DevObject, ObjectType } from "./dev_object.entity";

export enum ComponentType {
  ReactComponent,
}

export class Component extends DevObject {
  needUpdate(devObj: Component): boolean {
    return (
      devObj.componentType === this.componentType &&
      devObj.filePath === this.filePath &&
      devObj.description === this.description &&
      JSON.stringify(devObj.methods.sort()) === JSON.stringify(this.methods.sort()) &&
      JSON.stringify(devObj.props.sort()) === JSON.stringify(this.props.sort())
    );
  }
  objectType: ObjectType = ObjectType.Component;
  componentType?: ComponentType;
  tags?: string[];

  filePath?: string;
  description?: string;
  methods?: string[];
  props?: string[];

  repoId?: string;

  static getEmptyComponent(): Component {
    return new Component();
  }
}
