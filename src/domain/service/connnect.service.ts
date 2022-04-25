import { DevObject } from "../entity/dev_object.entity";
import { NotionWorkspace } from "../entity/notion_workspace.entity";
import { IConnectService } from "./i_connect.service";
import open from 'open';

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
  async guideNotionAuthentication(): Promise<void> {
    const redirectUri = encodeURIComponent(fikaCallbackUri);
    const params= `client_id=${fikaNotionClientId}&redirect_uri=${redirectUri}&response_type=code&owner=user&state=init`;
    const targetUri = `${notionAuthorizeUri}?${params}`;
    await open(targetUri);
  }
  requestNotionWorkspace(): NotionWorkspace {
    throw new Error("Method not implemented.");
  }
}