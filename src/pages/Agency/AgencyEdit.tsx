import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router';
import { ReactComponent as ChevronLeft } from '../../resources/img/svg/chevron-left.svg';
import { AgencyEditInitialMeeting } from './AgencyEditInitialMeeting';
import agencyRoutes from './Agency.routes';
import routePathNames from '../../appConfig';
import { useFeatureContext } from '../../context/FeatureContext';
import { FeatureFlag } from '../../enums/FeatureFlag';
import { AgencyEdit } from './AgencyEdit/index';

export const AgencyPageEdit = () => {
    const { t } = useTranslation();
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
        <React.Fragment>
            <div className="agencyEdit__header">
                <div className="agencyEdit__headerBack">
                    <NavLink to="/admin/agency/">
                        <ChevronLeft />
                        <h3 className="agencyEdit__header--headline">{t('agency.edit.general.headline')}</h3>
                    </NavLink>
                </div>
                <div className="agencyEdit__nav">
                    {agencyRoutes
                        ?.filter(
                            (route: any) => !route.condition || route.condition(isEnabled(FeatureFlag.Appointments)),
                        )
                        .map((tab) => (
                            <div key={tab.url} className="agencyEdit__navItem">
                                <NavLink
                                    to={`/admin/agency/edit/${agencyId}${tab.url}`}
                                    className={({ isActive }) => {
                                        return isActive ? 'active' : '';
                                    }}
                                >
                                    {tab.title}
                                </NavLink>
                            </div>
                        ))}
                </div>
            </div>
            <div className="agencyEdit__innerWrapper">{agencyEditComponent}</div>
        </React.Fragment>
    );
};
