import { WorkspacePlatform } from "@/domain/entity/add_on/workspace_platform.entity";
const notionAuthorizeUri: string = "https://api.notion.com/v1/oauth/authorize";
const fikaNotionClientId: string = "3b87a929-9ddd-4578-ad56-01243af38fb1";

export class NotionWorkspace extends WorkspacePlatform {
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
