import { FeatureFlag } from "./enums/FeatureFlag";

export const featureFlags: { [key in FeatureFlag]?: string[] } = {
  [FeatureFlag.Demographics]: ["happylife"],
};
