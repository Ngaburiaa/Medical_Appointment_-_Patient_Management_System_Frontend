import { appointmentApi } from './../Features/api/appointmentAPI';
import { configureStore } from '@reduxjs/toolkit';
import { userApi } from '../Features/api/userAPI';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import authReducer from "../Features/auth/authSlice";
import docAuthReducer from "../Features/auth/doctorSlice"
import { doctorApi } from '../Features/api/doctorAPI';
import { prescriptionApi } from '../Features/api/prescriptionAPI';
import { prescriptionItemApi } from '../Features/api/prescriptionItemAPI';
import { complaintApi } from '../Features/api/complaintApi';


const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated','userType'],
};

const docAuthPersistConfig = {
  key: 'docAuth',
  storage,
  whitelist: ['doctor'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedDocAuthReducer = persistReducer(docAuthPersistConfig, docAuthReducer);

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer, 
    [doctorApi.reducerPath]:doctorApi.reducer,
    [appointmentApi.reducerPath]:appointmentApi.reducer,
    [prescriptionApi.reducerPath]:prescriptionApi.reducer,
    [prescriptionItemApi.reducerPath]:prescriptionItemApi.reducer,
    [complaintApi.reducerPath]:complaintApi.reducer,
     auth: persistedAuthReducer,
     docAuth:persistedDocAuthReducer,
    
   
 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // To avoid serialization errors with redux-persist
    }).concat(userApi.middleware,
      doctorApi.middleware,
      appointmentApi.middleware,
      prescriptionItemApi.middleware,
      prescriptionApi.middleware,
      complaintApi.middleware
    
    ), 
      
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);