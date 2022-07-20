import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DataProvider from '../redux/store';
import { refreshToken } from '../redux/slices/authSlice';
import Alert from '../components/global/Alert';
import UserDescriptionModal from './../components/modal/UserDescriptionModal';
import '../styles/globals.css';

const App = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return <>{children}</>;
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
