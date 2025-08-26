import { MaterialCommunityIcons } from "@expo/vector-icons";
import { differenceInDays, format } from "date-fns";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";

import LoaderBlock from "@/components/LoaderBlock";
import Teaser from "@/components/Teaser";
import { gray } from "@/constants/colors";
import { useLocationContext } from "@/context/LocationContext";
import { useUserContext } from "@/context/UserContext";
import { useModisMapQuery } from "@/graphql/generated";

export default function SatelliteScreen() {
  const router = useRouter();
  const { user } = useUserContext();
  const { activeLocation } = useLocationContext();
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();

  const { data: modisMapData, loading } = useModisMapQuery({
    variables: { locationId: activeLocation?.id || "" },
    skip: !user.entitledToPremium || !activeLocation?.id,
  });

  const [curIndex, setCurIndex] = useState(0);

  const handleSmallMapPress = () => {
    if (!maps || !maps[curIndex]) return;

    const image = maps[curIndex];
    router.push({
      pathname: "/satellite-detail",
      params: {
        imageUrl: image.large.url,
        title: format(new Date(image.date), "EEEE, LLLL d"),
      },
    });
  };

  const maps = useMemo(() => {
    return modisMapData?.location?.modisMaps
      ? [...modisMapData.location.modisMaps].reverse()
      : [];
  }, [modisMapData?.location?.modisMaps]);

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current && maps.length > 0) {
        scrollRef.current.scrollToEnd({ animated: false });
      }
    }, 10);

    if (maps.length > 0) {
      setCurIndex(maps.length - 1);
    }
  }, [maps]);

  if (!user.entitledToPremium) {
    return (
      <Teaser
        title="Find clean water with real-time satellite imagery"
        description="Salty Solutions Premium gives you access to the last 7 days of high-res imagery from MODIS satellites - so you can find clean water."
        buttonTitle="Get Premium Access"
      >
        <Image
          source={require("../../assets/images/satellite-sample.jpg")}
          style={{
            width: width - 40,
            height: (width - 40) / 1.4,
            marginTop: 10,
            marginBottom: 20,
          }}
          resizeMode="stretch"
        />
      </Teaser>
    );
  }

  if (loading || !modisMapData?.location) {
    return (
      <View style={styles.container}>
        <LoaderBlock styles={{ ...styles.loaderBlock, height: 70 }} />
        <LoaderBlock styles={{ ...styles.loaderBlock, height: 50 }} />
        <LoaderBlock styles={{ ...styles.loaderBlock, height: 400 }} />
        <LoaderBlock styles={{ ...styles.loaderBlock, height: 70 }} />
      </View>
    );
  }

  if (!maps.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No satellite imagery available</Text>
      </View>
    );
  }

  const curImage = maps[curIndex];
  const curDate = new Date(curImage.date);
  const dayDiff = differenceInDays(new Date(), curDate);
  const pressText = Platform.OS === "android" ? "Long press" : "Press";
  const touchableProps = {
    [Platform.OS === "ios" ? "onPress" : "onLongPress"]: handleSmallMapPress,
  };

  return (
    <View style={styles.container}>
      <View style={styles.tileHeader}>
        <View>
          <MaterialCommunityIcons
            name="gesture-swipe-right"
            size={20}
            color={curIndex > 0 ? "rgba(0,0,0,.5)" : "transparent"}
          />
        </View>
        <View>
          <Text style={styles.tileText}>{format(curDate, "EEEE, LLLL d")}</Text>
          <Text style={styles.tileDiffText}>
            {dayDiff === 0
              ? "Today "
              : `${dayDiff} day${dayDiff > 1 ? "s" : ""} ago `}
            ({curImage.satellite.toLowerCase()} satellite)
          </Text>
        </View>
        <View>
          <MaterialCommunityIcons
            name="gesture-swipe-left"
            size={20}
            color={
              curIndex < maps.length - 1 ? "rgba(0,0,0,.5)" : "transparent"
            }
          />
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal={true}
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        onMomentumScrollEnd={(e) => {
          let newIndex = Math.floor(e.nativeEvent.contentOffset.x / width);
          if (newIndex < 0) {
            newIndex = 0;
          }
          if (newIndex > maps.length - 1) {
            newIndex = maps.length - 1;
          }
          setCurIndex(newIndex);
        }}
        style={styles.swiperView}
      >
        {maps.map((map, i) => {
          const smallImageDisplayWidth = width - 40;
          const smallImageDisplayHeight =
            (map.small.height * smallImageDisplayWidth) / map.small.width;

          return (
            <View key={i} style={[styles.scrollContainer]}>
              <TouchableWithoutFeedback {...touchableProps}>
                <Image
                  source={{
                    uri: map.small.url,
                  }}
                  style={{
                    width: smallImageDisplayWidth,
                    height: smallImageDisplayHeight,
                  }}
                  resizeMode="contain"
                />
              </TouchableWithoutFeedback>
            </View>
          );
        })}
      </ScrollView>

      <Text style={styles.zoomText}>
        {pressText} image to open zoomable view.
      </Text>
      <Text style={styles.instructionText}>
        Swipe left and right to view different days, and{" "}
        {pressText.toLowerCase()} any image to open a zoomable view.
      </Text>
      <Text style={styles.introText}>
        MODIS is an extensive program with two satellites (Aqua and Terra) that
        pass over the United States and take a giant photo each day. Most
        importantly for fishermen,{" "}
        <Text style={styles.bold}>
          you can use the imagery to find clean water.
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  introText: {
    marginTop: 20,
  },
  tileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tileText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  tileDiffText: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
    textTransform: "capitalize",
    color: gray[600],
  },
  loaderBlock: {
    backgroundColor: gray[400],
    width: "100%",
    marginBottom: 20,
  },
  zoomText: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    color: gray[700],
    fontSize: 14,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  swiperView: {
    flexGrow: 0,
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: gray[600],
    marginTop: 40,
  },
});
