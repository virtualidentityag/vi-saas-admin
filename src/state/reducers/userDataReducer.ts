// This will be set to Redux an initialization

import { UserData } from "../../types/user";

const initialState: UserData = {
  firstname: "",
  id: null,
  lastname: "",
  email: "",
  gender: "",
  phone: "",
  tenantId: null,
  active: true,
  username: "",
  twoFactorAuth: {
    isActive: false,
    qrCode: "",
    secret: "",
    type: null,
  },
};

// eslint-disable-next-line @typescript-eslint/default-param-last
const userDataReducer = (state = initialState, action: any) => {
  if (action) {
    const { type, payload } = action;
    switch (type) {
      case "user/set-data": {
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

export default userDataReducer;
