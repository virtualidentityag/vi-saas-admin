import { useFeatureContext } from '../../context/FeatureContext';
import { FeatureFlag } from '../../enums/FeatureFlag';

interface FeatureFlagProps {
    children: JSX.Element | JSX.Element[];
    feature: FeatureFlag;
}

export const FeatureEnabled = ({ children, feature }: FeatureFlagProps) => {
    const { isEnabled } = useFeatureContext();

    return isEnabled(feature) ? children : null;
};
