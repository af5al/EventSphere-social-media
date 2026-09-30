import { configureStore } from "@reduxjs/toolkit";
import loadingSlice from "./slices/LoadingSlice";
import AuthSlice from "./slices/AuthSlice";
import EventAuthSlice from "./slices/EventAuthSlice";
import AdminAuthSlice from "./slices/AdminAuthSlice";

export const store = configureStore({
  reducer: {
    loadings: loadingSlice,
    Auth: AuthSlice,
    EventAuth: EventAuthSlice,
    AdminAuth: AdminAuthSlice,
  },
  devTools: import.meta.env.DEV,
});

export default store;
