import { Snapshot } from "src/domain/entity/snapshot.entity";
import { BaseRepository } from "src/domain/repository/base-repository";

export class SnapshotRepository implements BaseRepository<Snapshot> {
  create(entity: Snapshot): Promise<void> {
    throw new Error("Method not implemented.");
  }
  read(id: string): Promise<Snapshot> {
    throw new Error("Method not implemented.");
  }
  update(entity: Snapshot): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<Snapshot> {
    throw new Error("Method not implemented.");
  }
}
