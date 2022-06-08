import { store } from "../store/store";

const hasUserRole = (userRole: string) => {
  const state = store.getState();

  if (
    state.tenantData.userRoles &&
    state.tenantData.userRoles.some((role: string) => role === userRole)
  ) {
    return true;
  }
  return false;
};

export default hasUserRole;
