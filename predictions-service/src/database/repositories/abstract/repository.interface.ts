export interface Repository<T> {
  findOne(options: unknown): Promise<T>;
  findMany(options: unknown): Promise<T[]>;
  count(options: unknown): Promise<number>;
  create(entity: unknown): Promise<T>;
  update(entity: unknown): Promise<T>;
  delete(entity: unknown): Promise<T>;
}
