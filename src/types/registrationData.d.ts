export interface RegistrationData {
    registrationStatistics: registrationStatistics[];
}

export interface RegistrationStatistics {
    tenantName: string;
    agencyName: string;
    userId: string;
    registrationDate: string;
    age: number | null;
    gender: string | null;
    counsellingRelation: string | null;
    topicsInternalAttributes: string[];
    mainTopicInternalAttribute: string | null;
    postalCode: string;
    endDate: string;
    referer: string | null;
}
