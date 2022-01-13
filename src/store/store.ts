import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";
import storage from "redux-persist/lib/storage";
import rootReducer from "../state/reducers/rootReducer";

const middlewares: any = [];

const persistConfig = {
  key: "primary",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

const store = createStore(persistedReducer, enhancer);

const persistor = persistStore(store);

export { store, persistor };
