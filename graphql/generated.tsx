import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AirPressure = {
  __typename?: 'AirPressure';
  pressure: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
};

export type AppVersion = {
  __typename?: 'AppVersion';
  android: SupportedVersion;
  ios: SupportedVersion;
};

export type CombinedForecastV2 = {
  __typename?: 'CombinedForecastV2';
  date: Scalars['String']['output'];
  day: ForecastDescription;
  name: Scalars['String']['output'];
  night: ForecastDescription;
  rain: Array<RainDetail>;
  temperature: Array<TemperatureDetail>;
  waves: Array<ForecastWaveDetail>;
  wind: Array<ForecastWindDetailV2>;
};

export type CompletePurchaseInput = {
  platform: Platform;
  priceCents: Scalars['Int']['input'];
  receipt: Scalars['String']['input'];
};

export type CompletePurchaseResponse = {
  __typename?: 'CompletePurchaseResponse';
  isComplete: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type Coords = {
  __typename?: 'Coords';
  lat: Scalars['Float']['output'];
  lon: Scalars['Float']['output'];
};

export type CreateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserResponse = {
  __typename?: 'CreateUserResponse';
  user: User;
};

export type CurrentWind = {
  __typename?: 'CurrentWind';
  direction: Scalars['String']['output'];
  directionDegrees: Scalars['Float']['output'];
  speed: Scalars['Float']['output'];
};

export type DataSources = {
  __typename?: 'DataSources';
  marineZoneId: Scalars['String']['output'];
  tideStationIds: Array<Scalars['String']['output']>;
  usgsSiteId: Scalars['String']['output'];
  weatherRadarSiteId: Scalars['String']['output'];
  weatherStationId: Scalars['String']['output'];
};

export type FeatureFlag = {
  __typename?: 'FeatureFlag';
  id: Scalars['ID']['output'];
  type: FeatureFlagType;
  value: Scalars['Boolean']['output'];
};

export enum FeatureFlagType {
  Boolean = 'Boolean'
}

export type FeatureFlagsResponse = {
  __typename?: 'FeatureFlagsResponse';
  flags: Array<FeatureFlag>;
};

export type ForecastDescription = {
  __typename?: 'ForecastDescription';
  detailed?: Maybe<Scalars['String']['output']>;
  marine?: Maybe<Scalars['String']['output']>;
  short?: Maybe<Scalars['String']['output']>;
};

export type ForecastWaveDetail = {
  __typename?: 'ForecastWaveDetail';
  direction: WindDirection;
  /** feet */
  height: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
};

export type ForecastWindDetailV2 = {
  __typename?: 'ForecastWindDetailV2';
  /** mph */
  base: Scalars['Float']['output'];
  direction: WindDirection;
  /** mph */
  gusts: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
};

export type ForecastWindSpeedDetail = {
  __typename?: 'ForecastWindSpeedDetail';
  from: Scalars['Int']['output'];
  to: Scalars['Int']['output'];
};

export type Location = {
  __typename?: 'Location';
  combinedForecastV2?: Maybe<Array<CombinedForecastV2>>;
  coords: Coords;
  dataSources?: Maybe<DataSources>;
  hourlyWeatherForecast?: Maybe<Array<WeatherForecast>>;
  id: Scalars['ID']['output'];
  marineForecast?: Maybe<Array<MarineForecast>>;
  modisMaps: Array<ModisMap>;
  moon?: Maybe<Array<MoonDetail>>;
  name: Scalars['String']['output'];
  salinityMap: Scalars['String']['output'];
  solunar?: Maybe<Array<SolunarDetail>>;
  state: Scalars['String']['output'];
  sun?: Maybe<Array<SunDetail>>;
  temperature: TemperatureResult;
  tidePreditionStations: Array<TidePreditionStation>;
  usgsSites: Array<UsgsSite>;
  weatherForecast?: Maybe<Array<WeatherForecast>>;
  wind?: Maybe<Wind>;
};


export type LocationCombinedForecastV2Args = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};


export type LocationModisMapsArgs = {
  numDays?: InputMaybe<Scalars['Int']['input']>;
};


export type LocationMoonArgs = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};


export type LocationSolunarArgs = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};


export type LocationSunArgs = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};


export type LocationTidePreditionStationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type MarineForecast = {
  __typename?: 'MarineForecast';
  forecast: MarineForecastDetail;
  timePeriod: MarineForecastTimePeriod;
};

export type MarineForecastDetail = {
  __typename?: 'MarineForecastDetail';
  text: Scalars['String']['output'];
  waterCondition?: Maybe<Scalars['String']['output']>;
  windDirection?: Maybe<WindDirection>;
  windSpeed?: Maybe<ForecastWindSpeedDetail>;
};

export type MarineForecastTimePeriod = {
  __typename?: 'MarineForecastTimePeriod';
  date: Scalars['String']['output'];
  isDaytime: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
};

export type ModisMap = {
  __typename?: 'ModisMap';
  date: Scalars['String']['output'];
  large: ModisMapEntry;
  medium: ModisMapEntry;
  satellite: ModisSatellite;
  small: ModisMapEntry;
};

export type ModisMapEntry = {
  __typename?: 'ModisMapEntry';
  height: Scalars['Int']['output'];
  url: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export enum ModisSatellite {
  Aqua = 'AQUA',
  Terra = 'TERRA'
}

export type MoonDetail = {
  __typename?: 'MoonDetail';
  date: Scalars['String']['output'];
  illumination: Scalars['Int']['output'];
  phase: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Record an IAP purchase */
  completePurchase: CompletePurchaseResponse;
  /**
   * Create a new user. If user already exists, this is a no-op.
   * @deprecated Use upsert user
   */
  createUser: CreateUserResponse;
  /** Send message */
  sendFeedback: SendFeedbackResponse;
  /** Create or update a user */
  upsertUser: UpsertUserResponse;
  userLoggedIn: UserLoggedInResponse;
};


export type MutationCompletePurchaseArgs = {
  input: CompletePurchaseInput;
};


export type MutationCreateUserArgs = {
  input?: InputMaybe<CreateUserInput>;
};


export type MutationSendFeedbackArgs = {
  input: SendFeedbackInput;
};


export type MutationUpsertUserArgs = {
  input: UpsertUserInput;
};


export type MutationUserLoggedInArgs = {
  input: UserLoggedInInput;
};

export enum NoaaParam {
  AirPressure = 'AirPressure',
  AirTemperature = 'AirTemperature',
  TidePrediction = 'TidePrediction',
  WaterLevel = 'WaterLevel',
  WaterTemperature = 'WaterTemperature',
  Wind = 'Wind'
}

export type NoaaParamInfo = {
  __typename?: 'NoaaParamInfo';
  id: NoaaParam;
  latestDataDate?: Maybe<Scalars['String']['output']>;
};

export enum Platform {
  Android = 'ANDROID',
  Ios = 'IOS',
  Web = 'WEB'
}

export enum PurchasableItem {
  PremiumV1 = 'PREMIUM_V1'
}

export type Query = {
  __typename?: 'Query';
  appVersion: AppVersion;
  featureFlags: FeatureFlagsResponse;
  location?: Maybe<Location>;
  locations: Array<Location>;
  tidePreditionStation?: Maybe<TidePreditionStation>;
  tidePreditionStations: Array<TidePreditionStation>;
  usgsSite?: Maybe<UsgsSite>;
  usgsSites: Array<UsgsSite>;
  viewer?: Maybe<User>;
};


export type QueryFeatureFlagsArgs = {
  platform: Platform;
};


export type QueryLocationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTidePreditionStationArgs = {
  stationId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUsgsSiteArgs = {
  siteId?: InputMaybe<Scalars['ID']['input']>;
};

export type RainDetail = {
  __typename?: 'RainDetail';
  mmPerHour: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
};

export type Salinity = {
  __typename?: 'Salinity';
  detail?: Maybe<Array<SalinityDetail>>;
  summary?: Maybe<SalinitySummary>;
};


export type SalinityDetailArgs = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};

export type SalinityDetail = {
  __typename?: 'SalinityDetail';
  /** parts per thousand */
  salinity: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
};

export type SalinitySummary = {
  __typename?: 'SalinitySummary';
  /** parts per thousand */
  mostRecent?: Maybe<SalinityDetail>;
};

export type SendFeedbackInput = {
  fromEmail: Scalars['String']['input'];
  fromName: Scalars['String']['input'];
  message: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};

export type SendFeedbackResponse = {
  __typename?: 'SendFeedbackResponse';
  success: Scalars['Boolean']['output'];
};

export type SolunarDetail = {
  __typename?: 'SolunarDetail';
  date: Scalars['String']['output'];
  majorPeriods: Array<SolunarPeriod>;
  minorPeriods: Array<SolunarPeriod>;
  saltyScore: Scalars['Int']['output'];
  score: Scalars['Float']['output'];
};

export type SolunarPeriod = {
  __typename?: 'SolunarPeriod';
  end: Scalars['String']['output'];
  start: Scalars['String']['output'];
  weight: Scalars['Int']['output'];
};

export type SunDetail = {
  __typename?: 'SunDetail';
  date: Scalars['String']['output'];
  dawn: Scalars['String']['output'];
  dusk: Scalars['String']['output'];
  nauticalDawn: Scalars['String']['output'];
  nauticalDusk: Scalars['String']['output'];
  sunrise: Scalars['String']['output'];
  sunset: Scalars['String']['output'];
};

export type SupportedVersion = {
  __typename?: 'SupportedVersion';
  current: Scalars['String']['output'];
  minimumSupported: Scalars['String']['output'];
};

export type Temperature = {
  __typename?: 'Temperature';
  degrees: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
};

export type TemperatureDetail = {
  __typename?: 'TemperatureDetail';
  temperature: Temperature;
  timestamp: Scalars['String']['output'];
};

export type TemperatureResult = {
  __typename?: 'TemperatureResult';
  detail?: Maybe<Array<TemperatureDetail>>;
  summary: TemperatureSummary;
};


export type TemperatureResultDetailArgs = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};

export type TemperatureSummary = {
  __typename?: 'TemperatureSummary';
  mostRecent?: Maybe<TemperatureDetail>;
};

export type TideDetail = {
  __typename?: 'TideDetail';
  height: Scalars['Float']['output'];
  time: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type TidePreditionStation = {
  __typename?: 'TidePreditionStation';
  availableParams: Array<NoaaParam>;
  availableParamsV2: Array<NoaaParamInfo>;
  coords: Coords;
  id: Scalars['ID']['output'];
  locations: Array<Location>;
  name: Scalars['String']['output'];
  salinity?: Maybe<Salinity>;
  temperature?: Maybe<TemperatureResult>;
  tides?: Maybe<Array<TideDetail>>;
  url: Scalars['String']['output'];
  waterHeight?: Maybe<Array<WaterHeight>>;
  waterTemperature?: Maybe<WaterTemperature>;
  wind?: Maybe<Wind>;
};


export type TidePreditionStationTidesArgs = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};


export type TidePreditionStationWaterHeightArgs = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};

export type UpsertUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  picture?: InputMaybe<Scalars['String']['input']>;
};

export type UpsertUserResponse = {
  __typename?: 'UpsertUserResponse';
  user: User;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  entitledToPremium: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  picture?: Maybe<Scalars['String']['output']>;
  /** @deprecated use entitledToPremium instead */
  purchases: Array<UserPurchase>;
};

export type UserLoggedInInput = {
  platform: Platform;
};

export type UserLoggedInResponse = {
  __typename?: 'UserLoggedInResponse';
  success: Scalars['Boolean']['output'];
};

export type UserPurchase = {
  __typename?: 'UserPurchase';
  endDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  item: PurchasableItem;
  platform: Platform;
  priceCents: Scalars['Int']['output'];
  purchaseDate: Scalars['String']['output'];
};

export enum UsgsParam {
  GuageHeight = 'GuageHeight',
  Salinity = 'Salinity',
  WaterTemp = 'WaterTemp',
  WindDirection = 'WindDirection',
  WindSpeed = 'WindSpeed'
}

export type UsgsParamInfo = {
  __typename?: 'UsgsParamInfo';
  id: UsgsParam;
  latestDataDate?: Maybe<Scalars['String']['output']>;
};

export type UsgsSite = {
  __typename?: 'UsgsSite';
  availableParams: Array<UsgsParam>;
  availableParamsV2: Array<UsgsParamInfo>;
  coords: Coords;
  id: Scalars['ID']['output'];
  locations: Array<Location>;
  name: Scalars['String']['output'];
  salinity?: Maybe<Salinity>;
  url: Scalars['String']['output'];
  waterHeight?: Maybe<Array<WaterHeight>>;
  waterTemperature?: Maybe<WaterTemperature>;
  wind?: Maybe<Wind>;
};


export type UsgsSiteWaterHeightArgs = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};

export type WaterHeight = {
  __typename?: 'WaterHeight';
  /** measured in feet */
  height: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
};

export type WaterTemperature = {
  __typename?: 'WaterTemperature';
  detail?: Maybe<Array<TemperatureDetail>>;
  summary: TemperatureSummary;
};


export type WaterTemperatureDetailArgs = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};

export type WeatherForecast = {
  __typename?: 'WeatherForecast';
  chanceOfPrecipitation?: Maybe<Scalars['Int']['output']>;
  detailedForecast: Scalars['String']['output'];
  endTime: Scalars['String']['output'];
  icon: Scalars['String']['output'];
  isDaytime: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  shortForecast: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
  temperature: Temperature;
  windDirection?: Maybe<WindDirection>;
  windSpeed?: Maybe<ForecastWindSpeedDetail>;
};

export type Wind = {
  __typename?: 'Wind';
  detail?: Maybe<Array<WindDetail>>;
  summary: WindSummary;
};


export type WindDetailArgs = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};

export type WindDetail = {
  __typename?: 'WindDetail';
  direction: Scalars['String']['output'];
  directionDegrees: Scalars['Float']['output'];
  /** miles per hour */
  speed: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
};

export type WindDirection = {
  __typename?: 'WindDirection';
  degrees: Scalars['Int']['output'];
  text: Scalars['String']['output'];
};

export type WindSummary = {
  __typename?: 'WindSummary';
  mostRecent?: Maybe<WindDetail>;
};

export type CurrentConditionsDataQueryVariables = Exact<{
  locationId: Scalars['ID']['input'];
  usgsSiteId?: InputMaybe<Scalars['ID']['input']>;
  includeUsgs: Scalars['Boolean']['input'];
  noaaStationId?: InputMaybe<Scalars['ID']['input']>;
  includeNoaa: Scalars['Boolean']['input'];
  includeLocationWind?: InputMaybe<Scalars['Boolean']['input']>;
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;


export type CurrentConditionsDataQuery = { __typename?: 'Query', location?: { __typename?: 'Location', id: string, temperature: { __typename?: 'TemperatureResult', summary: { __typename?: 'TemperatureSummary', mostRecent?: { __typename?: 'TemperatureDetail', temperature: { __typename?: 'Temperature', degrees: number } } | null }, detail?: Array<{ __typename?: 'TemperatureDetail', timestamp: string, temperature: { __typename?: 'Temperature', degrees: number } }> | null }, locationWind?: { __typename?: 'Wind', summary: { __typename?: 'WindSummary', mostRecent?: { __typename?: 'WindDetail', timestamp: string, speed: number, direction: string, directionDegrees: number } | null }, detail?: Array<{ __typename?: 'WindDetail', timestamp: string, speed: number, direction: string, directionDegrees: number }> | null } | null } | null, usgsSite?: { __typename?: 'UsgsSite', id: string, name: string, salinity?: { __typename?: 'Salinity', summary?: { __typename?: 'SalinitySummary', mostRecent?: { __typename?: 'SalinityDetail', salinity: number } | null } | null, detail?: Array<{ __typename?: 'SalinityDetail', timestamp: string, salinity: number }> | null } | null, waterTemperature?: { __typename?: 'WaterTemperature', summary: { __typename?: 'TemperatureSummary', mostRecent?: { __typename?: 'TemperatureDetail', temperature: { __typename?: 'Temperature', degrees: number } } | null }, detail?: Array<{ __typename?: 'TemperatureDetail', timestamp: string, temperature: { __typename?: 'Temperature', degrees: number } }> | null } | null, wind?: { __typename?: 'Wind', summary: { __typename?: 'WindSummary', mostRecent?: { __typename?: 'WindDetail', timestamp: string, speed: number, direction: string, directionDegrees: number } | null }, detail?: Array<{ __typename?: 'WindDetail', timestamp: string, speed: number, direction: string, directionDegrees: number }> | null } | null } | null, tidePreditionStation?: { __typename?: 'TidePreditionStation', id: string, name: string, wind?: { __typename?: 'Wind', summary: { __typename?: 'WindSummary', mostRecent?: { __typename?: 'WindDetail', timestamp: string, speed: number, direction: string, directionDegrees: number } | null }, detail?: Array<{ __typename?: 'WindDetail', timestamp: string, speed: number, direction: string, directionDegrees: number }> | null } | null, temperature?: { __typename?: 'TemperatureResult', summary: { __typename?: 'TemperatureSummary', mostRecent?: { __typename?: 'TemperatureDetail', temperature: { __typename?: 'Temperature', degrees: number } } | null }, detail?: Array<{ __typename?: 'TemperatureDetail', timestamp: string, temperature: { __typename?: 'Temperature', degrees: number } }> | null } | null, waterTemperature?: { __typename?: 'WaterTemperature', summary: { __typename?: 'TemperatureSummary', mostRecent?: { __typename?: 'TemperatureDetail', temperature: { __typename?: 'Temperature', degrees: number } } | null }, detail?: Array<{ __typename?: 'TemperatureDetail', timestamp: string, temperature: { __typename?: 'Temperature', degrees: number } }> | null } | null } | null };

export type TemperatureDetailFieldsFragment = { __typename?: 'TemperatureResult', summary: { __typename?: 'TemperatureSummary', mostRecent?: { __typename?: 'TemperatureDetail', temperature: { __typename?: 'Temperature', degrees: number } } | null }, detail?: Array<{ __typename?: 'TemperatureDetail', timestamp: string, temperature: { __typename?: 'Temperature', degrees: number } }> | null };

export type WaterTemperatureDetailFieldsFragment = { __typename?: 'WaterTemperature', summary: { __typename?: 'TemperatureSummary', mostRecent?: { __typename?: 'TemperatureDetail', temperature: { __typename?: 'Temperature', degrees: number } } | null }, detail?: Array<{ __typename?: 'TemperatureDetail', timestamp: string, temperature: { __typename?: 'Temperature', degrees: number } }> | null };

export type UsgsSiteDetailFieldsFragment = { __typename?: 'UsgsSite', id: string, name: string, salinity?: { __typename?: 'Salinity', summary?: { __typename?: 'SalinitySummary', mostRecent?: { __typename?: 'SalinityDetail', salinity: number } | null } | null, detail?: Array<{ __typename?: 'SalinityDetail', timestamp: string, salinity: number }> | null } | null, waterTemperature?: { __typename?: 'WaterTemperature', summary: { __typename?: 'TemperatureSummary', mostRecent?: { __typename?: 'TemperatureDetail', temperature: { __typename?: 'Temperature', degrees: number } } | null }, detail?: Array<{ __typename?: 'TemperatureDetail', timestamp: string, temperature: { __typename?: 'Temperature', degrees: number } }> | null } | null, wind?: { __typename?: 'Wind', summary: { __typename?: 'WindSummary', mostRecent?: { __typename?: 'WindDetail', timestamp: string, speed: number, direction: string, directionDegrees: number } | null }, detail?: Array<{ __typename?: 'WindDetail', timestamp: string, speed: number, direction: string, directionDegrees: number }> | null } | null };

export type TidePredictionStationDetailFieldsFragment = { __typename?: 'TidePreditionStation', id: string, name: string, wind?: { __typename?: 'Wind', summary: { __typename?: 'WindSummary', mostRecent?: { __typename?: 'WindDetail', timestamp: string, speed: number, direction: string, directionDegrees: number } | null }, detail?: Array<{ __typename?: 'WindDetail', timestamp: string, speed: number, direction: string, directionDegrees: number }> | null } | null, temperature?: { __typename?: 'TemperatureResult', summary: { __typename?: 'TemperatureSummary', mostRecent?: { __typename?: 'TemperatureDetail', temperature: { __typename?: 'Temperature', degrees: number } } | null }, detail?: Array<{ __typename?: 'TemperatureDetail', timestamp: string, temperature: { __typename?: 'Temperature', degrees: number } }> | null } | null, waterTemperature?: { __typename?: 'WaterTemperature', summary: { __typename?: 'TemperatureSummary', mostRecent?: { __typename?: 'TemperatureDetail', temperature: { __typename?: 'Temperature', degrees: number } } | null }, detail?: Array<{ __typename?: 'TemperatureDetail', timestamp: string, temperature: { __typename?: 'Temperature', degrees: number } }> | null } | null };

export type WindDetailFields2Fragment = { __typename?: 'WindDetail', timestamp: string, speed: number, direction: string, directionDegrees: number };

export type LocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type LocationsQuery = { __typename?: 'Query', locations: Array<{ __typename?: 'Location', id: string, name: string, state: string, coords: { __typename?: 'Coords', lat: number }, tidePreditionStations: Array<{ __typename?: 'TidePreditionStation', id: string, name: string, url: string, availableParamsV2: Array<{ __typename?: 'NoaaParamInfo', id: NoaaParam, latestDataDate?: string | null }> }>, usgsSites: Array<{ __typename?: 'UsgsSite', id: string, name: string, url: string, availableParamsV2: Array<{ __typename?: 'UsgsParamInfo', id: UsgsParam, latestDataDate?: string | null }> }> }> };

export type LocationDetailFragment = { __typename?: 'Location', id: string, name: string, state: string, coords: { __typename?: 'Coords', lat: number }, tidePreditionStations: Array<{ __typename?: 'TidePreditionStation', id: string, name: string, url: string, availableParamsV2: Array<{ __typename?: 'NoaaParamInfo', id: NoaaParam, latestDataDate?: string | null }> }>, usgsSites: Array<{ __typename?: 'UsgsSite', id: string, name: string, url: string, availableParamsV2: Array<{ __typename?: 'UsgsParamInfo', id: UsgsParam, latestDataDate?: string | null }> }> };

export type TideStationDetailFragment = { __typename?: 'TidePreditionStation', id: string, name: string, url: string, availableParamsV2: Array<{ __typename?: 'NoaaParamInfo', id: NoaaParam, latestDataDate?: string | null }> };

export type UsgsSiteDetailFragment = { __typename?: 'UsgsSite', id: string, name: string, url: string, availableParamsV2: Array<{ __typename?: 'UsgsParamInfo', id: UsgsParam, latestDataDate?: string | null }> };

export type UpsertUserMutationVariables = Exact<{
  input: UpsertUserInput;
}>;


export type UpsertUserMutation = { __typename?: 'Mutation', upsertUser: { __typename?: 'UpsertUserResponse', user: { __typename?: 'User', id: string, email?: string | null, name: string, picture?: string | null, createdAt: string, entitledToPremium: boolean } } };

export type UserFieldsFragment = { __typename?: 'User', id: string, email?: string | null, name: string, picture?: string | null, createdAt: string, entitledToPremium: boolean };

export type UserLoggedInMutationVariables = Exact<{
  platform: Platform;
}>;


export type UserLoggedInMutation = { __typename?: 'Mutation', userLoggedIn: { __typename?: 'UserLoggedInResponse', success: boolean } };

export const WaterTemperatureDetailFieldsFragmentDoc = gql`
    fragment WaterTemperatureDetailFields on WaterTemperature {
  summary {
    mostRecent {
      temperature {
        degrees
      }
    }
  }
  detail(start: $startDate, end: $endDate) {
    timestamp
    temperature {
      degrees
    }
  }
}
    `;
export const WindDetailFields2FragmentDoc = gql`
    fragment WindDetailFields2 on WindDetail {
  timestamp
  speed
  direction
  directionDegrees
}
    `;
export const UsgsSiteDetailFieldsFragmentDoc = gql`
    fragment UsgsSiteDetailFields on UsgsSite {
  id
  name
  salinity {
    summary {
      mostRecent {
        salinity
      }
    }
    detail(start: $startDate, end: $endDate) {
      timestamp
      salinity
    }
  }
  waterTemperature {
    ...WaterTemperatureDetailFields
  }
  wind {
    summary {
      mostRecent {
        ...WindDetailFields2
      }
    }
    detail(start: $startDate, end: $endDate) {
      ...WindDetailFields2
    }
  }
}
    ${WaterTemperatureDetailFieldsFragmentDoc}
${WindDetailFields2FragmentDoc}`;
export const TemperatureDetailFieldsFragmentDoc = gql`
    fragment TemperatureDetailFields on TemperatureResult {
  summary {
    mostRecent {
      temperature {
        degrees
      }
    }
  }
  detail(start: $startDate, end: $endDate) {
    timestamp
    temperature {
      degrees
    }
  }
}
    `;
export const TidePredictionStationDetailFieldsFragmentDoc = gql`
    fragment TidePredictionStationDetailFields on TidePreditionStation {
  id
  name
  wind {
    summary {
      mostRecent {
        ...WindDetailFields2
      }
    }
    detail(start: $startDate, end: $endDate) {
      ...WindDetailFields2
    }
  }
  temperature {
    ...TemperatureDetailFields
  }
  waterTemperature {
    ...WaterTemperatureDetailFields
  }
}
    ${WindDetailFields2FragmentDoc}
${TemperatureDetailFieldsFragmentDoc}
${WaterTemperatureDetailFieldsFragmentDoc}`;
export const TideStationDetailFragmentDoc = gql`
    fragment TideStationDetail on TidePreditionStation {
  id
  name
  availableParamsV2 {
    id
    latestDataDate
  }
  url
}
    `;
export const UsgsSiteDetailFragmentDoc = gql`
    fragment UsgsSiteDetail on UsgsSite {
  id
  name
  availableParamsV2 {
    id
    latestDataDate
  }
  url
}
    `;
export const LocationDetailFragmentDoc = gql`
    fragment LocationDetail on Location {
  id
  name
  state
  coords {
    lat
  }
  tidePreditionStations {
    ...TideStationDetail
  }
  usgsSites {
    ...UsgsSiteDetail
  }
}
    ${TideStationDetailFragmentDoc}
${UsgsSiteDetailFragmentDoc}`;
export const UserFieldsFragmentDoc = gql`
    fragment UserFields on User {
  id
  email
  name
  picture
  createdAt
  entitledToPremium
}
    `;
export const CurrentConditionsDataDocument = gql`
    query CurrentConditionsData($locationId: ID!, $usgsSiteId: ID, $includeUsgs: Boolean!, $noaaStationId: ID, $includeNoaa: Boolean!, $includeLocationWind: Boolean = false, $startDate: String!, $endDate: String!) {
  location(id: $locationId) {
    id
    temperature {
      ...TemperatureDetailFields
    }
    locationWind: wind @include(if: $includeLocationWind) {
      summary {
        mostRecent {
          ...WindDetailFields2
        }
      }
      detail(start: $startDate, end: $endDate) {
        ...WindDetailFields2
      }
    }
  }
  usgsSite(siteId: $usgsSiteId) @include(if: $includeUsgs) {
    ...UsgsSiteDetailFields
  }
  tidePreditionStation(stationId: $noaaStationId) @include(if: $includeNoaa) {
    ...TidePredictionStationDetailFields
  }
}
    ${TemperatureDetailFieldsFragmentDoc}
${WindDetailFields2FragmentDoc}
${UsgsSiteDetailFieldsFragmentDoc}
${TidePredictionStationDetailFieldsFragmentDoc}`;

/**
 * __useCurrentConditionsDataQuery__
 *
 * To run a query within a React component, call `useCurrentConditionsDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentConditionsDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentConditionsDataQuery({
 *   variables: {
 *      locationId: // value for 'locationId'
 *      usgsSiteId: // value for 'usgsSiteId'
 *      includeUsgs: // value for 'includeUsgs'
 *      noaaStationId: // value for 'noaaStationId'
 *      includeNoaa: // value for 'includeNoaa'
 *      includeLocationWind: // value for 'includeLocationWind'
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useCurrentConditionsDataQuery(baseOptions: Apollo.QueryHookOptions<CurrentConditionsDataQuery, CurrentConditionsDataQueryVariables> & ({ variables: CurrentConditionsDataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentConditionsDataQuery, CurrentConditionsDataQueryVariables>(CurrentConditionsDataDocument, options);
      }
export function useCurrentConditionsDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentConditionsDataQuery, CurrentConditionsDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentConditionsDataQuery, CurrentConditionsDataQueryVariables>(CurrentConditionsDataDocument, options);
        }
export function useCurrentConditionsDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CurrentConditionsDataQuery, CurrentConditionsDataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CurrentConditionsDataQuery, CurrentConditionsDataQueryVariables>(CurrentConditionsDataDocument, options);
        }
export type CurrentConditionsDataQueryHookResult = ReturnType<typeof useCurrentConditionsDataQuery>;
export type CurrentConditionsDataLazyQueryHookResult = ReturnType<typeof useCurrentConditionsDataLazyQuery>;
export type CurrentConditionsDataSuspenseQueryHookResult = ReturnType<typeof useCurrentConditionsDataSuspenseQuery>;
export type CurrentConditionsDataQueryResult = Apollo.QueryResult<CurrentConditionsDataQuery, CurrentConditionsDataQueryVariables>;
export const LocationsDocument = gql`
    query Locations {
  locations {
    ...LocationDetail
  }
}
    ${LocationDetailFragmentDoc}`;

/**
 * __useLocationsQuery__
 *
 * To run a query within a React component, call `useLocationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLocationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLocationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLocationsQuery(baseOptions?: Apollo.QueryHookOptions<LocationsQuery, LocationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LocationsQuery, LocationsQueryVariables>(LocationsDocument, options);
      }
export function useLocationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LocationsQuery, LocationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LocationsQuery, LocationsQueryVariables>(LocationsDocument, options);
        }
export function useLocationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LocationsQuery, LocationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LocationsQuery, LocationsQueryVariables>(LocationsDocument, options);
        }
export type LocationsQueryHookResult = ReturnType<typeof useLocationsQuery>;
export type LocationsLazyQueryHookResult = ReturnType<typeof useLocationsLazyQuery>;
export type LocationsSuspenseQueryHookResult = ReturnType<typeof useLocationsSuspenseQuery>;
export type LocationsQueryResult = Apollo.QueryResult<LocationsQuery, LocationsQueryVariables>;
export const UpsertUserDocument = gql`
    mutation UpsertUser($input: UpsertUserInput!) {
  upsertUser(input: $input) {
    user {
      ...UserFields
    }
  }
}
    ${UserFieldsFragmentDoc}`;
export type UpsertUserMutationFn = Apollo.MutationFunction<UpsertUserMutation, UpsertUserMutationVariables>;

/**
 * __useUpsertUserMutation__
 *
 * To run a mutation, you first call `useUpsertUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertUserMutation, { data, loading, error }] = useUpsertUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpsertUserMutation(baseOptions?: Apollo.MutationHookOptions<UpsertUserMutation, UpsertUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertUserMutation, UpsertUserMutationVariables>(UpsertUserDocument, options);
      }
export type UpsertUserMutationHookResult = ReturnType<typeof useUpsertUserMutation>;
export type UpsertUserMutationResult = Apollo.MutationResult<UpsertUserMutation>;
export type UpsertUserMutationOptions = Apollo.BaseMutationOptions<UpsertUserMutation, UpsertUserMutationVariables>;
export const UserLoggedInDocument = gql`
    mutation UserLoggedIn($platform: Platform!) {
  userLoggedIn(input: {platform: $platform}) {
    success
  }
}
    `;
export type UserLoggedInMutationFn = Apollo.MutationFunction<UserLoggedInMutation, UserLoggedInMutationVariables>;

/**
 * __useUserLoggedInMutation__
 *
 * To run a mutation, you first call `useUserLoggedInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserLoggedInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userLoggedInMutation, { data, loading, error }] = useUserLoggedInMutation({
 *   variables: {
 *      platform: // value for 'platform'
 *   },
 * });
 */
export function useUserLoggedInMutation(baseOptions?: Apollo.MutationHookOptions<UserLoggedInMutation, UserLoggedInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserLoggedInMutation, UserLoggedInMutationVariables>(UserLoggedInDocument, options);
      }
export type UserLoggedInMutationHookResult = ReturnType<typeof useUserLoggedInMutation>;
export type UserLoggedInMutationResult = Apollo.MutationResult<UserLoggedInMutation>;
export type UserLoggedInMutationOptions = Apollo.BaseMutationOptions<UserLoggedInMutation, UserLoggedInMutationVariables>;