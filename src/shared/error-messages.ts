export enum ErrorMessageKey {
  UserNotFound = 'USER_NOT_FOUND',
}

const MessageDetail = {
  [ErrorMessageKey.UserNotFound]: 'User not found.',
} as const;

export const getErrorMessage = (key: ErrorMessageKey) => {
  return MessageDetail[key];
};
