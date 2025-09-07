import React, {
  createContext,
  useContext,
  useState,
  useMemo,
} from 'react';
import { DataSite } from '../types';

type ComponentType = 'wind' | 'water-temp' | 'salinity';

interface SiteSelectionContext {
  selectedSites: Record<ComponentType, DataSite | undefined>;
  actions: {
    setSelectedSite: (componentType: ComponentType, site: DataSite) => void;
    getSelectedSite: (componentType: ComponentType) => DataSite | undefined;
  };
}

const SiteSelectionContextImpl = createContext<SiteSelectionContext | undefined>(undefined);

export const SiteSelectionContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedSites, setSelectedSites] = useState<Record<ComponentType, DataSite | undefined>>({
    'wind': undefined,
    'water-temp': undefined,
    'salinity': undefined,
  });

  const actions = useMemo(() => ({
    setSelectedSite: (componentType: ComponentType, site: DataSite) => {
      setSelectedSites(prev => ({
        ...prev,
        [componentType]: site
      }));
    },
    getSelectedSite: (componentType: ComponentType) => selectedSites[componentType],
  }), [selectedSites]);

  const providerValue: SiteSelectionContext = useMemo(
    () => ({
      selectedSites,
      actions,
    }),
    [selectedSites, actions],
  );

  return (
    <SiteSelectionContextImpl.Provider value={providerValue}>
      {children}
    </SiteSelectionContextImpl.Provider>
  );
};

export const useSiteSelectionContext = () => {
  const context = useContext(SiteSelectionContextImpl);
  if (context === undefined) {
    throw new Error(
      'useSiteSelectionContext must be used within a SiteSelectionContextProvider'
    );
  }
  return context;
};