import { useLocalSearchParams, useNavigation } from "expo-router";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

import { gray, white } from "@/constants/colors";
import { useLayoutEffect } from "react";

export default function SalinityDetail() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { imageUrl } = params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: params.title });
  }, [navigation, params.title]);

  if (!imageUrl) {
    return null;
  }

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=15.0, user-scalable=yes">
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #fff;
          }
          img {
            max-width: 100%;
            height: auto;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img src="${imageUrl}" alt="Salinity Map" />
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        startInLoadingState={true}
        scalesPageToFit={true}
        bounces={false}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  webview: {
    flex: 1,
  },
  noMapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMapText: {
    fontSize: 18,
    color: gray[600],
  },
});
