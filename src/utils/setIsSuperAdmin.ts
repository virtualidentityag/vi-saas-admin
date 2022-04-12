import parseJwt from "./parseJWT";
import { store } from "../store/store";
import storeDispatch from "../state/actions/storeDispatch";

const setIsSuperAdmin = (token: string | undefined) =>
  // eslint-disable-next-line no-new
  new Promise((resolve) => {
    const state = store.getState();

    const access = parseJwt(token || "");
    const isSuperAdmin = access.realm_access.roles.some(
      (role: string) => role === "tenant-admin"
    );
    if (isSuperAdmin) {
      storeDispatch("tenant/set-data", {
        ...state.tenantData,
        isSuperAdmin,
      });
    }
    resolve(isSuperAdmin);
  });

export default setIsSuperAdmin;
