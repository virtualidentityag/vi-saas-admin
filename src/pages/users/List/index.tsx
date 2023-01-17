import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Page } from '../../../components/Page';
import { PermissionAction } from '../../../enums/PermissionAction';
import { Resource } from '../../../enums/Resource';
import { useTenantAdminsData } from '../../../hooks/useTenantUserAdminsData';
import { useUserPermissions } from '../../../hooks/useUserPermission';
import { TenantsTableData } from './components/TenantsTableData';
import { UsersTableData } from './components/UsersTableData';

export const UsersList = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { can } = useUserPermissions();
    const { typeOfUsers } = useParams();
    const isTenantAdmins = typeOfUsers === 'tenant-admins';

    const { data } = useTenantAdminsData({ current: 1, enabled: isTenantAdmins });

    useEffect(() => {
        if (!can(PermissionAction.Read, Resource.Consultant) && !!location.pathname.match('/admin/users/consultants')) {
            if (can(PermissionAction.Read, Resource.AgencyAdminUser)) {
                navigate('/admin/users/agency-admins');
            } else {
                navigate('/admin/users/tenant-admins');
            }
        }
    }, [location.pathname]);

    return (
        <Page>
            <Page.Title
                titleKey="users.title"
                subTitle={
                    isTenantAdmins
                        ? t('tenantAdmins.title.text', { count: data?.total })
                        : t(`${typeOfUsers}.title.text`)
                }
                tabs={[
                    can(PermissionAction.Read, Resource.Consultant) && {
                        to: '/admin/users/consultants',
                        titleKey: 'counselor.title',
                    },
                    can(PermissionAction.Read, Resource.AgencyAdminUser) && {
                        to: '/admin/users/agency-admins',
                        titleKey: 'agencyAdmins.title',
                    },
                    can(PermissionAction.Read, Resource.TenantAdminUser) && {
                        to: '/admin/users/tenant-admins',
                        titleKey: 'tenantAdmins.title',
                    },
                ]}
            />
            {isTenantAdmins ? <TenantsTableData /> : <UsersTableData key={`admins-${typeOfUsers}`} />}
        </Page>
    );
};
