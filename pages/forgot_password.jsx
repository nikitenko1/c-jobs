import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Footer from './../components/global/Footer';
import Navbar from './../components/global/Navbar';
import Loader from './../components/global/Loader';
import { postDataAPI } from '../utils/fetchData';
import { validateEmail } from '../utils/validator';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please provide email address.' },
      });
    }

    if (!validateEmail(email)) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please provide valid email address.' },
      });
    }
    setLoading(true);
    try {
      const res = await postDataAPI('auth/forgot-password', { email });
      dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });
    } catch (err) {
      dispatch({
        type: 'alert/alert',
        payload: {
          error: err.response.data.msg,
        },
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    if (auth.accessToken) {
      router.push('/');
    }
  }, [auth, router]);

  return (
    <>
      <Head>
        <title>Let&apos;s work | Forgot Password</title>
      </Head>
      <Navbar />
      <div className="bg-[#FAFAFA] px-10 py-14">
        <div className="bg-white w-full max-w-[400px] border border-gray-300 m-auto px-6 py-12">
          <h1 className="text-xl text-center mb-7 text-gray-600">
            Forgot Password
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="me@example.com"
                className="w-full outline-0 border border-gray-300 px-2 py-3 text-sm rounded-md mt-3"
              />
            </div>
            <button
              className={`${
                loading
                  ? 'bg-gray-200 hover:bg-gray-200 cursor-auto'
                  : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
              } transition-[background] text-sm w-full py-3 text-white rounded-md mt-7`}
            >
              {loading ? <Loader /> : 'Submit Now'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgetPassword;
