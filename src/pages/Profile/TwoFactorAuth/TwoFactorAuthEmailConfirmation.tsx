import { useTranslation } from 'react-i18next';
import IlluCheck from '../../../resources/img/illustrations/check.svg?react';
import { Headline } from '../../../components/headline/Headline';

export const TwoFactorAuthEmailConfirmation = () => {
    const { t } = useTranslation();
    return (
        <div className="twoFactorAuth__emailConfirmation">
            <IlluCheck />
            <Headline text={t('twoFactorAuth.activate.email.step4.title')} semanticLevel="3" />
        </div>
    );
};
