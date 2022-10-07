import { useMutation } from "react-query";
import updateAgencyPostCodeRange from "../api/agency/updateAgencyPostCodeRange";

export const useAgencyPostCodesUpdate = (id: string) => {
  return useMutation(
    ["AGENCY_POST_CODES", id],
    (data: { postcodeRanges: string }) => {
      return updateAgencyPostCodeRange(id, data, "");
    }
  );
};
