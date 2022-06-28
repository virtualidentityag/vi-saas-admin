import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useCallback,
} from "react";
import { IFeature } from "../types/feature";

const FeatureContext =
  createContext<[IFeature[], (features: IFeature[]) => void]>(null);

interface FeatureProviderProps {
  children: ReactNode;
}

function FeatureProvider({ children }: FeatureProviderProps) {
  const state = useState<IFeature[]>([
    {
      name: "developer",
      active: false,
    },
    {
      name: "topics",
      active: false,
    },
  ]);

  return (
    <FeatureContext.Provider value={state}>{children}</FeatureContext.Provider>
  );
}

function useFeatureContext() {
  const [features, setFeatures] = useContext(FeatureContext);

  const isEnabled = useCallback(
    (name: string) => {
      const tempFeature = features.find((feature) => feature.name === name);

      return tempFeature?.active || false;
    },
    [features]
  );

  const toggleFeature = (key: string) => {
    const feature = features.find((f) => f.name === key);

    feature.active = !feature.active;

    setFeatures([...features]);
  };

  return {
    isEnabled,
    toggleFeature,
  };
}

export { FeatureProvider, useFeatureContext };
