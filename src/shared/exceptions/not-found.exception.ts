import { NotFoundException as OriginalNotFoundException } from '@nestjs/common';
import { EntityName, ERROR_MESSAGES } from '../error-messages';

export class NotFoundException extends OriginalNotFoundException {
  constructor(entityName: EntityName) {
    super(ERROR_MESSAGES.notFound(entityName));
  }
}
