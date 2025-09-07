import React from "react";
import { Area, ChartBounds, PointsArray } from "victory-native";
import { SolunarPeriod, TidePoint } from "../../types";
import Fish from "../svg/Fish";

interface SolunarFeedingPeriodsOverlayProps {
  solunarPeriods: SolunarPeriod[];
  waterHeightPoints: PointsArray;
  tideData: TidePoint[];
  chartBounds: ChartBounds;
}

const SolunarFeedingPeriodsOverlay: React.FC<
  SolunarFeedingPeriodsOverlayProps
> = ({
  solunarPeriods,
  waterHeightPoints,
  tideData: tideData,
  chartBounds,
}) => {
  return solunarPeriods.map((period, i) => {
    if (period.tides.length === 0) return null;

    // Extract the subset of tide curve chart points that fall within this solunar feeding period
    // Filter to only predicted tide data points (not observations) for solunar matching
    const predictedTideData = tideData.filter(
      (datum) => datum.predictedHeight !== null
    );
    const solunarPoints = waterHeightPoints.filter((_, index) => {
      const dataPoint = predictedTideData[index];
      if (!dataPoint) return false;
      return period.tides.some(
        (tide) => Math.abs(tide.timestamp - dataPoint.timestamp) < 60000 // within 1 minute
      );
    });

    if (solunarPoints.length === 0) return null;

    // Calculate center of the feeding period for fish positioning
    const periodStart = period.tides[0].timestamp;
    const periodEnd = period.tides[period.tides.length - 1].timestamp;
    const periodCenter = (periodStart + periodEnd) / 2;

    // Find the corresponding point on the tide curve (using predicted data only)
    const centerPointIndex = predictedTideData.findIndex(
      (datum) =>
        Math.abs(datum.timestamp - periodCenter) ===
        Math.min(
          ...predictedTideData.map((d) => Math.abs(d.timestamp - periodCenter))
        )
    );
    const centerPoint = waterHeightPoints[centerPointIndex];
    const isMajor = period.type === "major";

    return (
      <React.Fragment key={i}>
        <Area
          points={solunarPoints}
          y0={chartBounds.bottom}
          color={"rgba(255,255,255, .25)"}
          opacity={1}
          curveType="natural"
        />

        {/* Fish icons within the feeding period */}
        {centerPoint.y != null && (
          <>
            {isMajor ? (
              <>
                <Fish
                  transform={[
                    { translateX: centerPoint.x - 13 },
                    { translateY: centerPoint.y + 6 },
                    { scale: 0.3 },
                  ]}
                />
                <Fish
                  transform={[
                    { translateX: centerPoint.x - 13 },
                    { translateY: centerPoint.y + 14 },
                    { scale: 0.3 },
                  ]}
                />
              </>
            ) : (
              <Fish
                transform={[
                  { translateX: centerPoint.x - 8 },
                  { translateY: centerPoint.y + 8 },
                  { scale: 0.2 },
                ]}
              />
            )}
          </>
        )}
      </React.Fragment>
    );
  });
};

export default SolunarFeedingPeriodsOverlay;
