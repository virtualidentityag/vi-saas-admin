import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { LegalText } from './components/LegalText';

export const LegalSettings = () => {
    const { t } = useTranslation();

    return (
        <Row gutter={[24, 24]}>
            <Col span={12} sm={6}>
                <LegalText
                    fieldName={['content', 'impressum']}
                    titleKey="imprint.title"
                    subTitle={t('imprint.subTitle')}
                    placeHolderKey="settings.imprint.placeholder"
                />
                <LegalText
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
