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
} from "../graphql/generated";
import { SolunarPeriod, TidePoint } from "../types";

export const Y_PADDING = 0.4;

// TypeScript interfaces for tide data processing
export interface TideDataset {
  x: Date;
  y: number;
}

export type HiLowTideType = 'high' | 'low';

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

const buildDatasets = (
  sunData: SunDetailFieldsFragment,
  tideDetails: TideDetailFieldsFragment[],
  solunarDetails?: SolunarDetailFieldsFragment
) => {
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

  const tideBoundaries = calcTideBoundaries(tideDetails, []);

  const timespanFilterer = makeTimespanFilterer(
    tideDetails,
    tideBoundaries.max + Y_PADDING
  );

  const tideData: TidePoint[] = tideDetails.map((tide: TideDetailFieldsFragment) => ({
    date: new Date(tide.time),
    timestamp: Date.parse(tide.time),
    waterHeight: tide.height,
    type: tide.type,
  }));

  let solunarPeriods: SolunarPeriod[] = [];
  if (solunarDetails && solunarDetails.majorPeriods) {
    // Process major periods
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
    .filter(tide => tide.type === 'high' || tide.type === 'low')
    .map(tide => ({
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
  waterHeightData: any[] // Using any since we don't have water height data in new app
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

// Comprehensive data preparation function that handles all filtering and processing
export const prepareTideDataForDay = (
  rawTideData: TideDetailFieldsFragment[],
  sunData: SunDetailFieldsFragment[],
  solunarData: SolunarDetailFieldsFragment[],
  date: Date
): PreparedTideData => {
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

  // Build the datasets using existing function
  return buildDatasets(curDaySunData, curDayTideData, curDaySolunarData);
};
