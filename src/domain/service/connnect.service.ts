import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { IConnectService } from "./i_connect.service";

export class ConnectService implements IConnectService {
  requestNotionWorkspace(): NotionWorkspace {
    throw new Error("Method not implemented.");
  }
  push(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}