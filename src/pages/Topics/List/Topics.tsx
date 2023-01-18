import { Navigate } from 'react-router-dom';
import routePathNames from '../../../appConfig';
import { UserRole } from '../../../enums/UserRole';
import { useUserRoles } from '../../../hooks/useUserRoles.hook';
import { TopicList } from './TopicList';

export const Topics = () => {
    const [, hasRole] = useUserRoles();

    return hasRole(UserRole.TopicAdmin) ? (
        <div>
            <TopicList />
        </div>
    ) : (
        <Navigate to={routePathNames.themeSettings} />
    );
};
