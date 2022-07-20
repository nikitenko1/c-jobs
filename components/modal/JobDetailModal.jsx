import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { toCurrency } from './../../utils/toCurrency';

const JobDetailModal = ({
  openModal,
  setOpenModal,
  jobDetail,
  invitationData,
}) => {
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');

  useEffect(() => {
    setProvince(
      jobDetail
        ? jobDetail?.organization?.user.province
        : invitationData?.job.organization?.user.province
    );
    setCity(
      jobDetail
        ? jobDetail?.organization?.user.city
        : invitationData?.job.organization?.user.city
    );
    setDistrict(
      jobDetail
        ? jobDetail?.organization?.user.district
        : invitationData?.job.organization?.user.district
    );
  }, [jobDetail, invitationData]);

  const modalRef = useRef();
  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openModal &&
        /**
         * Alert if clicked on outside of element
         */
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

  return (
    <div
      className={`${
        openModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } modal-background`}
    >
      <div
        ref={modalRef}
        className={`${
          openModal ? 'translate-y-0' : '-translate-y-12'
        } modal-box max-w-[600px] h-[550px] overflow-auto hide-scrollbar`}
      >
        <div className="modal-box-header">
          <h1 className="font-medium text-lg">Job Detail</h1>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-7">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full border border-gray-300 shrink-0">
              <img
                src={
                  jobDetail
                    ? jobDetail?.organization?.user.avatar
                    : invitationData?.job.organization?.user.avatar
                }
                alt={
                  jobDetail
                    ? jobDetail?.organization?.user.avatar
                    : invitationData?.job.organization?.user.name
                }
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-blue-600 text-lg">
                {jobDetail ? jobDetail.position : invitationData?.job.position}
              </h1>
              <p className="text-xs mt-2">
                {jobDetail
                  ? jobDetail.organization?.user.name
                  : invitationData?.job.organization?.user.name}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <p className="font-medium mb-4">Job Overview</p>
            <div
              className="break-words text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: `${
                  jobDetail ? jobDetail.overview : invitationData?.job.overview
                }`,
              }}
            />
            <p className="font-medium mt-7 mb-4">Skills and Expertise</p>
            <div className="flex items-center gap-3 mb-7">
              {jobDetail ? (
                <>
                  {jobDetail.skills.map((item) => (
                    <p
                      key={item}
                      className="bg-gray-200 text-gray-600 text-xs px-3 py-2 rounded-full"
                    >
                      {item}
                    </p>
                  ))}
                </>
              ) : (
                <>
                  {invitationData?.job.skills.map((item) => (
                    <p
                      key={item}
                      className="bg-gray-200 text-gray-600 text-xs px-3 py-2 rounded-full"
                    >
                      {item}
                    </p>
                  ))}
                </>
              )}
            </div>
            <p className="font-medium mb-4">Requirements</p>
            <div
              className="break-words mb-7 list-disc ml-5"
              dangerouslySetInnerHTML={{
                __html: `${
                  jobDetail
                    ? jobDetail.requirements
                    : invitationData?.job.requirements
                }`,
              }}
            />
            <p className="mt-7 font-medium mb-4">Salary</p>
            <div className="flex items-center mb-7">
              <p className="font-semibold text-lg">
                {toCurrency(
                  jobDetail ? jobDetail.salary : invitationData?.job.salary
                )}
              </p>
              <p className="text-gray-500 text-xs">/month</p>
            </div>
            <p className="font-medium mb-4">Company Overview</p>
            <div
              className="text-sm leading-relaxed mb-3"
              dangerouslySetInnerHTML={{
                __html: `${
                  jobDetail
                    ? jobDetail?.organization?.description
                    : invitationData?.job.organization?.description
                }`,
              }}
            />
            <p className="font-medium mb-4 mt-7">Company Location</p>
            <p className="mb-3 text-sm">
              {province}, {city}, {district}
            </p>
            <p className="mb-7 text-sm">
              {jobDetail
                ? jobDetail.organization?.address
                : invitationData?.job.organization?.address}
              ,{' '}
              {jobDetail
                ? jobDetail.organization?.user.postalCode
                : invitationData?.job.organization?.user.postalCode}
            </p>
            <p className="font-medium mb-4">Estimated Company Total Employee</p>
            <p>
              {jobDetail
                ? jobDetail.organization?.totalEmployee
                : invitationData?.job.organization?.totalEmployee}{' '}
              people
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
