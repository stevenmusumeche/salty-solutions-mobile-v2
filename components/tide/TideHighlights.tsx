import { format } from "date-fns";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { blue, gray, orange, teal } from "../../constants/colors";
import {
  MoonDetailFieldsFragment,
  SolunarDetailFieldsFragment,
  SunDetailFieldsFragment,
} from "../../graphql/generated";
import { HiLowTide } from "../../utils/tide-helpers";
import Stars from "../forecast/Stars";
import Pill from "../Pill";

interface TideHighlightsProps {
  hiLowData: HiLowTide[];
  sunData?: SunDetailFieldsFragment;
  moonData?: MoonDetailFieldsFragment;
  solunarData?: SolunarDetailFieldsFragment;
  isPremiumUser: boolean;
}

const TideHighlights: React.FC<TideHighlightsProps> = ({
  hiLowData,
  sunData,
  moonData,
  solunarData,
  isPremiumUser,
}) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {solunarData && (
        <>
          <Pill color={teal[600]} label="Solunar Score">
            {isPremiumUser ? (
              <Stars score={solunarData.score || 0} size={20} isPremium={true} />
            ) : (
              <PremiumTeaser onPress={() => router.push("/solunar-teaser")} />
            )}
          </Pill>
          <Pill color={teal[600]} label="Major Feeding">
            {isPremiumUser ? (
              <View>
                {solunarData.majorPeriods.map((period) => formatPeriod(period))}
              </View>
            ) : (
              <PremiumTeaser onPress={() => router.push("/solunar-teaser")} />
            )}
          </Pill>
          <Pill color={teal[600]} label="Minor Feeding">
            {isPremiumUser ? (
              <View>
                {solunarData.minorPeriods.map((period) => formatPeriod(period))}
              </View>
            ) : (
              <PremiumTeaser onPress={() => router.push("/solunar-teaser")} />
            )}
          </Pill>
        </>
      )}

      {sunData && (
        <>
          <Pill label="Nautical Dawn" color={orange[700]}>
            {formatDate(sunData.nauticalDawn)}
          </Pill>
          <Pill label="Sunrise" color={orange[700]}>
            {formatDate(sunData.sunrise)}
          </Pill>
          <Pill label="Sunset" color={orange[700]}>
            {formatDate(sunData.sunset)}
          </Pill>
          <Pill label="Nautical Dusk" color={orange[700]}>
            {formatDate(sunData.nauticalDusk)}
          </Pill>
        </>
      )}

      {hiLowData.map((tide, index) => (
        <Pill key={index} label={`${tide.type === 'high' ? 'High' : 'Low'} Tide`} color={blue[600]}>
          {formatDate(tide.time)}
        </Pill>
      ))}

      {moonData && (
        <Pill label="Moon" color={blue[800]}>
          <Text style={styles.smallerFont}>{moonData.phase}</Text>
        </Pill>
      )}
    </View>
  );
};

export default TideHighlights;

const styles = StyleSheet.create({
  container: {
    backgroundColor: gray[100],
    borderTopWidth: 1,
    borderColor: gray[200],
    padding: 15,
    width: "100%",
    overflow: "hidden",
    justifyContent: "space-between",
  },
  timeText: {
    textTransform: "lowercase",
    width: "100%",
    fontSize: 16,
    textAlign: "center",
  },
  smallerFont: {
    fontSize: 14,
    textAlign: "center",
  },
  teaserText: {
    color: gray["700"],
  },
});

function formatPeriod(period: { start: string; end: string }) {
  return (
    <View key={period.start}>
      <Text style={styles.smallerFont}>
        {format(new Date(period.start), "h:mma")}-
        {format(new Date(period.end), "h:mma")}
      </Text>
    </View>
  );
}

function formatDate(dateString: string) {
  return (
    <Text style={styles.timeText}>{format(new Date(dateString), "h:mma")}</Text>
  );
}

function PremiumTeaser({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.teaserText}>Premium Required</Text>
    </TouchableOpacity>
  );
}
