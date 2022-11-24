import { Tabs } from 'antd';
import { useNavigate, useParams } from 'react-router';
import { Page } from '../../../components/Page';
import { UsersTableData } from './components/UsersTableData';

export const UsersList = () => {
    const { typeOfUsers } = useParams();
    const navigate = useNavigate();

    const items = [
        {
            label: 'Consultants',
            key: 'consultants',
            children: <UsersTableData />,
        },
        {
            label: 'Admins',
            key: 'admins',
            children: <UsersTableData />,
        },
    ];

    return (
        <Page>
            <Page.Title titleKey="counselor.title" subTitleKey="counselor.title.text" />

            <Tabs
                activeKey={typeOfUsers || items[0].key}
                items={items}
                onTabClick={(key) => navigate(`/admin/users/${key}`)}
            />
        </Page>
    );
};
