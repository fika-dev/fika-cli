import { Config } from "src/domain/entity/config.entity";
import { BaseRepository } from "src/domain/repository/base-repository";

export class ConfigRepository implements BaseRepository<Config> {
  create(entity: Config): Promise<void> {
    throw new Error("Method not implemented.");
  }
  read(id: string): Promise<Config> {
    throw new Error("Method not implemented.");
  }
  update(entity: Config): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<Config> {
    throw new Error("Method not implemented.");
  }
}
