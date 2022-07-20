import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import alert from './slices/alertSlice';
import job from './slices/jobSlice';
import organization from './slices/organizationSlice';
import category from './slices/categorySlice';
import applicant from './slices/applicantSlice';
import userDescription from './slices/userDescriptionSlice';
import invitation from './slices/invitationSlice';

const store = configureStore({
  reducer: {
    applicant,
    auth,
    alert,
    category,
    job,
    invitation,
    organization,
    userDescription,
  },
});

const DataProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default DataProvider;
