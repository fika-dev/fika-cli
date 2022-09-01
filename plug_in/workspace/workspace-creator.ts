import { Workspace, WorkspaceType } from "@/domain/entity/add_on/workspace.entity";
import { JiraWorkspace } from "./jira";
import { NotionWorkspace } from "./notion";

export class WorkspaceCreator {
  static fromType(workspaceType: WorkspaceType): Workspace {
    if (workspaceType === "jira") {
      return new JiraWorkspace();
    } else if (workspaceType === "notion") {
      return new NotionWorkspace();
    }
  }
}
