import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAfter } from "date-fns";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform as RNPlatform } from "react-native";
import Auth0, { Credentials } from "react-native-auth0";
import {
  Platform,
  UserFieldsFragment,
  useUpsertUserMutation,
  useUserLoggedInMutation,
} from "../graphql/generated";

interface UserContextType {
  user: User;
  premiumOverride: boolean | null;
  actions: {
    login: () => void;
    logout: () => void;
    purchaseComplete: (userFields: UserFieldsFragment) => void;
    setPremiumOverride: (override: boolean | null) => void;
  };
}

const auth0 = new Auth0({
  domain: "dev-nzoppbnb.us.auth0.com",
  clientId: "Ox02XdfLPCDeAyq0zmMbyKmhDd6zyIjQ",
});

export const UserContext = createContext({} as UserContextType);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const platform = RNPlatform.OS === "ios" ? Platform.Ios : Platform.Android;
  const savedCredentialsKey = "auth0Creds";
  const premiumOverrideKey = "premiumOverride";
  const [userCredentials, setUserCredentials] = useState<UserCredentials>();

  // Premium Override State (Development Only)
  // This state allows developers to force premium/non-premium experiences for testing
  // Values: null = use server value, true = force premium, false = force non-premium
  // Only active when __DEV__ is true, persisted in AsyncStorage
  const [premiumOverride, setPremiumOverrideState] = useState<boolean | null>(
    null
  );

  const [user, setUser] = useState<User>({
    isLoggedIn: false,
    loading: false,
    entitledToPremium: false,
  });
  const [loggedInMutation] = useUserLoggedInMutation();
  const [executeUpsertUser, upsertUserResult] = useUpsertUserMutation();

  const makeLoadedUser = useCallback(
    (user: UserFieldsFragment): LoadedUser => {
      // Premium Entitlement Logic:
      // In development mode, if an override is set, use that value
      // Otherwise, always use the server's entitlement value
      const finalEntitlement =
        __DEV__ && premiumOverride !== null
          ? premiumOverride
          : user.entitledToPremium;

      return {
        isLoggedIn: true,
        loading: false,
        ...user,
        serverEntitledToPremium: user.entitledToPremium, // Always preserve original server value
        entitledToPremium: finalEntitlement, // Use override in dev, server value in prod
        idToken: userCredentials?.credentials.idToken ?? "",
      };
    },
    [userCredentials, premiumOverride]
  );

  const handleNewCreds = useCallback(async (auth0Creds: Credentials) => {
    const credentials = {
      credentials: auth0Creds,
      token: enrichToken(jwtDecode<RawToken>(auth0Creds.idToken)),
    };
    setUserCredentials(credentials);
    await SecureStore.setItemAsync(
      savedCredentialsKey,
      JSON.stringify(auth0Creds)
    ).catch(() => {});
  }, []);

  const login = useCallback(async () => {
    try {
      const auth0Creds = await auth0.webAuth.authorize({
        scope: "openid profile email offline_access",
      });
      handleNewCreds(auth0Creds);

      await loggedInMutation({
        variables: { platform },
        context: {
          headers: { authorization: "Bearer " + auth0Creds.idToken },
        },
      });
    } catch (e) {
      console.log("Error logging in", e);
    }
  }, [handleNewCreds, loggedInMutation, platform]);

  const logout = useCallback(async () => {
    try {
      setUserCredentials(undefined);
      await SecureStore.deleteItemAsync(savedCredentialsKey).catch(() => {});
      await auth0.webAuth.clearSession();
    } catch (e) {
      console.log("error logging out", e);
    }
  }, []);

  const purchaseComplete = useCallback(
    (userFields: UserFieldsFragment) => {
      setUser(makeLoadedUser(userFields));
    },
    [makeLoadedUser]
  );

  /**
   * Development-only function to override premium entitlement for testing
   * @param override - null: use server value, true: force premium, false: force non-premium
   *
   * This function allows developers to test both premium and non-premium experiences
   * without needing actual premium subscriptions. The override value is persisted
   * in AsyncStorage and survives app restarts.
   *
   * In production builds (__DEV__ === false), this function does nothing.
   */
  const setPremiumOverride = useCallback(
    async (override: boolean | null) => {
      if (!__DEV__) return; // Safety check: only works in development

      setPremiumOverrideState(override);
      try {
        if (override === null) {
          await AsyncStorage.removeItem(premiumOverrideKey);
        } else {
          await AsyncStorage.setItem(
            premiumOverrideKey,
            JSON.stringify(override)
          );
        }
      } catch (error) {
        console.error("Failed to save premium override:", error);
      }
    },
    [premiumOverrideKey]
  );

  // create/update user in the database
  useEffect(() => {
    const idToken = userCredentials?.credentials.idToken;
    if (!idToken) {
      return;
    }

    executeUpsertUser({
      variables: {
        input: {
          name: userCredentials.token.name,
          email: userCredentials.token.email,
          picture: userCredentials.token.picture,
        },
      },
      context: {
        headers: { authorization: `Bearer ${idToken}` },
      },
    });
  }, [executeUpsertUser, userCredentials]);

  // Restore credentials and premium override from storage when the app starts up
  useEffect(() => {
    const restoreCredentials = async () => {
      const savedCredentials = await SecureStore.getItemAsync(
        savedCredentialsKey
      ).catch((e) => console.error(e));

      if (savedCredentials) {
        const auth0Creds = JSON.parse(savedCredentials);
        handleNewCreds(auth0Creds);
      }
    };

    /**
     * Restore Premium Override (Development Only)
     *
     * This function restores any previously set premium override from AsyncStorage.
     * This allows the developer's testing preference to persist across app restarts.
     * Only runs in development builds for security.
     */
    const restorePremiumOverride = async () => {
      if (!__DEV__) return; // Only restore overrides in development

      try {
        const savedOverride = await AsyncStorage.getItem(premiumOverrideKey);
        if (savedOverride !== null) {
          setPremiumOverrideState(JSON.parse(savedOverride));
        }
      } catch (error) {
        console.error("Failed to restore premium override:", error);
      }
    };

    restoreCredentials();
    restorePremiumOverride();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // poll for credential validity
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const tryRefresh = async () => {
      if (!userCredentials?.credentials.refreshToken) {
        return;
      }

      try {
        const auth0Creds = await auth0.auth.refreshToken({
          refreshToken: userCredentials.credentials.refreshToken,
        });

        const newCreds = { ...userCredentials.credentials, ...auth0Creds };

        handleNewCreds(newCreds);
      } catch (error) {
        if (tokenIsExpired(userCredentials.token)) {
          // force logout
          logout();
          return;
        }
        console.log(
          "Error refreshing token, but ignoring because the token is not expired",
          error
        );
      }
    };

    if (userCredentials?.credentials) {
      // if token is expired right when we call this (restored from session), then try to refresh it
      if (tokenIsExpired(userCredentials.token)) {
        tryRefresh();
      }

      // try to refresh the token every hour
      interval = setInterval(tryRefresh, 60000 * 60);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [handleNewCreds, logout, userCredentials]);

  // Update user state as credentials change
  useEffect(() => {
    if (!userCredentials) {
      setUser({
        isLoggedIn: false,
        loading: false,
        entitledToPremium: false,
      });
    } else {
      if (upsertUserResult.loading && !upsertUserResult.data?.upsertUser.user) {
        // Loading state - user not fully loaded yet, so no premium
        setUser({
          isLoggedIn: false,
          loading: true,
          entitledToPremium: false,
        });
      } else if (!upsertUserResult.data?.upsertUser.user) {
        // Error state - failed to create/load user, so no premium
        setUser({
          isLoggedIn: false,
          loading: false,
          entitledToPremium: false,
          error: "Unable to create user",
        });
      } else {
        // Successfully loaded user - makeLoadedUser handles the premium override logic
        const userData = upsertUserResult.data.upsertUser.user;
        setUser(makeLoadedUser(userData));
      }
    }
  }, [
    makeLoadedUser,
    upsertUserResult.data,
    upsertUserResult.loading,
    userCredentials,
    premiumOverride, // Re-evaluate user state when premium override changes
  ]);

  const providerValue: UserContextType = useMemo(() => {
    return {
      user,
      premiumOverride,
      actions: {
        login,
        logout,
        purchaseComplete,
        setPremiumOverride,
      },
    };
  }, [user, premiumOverride, login, logout, purchaseComplete, setPremiumOverride]);

  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
};

function enrichToken(rawToken: RawToken): Token {
  return {
    ...rawToken,
    expiration: new Date(rawToken.exp * 1000),
  };
}

function tokenIsExpired(token: Token) {
  return isAfter(new Date(), token.expiration);
}

interface RawToken {
  aud: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: number;
}

interface Token extends Omit<RawToken, "expiration"> {
  expiration: Date;
}

interface UserCredentials {
  credentials: Credentials;
  token: Token;
}

type BaseUser = {
  isLoggedIn: boolean;
  loading: boolean;
  entitledToPremium: boolean;
  serverEntitledToPremium?: boolean;
};

type LoadedUser = {
  isLoggedIn: true;
  loading: false;
  idToken: string;
  serverEntitledToPremium: boolean;
} & UserFieldsFragment &
  BaseUser;

export type User =
  | ({
      isLoggedIn: false;
      loading: true;
    } & BaseUser)
  | ({
      isLoggedIn: false;
      loading: false;
      error: string;
    } & BaseUser)
  | LoadedUser
  | ({ isLoggedIn: false; loading: false } & BaseUser);

export const useUserContext = () => useContext(UserContext);
