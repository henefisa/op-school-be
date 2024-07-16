import {
  EntityManager,
  FindOneOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { EntityName } from './error-messages';
import { NotFoundException } from './exceptions/not-found.exception';

export class BaseService<T extends ObjectLiteral> {
  entityName: EntityName;
  repository: Repository<T>;

  constructor(entityName: EntityName, repository: Repository<T>) {
    this.entityName = entityName;
    this.repository = repository;
  }

  getRepository(entityManager?: EntityManager) {
    return (
      entityManager?.getRepository(this.repository.target) ?? this.repository
    );
  }

  async getOne(options: FindOneOptions<T>, entityManager?: EntityManager) {
    const manager = this.getRepository(entityManager);

    return manager.findOne(options);
  }

  async getOneOrThrow(
    options: FindOneOptions<T>,
    entityManager?: EntityManager,
  ) {
    const result = await this.getOne(options, entityManager);

    if (!result) {
      throw new NotFoundException(this.entityName);
    }

    return result;
  }
}
