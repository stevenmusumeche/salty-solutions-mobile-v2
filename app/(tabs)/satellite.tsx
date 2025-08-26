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
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";

import LoaderBlock from "@/components/LoaderBlock";
import Teaser from "@/components/Teaser";
import { blue, gray, white } from "@/constants/colors";
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

  const handleModisInfoPress = () => {
    router.push("/modis-info");
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
      <View style={styles.container}>
        <Teaser
          title="Find productive fishing spots from space"
          description="NASA's MODIS satellites capture daily images showing water clarity and conditions. Premium members get access to 7 days of high-resolution imagery to locate the cleanest, most productive fishing areas."
          buttonTitle="Get Premium Access"
        >
          <Image
            source={require("../../assets/images/satellite-sample.jpg")}
            style={{
              width: width - 40,
              height: (width - 40) / 1.4,
              marginTop: 10,
              marginBottom: 15,
            }}
            resizeMode="stretch"
          />
        </Teaser>
      </View>
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topSection}>
        <View style={styles.tileHeader}>
          <View>
            <MaterialCommunityIcons
              name="gesture-swipe-right"
              size={20}
              color={curIndex > 0 ? "rgba(0,0,0,.5)" : "transparent"}
            />
          </View>
          <View>
            <Text style={styles.tileText}>
              {format(curDate, "EEEE, LLLL d")}
            </Text>
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
        <View style={styles.swipeCopyContainer}>
          <Text style={styles.instructionText}>
            Swipe to change days • {pressText} image to zoom
          </Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.colorGuide}>
          <Text style={styles.colorGuideTitle}>Water Color Guide</Text>
          <View style={styles.colorRow}>
            <View style={styles.colorItem}>
              <View style={[styles.colorDot, { backgroundColor: "#495468" }]} />
              <Text style={styles.colorLabel}>Clear</Text>
            </View>
            <View style={styles.colorItem}>
              <View style={[styles.colorDot, { backgroundColor: "#F6F6F6" }]} />
              <Text style={styles.colorLabel}>Cloudy</Text>
            </View>
            <View style={styles.colorItem}>
              <View style={[styles.colorDot, { backgroundColor: "#6B5E32" }]} />
              <Text style={styles.colorLabel}>Muddy</Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.learnMoreButton}
        onPress={handleModisInfoPress}
      >
        <Text style={styles.learnMoreText}>Learn about MODIS satellites</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    padding: 20,
  },
  swipeCopyContainer: {
    marginTop: 10,
  },
  bottomSection: {
    margin: 0,
    paddingInline: 20,
  },
  colorGuide: {
    backgroundColor: white,
    padding: 16,
    borderWidth: 1,
    borderColor: gray[200],
  },
  colorGuideTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: gray[800],
    marginBottom: 20,
    textAlign: "center",
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  colorItem: {
    alignItems: "center",
    flex: 1,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 32,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: gray[300],
  },
  colorLabel: {
    fontSize: 13,
    color: gray[700],
    fontWeight: "500",
    textAlign: "center",
  },
  learnMoreButton: {
    backgroundColor: blue[600],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin: 20,
    borderTopWidth: 1,
    borderTopColor: gray[100],
  },
  learnMoreText: {
    color: white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
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
  instructionText: {
    fontSize: 14,
    textAlign: "center",
    color: gray[600],
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
