export enum ErrorMessageKey {
  UserNotFound = 'USER_NOT_FOUND',
  InvalidCredentials = 'INVALID_CREDENTIALS',
}

const MessageDetail = {
  [ErrorMessageKey.UserNotFound]: 'User not found.',
  [ErrorMessageKey.InvalidCredentials]: 'Invalid credentials.',
} as const;

export const getErrorMessage = (key: ErrorMessageKey) => {
  return MessageDetail[key];
};
