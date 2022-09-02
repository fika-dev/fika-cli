import { Workspace } from "@/domain/entity/workspace.entity";
import { BaseDto } from "./base_dto";

export interface CreateWorkspaceDtoType {
  id: string;
  workspaceType: string;
  workspaceName: string;
  workspaceIcon: string;
}

export class CreateWorkspaceDto extends BaseDto<Workspace, CreateWorkspaceDtoType> {
  constructor(dto: CreateWorkspaceDtoType) {
    super(dto);
  }
  toEntity(): Workspace {
    return this.dto;
  }
}
