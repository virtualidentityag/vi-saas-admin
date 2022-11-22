import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ReactComponent as ChevronLeft } from '../resources/img/svg/chevron-left.svg';
import { AgencyAddGeneral } from '../components/Agency/AgencyAddGeneral';
import routePathNames from '../appConfig';

export const AgencyAdd = () => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <div className="agencyEdit__header">
                <div className="agencyEdit__headerBack">
                    <NavLink to="/admin/agency/">
                        <ChevronLeft />
                        <h3 className="agencyEdit__header--headline">{t('agency.add.general.headline')}</h3>
                    </NavLink>
                </div>
                <div className="agencyEdit__nav">
                    <div className="agencyEdit__navItem">
                        <NavLink to={routePathNames.agencyAddGeneral} className="active">
                            {t('agency.add.general.navigation')}
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className="agencyEdit__innerWrapper">
                <AgencyAddGeneral />
            </div>
        </React.Fragment>
    );
};
