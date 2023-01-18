import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { AgencyEditInitialMeeting } from './AgencyEditInitialMeeting';
import agencyRoutes from './Agency.routes';
import routePathNames from '../../appConfig';
import { useFeatureContext } from '../../context/FeatureContext';
import { FeatureFlag } from '../../enums/FeatureFlag';
import { AgencyEdit } from './AgencyEdit/index';
import { Page } from '../../components/Page';

export const AgencyPageEdit = () => {
    const currentPath = useLocation().pathname;
    const [agencyEditComponent, setAgencyEditComponent] = useState(null);
    const [, agencyId] = currentPath.match(/.*\/([^/]+)\/[^/]+/);
    const { isEnabled } = useFeatureContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentPath.includes('/initial-meeting') && !isEnabled(FeatureFlag.Appointments)) {
            navigate(routePathNames.agencyEditGeneral.replace(':id', agencyId));
        }
        switch (currentPath.replace(agencyId, ':id')) {
            case routePathNames.agencyEditGeneral:
                setAgencyEditComponent(<AgencyEdit />);
                break;

            case routePathNames.agencyEditInitialMeeting:
                setAgencyEditComponent(<AgencyEditInitialMeeting />);
                break;

            default:
                break;
        }
    }, [currentPath]);

    return (
        <Page>
            <Page.Back
                titleKey="agency.edit.general.headline"
                path="/admin/agency"
                tabs={agencyRoutes
                    ?.filter((route: any) => !route.condition || route.condition(isEnabled(FeatureFlag.Appointments)))
                    .map((tab) => ({
                        to: `/admin/agency/edit/${agencyId}${tab.url}`,
                        titleKey: tab.title,
                    }))}
            />
            <div className="agencyEdit__innerWrapper">{agencyEditComponent}</div>
        </Page>
    );
};
