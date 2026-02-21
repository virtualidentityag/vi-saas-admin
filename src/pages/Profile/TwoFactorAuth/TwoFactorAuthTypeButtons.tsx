import { useTranslation } from 'react-i18next';
import { RadioButton } from '../../../components/radioButton/RadioButton';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { TwoFactorType } from '../../../enums/TwoFactorType';

interface TwoFactorAuthTypeButtonsProps {
    twoFactorType: TwoFactorType;
    setTwoFactorType: (type: TwoFactorType) => void;
}

export const TwoFactorAuthTypeButtons = ({ twoFactorType, setTwoFactorType }: TwoFactorAuthTypeButtonsProps) => {
    const { t } = useTranslation();
    return (
        <div className="twoFactorAuth__selectType">
            <div className="twoFactorAuth__radioWrapper">
                <RadioButton
                    checked={twoFactorType === TwoFactorType.App}
                    handleRadioButton={() => setTwoFactorType(TwoFactorType.App)}
                    label={t('twoFactorAuth.activate.radio.label.app')}
                    inputId="radio_2fa_app"
                    name="radio_2fa"
                    type="default"
                    value={TwoFactorType.App}
                />
                <Tooltip title={t('twoFactorAuth.activate.radio.tooltip.app')}>
                    <InfoCircleOutlined />
                </Tooltip>
            </div>
            <div className="twoFactorAuth__radioWrapper">
                <RadioButton
                    checked={twoFactorType === TwoFactorType.Email}
                    handleRadioButton={() => setTwoFactorType(TwoFactorType.Email)}
                    label={t('twoFactorAuth.activate.radio.label.email')}
                    inputId="radio_2fa_email"
                    name="radio_2fa"
                    type="default"
                    value={TwoFactorType.Email}
                />
                <Tooltip title={t('twoFactorAuth.activate.radio.tooltip.email')}>
                    <InfoCircleOutlined />
                </Tooltip>
            </div>
        </div>
    );
};
