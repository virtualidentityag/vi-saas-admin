import { TopicData } from "./topic";

export interface AgencyDemographicsData {
  age?: string[];
  ageFrom?: number;
  ageTo?: number;
  genders?: string[];
}

export interface AgencyData {
  id: string | null;
  name: string;
  city: string;
  topics: TopicData[];
  topicIds: Array<{ value: string; label: string }> | string[];
  demographics?: AgencyDemographicsData;
  description: string;
  offline: boolean;
  online: boolean;
  postcode: string;
  teamAgency: boolean;
  consultingType: string;
  status: string | undefined;
  deleteDate: string | undefined;
}
