import {
  addDays,
  addHours,
  addMinutes,
  endOfDay,
  isAfter,
  isBefore,
  isWithinInterval,
  startOfDay,
  subMinutes,
} from "date-fns";
import {
  SolunarDetailFieldsFragment,
  SunDetailFieldsFragment,
  TideDetailFieldsFragment,
  WaterHeightFieldsFragment,
} from "../graphql/generated";
import { SolunarPeriod, TidePoint } from "../types";

export const Y_PADDING = 0.4;

// TypeScript interfaces for tide data processing
export interface TideDataset {
  x: Date;
  y: number;
}

export type HiLowTideType = "high" | "low";

export interface HiLowTide {
  time: string;
  type: HiLowTideType;
  height: number;
}

export interface TideBoundaries {
  min: number;
  max: number;
}

export interface PreparedTideData {
  // Timespan data for chart rendering
  darkMorning: TideDataset[];
  darkEvening: TideDataset[];
  dawn: TideDataset[];
  dusk: TideDataset[];
  daylight: TideDataset[];

  // Processed tide data (reuse existing TidePoint type)
  tideData: TidePoint[];

  // Boundaries for chart scaling
  tideBoundaries: TideBoundaries;

  // Solunar periods with associated tides (reuse existing SolunarPeriod type)
  solunarPeriods: SolunarPeriod[];

  // High/Low tide events for badges
  hiLowData: HiLowTide[];
}

interface BuildDatasetsInput {
  sunData: SunDetailFieldsFragment;
  tideDetails: TideDetailFieldsFragment[];
  waterHeightData: WaterHeightFieldsFragment[];
  solunarDetails?: SolunarDetailFieldsFragment;
}

const buildDatasets = ({
  sunData,
  tideDetails,
  waterHeightData,
  solunarDetails,
}: BuildDatasetsInput) => {
  const dayStart = subMinutes(startOfDay(new Date(sunData.sunrise)), 10);
  const dayEnd = addMinutes(endOfDay(new Date(sunData.sunrise)), 10);
  const sunrise = new Date(sunData.sunrise);
  const sunset = new Date(sunData.sunset);
  const nauticalDusk = new Date(sunData.nauticalDusk);
  const nauticalDawn = new Date(sunData.nauticalDawn);

  type Filterer = (tide: TideDetailFieldsFragment) => boolean;
  const isDarkMorning: Filterer = (tide) =>
    isAfter(new Date(tide.time), dayStart) &&
    isBefore(new Date(tide.time), addMinutes(nauticalDawn, 10));
  const isDarkEvening: Filterer = (tide) =>
    isAfter(new Date(tide.time), subMinutes(nauticalDusk, 10)) &&
    isBefore(new Date(tide.time), dayEnd);
  const isDawn: Filterer = (tide) =>
    isAfter(new Date(tide.time), nauticalDawn) &&
    isBefore(new Date(tide.time), sunrise);
  const isDusk: Filterer = (tide) =>
    isAfter(new Date(tide.time), sunset) &&
    isBefore(new Date(tide.time), nauticalDusk);
  const isDaylight: Filterer = (tide) =>
    isAfter(new Date(tide.time), subMinutes(sunrise, 6)) &&
    isBefore(new Date(tide.time), addMinutes(sunset, 6));

  const tideBoundaries = calcTideBoundaries(tideDetails, waterHeightData || []);

  const timespanFilterer = makeTimespanFilterer(
    tideDetails,
    tideBoundaries.max + Y_PADDING
  );

  // Create tide data and add observed height
  const tideData: TidePoint[] = tideDetails.map(
    (tide: TideDetailFieldsFragment) => {
      const tidePt = {
        date: new Date(tide.time),
        timestamp: Date.parse(tide.time),
        predictedHeight: tide.height,
        type: tide.type,
      };

      // Find closest water height observation within 15 minutes
      let observedHeight: number | null = null;
      if (waterHeightData && waterHeightData.length > 0) {
        const tolerance = 15 * 60 * 1000; // 15 minutes in ms
        const tideTime = tidePt.date.getTime();

        // Find all water height observations within tolerance window
        const candidateObs = waterHeightData.filter(
          (data) =>
            Math.abs(new Date(data.timestamp).getTime() - tideTime) <= tolerance
        );

        if (candidateObs.length > 0) {
          const closest = candidateObs.reduce((prev, curr) => {
            const prevDiff = Math.abs(
              new Date(prev.timestamp).getTime() - tideTime
            );
            const currDiff = Math.abs(
              new Date(curr.timestamp).getTime() - tideTime
            );
            return currDiff < prevDiff ? curr : prev;
          });
          observedHeight = closest.height;
        }
      }

      return {
        ...tidePt,
        observedHeight,
      };
    }
  );

  let solunarPeriods: SolunarPeriod[] = [];
  if (solunarDetails && solunarDetails.majorPeriods) {
    // Process major periods - use tide data for solunar matching
    const majorPeriods = solunarDetails.majorPeriods.map((period) => ({
      tides: tideData.filter((tideDatum) =>
        isWithinInterval(tideDatum.date, {
          start: new Date(period.start),
          end: new Date(period.end),
        })
      ),
      type: "major" as const,
    }));

    // Process minor periods
    const minorPeriods = solunarDetails.minorPeriods.map((period) => ({
      tides: tideData.filter((tideDatum) =>
        isWithinInterval(tideDatum.date, {
          start: new Date(period.start),
          end: new Date(period.end),
        })
      ),
      type: "minor" as const,
    }));

    solunarPeriods = [...majorPeriods, ...minorPeriods];
  }

  const darkMorning = timespanFilterer(isDarkMorning);
  const darkEvening = timespanFilterer(isDarkEvening);
  const dawn = timespanFilterer(isDawn);
  const dusk = timespanFilterer(isDusk);
  const daylight = timespanFilterer(isDaylight);

  // Extract high/low tide events for badges
  const hiLowData: HiLowTide[] = tideDetails
    .filter((tide) => tide.type === "high" || tide.type === "low")
    .map((tide) => ({
      time: tide.time,
      type: tide.type as HiLowTideType,
      height: tide.height,
    }));

  return {
    darkMorning,
    darkEvening,
    dawn,
    dusk,
    daylight,
    tideData,
    tideBoundaries,
    solunarPeriods,
    hiLowData,
  };
};

function calcTideBoundaries(
  tideDetails: TideDetailFieldsFragment[],
  waterHeightData: WaterHeightFieldsFragment[]
) {
  const tideBoundaries = tideDetails.reduce(
    (cur, tide) => {
      return {
        max: cur.max > tide.height ? cur.max : tide.height,
        min: cur.min < tide.height ? cur.min : tide.height,
      };
    },
    { max: 0, min: 99 }
  );

  return waterHeightData.reduce((cur, waterHeight) => {
    return {
      max: cur.max > waterHeight.height ? cur.max : waterHeight.height,
      min: cur.min < waterHeight.height ? cur.min : waterHeight.height,
    };
  }, tideBoundaries);
}

// used to select the timespans corresponding to a certain group, like dusk, dawn, etc
const makeTimespanFilterer =
  (tides: TideDetailFieldsFragment[], maxValue: number) =>
  (filterFn: (tide: TideDetailFieldsFragment) => boolean) => {
    return tides.filter(filterFn).map((tide) => ({
      x: new Date(tide.time),
      y: maxValue,
    }));
  };

// Input parameters for prepareTideDataForDay function
export interface PrepareTideDataInput {
  rawTideData: TideDetailFieldsFragment[];
  sunData: SunDetailFieldsFragment[];
  solunarData: SolunarDetailFieldsFragment[];
  date: Date;
  waterHeightData?: WaterHeightFieldsFragment[];
}

// Comprehensive data preparation function that handles all filtering and processing
export const prepareTideDataForDay = ({
  rawTideData,
  sunData,
  solunarData,
  date,
  waterHeightData = [],
}: PrepareTideDataInput): PreparedTideData => {
  const TIDE_WINDOW_HOURS = 2;

  // Filter tide data for the current day (with buffer)
  const curDayTideData = rawTideData.filter((x) =>
    isWithinInterval(new Date(x.time), {
      start: addHours(startOfDay(date), -TIDE_WINDOW_HOURS),
      end: addHours(startOfDay(addDays(date, 1)), TIDE_WINDOW_HOURS),
    })
  );

  // Find sun data for the specific day
  const curDaySunData =
    sunData.find(
      (x) =>
        startOfDay(new Date(x.sunrise)).toISOString() ===
        startOfDay(date).toISOString()
    ) || ({} as SunDetailFieldsFragment);

  // Find solunar data for the specific day
  const curDaySolunarData =
    solunarData.find(
      (x) =>
        startOfDay(new Date(x.date)).toISOString() ===
        startOfDay(date).toISOString()
    ) || ({} as SolunarDetailFieldsFragment);

  // Filter water height data for the current day (with same buffer as tide data)
  const curDayWaterHeightData = waterHeightData.filter((x) =>
    isWithinInterval(new Date(x.timestamp), {
      start: addHours(startOfDay(date), -TIDE_WINDOW_HOURS),
      end: addHours(startOfDay(addDays(date, 1)), TIDE_WINDOW_HOURS),
    })
  );

  return buildDatasets({
    sunData: curDaySunData,
    tideDetails: curDayTideData,
    waterHeightData: curDayWaterHeightData,
    solunarDetails: curDaySolunarData,
  });
};
