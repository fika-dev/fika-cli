import { WorkspacePlatform } from "@/domain/entity/add_on/workspace_platform.entity";

const jiraAuthorizeUri: string = "https://auth.atlassian.com/authorize";
const fikaJiraClientId: string = "4CtGOOySCpovViYXMVwRtPuPdlZtg9gA";
const testFikaJiraClientId: string = "MmjvsYfSW4xFEiZmr9UBPRdeX2TjenIC";
const jiraSocpes: string[] = ["read:jira-work", "write:jira-work", "offline_access"];

export class JiraWorkspace extends WorkspacePlatform {
  constructor() {
    super();
    this.workspaceType = "jira";
  }

  getAuthenticationUri(domain: string, hash: string): string {
    let clientId: string;
    if (domain === process.env.TEST_API_ADDRESS) {
      clientId = testFikaJiraClientId;
    } else {
      clientId = fikaJiraClientId;
    }
    const redirectUri = `${domain}/workspace/${this.workspaceType}/callback`;
    const scopeParams = jiraSocpes.join("+");

    const params = `audience=api.atlassian.com&client_id=${fikaJiraClientId}&scope=${scopeParams}&redirect_uri=${redirectUri}&state=${hash}&response_type=code&prompt=consent`;
    const targetUri = `${jiraAuthorizeUri}?${params}`;
    return targetUri;
  }
}
