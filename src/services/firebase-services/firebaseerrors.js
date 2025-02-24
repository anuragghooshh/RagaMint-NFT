export const firebaseErrorFinder = error => {
  const errors = {
    'auth/invalid-login-credentials': 'Invalid Credential',
    'auth/email-already-in-use': 'Account already exists. Please Log in.',
    'auth/invalid-email': 'The email address is badly formatted.',
    'auth/user-disabled': 'User account is disabled.',
    'auth/user-not-found': 'Account does not exist.',
    'auth/wrong-password': 'Invalid Credentials.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials.',
    'auth/requires-recent-login': 'This action requires a recent login. Please sign in again.',
    'auth/credential-already-in-use': 'This credential is already associated with a different user account.',
    'auth/invalid-verification-code': 'The verification code is invalid.',
    'auth/invalid-verification-id': 'The verification ID is invalid.',
    'auth/missing-verification-code': 'Please enter the verification code.',
    'auth/missing-verification-id': 'The verification ID is missing.',
    'auth/provider-already-linked': 'This account is already linked to another credential.',
    'auth/captcha-check-failed': 'The CAPTCHA response is invalid. Please try again.',
    'auth/timeout': 'The operation has timed out. Please try again.',
    'auth/network-request-failed': 'A network error has occurred. Please check your connection.',
    'auth/weak-password': 'The password is too weak. Please enter a stronger password.',
    'auth/unverified-email': 'Email address is not verified.',
    'auth/invalid-phone-number': 'The phone number format is invalid.',
    'auth/missing-phone-number': 'Please enter a phone number.',
    'auth/quota-exceeded': 'The SMS quota has been exceeded. Please try again later.',
    'auth/app-not-authorized': 'This app is not authorized to use Firebase Authentication.',
    'auth/unauthorized-domain': 'This domain is not authorized for Firebase operations.',
    'auth/user-token-expired': "The user's credential has expired. Please sign in again.",
    'auth/null-user': 'No user is currently signed in.'
  };

  if (error?.code === 'auth/popup-closed-by-user') {
    return;
  }

  return errors[error?.code] ? errors[error?.code] : `Encountered ${error}`;
};
