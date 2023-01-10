import { Outlet } from 'react-router';
import { Page } from '../../components/Page';
import { PermissionAction } from '../../enums/PermissionAction';
import { Resource } from '../../enums/Resource';
import { useUserPermissions } from '../../hooks/useUserPermission';

export const TenantSettingsLayout = () => {
    const { can } = useUserPermissions();

    return (
        <Page>
            <Page.Title
                titleKey="settings.title"
                subTitleKey="settings.title.text"
                tabs={[
                    can(PermissionAction.Update, Resource.Tenant) && {
                        to: '/admin/theme-settings/general',
                        titleKey: 'settings.subhead.view',
                    },
                    can(PermissionAction.Update, Resource.LegalText) && {
                        to: '/admin/theme-settings/legal',
                        titleKey: 'settings.subhead.legal',
                    },
                ]}
            />
            <Outlet />
        </Page>
    );
};
