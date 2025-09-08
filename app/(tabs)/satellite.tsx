import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import PagerView, {
  PagerViewOnPageScrollEvent,
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";

import BrandButton from "@/components/BrandButton";
import LoaderWithHeader from "@/components/LoaderWithHeader";
import PagerHeader from "@/components/PagerHeader";
import Teaser from "@/components/Teaser";
import { gray, white } from "@/constants/colors";
import { useLocationContext } from "@/context/LocationContext";
import { useUserContext } from "@/context/UserContext";
import { useModisMapQuery } from "@/graphql/generated";
import { formatRelativeDate } from "@/utils/date-helpers";

const SCROLL_THRESHOLD = 0.7; // Threshold for triggering early header animation
const REVERSE_SCROLL_THRESHOLD = 1 - SCROLL_THRESHOLD;

export default function SatelliteScreen() {
  const router = useRouter();
  const { user } = useUserContext();
  const { activeLocation } = useLocationContext();
  const pagerRef = useRef<PagerView>(null);
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

  const handlePageSelected = useCallback((e: PagerViewOnPageSelectedEvent) => {
    setCurIndex(e.nativeEvent.position);
  }, []);

  // Updates index during swipe for early header animation trigger
  const handlePageScroll = useCallback(
    (e: PagerViewOnPageScrollEvent) => {
      const { position, offset } = e.nativeEvent;

      if (offset > SCROLL_THRESHOLD && position + 1 !== curIndex) {
        setCurIndex(position + 1);
      } else if (offset < REVERSE_SCROLL_THRESHOLD && position !== curIndex) {
        setCurIndex(position);
      }
    },
    [curIndex]
  );

  const maps = useMemo(() => {
    return modisMapData?.location?.modisMaps
      ? [...modisMapData.location.modisMaps].reverse()
      : [];
  }, [modisMapData?.location?.modisMaps]);

  const getTitle = useCallback(
    (index: number) => {
      if (!maps[index]) return "";
      return formatRelativeDate(maps[index].date);
    },
    [maps]
  );

  useEffect(() => {
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
        >
          <View style={{ paddingInline: 20 }}>
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
          </View>
        </Teaser>
      </View>
    );
  }

  if (loading || !modisMapData?.location) {
    return <LoaderWithHeader />;
  }

  if (!maps.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No satellite imagery available</Text>
      </View>
    );
  }

  const touchableProps = {
    [Platform.OS === "ios" ? "onPress" : "onLongPress"]: handleSmallMapPress,
  };

  return (
    <View style={styles.container}>
      <PagerHeader
        currentIndex={curIndex}
        totalPages={maps.length}
        getTitle={getTitle}
      />
      <View style={styles.topSection}>
        <View style={styles.imageContainer}>
          <PagerView
            ref={pagerRef}
            style={styles.swiperView}
            initialPage={maps.length - 1}
            onPageSelected={handlePageSelected}
            onPageScroll={handlePageScroll}
          >
            {maps.map((map, i) => {
              const smallImageDisplayWidth = width - 30;
              const smallImageDisplayHeight =
                (map.small.height * smallImageDisplayWidth) / map.small.width;

              return (
                <View
                  key={i}
                  style={[styles.scrollContainer]}
                  collapsable={false}
                >
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
          </PagerView>
          <View style={styles.zoomIconOverlay}>
            <MaterialIcons name="zoom-in" size={20} color={white} />
          </View>
        </View>
      </View>

      <BrandButton
        title="Learn about MODIS satellites"
        onPress={handleModisInfoPress}
        style={{ margin: 20, borderTopWidth: 1, borderTopColor: gray[100] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  topSection: {
    padding: 15,
    paddingBottom: 0,
  },
  imageContainer: {
    position: "relative",
  },
  zoomIconOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    borderRadius: 20,
    pointerEvents: "none",
  },
  instructionText: {
    fontSize: 14,
    textAlign: "center",
    color: gray[600],
  },
  swiperView: {
    height: 300,
  },
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
