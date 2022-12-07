import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { CardEditable } from '../../../../../components/CardEditable';
import { FormFileUploaderField } from '../../../../../components/FormFileUploaderField';
import { useTenantAdminData } from '../../../../../hooks/useTenantAdminData.hook';
import { useTenantAdminDataMutation } from '../../../../../hooks/useTenantAdminDataMutation.hook';

export const LogoAndFavicon = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useTenantAdminData();
    const { mutate } = useTenantAdminDataMutation();

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
