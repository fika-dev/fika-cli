import { Repo } from "src/domain/entity/repo.entity";
import { BaseRepository } from "src/domain/repository/base-repository";

export class RepoRepository implements BaseRepository<Repo>{
  create(entity: Repo): Promise<void> {
    throw new Error("Method not implemented.");
  }
  read(id: string): Promise<Repo> {
    throw new Error("Method not implemented.");
  }
  update(entity: Repo): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<Repo> {
    throw new Error("Method not implemented.");
  }

}