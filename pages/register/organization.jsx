import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { register } from './../../utils/auth';
import Editor from './../../utils/Editor';
import { validateEmail } from './../../utils/validator';
import Footer from './../../components/global/Footer';
import Navbar from './../../components/global/Navbar';
import Loader from './../../components/global/Loader';

const Organization = () => {
  const [description, setDescription] = useState('');
  const [organizationData, setOrganizationData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    createdDate: '',
    totalEmployee: 0,
    industryType: '',
    province: '',
    city: '',
    district: '',
    postalCode: 0,
    address: '',
    password: '',
    passwordConfirmation: '',
    role: 'organization',
  });
  const [avatar, setAvatar] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { alert, auth } = useSelector((state) => state);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setOrganizationData({ ...organizationData, [name]: value });
  };

  const handleChangeImage = (e) => {
    const target = e.target;
    const files = [...Object.values(target.files)];
    setAvatar([...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!organizationData.name) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in name.' },
      });
    }
    ('t l');

    if (!organizationData.email) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please provide email.' },
      });
    }

    if (!validateEmail(organizationData.email)) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please provide valid email address.' },
      });
    }

    if (organizationData.password.length < 8) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Password should be at least 8 characters.' },
      });
    }

    if (organizationData.passwordConfirmation !== organizationData.password) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Password confirmation should be matched.' },
      });
    }

    if (!organizationData.phoneNumber) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please fill in organization phone number.',
        },
      });
    }

    if (organizationData.totalEmployee <= 0) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: "Organization total employee can't less than 1." },
      });
    }

    if (!organizationData.industryType) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in industry type.' },
      });
    }

    if (!organizationData.province) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in province.' },
      });
    }

    if (!organizationData.city) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in city.' },
      });
    }

    if (!organizationData.district) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in district.' },
      });
    }

    if (organizationData.postalCode === 0) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in postal code.' },
      });
    }

    if (!organizationData.address) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in address.' },
      });
    }

    if (avatar.length === 0) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in organization logo.' },
      });
    }

    register({ ...organizationData, description }, avatar, dispatch);
  };

  useEffect(() => {
    if (auth.accessToken) {
      router.push('/');
    }
  }, [router, auth]);

  return (
    <>
      <Head>
        <title>Let&apos;s work | Organization | Sign Up</title>
      </Head>
      <Navbar />
      <div className="bg-[#FAFAFA] px-10 py-14">
        <h1 className="text-center mb-10 text-2xl font-semibold text-blue-500">
          Recruit Better With{' '}
          <span className="text-gray-500">&copy;Let&apos;s work</span>
        </h1>
        <div className="bg-white w-full max-w-[1000px] border border-gray-300 m-auto px-8 py-12">
          <form onSubmit={handleSubmit}>
            <div className="flex md:flex-row flex-col md:items-center gap-7 md:mb-10 mb-7">
              <div className="flex-1">
                <label htmlFor="name" className="text-sm">
                  Organization Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={organizationData.name}
                  onChange={handleChangeInput}
                  className="outline-0 mt-3 w-full px-3 text-sm h-10 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="email" className="text-sm">
                  Organization Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={organizationData.email}
                  onChange={handleChangeInput}
                  className="outline-0 mt-3 w-full px-3 text-sm h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex md:flex-row flex-col md:items-center gap-7 md:mb-10 mb-7">
              <div className="flex-1">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
                <div className="flex items-center border border-gray-300 mt-3 rounded-md px-2 py-3 gap-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={organizationData.password}
                    onChange={handleChangeInput}
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
              </div>
              <div className="flex-1">
                <label htmlFor="passwordConfirmation" className="text-sm">
                  Password Confirmation
                </label>
                <div className="flex items-center border border-gray-300 mt-3 rounded-md px-2 py-3 gap-2">
                  <input
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    value={organizationData.passwordConfirmation}
                    onChange={handleChangeInput}
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
            </div>
            <div className="flex md:flex-row flex-col md:items-center gap-7 md:mb-10 mb-7">
              <div className="flex-1">
                <label htmlFor="phoneNumber" className="text-sm">
                  Organization Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={organizationData.phoneNumber}
                  onChange={handleChangeInput}
                  className="outline-0 mt-3 w-full px-3 text-sm h-10 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="createdDate" className="text-sm">
                  Organization Created Date
                </label>
                <input
                  type="date"
                  id="createdDate"
                  name="createdDate"
                  value={organizationData.createdDate}
                  onChange={handleChangeInput}
                  className="outline-0 mt-3 w-full px-3 text-sm h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex md:flex-row flex-col md:items-center gap-7 md:mb-10 mb-7">
              <div className="flex-1">
                <label htmlFor="totalEmployee" className="text-sm">
                  Estimated Organization Total Employee
                </label>
                <input
                  type="number"
                  id="totalEmployee"
                  name="totalEmployee"
                  value={organizationData.totalEmployee}
                  onChange={handleChangeInput}
                  className="outline-0 mt-3 w-full px-3 text-sm h-10 border border-gray-300 rounded-md"
                  min={1}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="industryType" className="text-sm">
                  Organization Industry Type (e.g. FnB, Agriculture, etc)
                </label>
                <input
                  type="text"
                  id="industryType"
                  name="industryType"
                  value={organizationData.industryType}
                  onChange={handleChangeInput}
                  className="outline-0 mt-3 w-full px-3 text-sm h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex md:flex-row flex-col md:items-center gap-7 md:mb-10 mb-7">
              <div className="flex-1">
                <label htmlFor="province" className="text-sm">
                  Province
                </label>

                <select
                  name="province"
                  id="province"
                  value={organizationData.province}
                  onChange={handleChangeInput}
                  className="w-full outline-0 bg-transparent border border-gray-300 rounded-md h-10 px-2 mt-3 text-sm"
                >
                  <option value="">- Select Province -</option>
                  <option value="Cherkasy Oblast">Cherkasy Oblast</option>
                  <option value="Chernihiv Oblast"> Chernihiv Oblast</option>
                  <option value="Chernivtsi Oblast">Chernivtsi Oblast</option>
                  <option value="Donetsk Oblast">Donetsk Oblast</option>
                  <option value="Kharkiv Oblast">Kharkiv Oblast</option>
                  <option value="Kherson Oblast">Kherson Oblast</option>
                  <option value="Khmelnytskyi Oblast">
                    Khmelnytskyi Oblast
                  </option>
                  <option value="Kyiv Oblast">Kyiv Oblast</option>
                  <option value="Kirovohrad Oblast">Kirovohrad Oblast</option>
                  <option value="Luhansk Oblast">Luhansk Oblast</option>
                  <option value="Lviv Oblast">Lviv Oblast</option>
                  <option value="Mykolaiv Oblast">Mykolaiv Oblast</option>
                  <option value="Odessa Oblast">Odessa Oblast</option>
                  <option value="Poltava Oblast">Poltava Oblast</option>
                  <option value="Sumy Oblast">Sumy Oblast</option>
                  <option value="Vinnytsia Oblast">Vinnytsia Oblast</option>
                  <option value=" Volyn Oblast">Zakarpattia Oblast</option>
                  <option value="Zaporizhzhia Oblast">
                    Zaporizhzhia Oblast
                  </option>
                  <option value="Zhytomyr Oblast">Zhytomyr Oblast</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="city" className="text-sm">
                  City
                </label>

                <select
                  name="city"
                  id="city"
                  value={organizationData.city}
                  onChange={handleChangeInput}
                  className="w-full outline-0 bg-transparent border border-gray-300 rounded-md h-10 px-2 mt-3 text-sm"
                >
                  <option value="">- Select City -</option>
                  <option value="Kyiv">Kyiv</option>
                  <option value="New York">New York</option>
                </select>
              </div>
            </div>
            <div className="flex md:flex-row flex-col md:items-center gap-7 md:mb-10 mb-7">
              <div className="flex-1">
                <label htmlFor="district" className="text-sm">
                  District
                </label>

                <select
                  name="district"
                  id="district"
                  value={organizationData.district}
                  onChange={handleChangeInput}
                  className="w-full outline-0 bg-transparent border border-gray-300 rounded-md h-10 px-2 mt-3 text-sm"
                >
                  <option value="">- Select District -</option>
                  {organizationData.city === 'Kyiv' ? (
                    <>
                      <option value="Darnytskyi District">
                        Darnytskyi District
                      </option>
                      <option value="Desnianskyi District">
                        Desnianskyi District
                      </option>
                      <option value="Dniprovskyi District">
                        Dniprovskyi District
                      </option>
                      <option value="Holosiivskyi District">
                        Holosiivskyi District
                      </option>
                      <option value="Pecherskyi District">
                        Obolonskyi District
                      </option>
                      <option value="Shevchenkivskyi District">
                        Shevchenkivskyi District
                      </option>
                      <option value="Solomianskyi District">
                        Solomianskyi District
                      </option>
                      <option value="Sviatoshynskyi District">
                        Sviatoshynskyi District
                      </option>
                      <option value="Sviatoshynskyi District">
                        Sviatoshynskyi District
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="Bronx District">Bronx District</option>
                      <option value="Brooklyn District">
                        Brooklyn District
                      </option>
                      <option value="Manhattan District">
                        Manhattan District
                      </option>
                      <option value="Queens District">Queens District</option>
                      <option value="Staten Island">
                        Staten Island District
                      </option>
                    </>
                  )}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="postalCode" className="text-sm">
                  Postal Code
                </label>
                <input
                  type="number"
                  name="postalCode"
                  id="postalCode"
                  value={organizationData.postalCode}
                  onChange={handleChangeInput}
                  className="outline-0 mt-3 w-full px-3 text-sm h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="md:mb-10 mb-7">
              <label htmlFor="address" className="text-sm">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={organizationData.address}
                onChange={handleChangeInput}
                className="outline-0 mt-3 w-full px-3 text-sm h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:mb-10 mb-7">
              <label htmlFor="logo" className="text-sm">
                Organization Logo
              </label>
              <div className="flex gap-3 mt-3">
                <div className="w-20 h-20 rounded-full shadow-xl border border-gray-300 shrink-0">
                  {avatar.length > 0 && (
                    <img
                      src={URL.createObjectURL(avatar[0])}
                      alt={organizationData.name}
                      className="w-full h-full rounded-full object-contain"
                    />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="logo"
                  onChange={handleChangeImage}
                  className="outline-0 w-full px-3 text-sm h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="md:mb-10 mb-7">
              <label htmlFor="description" className="text-sm">
                Organization Description
              </label>
              <Editor content={description} setContent={setDescription} />
            </div>
            <button
              className={`${
                alert.loading
                  ? 'bg-gray-200 hover:bg-gray-200 cursor-auto'
                  : 'bg-blue-500 hover:bg-blue-700 cursor-pointer'
              } transition-[background] text-sm w-full py-3 text-white rounded-md mt-7`}
            >
              {alert.loading ? <Loader /> : 'Submit organization'}
            </button>
          </form>
          <p className="mt-8 text-gray-400 text-sm text-center">
            Already have an account?{' '}
            <Link href="/login">
              <a className="outline-0 text-blue-500">Sign in</a>
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Organization;
