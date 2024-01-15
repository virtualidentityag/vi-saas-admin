import { useMemo } from 'react';
import { AgencyContact, AgencyData } from '../types/agency';

export const useAgencyLegalDataMissing = (agencyData: AgencyData) => {
    const legalDataMissing = useMemo(() => {
        const checkContact = (contact: AgencyContact) => {
            return (
                !contact ||
                ['nameAndLegalForm', 'postcode', 'city', 'phoneNumber'].every((field) => {
                    return !!contact?.[field];
                })
            );
        };
        const type = agencyData?.dataProtection?.dataProtectionResponsibleEntity;
        return !(
            !checkContact(agencyData?.dataProtection?.agencyDataProtectionResponsibleContact) ||
            (type === 'DATA_PROTECTION_OFFICER' &&
                !checkContact(agencyData?.dataProtection?.dataProtectionOfficerContact)) ||
            (type === 'ALTERNATIVE_REPRESENTATIVE' &&
                !checkContact(agencyData?.dataProtection?.alternativeDataProtectionRepresentativeContact))
        );
    }, [agencyData]);

    return legalDataMissing;
};
