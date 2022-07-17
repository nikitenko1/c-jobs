import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import alert from './slices/alertSlice';

const store = configureStore({
  reducer: {
    auth,
    alert,
  },
});

const DataProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default DataProvider;
