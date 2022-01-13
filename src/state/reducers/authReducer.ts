export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: null | number;
  expiresInMilliseconds: null | number;
}

const initialState: AuthToken = {
  accessToken: "",
  refreshToken: "",
  tokenType: "",
  expiresIn: null,
  expiresInMilliseconds: null,
};

// eslint-disable-next-line @typescript-eslint/default-param-last
const authReducer = (state = initialState, action: any) => {
  if (action) {
    const { type, payload } = action;

    switch (type) {
      case "auth/set-token": {
        const expiresInMilliseconds = new Date(
          Date.now() + payload.expiresIn * 1000
        ).getTime();

        return {
          ...state,
          ...payload,
          expiresInMilliseconds,
        };
      }
      // Default case, just returns the initialState/currentState
      default:
        return state;
    }
  }
  return state;
};

export default authReducer;
