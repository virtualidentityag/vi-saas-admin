import { store } from "../../store/store";

/**
 * wrapper if useDispatch is not useable
 * @param reduxType {string}
 * @param payload {*}
 */
const storeDispatch = (reduxType: string, payload?: any) => {
  store.dispatch({
    type: reduxType,
    payload,
  });
};

export default storeDispatch;
