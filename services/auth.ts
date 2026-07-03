import * as AppleAuthentication from 'expo-apple-authentication';

export interface UserProfile {
  uid: string;
  email?: string;
  fullName?: string;
}

export const isAppleAuthAvailable = async (): Promise<boolean> => {
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
};

export const signInWithApple = async (): Promise<UserProfile> => {
  const available = await isAppleAuthAvailable();
  if (!available) {
    // For non-supported environments (e.g. Android simulator / Web / local dev),
    // we provide a developer mock login to ensure testability.
    console.warn('Apple Authentication is not available on this device/platform. Using developer mock sign-in.');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          uid: 'mock_apple_user_id_12345',
          email: 'developer@example.com',
          fullName: 'Developer User',
        });
      }, 800);
    });
  }

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  const email = credential.email || undefined;
  const fullName = credential.fullName
    ? [credential.fullName.givenName, credential.fullName.familyName].filter(Boolean).join(' ')
    : undefined;

  return {
    uid: credential.user,
    email,
    fullName,
  };
};

export const signOutWithApple = async (): Promise<void> => {
  // Apple Sign-In session is managed by the OS; signing out means clearing local app state.
  return Promise.resolve();
};
