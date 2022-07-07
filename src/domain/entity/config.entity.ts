import { AddOnConfig } from "../value_object/add_on_config.vo";
import { FikaToken, UnAuthenticated } from "../value_object/fika-token.vo";
import { GitConfig } from "../value_object/git_config.vo";
import { NotConnected, NotionWorkspace } from "./notion_workspace.entity";

export class Config {
  notionWorkspace: NotionWorkspace | NotConnected;
  addOns: AddOnConfig[];
  fikaToken: FikaToken | UnAuthenticated;
  git: GitConfig;
}
