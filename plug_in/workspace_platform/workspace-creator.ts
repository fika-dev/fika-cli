import { WorkspacePlatform, WorkspaceType } from "@/domain/entity/add_on/workspace_platform.entity";
import { JiraWorkspace } from "./jira";
import { NotionWorkspace } from "./notion";

export class WorkspaceCreator {
  static fromType(workspaceType: WorkspaceType): WorkspacePlatform {
    if (workspaceType === "jira") {
      return new JiraWorkspace();
    } else if (workspaceType === "notion") {
      return new NotionWorkspace();
    }
  }
}
