import { Outlet } from 'react-router';
import { Page } from '../../components/Page';

export const TenantSettingsLayout = () => {
    return (
        <Page>
            <Page.Title
                titleKey="settings.title"
                subTitleKey="settings.title.text"
                tabs={[
                    { to: '/admin/theme-settings/general', titleKey: 'settings.subhead.view' },
                    { to: '/admin/theme-settings/legal', titleKey: 'settings.subhead.legal' },
                ]}
            />
            <Outlet />
        </Page>
    );
};
