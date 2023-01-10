/* eslint-disable react/jsx-props-no-spreading */
import {
    Settings,
    SettingsOutlined,
    ManageAccounts,
    ManageAccountsOutlined,
    OtherHouses,
    OtherHousesOutlined,
    Interests,
    InterestsOutlined,
    Leaderboard,
    LeaderboardOutlined,
    AccountCircle,
    AccountCircleOutlined,
    Logout,
    AccountBalance,
    AccountBalanceOutlined,
} from '@mui/icons-material/';
import { useLocation } from 'react-router';
import routePathNames from '../../appConfig';
import { ReactComponent as ActiveTenantIcon } from '../../resources/img/svg/ActiveTenantIcon.svg';
import { ReactComponent as TenantIcon } from '../../resources/img/svg/TenantIcon.svg';

interface Props {
    path: string;
}

export const NavIcon = ({ path }: Props) => {
    const currentPath = useLocation().pathname;
    const currentlySelected = currentPath.includes(path);

    const props = { sx: { fontSize: 32 } };

    switch (path) {
        case routePathNames.themeSettings:
            return currentlySelected ? <Settings {...props} /> : <SettingsOutlined {...props} />;
        case '/admin/users':
            return currentlySelected ? <ManageAccounts {...props} /> : <ManageAccountsOutlined {...props} />;
        case '/admin/tenants':
            return currentlySelected ? <ActiveTenantIcon /> : <TenantIcon />;
        case routePathNames.agency:
        case routePathNames.agencyAdd:
        case routePathNames.agencyAddGeneral:
        case routePathNames.agencyEdit:
        case routePathNames.agencyEditGeneral:
        case routePathNames.agencyEditInitialMeeting:
            return currentlySelected ? (
                <OtherHouses {...props} />
            ) : (
                <OtherHousesOutlined className="OtherHousesOutlinedIcon" {...props} />
            );
        case routePathNames.topics:
            return currentlySelected ? <Interests {...props} /> : <InterestsOutlined {...props} />;
        case routePathNames.statistic:
            return currentlySelected ? <Leaderboard {...props} /> : <LeaderboardOutlined {...props} />;
        case routePathNames.userProfile:
            return currentlySelected ? <AccountCircle {...props} /> : <AccountCircleOutlined {...props} />;
        case routePathNames.tenants:
            return currentlySelected ? <AccountBalance {...props} /> : <AccountBalanceOutlined {...props} />;
        case 'logout':
            return <Logout {...props} />;
        default:
            return <div />;
    }
};
