import parseJwt from "./parseJWT";
import { store } from "../store/store";
import storeDispatch from "../state/actions/storeDispatch";

const retrieveUserRoles = (token: string | undefined) => {
  const state = store.getState();
  const access = parseJwt(token || "");

  if (access.realm_access.roles.length > 0) {
    const userRoles: string[] = access.realm_access.roles;
    const tempState: any = state.tenantData;
    userRoles.forEach((role) => tempState.userRoles.push(role));
    storeDispatch("tenant/set-data", {
      tempState,
    });
  }
};

export default retrieveUserRoles;
