import { CropUploadField } from '../../../../../components/CropUploadField';
import { Card } from '../../../../../components/Card';

export const AgencyLogo = () => {
    return (
        <Card
            titleKey="agency.edit.general.agency_logo.title"
            subTitleKey="agency.edit.general.agency_logo.description"
        >
            <CropUploadField
                name={['agencyLogo']}
                aspect={1}
                cropWidth={256}
                cropHeight={256}
            />
        </Card>
    );
};
