import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Loader from './../components/global/Loader';
import Footer from './../components/global/Footer';
import Navbar from './../components/global/Navbar';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { validateEmail } from './../utils/validator';
import { login } from '../redux/slices/authSlice';

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { query } = useRouter();
  const dispatch = useDispatch();
  const { alert, auth } = useSelector((state) => state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.email) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please provide email to login.' },
      });
    }

    if (!validateEmail(userData.email)) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please provide valid email address.' },
      });
    }

    if (!userData.password) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please provide password to login.' },
      });
    }

    await dispatch(login(userData));
    setUserData({ email: '', password: '' });
  };

  useEffect(() => {
    if (auth.accessToken) {
      if (query.r) {
        router.push(`/${query.r}`);
      } else {
        router.push('/');
      }
    }
  }, [auth, router, query.r]);

  return (
    <>
      <Head>
        <title>Let&apos;s work | Login</title>
      </Head>
      <Navbar />
      <div className="bg-[#FAFAFA] px-10 py-14">
        <div className="bg-white w-full max-w-[400px] border border-gray-300 m-auto px-6 py-12">
          <h1 className="text-xl text-center mb-7 text-gray-600">
            Sign In to Let&apos;s work
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-7">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="me@example.com"
                className="w-full outline-0 border border-gray-300 px-2 py-3 text-sm rounded-md mt-3"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <div className="flex items-center border border-gray-300 mt-3 rounded-md px-2 py-3 gap-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  className="w-full outline-0 text-sm"
                />
                {showPassword ? (
                  <AiFillEyeInvisible
                    onClick={() => setShowPassword(false)}
                    className="text-gray-400 cursor-pointer"
                  />
                ) : (
                  <AiFillEye
                    onClick={() => setShowPassword(true)}
                    className="text-gray-400 cursor-pointer"
                  />
                )}
              </div>
              <Link href="/forgot_password">
                <a className="text-blue-500 text-xs mt-2 float-right outline-0">
                  Forgot password?
                </a>
              </Link>
              <div className="clear-both" />
            </div>
            <button
              className={`${
                alert.loading
                  ? 'bg-gray-200 hover:bg-gray-200 cursor-auto'
                  : 'bg-blue-500 hover:bg-blue-700 cursor-pointer'
              } transition-[background] text-sm w-full py-3 text-white rounded-md mt-7`}
            >
              {alert.loading ? <Loader /> : 'Login Now'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
