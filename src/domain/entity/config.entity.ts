import { AddOnConfig } from "../value_object/add-on-config.vo";
import { NotionWorkspace } from "./notion_workspace.entity";

export class Config {
  notionWorkspace: NotionWorkspace;
  addOns: AddOnConfig[];
}