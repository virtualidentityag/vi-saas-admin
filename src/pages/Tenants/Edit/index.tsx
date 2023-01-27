import { Outlet, useLocation, useParams } from 'react-router';
import { Page } from '../../../components/Page';
import routePathNames from '../../../appConfig';
import { useSingleTenantData } from '../../../hooks/useSingleTenantData';
import { PermissionAction } from '../../../enums/PermissionAction';
import { Resource } from '../../../enums/Resource';
import { useUserPermissions } from '../../../hooks/useUserPermission';
import { useReleasesToggle } from '../../../hooks/useReleasesToggle.hook';
import { ReleaseToggle } from '../../../enums/ReleaseToggle';

export const TenantEditOrAdd = () => {
    const { isEnabled } = useReleasesToggle();
    const { can } = useUserPermissions();
    const { search } = useLocation();
    const main = new URLSearchParams(search).get('main');
    const { id } = useParams<{ id: string }>();
    const isEditing = id !== 'add';
    const { data, isLoading } = useSingleTenantData({ id, enabled: isEditing });

    const newTitle = main ? 'tenants.add.mainTenant.headline' : 'tenants.add.headline';
    const title = isEditing ? data?.name : newTitle;

    return (
        <Page isLoading={isLoading}>
            <Page.BackWithActions
                path={routePathNames.tenants}
                titleKey={title}
                tabs={
                    isEditing &&
                    isEnabled(ReleaseToggle.TENANT_ADMIN_SETTINGS_EDIT) && [
                        {
                            to: `/admin/tenants/${id}/general`,
                            titleKey: 'Allgemein',
                        },
                        {
                            to: `/admin/tenants/${id}/theme-settings`,
                            titleKey: 'Erscheinungsbild',
                        },
                        can(PermissionAction.Update, Resource.LegalText) && {
                            to: `/admin/tenants/${id}/legal-settings`,
                            titleKey: 'Legal',
                        },
                        {
                            to: `/admin/tenants/${id}/app-settings`,
                            titleKey: 'Funktionalitäten',
                        },
                    ]
                }
            />
            <Outlet />
        </Page>
    );
};
