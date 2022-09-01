import { AddOn } from "./add_on.entity";
export type WorkspaceType = JiraWorkspaceType | NotionWorkspaceType;
export type JiraWorkspaceType = "jira";
export type NotionWorkspaceType = "notion";

export abstract class Workspace extends AddOn {
  workspaceType: WorkspaceType;
  abstract getAuthenticationUri(): string;
}
