import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router";
import routePathNames from "../appConfig";
import { AuthToken } from "../state/reducers/authReducer";

/**
 * test if the token is expired at the time of calling
 * export to test in different places
 * pass the store token
 * @param timeWhenExpires {AuthToken["expiresInMilliseconds"]}
 */
export const isTokenExpired = (
  timeWhenExpires: AuthToken["expiresInMilliseconds"]
) => {
  return timeWhenExpires ? timeWhenExpires - new Date().getTime() <= 0 : true;
};

interface ProtectedRouteTypes {
  children: React.ReactNode;
}

/**
 * test if the user is logged in, otherwise redirect to the login page
 * @param children {Component}
 * @constructor
 */
function ProtectedRoute({ children }: ProtectedRouteTypes) {
  const location = useLocation();
  const { auth } = useSelector((state: any) => state);

  if (!auth?.accessToken || isTokenExpired(auth?.expiresInMilliseconds)) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.

    return <Navigate to={routePathNames.login} state={{ from: location }} />;
  }
  // we must return a proper element here :(
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export default ProtectedRoute;
