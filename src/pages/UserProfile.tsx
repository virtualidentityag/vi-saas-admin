import { Page } from '../components/Page';
import TwoFactorAuth from '../components/TwoFactorAuth/TwoFactorAuth';

export const UserProfile = () => (
    <Page>
        <Page.Title titleKey="profile.title" subTitleKey="profile.title.text" />

        <TwoFactorAuth />
    </Page>
);
