import { NotionUser, NotionWorkspace, WorkspaceLevel } from "src/domain/entity/notion_workspace.entity";
import { BaseDto } from "./base_dto";

interface CreateNotionWorkspaceDtoType{
  id: string;
  accessToken: string;
  workspaceId: string;
  workspaceName: string;
  workspaceIcon: string;
  ownerJsonString: any;
}

export class CreateNotionWorkspaceDto extends BaseDto<NotionWorkspace,CreateNotionWorkspaceDtoType> {
  constructor(dto: CreateNotionWorkspaceDtoType){
    super(dto);
  }
  toEntity(): NotionWorkspace{
    return {
      id: this.dto.workspaceId,
      botId: this.dto.id,
      name: this.dto.workspaceName,
      icon: this.dto.workspaceIcon,
      owner: this._parseOwnerJsonString(this.dto.ownerJsonString)
    }
  }

  _parseOwnerJsonString(ownerJsonString: any): WorkspaceLevel | NotionUser{
    if (ownerJsonString.workspace){
      return {
        workspace: true
      }
    }else{
      return {
        object: "user",
        id: ownerJsonString.id,
        type: ownerJsonString.type,
        name: ownerJsonString.name,
        avatar_url: ownerJsonString.avatar_url,
      }
    }
  }

}
