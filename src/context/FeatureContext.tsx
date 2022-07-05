import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useCallback,
} from "react";
import { FeatureFlag } from "../enums/FeatureFlag";
import { featureFlags } from "../staticFeatureFlags.config";
import { IFeature } from "../types/feature";
import { TenantData } from "../types/tenant";

const FeatureContext =
  createContext<[IFeature[], (features: IFeature[]) => void]>(null);

interface FeatureProviderProps {
  children: ReactNode;
  tenantData: TenantData;
}

function FeatureProvider({ children, tenantData }: FeatureProviderProps) {
  const state = useState<IFeature[]>([
    {
      name: FeatureFlag.Developer,
      active: false,
    },
    {
      name: FeatureFlag.Topics,
      active: false,
    },
    {
      name: FeatureFlag.Demographics,
      active: featureFlags[FeatureFlag.Demographics].includes(
        tenantData.subdomain
      ),
    },
  ]);

  return (
    <FeatureContext.Provider value={state}>{children}</FeatureContext.Provider>
  );
}

function useFeatureContext() {
  const [features, setFeatures] = useContext(FeatureContext);

  const isEnabled = useCallback(
    (name: FeatureFlag) => {
      const tempFeature = features.find((feature) => feature.name === name);

      return tempFeature?.active || false;
    },
    [features]
  );

  const toggleFeature = (key: FeatureFlag) => {
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
