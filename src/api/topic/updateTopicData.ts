import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { topicEndpoint } from "../../appConfig";
import { TopicData } from "../../types/topic";

/**
 * update topic
 * @param topicModel - topic data from backend
 * @param formInput - input data from form
 * @return data
 */
const updateTopicData = async (topicModel: TopicData, formInput: TopicData) => {
  const topicId = topicModel.id;
  if (topicId == null) {
    throw Error("topic id must be set");
  }

  const topicDataRequestBody = {
    dioceseId: 0,
    name: formInput.name,
    description: formInput.description,
    external: false,
  };
  return fetchData({
    url: `${topicEndpoint}/${topicModel.id}`,
    method: FETCH_METHODS.PUT,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
    bodyData: JSON.stringify(topicDataRequestBody),
  });
};

export default updateTopicData;
