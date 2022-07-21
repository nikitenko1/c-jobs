import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DataProvider from '../redux/store';
import { refreshToken } from '../redux/slices/authSlice';
import Alert from '../components/global/Alert';
import UserDescriptionModal from './../components/modal/UserDescriptionModal';
import '../styles/globals.css';

const App = ({ children }) => {
  const [showChild, setShowChild] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setShowChild(true);
  }, []);
  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  if (!showChild) {
    return null;
  }
  if (typeof window === 'undefined') {
    return <></>;
  } else {
    return <>{children}</>;
  }
};

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Alert />
      <UserDescriptionModal />
      <App>
        <Component {...pageProps} />
      </App>
    </DataProvider>
  );
}

export default MyApp;
