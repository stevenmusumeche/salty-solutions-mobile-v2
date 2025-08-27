import { addHours, isBefore, isEqual } from "date-fns";
import { CombinedForecastV2DetailFragment } from "../graphql/generated";

/**
 * Helper function to split an array into smaller chunks of specified size
 * @param array - The array to chunk
 * @param size - The size of each chunk
 * @returns Array of chunks
 */
function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Returns the time period label for a given chunk index
 * Used to display time ranges like "12-6", "6-noon", etc.
 * @param i - The chunk index (0-3)
 * @returns The time period label
 */
const getChunkLabel = (i: number): string => {
  switch (i) {
    case 0:
      return "12-6";
    case 1:
      return "6-noon";
    case 2:
      return "noon-6";
    case 3:
      return "6-12";
    default:
      return "";
  }
};

/**
 * Structure representing wind data for a specific time point
 */
interface WindData {
  /** Timestamp of the measurement */
  x: Date;
  /** Base wind speed */
  y: number;
  /** Gust speed above base wind */
  gustY: number;
  /** Wind direction in degrees */
  directionDegrees: number;
  /** Temperature in degrees (optional) */
  temperature?: number;
  /** Rain amount in mm per hour (optional) */
  rain?: number;
}

/**
 * Creates time-based chunks from wind data array
 * Divides the day into 4 time periods and aggregates wind data for each period
 * @param windData - Array of wind data points
 * @param numChunks - Number of chunks to create (default: 4)
 * @returns Array of aggregated time chunks with min/max wind, average direction, etc.
 */
const createTimeChunks = (windData: WindData[], numChunks = 4) => {
  const rawChunks = chunk(windData, Math.ceil(windData.length / numChunks));
  return rawChunks.map((timeBucket, i) => {
    const windReductions = timeBucket.reduce(
      (acc, cur) => {
        if (cur.y < acc.min) {
          acc.min = cur.y;
        }
        if (cur.y > acc.max) {
          acc.max = cur.y;
        }
        acc.directions.push(cur.directionDegrees);

        if (cur.temperature) {
          acc.temperatures.push(cur.temperature);
        }

        if (cur.rain) {
          acc.rainTotal += cur.rain;
        }

        return acc;
      },
      {
        min: Infinity,
        max: -Infinity,
        directions: [] as number[],
        temperatures: [] as number[],
        // in millimeters
        rainTotal: 0,
      }
    );

    return {
      ...windReductions,
      label: getChunkLabel(i),
      averageDirection: averageAngle(windReductions.directions),
      averageTemperature:
        windReductions.temperatures.length > 0 &&
        windReductions.temperatures.reduce((a, b) => a + b, 0) /
          windReductions.temperatures.length,
    };
  });
};

/**
 * Prepares and processes forecast data for chart rendering and time bucket display
 * Combines wind, temperature, and rain data, fills gaps for missing hours, and creates time chunks
 * @param data - Raw forecast data from GraphQL API
 * @param date - The target date for forecast processing
 * @returns Object containing chartData array and timeChunks for display
 */
export const prepareForecastData = (
  data: CombinedForecastV2DetailFragment,
  date: Date
) => {
  const chartData: WindData[] = data.wind.map((datum) => {
    return {
      x: new Date(datum.timestamp),
      y: datum.base,
      gustY: datum.gusts - datum.base,
      ySum: datum.gusts,
      directionDegrees: datum.direction.degrees,
      temperature: data.temperature.find(
        (x) => x.timestamp === datum.timestamp
      )?.temperature.degrees,
      rain: data.rain.find((x) => x.timestamp === datum.timestamp)
        ?.mmPerHour,
    };
  });

  // make sure we have an entry for each hour
  let oldestData = chartData[0];
  for (let h = 0; h < 24; h++) {
    const targetTime = addHours(date, h);
    const match = chartData.find((x) => isEqual(x.x, targetTime));
    if (!match) {
      const toAdd = { ...oldestData, x: targetTime, fake: true };
      chartData.push(toAdd);
    } else {
      oldestData = match;
    }
  }

  // sort by date
  chartData.sort((a, b) => (isBefore(a.x, b.x) ? -1 : 1));

  // split into 4 time buckets
  const timeChunks = createTimeChunks(chartData);

  return { chartData, timeChunks };
};

/**
 * Calculates the sum of all numbers in an array
 * @param a - Array of numbers to sum
 * @returns The total sum of all numbers in the array
 */
function sum(a: number[]) {
  return a.reduce((acc, cur) => {
    acc += cur;
    return acc;
  }, 0);
}

/**
 * Converts degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle converted to radians
 */
function degreeToRadians(degrees: number) {
  return (Math.PI / 180) * degrees;
}

/**
 * Calculates the average angle from an array of degree values
 * Uses vector averaging to properly handle circular values (e.g., 350° and 10° average to 0°)
 * @param degrees - Array of angles in degrees
 * @returns Average angle in degrees (0-359)
 */
function averageAngle(degrees: number[]) {
  const base = Math.floor(
    (180 / Math.PI) *
      Math.atan2(
        sum(degrees.map(degreeToRadians).map(Math.sin)) / degrees.length,
        sum(degrees.map(degreeToRadians).map(Math.cos)) / degrees.length
      )
  );

  return base < 0 ? base + 360 : base;
}

/**
 * Converts wind direction from degrees to compass direction text
 * @param degrees - Wind direction in degrees (0-359, where 0/360 is North)
 * @returns Compass direction string (e.g., "N", "NE", "SSW", etc.)
 */
export function degreesToCompass(degrees: number): string {
  const val = Math.floor(degrees / 22.5 + 0.5);
  const arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return arr[val % 16];
}
