import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cueReducer from './slices/cueSlice';
import deviceReducer from './slices/deviceSlice';
import workspaceReducer from './slices/workspaceSlice';
import scriptReducer from './slices/scriptSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cues: cueReducer,
    devices: deviceReducer,
    workspace: workspaceReducer,
    scripts: scriptReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['socket/connected', 'socket/disconnected'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.socket', 'meta.arg.socket'],
        // Ignore these paths in the state
        ignoredPaths: ['socket.instance'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
