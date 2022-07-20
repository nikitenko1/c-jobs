import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { getApplicants } from './../../redux/slices/applicantSlice';
import UserCard from './../global/UserCard';

const ApplicantModal = ({ openModal, setOpenModal, jobId }) => {
  const dispatch = useDispatch();
  const { auth, applicant } = useSelector((state) => state);

  useEffect(() => {
    if (jobId && auth.accessToken) {
      dispatch(getApplicants({ jobId, token: auth.accessToken }));
    }
  }, [jobId, auth, dispatch]);

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setOpenModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openModal, setOpenModal]);

  useEffect(() => {
    if (jobId && auth.accessToken) {
      dispatch(getApplicants({ jobId, token: auth.accessToken }));
    }
  }, [jobId, auth, dispatch]);

  return (
    <div
      className={`modal-background ${
        openModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        ref={modalRef}
        className={`${
          openModal ? 'translate-y-0' : '-translate-y-12'
        } modal-box max-w-[950px] max-h-[600px] overflow-auto hide-scrollbar`}
      >
        <div className="modal-box-header">
          <h1 className="text-lg font-medium">Applicant List</h1>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            className="cursor-pointer"
          />
        </div>
        {applicant.length === 0 ? (
          <div className="p-7">
            <div className="bg-red-500 text-center text-white text-sm rounded-md py-3">
              There's no job posted data found.
            </div>
          </div>
        ) : (
          <div className="p-7 grid lg:grid-cols-2 grid-cols-1 gap-8">
            {applicant.map((item) => (
              <UserCard key={item._id} isApplicant={true} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantModal;
