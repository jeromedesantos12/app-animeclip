import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./slices";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
  },
});
console.log("STORE INIT: ", store.getState());

store.subscribe(() => {
  console.log("STORE CHANGE: ", store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
