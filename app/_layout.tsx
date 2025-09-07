import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import "react-native-reanimated";

import App from "@/components/App";
import { FontProvider } from "@/context/FontContext";
import { UserContextProvider } from "@/context/UserContext";
import { SiteSelectionContextProvider } from "@/context/SiteSelectionContext";
import { apolloClient } from "@/utils/apollo";
import { ApolloProvider } from "@apollo/client";

if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      <UserContextProvider>
        <SiteSelectionContextProvider>
          <FontProvider>
            <App />
          </FontProvider>
        </SiteSelectionContextProvider>
      </UserContextProvider>
    </ApolloProvider>
  );
}
