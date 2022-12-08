import { useParams } from 'react-router';
import { Page } from '../../../components/Page';
import { PermissionAction } from '../../../enums/PermissionAction';
import { Resource } from '../../../enums/Resource';
import { useUserPermissions } from '../../../hooks/useUserPermission';
import { UsersTableData } from './components/UsersTableData';

export const UsersList = () => {
    const { can } = useUserPermissions();
    const { typeOfUsers } = useParams();

    return (
        <Page>
            <Page.Title
                titleKey="users.title"
                subTitleKey={`${typeOfUsers}.title.text`}
                tabs={[
                    can(PermissionAction.Read, Resource.Consultant) && {
                        to: '/admin/users/consultants',
                        titleKey: 'counselor.title',
                    },
                    can(PermissionAction.Read, Resource.Admin) && {
                        to: '/admin/users/admins',
                        titleKey: 'admins.title',
                    },
                ]}
            />
            <UsersTableData key={`admins-${typeOfUsers}`} />
        </Page>
    );
};
