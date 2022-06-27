import { createContext, ReactNode, useMemo, useState } from "react";
import { FeatureContextType, IFeature } from "../types/feature";

export const FeatureContext = createContext<FeatureContextType | null>(null);

interface FeatureProviderProps {
  children: ReactNode;
}

// export const FeatureProvider: FC = ({ children }) => {
// function FeatureProvider(children: ReactNode) {
export function FeatureProvider({ children }: FeatureProviderProps) {
  const [features, setFeatures] = useState<IFeature[]>([
    {
      name: "topics",
      active: false,
    },
  ]);

  const getFeatureStatus = (name: string) => {
    const tempFeature = features.find((feature) => feature.name === name);

    return tempFeature.active;
  };

  const toggleFeature = (feature: IFeature) => {
    const tempFeatures = features.map((e) => {
      return e.name === feature.name ? feature : e;
    });

    setFeatures(tempFeatures);
  };

  const value = useMemo(
    () => ({
      features,
      getFeatureStatus,
      toggleFeature,
    }),
    [features]
  );

  return (
    <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>
  );
}
