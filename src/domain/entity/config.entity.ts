import { AddOnConfig } from "../value_object/add_on_config.vo";
import { FikaToken, UnAuthenticated } from "../value_object/fika-token.vo";
import { NotConnected } from "./notion_workspace.entity";
import { Workspace } from "./workspace.entity";

export interface Config {
  workspaces: Workspace[] | NotConnected;
  addOns: AddOnConfig[];
  fikaToken: FikaToken | UnAuthenticated;
  currentWorkspaceId: string | NotConnected;
}
