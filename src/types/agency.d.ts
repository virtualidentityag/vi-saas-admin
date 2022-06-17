import { TopicData } from "./topic";

export interface AgencyData {
  id: string | null;
  name: string;
  city: string;
  topics: TopicData[];
  topicIds: string[];
  description: string;
  offline: boolean;
  online: boolean;
  postcode: string;
  teamAgency: string;
  consultingType: string;
  status: string | undefined;
}
