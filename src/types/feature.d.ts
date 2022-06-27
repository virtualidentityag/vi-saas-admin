export interface IFeature {
  name: string;
  active: boolean;
}

export type FeatureContextType = {
  features: IFeature[];
  getFeatureStatus: (name: string) => boolean;
  toggleFeature: (feature: IFeature) => void;
};
