export interface NotionUser {
  object: "user",
  id: string,
  type: string,
  name: string,
  avatar_url: string,
}

export interface WorkspaceLevel {
  workspace: true,
}
export class NotionWorkspace {
  id: string;
  name: string;
  icon: string;
  owner: WorkspaceLevel | NotionUser;
}