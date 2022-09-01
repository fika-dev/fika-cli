import { JiraWorkspace } from "plug_in/workspace/jira";
import { NotionWorkspace } from "../notion_workspace.entity";
import { AddOn } from "./add_on.entity";
export type WorkspaceType = JiraWorkspaceType | NotionWorkspaceType;
export type JiraWorkspaceType = "jira";
export type NotionWorkspaceType = "notion";

export abstract class Workspace {
  workspaceType: WorkspaceType;
  abstract getAuthenticationUri(domain: string): string;
  static fromType(workspaceType: WorkspaceType): Workspace {
    if (workspaceType === "jira") {
      return new JiraWorkspace();
    } else if (workspaceType === "notion") {
      return new NotionWorkspace();
    }
  }
}
