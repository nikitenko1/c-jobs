import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from './../../components/global/Navbar';
import Footer from './../../components/global/Footer';
import Loader from './../../components/global/Loader';
import { register } from './../../utils/auth';
import { AiFillEye, AiFillEyeInvisible, AiOutlineUser } from 'react-icons/ai';
import { BiLock } from 'react-icons/bi';
import { validateEmail } from '../../utils/validator';

const Jobseeker = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { alert, auth } = useSelector((state) => state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.name) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in name to register.' },
      });
    }

    if (!userData.email) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in email to register.' },
      });
    }

    if (!validateEmail(userData.email)) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in valid email address.' },
      });
    }

    if (!userData.password) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in password to register.' },
      });
    }

    if (userData.password.length < 8) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Password should be at least 8 characters.' },
      });
    }

    if (!userData.passwordConfirmation) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in password confirmation to register.' },
      });
    }

    if (userData.password !== userData.passwordConfirmation) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Password confirmation should be matched.' },
      });
    }

    register({ ...userData, role: 'jobseeker' }, [], dispatch);
  };

  useEffect(() => {
    if (auth.accessToken) {
      router.push('/');
    }
  }, [router, auth.accessToken]);
  return (
    <>
      <Head>
        <title>Let&apos;s work | Jobseeker Sign Up</title>
      </Head>
      <Navbar />
      <div className="bg-white px-10 py-14">
        <div className="bg-slate-50 w-full max-w-[600px] border border-gray-300 m-auto px-8 py-12">
          <h1 className="text-xl text-center mb-7 text-gray-600">Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 border border-gray-300 rounded-md h-12 px-3 mb-7">
              <AiOutlineUser className="text-lg text-gray-500" />
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Name"
                className="outline-0 w-full text-sm"
              />
            </div>
            <div className="flex items-center gap-3 border border-gray-300 rounded-md h-12 px-3 mb-7">
              <AiOutlineUser className="text-lg text-gray-500" />
              <input
                type="text"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="outline-0 w-full text-sm"
              />
            </div>
            <div className="flex items-center gap-3 border border-gray-300 rounded-md h-12 px-3 mb-7">
              <BiLock className="text-lg text-gray-500" />
              <div className="flex items-center w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="outline-0 w-full text-sm pr-3"
                />
                {showPassword ? (
                  <AiFillEyeInvisible
                    onClick={() => setShowPassword(false)}
                    className="cursor-pointer text-gray-500"
                  />
                ) : (
                  <AiFillEye
                    onClick={() => setShowPassword(true)}
                    className="cursor-pointer text-gray-500"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 border border-gray-300 rounded-md h-12 px-3">
              <BiLock className="text-lg text-gray-500" />
              <div className="flex items-center w-full">
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  name="passwordConfirmation"
                  value={userData.passwordConfirmation}
                  onChange={handleChange}
                  placeholder="Password confirmation"
                  className="outline-0 w-full text-sm pr-3"
                />
                {showPasswordConfirmation ? (
                  <AiFillEyeInvisible
                    onClick={() => setShowPasswordConfirmation(false)}
                    className="cursor-pointer text-gray-500"
                  />
                ) : (
                  <AiFillEye
                    onClick={() => setShowPasswordConfirmation(true)}
                    className="cursor-pointer text-gray-500"
                  />
                )}
              </div>
            </div>
            <button
              className={`${
                alert.loading
                  ? 'bg-gray-200 hover:bg-gray-200 cursor-auto'
                  : 'bg-blue-500 hover:bg-blue-700 cursor-pointer'
              } transition-[background] text-sm w-full py-3 text-white rounded-md mt-7`}
            >
              {alert.loading ? <Loader /> : 'Register Now'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Jobseeker;
