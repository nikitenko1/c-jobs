import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Footer from './../../components/global/Footer';
import Navbar from './../../components/global/Navbar';
import { toCurrency } from './../../utils/toCurrency';
import RecheckCVModal from './../../components/modal/RecheckCVModal';
import { getDataAPI, postDataAPI } from '../../utils/fetchData';

const JobDetail = ({ job }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const applyJob = async () => {
    if (!auth.accessToken) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please login first to apply job.',
        },
      });
    }

    setOpenModal(true);
  };

  const handleApplyJob = async () => {
    try {
      const res = await postDataAPI(
        'job/apply',
        { job: job?._id, userId: auth.user?._id },
        `${auth.accessToken}`
      );
      dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      setIsApplied(true);
    } catch (err) {
      dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }

    setOpenModal(false);
  };

  useEffect(() => {
    const fetchAppliedStatus = async () => {
      const res = await getDataAPI(
        `jobs-applied/status/${job._id}`,
        auth.accessToken
      );
      setIsApplied(res.data.isApplied);
    };
    if (auth.accessToken && auth.user?.role === 'jobseeker') {
      fetchAppliedStatus();
    }
  }, [auth, job._id]);
  return (
    <>
      <Head>
        <title>
          Let&apos;s work | {job.position} at {job.organization?.user.name}
        </title>
      </Head>
      <Navbar />
      <div className="md:px-52 px-6 py-10">
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full border border-gray-300 shrink-0">
                <img
                  src={job?.organization?.user.avatar}
                  alt={job?.organization?.user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-[#504ED7] text-lg">{job?.position}</h1>
                <p className="text-xs mt-2">{job?.organization?.user.name}</p>
              </div>
            </div>
            {isApplied ? (
              <p className="bg-green-600 text-white rounded-md text-sm px-4 py-2">
                Application Sent
              </p>
            ) : (
              <>
                {auth.user?.role === 'jobseeker' && (
                  <button
                    onClick={applyJob}
                    className="bg-[#504ED7] hover:bg-[#2825C2] outline-0 transition-[background] text-white rounded-md text-sm px-4 py-2"
                  >
                    Apply
                  </button>
                )}
              </>
            )}
          </div>
          <div className="mt-5">
            <p className="font-medium mb-4">Job Overview</p>
            <div
              className="text-sm leading-relaxed mb-3 break-words"
              dangerouslySetInnerHTML={{ __html: `${job?.overview}` }}
            />
            <p className="font-medium mb-4 mt-6">Skills and Expertise</p>
          </div>
          <div className="flex items-center gap-3 mb-7 flex-wrap">
            {job?.skills.map((item) => (
              <p
                key={item}
                className="bg-gray-200 text-gray-600 text-xs px-3 py-2 rounded-full"
              >
                {item}
              </p>
            ))}
          </div>
          <p className="font-medium mb-4">Requirements</p>
          <div
            className="mb-7 list-disc ml-5"
            dangerouslySetInnerHTML={{ __html: `${job?.requirements}` }}
          />
          <p className="font-medium mb-4">Salary</p>
          <div className="flex items-center mb-7">
            <p className="font-semibold text-lg">{toCurrency(job?.salary)}</p>
            <p className="text-gray-500 text-xs">/month</p>
          </div>
          <p className="font-medium mb-4">Company Overview</p>
          <div
            className="text-sm leading-relaxed mb-3"
            dangerouslySetInnerHTML={{
              __html: `${job?.organization?.description}`,
            }}
          />
          <p className="font-medium mb-4 mt-6">Company Location</p>
          <p className="mb-3 text-sm leading-realxed">
            {job?.organization?.user.province}, {job?.organization?.user.city},
            {job?.organization?.user.district},
            {job?.organization?.user.postalCode}
          </p>
          <p className="mb-7 text-sm leading-realxed">
            {job?.organization?.address}
          </p>
          <p className="font-medium mb-4">Estimated Company Total Employee</p>
          <p>{job?.organization?.totalEmployee} people</p>
        </>
      </div>
      <Footer />
      <RecheckCVModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        company={job.organization?.user.name}
        position={job.position}
        onClick={handleApplyJob}
      />
    </>
  );
};

export default JobDetail;

export const getServerSideProps = async (context) => {
  try {
    const res = await axios.get(
      `${process.env.CLIENT_URL}/api/job/${context.query.id}`
    );

    return {
      props: {
        job: res.data.job[0],
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/jobs',
        permanent: false,
      },
    };
  }
};
