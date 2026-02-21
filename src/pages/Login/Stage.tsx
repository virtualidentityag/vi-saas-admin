import React from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import LogoSvg from '../../resources/img/logo-connecta.svg?react';

const { Title, Text } = Typography;

const Stage = () => {
    const { t } = useTranslation();
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px 24px',
            }}
        >
            <LogoSvg style={{ width: 220, height: 'auto', marginBottom: 16 }} />
            <Title level={3} style={{ margin: 0, color: '#273270' }}>
                {t('slogan')}
            </Title>
            <Text type="secondary">{t('subSlogan')}</Text>
        </div>
    );
};

export default Stage;
