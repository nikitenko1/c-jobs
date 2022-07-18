import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useSelector } from 'react-redux';

const OrganizationDetailModal = ({
  openModal,
  setOpenModal,
  selectedOrganization,
}) => {
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const { auth } = useSelector((state) => state);

  useEffect(() => {
    if (auth.accessToken) {
      setProvince(auth.user.province);
      setCity(auth.user.city);
      setDistrict(auth.user.district);
    }
  }, [auth]);

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
        } modal-box max-w-[609px] h-[600px] overflow-auto hide-scrollbar`}
      >
        <div className="modal-box-header">
          <h1 className="font-medium text-lg">Organization Detail</h1>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-7">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border border-gray-300 shadow-xl shrink-0">
              <img
                src={selectedOrganization.user?.avatar}
                alt={selectedOrganization.user?.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-medium text-lg">
                {selectedOrganization.user?.name}
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                {province}, {city}, {district},{' '}
                {selectedOrganization.user?.postalCode}
              </p>
            </div>
          </div>
          <div className="mt-7">
            <h1 className="font-medium text-lg mb-3">Description</h1>
            <div
              className="text-sm text-gray-600 leading-loose break-words"
              dangerouslySetInnerHTML={{
                __html: selectedOrganization.description,
              }}
            />
          </div>
          <div className="mt-7">
            <h1 className="font-medium text-lg mb-3">Address</h1>
            <p>{selectedOrganization.address}</p>
          </div>
          <div className="mt-7">
            <h1 className="font-medium text-lg mb-3">Phone Number</h1>
            <p>{selectedOrganization.phoneNumber}</p>
          </div>
          <div className="mt-7">
            <h1 className="font-medium text-lg mb-3">
              Estimated Total Employee
            </h1>
            <p>&plusmn; {selectedOrganization.totalEmployee} people</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailModal;
