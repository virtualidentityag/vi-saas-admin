import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { topicEndpoint } from "../../appConfig";
import { TopicData } from "../../types/topic";

/**
 * delete topic
 * @param topicData
 * @return Promise
 */
const deleteTopicData = (topicData: TopicData) => {
  const { id } = topicData;

  return fetchData({
    url: `${topicEndpoint}/${id}`,
    method: FETCH_METHODS.DELETE,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });
};

export default deleteTopicData;
