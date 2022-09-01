import { AddOnType } from "@/domain/entity/add_on/add_on.entity";
import { Workspace } from "@/domain/entity/add_on/workspace.entity";
import { IConfigService } from "@/domain/service/i_config.service";
import { AddOnConfig } from "@/domain/value_object/add_on_config.vo";
const notionAuthorizeUri: string = "https://api.notion.com/v1/oauth/authorize";
const fikaNotionClientId: string = "3b87a929-9ddd-4578-ad56-01243af38fb1";

export class NotionWorkspace extends Workspace {
  constructor() {
    super();
    this.workspaceType = "notion";
  }

  getAuthenticationUri(domain: string): string {
    const redirectUri = encodeURIComponent(`${domain}/notion/callback`);
    const params = `client_id=${fikaNotionClientId}&redirect_uri=${redirectUri}&response_type=code&owner=user&state=init`;
    const targetUri = `${notionAuthorizeUri}?${params}`;
    return targetUri;
  }
}
