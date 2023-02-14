import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { CardEditable } from '../../../../CardEditable';
import { FormFileUploaderField } from '../../../../FormFileUploaderField';
import { useSingleTenantData } from '../../../../../hooks/useSingleTenantData';
import { useTenantAdminDataMutation } from '../../../../../hooks/useTenantAdminDataMutation.hook';

export const LogoAndFavicon = ({ tenantId }: { tenantId: string }) => {
    const { t } = useTranslation();
    const { data, isLoading } = useSingleTenantData({ id: tenantId });
    const { mutate } = useTenantAdminDataMutation({ id: tenantId });

    return (
        <CardEditable
            isLoading={isLoading}
            initialValues={{ ...data }}
            titleKey="settings.logoAndFavicon"
            subTitle={t('settings.images.howto')}
            onSave={mutate}
            tooltip={t('settings.images.help')}
        >
            <Row gutter={15}>
                <Col xs={6} md={5} lg={4}>
                    <FormFileUploaderField labelKey="organisation.logo" name={['theming', 'logo']} />
                </Col>
                <Col xs={6} md={5} lg={4}>
                    <FormFileUploaderField labelKey="organisation.favicon" name={['theming', 'favicon']} />
                </Col>
            </Row>
        </CardEditable>
    );
};
