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
                background: '#fff',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderBottom: '1px solid #f0f0f0',
            }}
        >
            <Title level={4} style={{ margin: 0 }}>
                {t('slogan')}
            </Title>
            <Text type="secondary">{t('subSlogan')}</Text>
        </Header>
    );
};

export default SiteHeader;
