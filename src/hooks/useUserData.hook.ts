import { useQuery, UseQueryOptions } from "react-query";
import { getUserData } from "../api/user/getUserData";

const KEY = "user-data";
export const useUserData = (
  options?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) => useQuery<any>(KEY, () => getUserData(), options);
