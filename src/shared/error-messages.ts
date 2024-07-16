export enum ErrorMessageKey {
  UserNotFound = 'USER_NOT_FOUND',
  InvalidCredentials = 'INVALID_CREDENTIALS',
  ClassNotFound = 'CLASS_NOT_FOUND',
}

const MessageDetail = {
  [ErrorMessageKey.UserNotFound]: 'User not found.',
  [ErrorMessageKey.InvalidCredentials]: 'Invalid credentials.',
  [ErrorMessageKey.ClassNotFound]: 'Class not found.',
} as const;

export const getErrorMessage = (key: ErrorMessageKey) => {
  return MessageDetail[key];
};

export enum EntityName {
  User = 'user',
}

export const ERROR_MESSAGES = {
  notFound: (entityName: EntityName) => `${entityName}_not_found`,
};
