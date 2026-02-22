import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { CardEditable } from '../../../../CardEditable';
import { CropUploadField } from '../../../../CropUploadField';
import { useSingleTenantData } from '../../../../../hooks/useSingleTenantData';
import { useTenantAdminDataMutation } from '../../../../../hooks/useTenantAdminDataMutation.hook';
import { useAppConfigContext } from '../../../../../context/useAppConfig';

export const LogoAndFavicon = ({ tenantId }: { tenantId: string }) => {
    const { t } = useTranslation();
    const { data, isLoading } = useSingleTenantData({ id: tenantId });
    const { mutate } = useTenantAdminDataMutation({ id: tenantId });
    const { settings } = useAppConfigContext();

    return (
        <CardEditable
            isLoading={isLoading}
            initialValues={{ ...data }}
            titleKey="settings.images.title"
            subTitle={t('settings.images.howto')}
            onSave={mutate}
        >
            <Row gutter={24}>
                <Col span={8}>
                    <CropUploadField
                        labelKey="organisation.logo"
                        name={['theming', 'logo']}
                        tooltip={t('settings.images.tooltip.logo')}
                        aspect={512 / 256}
                        cropWidth={512}
                        cropHeight={256}
                    />
                </Col>
                <Col span={8}>
                    <CropUploadField
                        allowIcon
                        labelKey="organisation.favicon"
                        name={['theming', 'favicon']}
                        tooltip={t('settings.images.tooltip.favicon')}
                        aspect={1}
                        cropWidth={256}
                        cropHeight={256}
                    />
                </Col>
                {!settings.multitenancyWithSingleDomainEnabled && (
                    <Col span={8}>
                        <CropUploadField
                            labelKey="organisation.associationLogo"
                            name={['theming', 'associationLogo']}
                            tooltip={t('settings.images.tooltip.associationLogo')}
                            aspect={512 / 342}
                            cropWidth={512}
                            cropHeight={342}
                        />
                    </Col>
                )}
            </Row>
        </CardEditable>
    );
};
