import { AddOnType } from "@/domain/entity/add_on/add_on.entity";
import { Workspace } from "@/domain/entity/add_on/workspace.entity";
import { IConfigService } from "@/domain/service/i_config.service";
import { AddOnConfig } from "@/domain/value_object/add_on_config.vo";

const jiraAuthorizeUri: string = "https://auth.atlassian.com/authorize?audience=api.atlassian.com";
const fikaJraClientId: string = "4CtGOOySCpovViYXMVwRtPuPdlZtg9gA";
const jiraSocpes: string[] = ["read:jira-work", "write:jira-work"];

export class JiraWorkspace extends Workspace {
  constructor() {
    super();
    this.workspaceType = "jira";
  }

  getAuthenticationUri(domain: string): string {
    const redirectUri = encodeURIComponent(`${domain}/workspace/${this.workspaceType}/callback`);
    const scopeParams = jiraSocpes.join("+");

    const params = encodeURIComponent(
      `audience=api.atlassian.com&client_id=${fikaJraClientId}&scope=${scopeParams}&redirect_uri=${redirectUri}&state=\${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent`
    );
    const targetUri = `${jiraAuthorizeUri}?${params}`;
    return targetUri;
  }
}
