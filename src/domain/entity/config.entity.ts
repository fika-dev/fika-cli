import { AddOnConfig } from "../value_object/add_on_config.vo";
import { FikaToken, UnAuthenticated } from "../value_object/fika-token.vo";
import { NotConnected, NotionWorkspace } from "./notion_workspace.entity";

export class Config {
  notionWorkspace: NotionWorkspace | NotConnected;
  addOns: AddOnConfig[];
  fikaToken: FikaToken | UnAuthenticated;
}