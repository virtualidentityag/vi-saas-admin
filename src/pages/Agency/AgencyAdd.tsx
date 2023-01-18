import { AgencyAddGeneral } from './AgencyAddGeneral';
import { Page } from '../../components/Page';

export const AgencyAdd = () => {
    return (
        <Page>
            <Page.Back titleKey="agency.add.general.headline" path="/admin/agency/" />
            <div className="agencyEdit__innerWrapper">
                <AgencyAddGeneral />
            </div>
        </Page>
    );
};
