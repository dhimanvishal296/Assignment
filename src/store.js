import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import searchReducer from './features/search/searchSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
  },
});


