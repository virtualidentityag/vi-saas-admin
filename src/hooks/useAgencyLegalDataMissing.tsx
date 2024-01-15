import { useMemo } from 'react';
import { AgencyContact, AgencyData } from '../types/agency';

export const useAgencyLegalDataMissing = (agencyData: AgencyData) => {
    return useMemo(() => {
        const checkContact = (contact: AgencyContact) => {
            return (
                !contact ||
                ['nameAndLegalForm', 'postcode', 'city', 'phoneNumber'].every((field) => {
                    return !!contact?.[field];
                })
            );
        };
        const type = agencyData?.dataProtection?.dataProtectionResponsibleEntity;
        const hasMissingAgencyDataProtectionResponsibleContact = !checkContact(
            agencyData?.dataProtection?.agencyDataProtectionResponsibleContact,
        );

        const hasMissingDataProtectionOfficerContact =
            type === 'DATA_PROTECTION_OFFICER' &&
            !checkContact(agencyData?.dataProtection?.dataProtectionOfficerContact);

        const hasMissingAlternativeDataProtectionRepresentativeContact =
            type === 'ALTERNATIVE_REPRESENTATIVE' &&
            !checkContact(agencyData?.dataProtection?.alternativeDataProtectionRepresentativeContact);

        return !(
            hasMissingAgencyDataProtectionResponsibleContact ||
            hasMissingDataProtectionOfficerContact ||
            hasMissingAlternativeDataProtectionRepresentativeContact
        );
    }, [agencyData]);
};
