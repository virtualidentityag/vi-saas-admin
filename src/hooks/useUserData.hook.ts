import { useQuery, UseQueryOptions } from 'react-query';
import { getUserData } from '../api/user/getUserData';
import { UserData } from '../types/user';

export const USER_DATA_KEY = 'user-data';
export const useUserData = (options?: Omit<UseQueryOptions<UserData>, 'queryKey' | 'queryFn'>) =>
    useQuery<UserData>(USER_DATA_KEY, () => getUserData(), options);
