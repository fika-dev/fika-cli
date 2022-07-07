export interface BaseRepository<T> {
  create(entity: T): Promise<void>;
  read(id: string): Promise<T>;
  update(entity: T): Promise<void>;
  delete(id: string): Promise<T>;
}
