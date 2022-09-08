import { JiraWorkspace } from "plug_in/workspace_platform/jira";
import { NotionWorkspace } from "plug_in/workspace_platform/notion";
export type WorkspaceType = JiraWorkspaceType | NotionWorkspaceType;
export type JiraWorkspaceType = "jira";
export type NotionWorkspaceType = "notion";

export abstract class WorkspacePlatform {
  workspaceType: WorkspaceType;
  abstract getAuthenticationUri(domain: string, hash: string): string;
}
