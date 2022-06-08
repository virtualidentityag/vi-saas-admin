// This will be set to Redux an initialization

import { TenantData } from "../../types/tenant";

const initialState: TenantData = {
  id: null,
  name: "",
  subdomain: "",
  createDate: "",
  updateDate: "",
  licensing: {
    allowedNumberOfUsers: 3,
  },
  isSuperAdmin: false,
  userRoles: [],
  theming: {
    logo: "",
    favicon: "",
    primaryColor: "",
    secondaryColor: "",
  },
  content: {
    impressum: "",
    privacy: "",
    termsAndConditions: "",
    claim: "",
  },
};

// eslint-disable-next-line @typescript-eslint/default-param-last
const tenantDataReducer = (state = initialState, action: any) => {
  if (action) {
    const { type, payload } = action;
    switch (type) {
      case "tenant/set-data": {
        return {
          ...state,
          ...payload,
        };
      }

      // Default case, just returns the initialState/currentState
      default:
        return state;
    }
  }
  return state;
};

export default tenantDataReducer;
