import { createSlice, configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counter";

// Store is a global object
export const store = configureStore({
  reducer: { counter: counterReducer },
});
