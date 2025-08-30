import React from "react";
import { StyleSheet, View } from "react-native";
import { gray } from "../../constants/colors";
import LoaderBlock from "../LoaderBlock";
import { styles as cardStyles } from "./ForecastCard";

const ForecastLoader: React.FC = () => (
  <>
    <View style={styles.headerShimmer}>
      <LoaderBlock styles={styles.loaderBlockHeader} />
      <View style={styles.pageDotsShimmer}>
        <LoaderBlock styles={styles.loaderBlockDots} />
      </View>
    </View>
    <View style={cardStyles.cardWrapper}>
      <View style={[cardStyles.children, styles.loaderContent]}>
        <LoaderBlock styles={styles.loaderBlockBody} />
      </View>
    </View>
  </>
);

const styles = StyleSheet.create({
  headerShimmer: {
    backgroundColor: gray[700],
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pageDotsShimmer: {
    marginTop: 8,
    alignItems: "center",
    height: 8,
  },
  loaderContent: {
    padding: 15,
  },
  loaderBlockHeader: {
    width: 150,
    height: 18,
    backgroundColor: gray[600],
  },
  loaderBlockDots: {
    width: 60,
    height: 8,
    backgroundColor: gray[600],
    borderRadius: 4,
  },
  loaderBlockBody: {
    width: "100%",
    height: "100%",
  },
});

export default ForecastLoader;