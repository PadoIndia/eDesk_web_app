import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authSlice from "../features/auth.slice";
import videoSlice from "../features/video.slice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import chatSlice from "../features/chat-slice";
import userSlice from "../features/user-slice";
import taskSlice from "../features/task-slice";
import mediaSlice from "../features/media-slice";
import replySlice from "../features/reply-slice";
import messageSlice from "../features/message-slice";
import viewMediaSlice from "../features/view-media-slice";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["video"],
};

const reducers = combineReducers({
  auth: authSlice,
  video: videoSlice,
  chatReducer: chatSlice,
  userReducer: userSlice,
  taskReducer: taskSlice,
  mediaReducer: mediaSlice,
  replyReducer: replySlice,
  messageReducer: messageSlice,
  viewMediaReducer: viewMediaSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const persistor = persistStore(store);
