import { DevObject } from "./dev_object.entity";

export class Component extends DevObject{
  componentType: string;
  tags?: string[];

  filePath: string;
  description?: string;
  methods?: string[];
  props?: string[];

  repoId: string;
}

