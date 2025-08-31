import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocationContext } from './LocationContext';
import { useTideStationSites, useWaterHeightSites } from '../utils/tide-station-helpers';
import { TideStationDetailFragment, UsgsSiteDetailFragment } from '../graphql/generated';

export type DataSite = (TideStationDetailFragment | UsgsSiteDetailFragment) & {
  hasRecentData: boolean;
};

interface TideContext {
  selectedTideStation?: {
    id: string;
    name: string;
  };
  tideStations: DataSite[];
  sites: DataSite[];
  selectedSite?: DataSite;
  actions: {
    setSelectedTideStationId: (id: string) => void;
    setSelectedSite: (site: DataSite) => void;
  };
}

const TideContextImpl = createContext<TideContext | undefined>(undefined);

export const TideContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { activeLocation } = useLocationContext();
  
  const tideStations = useTideStationSites(activeLocation);
  const sites = useWaterHeightSites(activeLocation);

  const [selectedTideStationId, setSelectedTideStationId] = useState<string>('');
  const [selectedSite, setSelectedSite] = useState<DataSite | undefined>();

  // Initialize defaults when data becomes available
  useEffect(() => {
    if (tideStations.length > 0 && !selectedTideStationId) {
      setSelectedTideStationId(tideStations[0].id);
    }
  }, [tideStations, selectedTideStationId]);

  useEffect(() => {
    if (sites.length > 0 && !selectedSite) {
      setSelectedSite(sites[0]);
    }
  }, [sites, selectedSite]);

  // Reset everything back to the default if the location changes
  useEffect(() => {
    if (tideStations.length > 0) {
      setSelectedTideStationId(tideStations[0].id);
    }
    if (sites.length > 0) {
      setSelectedSite(sites[0]);
    }
  }, [activeLocation?.id, tideStations, sites]);

  const providerValue: TideContext = useMemo(
    () => ({
      tideStations,
      selectedTideStation: tideStations.find(
        (station) => station.id === selectedTideStationId,
      ),
      sites,
      selectedSite: sites.find((site) => site.id === selectedSite?.id),
      actions: {
        setSelectedSite,
        setSelectedTideStationId,
      },
    }),
    [selectedTideStationId, selectedSite, tideStations, sites],
  );

  return (
    <TideContextImpl.Provider value={providerValue}>
      {children}
    </TideContextImpl.Provider>
  );
};

export const useTideContext = () => {
  const context = useContext(TideContextImpl);
  if (context === undefined) {
    throw new Error(
      'useTideContext must be used within a TideContextProvider'
    );
  }
  return context;
};