import { useQuery } from 'react-query';
import getTopicByTenantData from '../api/topic/getTopicByTenantData';
import { TopicData } from '../types/topic';

export const useTopics = (onlyActive?: boolean) => {
    return useQuery<TopicData[]>(['ALL_TOPICS', onlyActive], () =>
        getTopicByTenantData().then((topics) => {
            return onlyActive ? topics.filter(({ status }) => status === 'ACTIVE') : topics;
        }),
    );
};
