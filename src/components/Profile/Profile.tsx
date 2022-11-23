import Title from 'antd/es/typography/Title';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import TwoFactorAuth from '../TwoFactorAuth/TwoFactorAuth';

const { Paragraph } = Typography;

const Profile = () => {
    const { t } = useTranslation();

    return (
        <div>
            <div className="profile__content__title">
                <Title level={3}>{t('profile.title')}</Title>
                <Paragraph className="mb-l">{t('profile.title.text')}</Paragraph>
            </div>
            <TwoFactorAuth />
        </div>
    );
};

export default Profile;
