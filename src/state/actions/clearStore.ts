import { store } from "../../store/store";

const clearStore = () => {
  // remove storages
  localStorage.clear();
  sessionStorage.clear();
  // reset redux
  store.dispatch({
    type: "store/clear",
  });
};

export default clearStore;
