import {
  addMinutes,
  endOfDay,
  isAfter,
  isBefore,
  startOfDay,
  subMinutes,
  isWithinInterval,
} from "date-fns";
import {
  SunDetailFieldsFragment,
  TideDetailFieldsFragment,
  SolunarDetailFieldsFragment,
} from "../graphql/generated";

export const Y_PADDING = 0.4;

export const buildDatasets = (
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

  const toVictory = (tide: TideDetailFieldsFragment) => ({
    x: new Date(tide.time),
    y: tide.height,
    type: tide.type,
  });

  const tideData = tideDetails.map(toVictory);

  let tidesWithinSolunarPeriod: typeof tideData[] = [];
  if (solunarDetails && solunarDetails.majorPeriods) {
    const solunarPeriods = [
      ...solunarDetails.majorPeriods,
      ...solunarDetails.minorPeriods,
    ];

    tidesWithinSolunarPeriod = solunarPeriods.map((period) =>
      tideData.filter((tideDatum) =>
        isWithinInterval(tideDatum.x, {
          start: new Date(period.start),
          end: new Date(period.end),
        })
      )
    );
  }

  const darkMorning = timespanFilterer(isDarkMorning);
  const darkEvening = timespanFilterer(isDarkEvening);
  const dawn = timespanFilterer(isDawn);
  const dusk = timespanFilterer(isDusk);
  const daylight = timespanFilterer(isDaylight);

  return {
    darkMorning,
    darkEvening,
    dawn,
    dusk,
    daylight,
    tideData,
    tideBoundaries,
    tidesWithinSolunarPeriod,
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
const makeTimespanFilterer = (
  tides: TideDetailFieldsFragment[],
  maxValue: number
) => (filterFn: (tide: TideDetailFieldsFragment) => boolean) => {
  return tides.filter(filterFn).map((tide) => ({
    x: new Date(tide.time),
    y: maxValue,
  }));
};