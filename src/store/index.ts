import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import deviceReducer from './slices/deviceSlice';
import workspaceReducer from './slices/workspaceSlice';
import cueReducer from './slices/cueSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    devices: deviceReducer,
    workspace: workspaceReducer,
    cues: cueReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
