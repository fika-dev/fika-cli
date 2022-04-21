interface NotionUser {
  object: "user",
  id: string,
  type: string,
  name: string,
  avatar_url: string,
}

interface WorkspaceLevel {
  workspace: true,
}
class NotionWorkspace {
  id: string;
  name: string;
  icon: string;
  owner: WorkspaceLevel | NotionUser;
}