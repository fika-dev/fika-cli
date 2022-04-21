import { DevObject } from "../entity/dev_object.entity";
import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { IConnectService } from "./i_connect.service";

export class ConnectService implements IConnectService {
  create(devObj: DevObject): Promise<string> {
    throw new Error("Method not implemented.");
  }
  update(devObj: DevObject): Promise<string> {
    throw new Error("Method not implemented.");
  }
  remove(devObj: DevObject): Promise<string> {
    throw new Error("Method not implemented.");
  }
  guideNotionAuthentication(): void {
    throw new Error("Method not implemented.");
  }
  requestNotionWorkspace(): NotionWorkspace {
    throw new Error("Method not implemented.");
  }
}