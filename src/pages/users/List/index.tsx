import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Page } from '../../../components/Page';
import { UsersTableData } from './components/UsersTableData';

export const UsersList = () => {
    const { t } = useTranslation();
    const { typeOfUsers } = useParams();
    const navigate = useNavigate();

    const items = [
        {
            label: t('counselor.title'),
            key: 'consultants',
            children: <UsersTableData />,
        },
        {
            label: t('admins.title'),
            key: 'admins',
            children: <UsersTableData />,
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
