import { AuthToken } from "../state/reducers/authReducer";

/**
 * test if the token is expired at the time of calling
 * export to test in different places
 * pass the store token
 * @param timeWhenExpires {AuthToken["expiresInMilliseconds"]}
 */
const isTokenExpired = (timeWhenExpires: AuthToken["expiresInMilliseconds"]) =>
  timeWhenExpires ? timeWhenExpires - new Date().getTime() <= 0 : true;

export default isTokenExpired;
