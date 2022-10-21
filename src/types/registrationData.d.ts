export interface RegistrationData {
  registrationStatistics: registrationStatistics[];
}

export interface RegistrationStatistics {
  userId: string;
  registrationDate: string;
  age: number | null;
  gender: string | null;
  counsellingRelation: string | null;
  topicsInternalAttributes: string[];
  mainTopicInternalAttribute: string | null;
  postalCode: string;
  endDate: string;
}
