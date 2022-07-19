import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { AiOutlineClose } from 'react-icons/ai';
import { getDataAPI } from './../utils/fetchData';
import { editProfile } from './../redux/slices/authSlice';
import Head from 'next/head';
import Footer from './../components/global/Footer';
import Navbar from './../components/global/Navbar';
import Loader from './../components/global/Loader';
import CVModal from './../components/modal/CVModal';

const EditProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    dob: '',
    cv: '',
    province: '',
    city: '',
    district: '',
    postalCode: '',
    avatar: '',
    about: '',
  });
  const [jobseeker, setJobseeker] = useState({});
  const [skills, setSkills] = useState([]);
  const [tempAvatar, setTempAvatar] = useState([]);
  const [tempCv, setTempCv] = useState([]);

  const [openCVModal, setOpenCVModal] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { auth, alert } = useSelector((state) => state);

  const handleChangeSkills = (e) => {
    if (e.key === ',' && e.target.value !== ',') {
      const val = e.target.value;
      if (skills.includes(val.substring(0, val.length - 1)))
        e.target.value = '';
      else {
        setSkills([...skills, val.substring(0, val.length - 1)]);
        e.target.value = '';
      }
    }
  };

  const handleRemoveSkill = (idx) => {
    const skillCopy = [...skills];
    skillCopy.splice(idx, 1);
    setSkills(skillCopy);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleChangeImage = (e) => {
    const target = e.target;
    const files = [...Object.values(target.files)];
    setTempAvatar([...files]);
  };

  const handleChangeCv = (e) => {
    const target = e.target;
    const files = [...Object.values(target.files)];
    setTempCv([...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userData.name) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please provide name.' },
      });
    }

    if (new Date(userData.dob) > new Date()) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: "Date of birth can't be greater than current date." },
      });
    }
    if (auth.accessToken) {
      dispatch(
        editProfile({
          ...userData,
          skills,
          tempAvatar,
          tempCv,
          token: `${auth.accessToken}`,
        })
      );
    }
  };

  useEffect(() => {
    if (!auth.accessToken) {
      router.push('/login?r=edit_profile');
    } else {
      if (auth.user?.role !== 'jobseeker') {
        router.push('/');
      }
    }
  }, [router, auth]);

  useEffect(() => {
    const fetchJobseeker = async () => {
      try {
        const res = await getDataAPI(
          `jobseeker/${auth.user?._id}`,
          `${auth.accessToken}`
        );
        // API return res.status(200).json({ jobseeker });
        setJobseeker(res.data.jobseeker);
      } catch (err) {
        dispatch({
          type: 'alert/alert',
          payload: { error: err.response.data.msg },
        });
      }
    };

    if (auth.accessToken) {
      fetchJobseeker();
    }
  }, [auth, dispatch]);

  useEffect(() => {
    if (auth.accessToken) {
      setUserData({
        name: auth.user?.name ?? '',
        email: auth.user?.email ?? '',
        province: `${auth.user?.province}`,
        avatar: `${auth.user?.avatar}`,
        city: `${auth.user?.city}`,
        district: `${auth.user?.district}`,
        cv: jobseeker.cv || '',
        postalCode: auth.user?.postalCode || '',
        dob: jobseeker.dob ? jobseeker.dob : '',
        about: jobseeker.about || '',
      });
      jobseeker.skills && setSkills(jobseeker.skills);
    }
  }, [auth, jobseeker]);

  return (
    <>
      <Head>
        <title>Let&apos;s work | Edit Profile</title>
      </Head>
      <Navbar />
      <div className="md:py-14 py-7 md:px-16 px-8 bg-gray-100">
        <h1 className="text-3xl text-center mb-9 font-medium">
          <span className="text-blue-600">Edit</span> Profile
        </h1>
        <div className="w-full max-w-[700px] bg-white m-auto shadow-lg border border-gray-200 rounded-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="avatar" className="text-sm">
                Avatar
              </label>
              <div className="flex gap-4 mt-3">
                <div className="w-20 h-20 bg-gray-200 rounded-full shrink-0 shadow-xl border border-gray-300">
                  {
                    <img
                      src={
                        tempAvatar.length > 0
                          ? URL.createObjectURL(tempAvatar[0])
                          : userData.avatar
                      }
                      alt={userData.avatar}
                      className="w-full h-full rounded-full object-cover"
                    />
                  }
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="avatar"
                  onChange={handleChangeImage}
                  className="w-full outline-0 border border-gray-300 text-sm h-10 rounded-md px-2"
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="name" className="text-sm">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="outline-0 border border-gray-300 rounded-md h-10 text-sm px-2 w-full mt-3"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                readOnly
                className="outline-0 border border-gray-300 rounded-md h-10 text-sm px-2 w-full mt-3 bg-gray-100"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="dob" className="text-sm">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={userData.dob}
                onChange={handleChange}
                className="outline-0 border border-gray-300 rounded-md h-10 text-sm px-2 w-full mt-3"
              />
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <label htmlFor="cv" className="text-sm">
                  CV (PDF Format)
                </label>
                {(tempCv.length > 0 || userData.cv) && (
                  <button
                    type="button"
                    onClick={() => setOpenCVModal(true)}
                    className="bg-red-500 hover:bg-red-600 transition[background] text-white px-2 text-xs py-1 rounded-md"
                  >
                    View CV
                  </button>
                )}
              </div>
              <input
                type="file"
                accept=".pdf"
                id="cv"
                name="cv"
                onChange={handleChangeCv}
                className="outline-0 border border-gray-300 rounded-md h-10 text-sm px-2 w-full mt-3"
              />
            </div>
            <div className="mb-6 flex md:flex-row flex-col md:items-center md:gap-5 gap-6">
              <div className="flex-1">
                <label htmlFor="province" className="text-sm">
                  Province
                </label>
                <select
                  name="province"
                  id="province"
                  value={userData.province}
                  onChange={handleChange}
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
                  value={userData.city}
                  onChange={handleChange}
                  className="w-full outline-0 bg-transparent border border-gray-300 rounded-md h-10 px-2 mt-3 text-sm"
                >
                  <option value="">- Select City -</option>
                  <option value="Kyiv">Kyiv</option>
                  <option value="New York">New York</option>
                </select>
              </div>
            </div>
            <div className="mb-6 flex md:flex-row flex-col md:items-center md:gap-5 gap-6">
              <div className="flex-1">
                <label htmlFor="district" className="text-sm">
                  District
                </label>
                <select
                  name="district"
                  id="district"
                  value={userData.district}
                  onChange={handleChange}
                  className="w-full outline-0 bg-transparent border border-gray-300 rounded-md h-10 px-2 mt-3 text-sm"
                >
                  <option value="">- Select District -</option>
                  {userData.city === 'Kyiv' ? (
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
                <select
                  name="postalCode"
                  id="postalCode"
                  value={userData.postalCode}
                  onChange={handleChange}
                  className="w-full outline-0 bg-transparent border border-gray-300 rounded-md h-10 px-2 mt-3 text-sm"
                >
                  <option value="">- Select Postal Code -</option>
                  {userData.city === 'Kyiv' ? (
                    <>
                      <option value="03141">Kyiv - 03141</option>
                    </>
                  ) : (
                    <>
                      <option value="10451">Bronx District - 10451</option>
                      <option value="11205">Brooklyn District - 11205</option>
                      <option value="11001">Manhattan District - 11001</option>
                      <option value="11431">Queens District - 11431</option>
                      <option value="10303">
                        Staten Island District - 10303
                      </option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="skills" className="text-sm">
                Skills
              </label>
              <div className="border border-gray-300 mt-3 rounded-md flex items-center px-2 min-h-20 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap my-2">
                  {skills.map((item, idx) => (
                    <div
                      key={item}
                      className="rounded-md bg-gray-100 px-3 py-1 flex items-center gap-2 break-words"
                    >
                      <p className="text-sm">{item}</p>
                      <div className="bg-gray-300 text-gray-600 w-fit rounded-full p-1 cursor-pointer">
                        <AiOutlineClose
                          onClick={() => handleRemoveSkill(idx)}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  onKeyUp={(e) => handleChangeSkills(e)}
                  className="outline-0 text-sm w-full px-2 h-10 flex-1"
                />
              </div>
            </div>
            <div className="mb-9">
              <label htmlFor="about" className="text-sm">
                About (1 paragraph)
              </label>
              <textarea
                id="about"
                name="about"
                value={userData.about}
                onChange={handleChange}
                className="outline-0 border border-gray-300 rounded-md text-sm px-2 w-full mt-3 resize-none py-2 h-32"
              />
            </div>
            <button
              className={`${
                alert.loading
                  ? 'bg-gray-200 hover:bg-gray-200 cursor-auto'
                  : 'bg-blue-500 hover:bg-blue-700 cursor-pointer'
              } transition-[background] text-sm w-full py-3 text-white rounded-md`}
            >
              {alert.loading ? <Loader /> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
      {(tempCv.length > 0 || userData.cv) && (
        <CVModal
          openModal={openCVModal}
          setOpenModal={setOpenCVModal}
          file={
            tempCv.length > 0 ? URL.createObjectURL(tempCv[0]) : userData.cv
          }
        />
      )}
    </>
  );
};

export default EditProfile;
