import { configureStore } from '@reduxjs/toolkit';
//slice
import authReducer from './auth';

const store = configureStore({ reducer: { auth: authReducer } });

export default store;
