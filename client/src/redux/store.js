import { configureStore } from "@reduxjs/toolkit";

import { AuthReducer } from "./slices/auth";
import { diskReducer } from "./slices/disk";
import { dropReducer } from "./slices/dropit";

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    disk: diskReducer,
    dropIt: dropReducer,
  },
});

export default store;
