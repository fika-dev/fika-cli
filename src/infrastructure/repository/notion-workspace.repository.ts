import { NotionWorkspace } from "src/domain/entity/notion-workspace.entity";
import { BaseRepository } from "src/domain/repository/base-repository";

export class NotionWorkspaceRepository implements BaseRepository<NotionWorkspace>{
  create(entity: NotionWorkspace): Promise<void> {
    throw new Error("Method not implemented.");
  }
  read(id: string): Promise<NotionWorkspace> {
    throw new Error("Method not implemented.");
  }
  update(entity: NotionWorkspace): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<NotionWorkspace> {
    throw new Error("Method not implemented.");
  }

}