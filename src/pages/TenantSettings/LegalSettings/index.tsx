import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { LegalText } from './components/LegalText';

export const LegalSettings = () => {
    const { t } = useTranslation();

    return (
        <Row gutter={[20, 10]}>
            <Col span={12} sm={6}>
                <LegalText
                    fieldName={['content', 'impressum']}
                    titleKey="imprint.title"
                    subTitle={t('imprint.subTitle')}
                    placeHolderKey="settings.imprint.placeholder"
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
                />
            </Col>
            <Col span={12} sm={6}>
                <LegalText
                    fieldName={['content', 'termsAndConditions']}
                    titleKey="termsAndConditions.title"
                    subTitle={t('termsAndConditions.subTitle')}
                    placeHolderKey="settings.termsAndConditions.placeholder"
                />
            </Col>
        </Row>
    );
};
