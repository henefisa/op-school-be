export enum ErrorMessageKey {
  UserNotFound = 'USER_NOT_FOUND',
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidOldPassword = 'INVALID_OLD_PASSWORD',
  NewPasswordAndOldPasswordAreTheSame = 'NEW_PASSWORD_AND_OLD_PASSWORD_ARE_THE_SAME',
}

const MessageDetail = {
  [ErrorMessageKey.UserNotFound]: 'User not found.',
  [ErrorMessageKey.InvalidCredentials]: 'Invalid credentials.',
  [ErrorMessageKey.InvalidOldPassword]: 'Invalid old password.',
  [ErrorMessageKey.NewPasswordAndOldPasswordAreTheSame]:
    "New password and old password can't be the same.",
} as const;

export const getErrorMessage = (key: ErrorMessageKey) => {
  return MessageDetail[key];
};
