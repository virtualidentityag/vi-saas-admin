import { useLocation } from 'react-router';
import { useState } from 'react';
import routePathNames from '../../appConfig';
import SettingsActiveIcon from '../../resources/img/svg/navbar/settings_active.svg?react';
import SettingsInactiveIcon from '../../resources/img/svg/navbar/settings_inactive.svg?react';
import TenantsActiveIcon from '../../resources/img/svg/navbar/tenants_active.svg?react';
import TenantsInactiveIcon from '../../resources/img/svg/navbar/tenants_inactive.svg?react';
import CounselingActiveIcon from '../../resources/img/svg/navbar/counseling_active.svg?react';
import CounselingInactiveIcon from '../../resources/img/svg/navbar/counseling_inactive.svg?react';
import UsersActiveIcon from '../../resources/img/svg/navbar/users_active.svg?react';
import UsersInactiveIcon from '../../resources/img/svg/navbar/users_inactive.svg?react';
import ProfileActiveIcon from '../../resources/img/svg/navbar/profile_active.svg?react';
import ProfileInactiveIcon from '../../resources/img/svg/navbar/profile_inactive.svg?react';
import TopicsActiveIcon from '../../resources/img/svg/navbar/topics_active.svg?react';
import TopicsInactiveIcon from '../../resources/img/svg/navbar/topics_inactive.svg?react';
import StatisticsActiveIcon from '../../resources/img/svg/navbar/statistics_active.svg?react';
import StatisticsInactiveIcon from '../../resources/img/svg/navbar/statistics_inactive.svg?react';
import LogoutActiveIcon from '../../resources/img/svg/navbar/logout_active.svg?react';
import LogoutInactiveIcon from '../../resources/img/svg/navbar/logout_inactive.svg?react';

interface Props {
    path: string;
}

const Icon = ({ path, hover }: { path: string; hover: boolean }) => {
    const currentPath = useLocation().pathname;
    const currentlySelected = hover || currentPath.includes(path);

    switch (path) {
        case routePathNames.themeSettings:
            return currentlySelected ? <SettingsActiveIcon /> : <SettingsInactiveIcon />;
        case '/admin/users':
            return currentlySelected ? <UsersActiveIcon /> : <UsersInactiveIcon />;
        case '/admin/tenants':
            return currentlySelected ? <TenantsActiveIcon /> : <TenantsInactiveIcon />;
        case routePathNames.agency:
        case routePathNames.agencyAdd:
        case routePathNames.agencyAddGeneral:
        case routePathNames.agencyEdit:
        case routePathNames.agencyEditInitialMeeting:
            return currentlySelected ? <CounselingActiveIcon /> : <CounselingInactiveIcon />;
        case routePathNames.topics:
            return currentlySelected ? <TopicsActiveIcon /> : <TopicsInactiveIcon />;
        case routePathNames.statistic:
            return currentlySelected ? <StatisticsActiveIcon /> : <StatisticsInactiveIcon />;
        case routePathNames.userProfile:
            return currentlySelected ? <ProfileActiveIcon /> : <ProfileInactiveIcon />;
        case 'logout':
            return currentlySelected ? <LogoutActiveIcon /> : <LogoutInactiveIcon />;
        default:
            return <div />;
    }
};

export const NavIcon = ({ path }: Props) => {
    const [hover, setHover] = useState(false);

    return (
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <Icon path={path} hover={hover} />
        </div>
    );
};
