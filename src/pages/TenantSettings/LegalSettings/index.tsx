import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useTenantData } from '../../../hooks/useTenantData.hook';
import { LegalText } from './components/LegalText';

interface LegalSettingsProps {
    tenantId?: string;
}

export const LegalSettings = ({ tenantId }: LegalSettingsProps) => {
    const { data } = useTenantData();
    const { t } = useTranslation();
    const finalTenantId = tenantId || `${data.id}`;

    return (
        <Row gutter={[24, 24]}>
            <Col span={12} sm={6}>
                <LegalText
                    tenantId={finalTenantId}
                    fieldName={['content', 'impressum']}
                    titleKey="imprint.title"
                    subTitle={t('imprint.subTitle')}
                    placeHolderKey="settings.imprint.placeholder"
                />
                <LegalText
                    tenantId={finalTenantId}
                    fieldName={['content', 'termsAndConditions']}
                    titleKey="termsAndConditions.title"
                    subTitle={t('termsAndConditions.subTitle')}
                    placeHolderKey="settings.termsAndConditions.placeholder"
                    showConfirmationModal={{
                        titleKey: 'termsAndConditions.confirmation.title',
                        contentKey: 'termsAndConditions.confirmation.content',
                        cancelLabelKey: 'termsAndConditions.confirmation.confirm',
                        okLabelKey: 'termsAndConditions.confirmation.cancel',
                        field: ['content', 'confirmTermsAndConditions'],
                    }}
                />
            </Col>
            <Col span={12} sm={6}>
                <LegalText
                    tenantId={finalTenantId}
                    fieldName={['content', 'privacy']}
                    titleKey="privacy.title"
                    subTitle={
                        <>
                            {t('privacy.subTitle')} <a href="/">{t('privacy.subTitleLinkLabel')}</a>
                        </>
                    }
                    placeHolderKey="settings.privacy.placeholder"
                    showConfirmationModal={{
                        titleKey: 'privacy.confirmation.title',
                        contentKey: 'privacy.confirmation.content',
                        cancelLabelKey: 'privacy.confirmation.confirm',
                        okLabelKey: 'privacy.confirmation.cancel',
                        field: ['content', 'confirmPrivacy'],
                    }}
                />
            </Col>
        </Row>
    );
};
