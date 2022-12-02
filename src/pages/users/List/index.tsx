import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Page } from '../../../components/Page';
import { PermissionAction } from '../../../enums/PermissionAction';
import { Resource } from '../../../enums/Resource';
import { useUserPermissions } from '../../../hooks/useUserPermission';
import { UsersTableData } from './components/UsersTableData';

export const UsersList = () => {
    const { can } = useUserPermissions();
    const { t } = useTranslation();
    const { typeOfUsers } = useParams();
    const navigate = useNavigate();

    const items = [
        can(PermissionAction.Read, Resource.Consultant) && {
            label: t('counselor.title'),
            key: 'consultants',
            children: <UsersTableData key={`consultants-${typeOfUsers}`} />,
        },
        can(PermissionAction.Read, Resource.Admin) && {
            label: t('admins.title'),
            key: 'admins',
            children: <UsersTableData key={`admins-${typeOfUsers}`} />,
        },
    ];

    return (
        <Page>
            <Page.Title titleKey="users.title" subTitleKey={`${typeOfUsers}.title.text`} />

            <Tabs
                activeKey={typeOfUsers || items[0].key}
                items={items}
                onTabClick={(key) => navigate(`/admin/users/${key}`)}
            />
        </Page>
    );
};
