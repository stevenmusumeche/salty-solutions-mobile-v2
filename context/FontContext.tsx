import { useFont } from "@shopify/react-native-skia";
import React, { createContext, ReactNode, useContext } from "react";

interface FontContextType {
  interFont: any; // Font object from Skia
}

const FontContext = createContext<FontContextType | null>(null);

interface FontProviderProps {
  children: ReactNode;
}

export const FontProvider: React.FC<FontProviderProps> = ({ children }) => {
  const interFont = useFont(require("../assets/fonts/inter-medium.ttf"), 10);

  const value: FontContextType = {
    interFont,
  };

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>;
};

export const useFontContext = (): FontContextType => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useAppFont must be used within a FontProvider");
  }
  return context;
};
