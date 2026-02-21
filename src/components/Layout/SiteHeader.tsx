import React from 'react';
import { Layout, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Header } = Layout;
const { Title, Text } = Typography;

const SiteHeader = () => {
    const { t } = useTranslation();
    return (
        <Header
            style={{
                background: '#ffffff',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            }}
        >
            <Title level={4} style={{ margin: 0, color: '#273270' }}>
                {t('slogan')}
            </Title>
            <Text style={{ color: '#f55d3e' }}>{t('subSlogan')}</Text>
        </Header>
    );
};

export default SiteHeader;
