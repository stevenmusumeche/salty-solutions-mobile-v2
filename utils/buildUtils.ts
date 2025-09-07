/**
 * Utility to check if the current build is a development build.
 * Returns true for both __DEV__ (Metro development) and development-standalone builds.
 */
export const isDevelopmentBuild = (): boolean => {
  return __DEV__ || process.env.EXPO_PUBLIC_APP_VARIANT === "development";
};