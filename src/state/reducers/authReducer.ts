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
    // can't do anything against KeyCloak
    // eslint-disable-next-line @typescript-eslint/naming-convention
    switch (type) {
      case "auth/set-token": {
        const expiresInMilliseconds = new Date(
          Date.now() + payload.expires_in * 10000 // aprox 50 minutes
        ).getTime();

        return {
          ...state,
          accessToken: payload.access_token,
          refreshToken: payload.refresh_token,
          tokenType: payload.token_type,
          expiresIn: payload.expires_in,
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
