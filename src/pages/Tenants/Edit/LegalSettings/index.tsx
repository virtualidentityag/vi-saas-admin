import { useParams } from 'react-router';
import { LegalSettings } from '../../../TenantSettings/LegalSettings';

export const SingleLegalSettings = () => {
    const { id } = useParams();

    return <LegalSettings tenantId={id} />;
};
