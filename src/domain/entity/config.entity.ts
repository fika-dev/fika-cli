import { AddOnConfig } from "../value-object/add-on-config.vo";
import { NotionWorkspace } from "./notion-workspace.entity";

export class Config {
  notionWorkspace: NotionWorkspace;
  addOns: AddOnConfig[];
}