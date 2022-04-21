import { Component } from "src/domain/entity/component.entity";
import { BaseRepository } from "src/domain/repository/base-repository";

export class ComponentRepository implements BaseRepository<Component>{
  create(entity: Component): Promise<void> {
    throw new Error("Method not implemented.");
  }
  read(id: string): Promise<Component> {
    throw new Error("Method not implemented.");
  }
  update(entity: Component): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<Component> {
    throw new Error("Method not implemented.");
  }

}