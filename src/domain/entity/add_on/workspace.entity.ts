import { JiraWorkspace } from "plug_in/workspace/jira";
import { NotionWorkspace } from "plug_in/workspace/notion";
export type WorkspaceType = JiraWorkspaceType | NotionWorkspaceType;
export type JiraWorkspaceType = "jira";
export type NotionWorkspaceType = "notion";

export abstract class Workspace {
  workspaceType: WorkspaceType;
  abstract getAuthenticationUri(domain: string): string;
}
