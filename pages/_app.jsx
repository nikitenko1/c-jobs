import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DataProvider from '../redux/store';
import { refreshToken } from '../redux/slices/authSlice';
import Alert from '../components/global/Alert';
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

      <App>
        <Component {...pageProps} />
      </App>
    </DataProvider>
  );
}

export default MyApp;
