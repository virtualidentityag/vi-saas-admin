import { combineReducers } from "redux";
// Import all Reducers here
import userDataReducer from "./userDataReducer";
import authReducer from "./authReducer";
import tenantDataReducer from "./tenantDataReducer";

// Declare all reducers here
const appReducer = combineReducers({
  auth: authReducer,
  userData: userDataReducer,
  tenantData: tenantDataReducer,
});

const rootReducer = (state: any, action: any) => {
  // when a unauthorized action is dispatched it will reset redux state
  if (action.type === "store/clear") {
    // return initial states
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return appReducer(undefined, action);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return appReducer(state, action);
};

export default rootReducer;
