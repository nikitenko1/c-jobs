import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import alert from './slices/alertSlice';
import job from './slices/jobSlice';
import organization from './slices/organizationSlice';
import category from './slices/categorySlice';

const store = configureStore({
  reducer: {
    auth,
    alert,
    job,
    organization,
    category,
  },
});

const DataProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default DataProvider;
