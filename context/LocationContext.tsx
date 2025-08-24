import { useLocationsQuery } from "@/graphql/generated";
import { LocationDetail } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SAVED_LOCATION_KEY = "@SaltySolutions:locationId";

export type LocationContext = {
  activeLocation?: LocationDetail;
  setActiveLocation: (location: LocationDetail) => void;
};

const LocationContextImpl = createContext<LocationContext | undefined>(
  undefined
);

export const LocationContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activeLocation, setActiveLocation] = useState<LocationDetail>(
    null as any
  );

  const { data } = useLocationsQuery();

  useEffect(() => {
    if (!data) {
      return;
    }

    const setDefaultLocation = async () => {
      let defaultLocation;
      const savedLocationId = await AsyncStorage.getItem(
        SAVED_LOCATION_KEY
      ).catch();
      const match = data.locations.find(
        (location) => location.id === savedLocationId
      );
      if (match) {
        defaultLocation = match;
      } else {
        defaultLocation = data.locations[0];
      }

      setActiveLocation(defaultLocation);
    };

    setDefaultLocation();
  }, [data]);

  const contextValue = useMemo(
    () => ({
      activeLocation,
      setActiveLocation: async (location: LocationDetail) => {
        setActiveLocation(location);
        await AsyncStorage.setItem(SAVED_LOCATION_KEY, location.id);
      },
    }),
    [activeLocation]
  );

  return (
    <LocationContextImpl.Provider value={contextValue}>
      {children}
    </LocationContextImpl.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContextImpl);
  if (context === undefined) {
    throw new Error(
      "useLocationContext must be used within a LocationContextProvider"
    );
  }
  return context;
};
