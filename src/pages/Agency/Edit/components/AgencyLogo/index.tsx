import { FormFileUploaderField } from '../../../../../components/FormFileUploaderField';
import { Card } from '../../../../../components/Card';

export const AgencyLogo = () => {
    return (
        <Card
            titleKey="agency.edit.general.agency_logo.title"
            subTitleKey="agency.edit.general.agency_logo.description"
        >
            <FormFileUploaderField name={['agencyLogo']} />
        </Card>
    );
};
