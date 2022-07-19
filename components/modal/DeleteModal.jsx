import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import DeleteImage from './../../public/images/delete.svg';

const DeleteModal = ({ openModal, setOpenModal, text, onSuccess }) => {
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
        } modal-box max-w-[500px] text-center p-7`}
      >
        <Image src={DeleteImage} alt="Let's work" />
        <h1 className="font-medium text-lg my-8">
          Are you sure want to delete this {text}?
        </h1>
        <div className="flex items-center gap-5 justify-center text-sm">
          <button
            onClick={onSuccess}
            className="bg-red-500 hover:bg-red-600 transition-[background] text-white rounded-md px-4 py-2"
          >
            Yes, delete it
          </button>
          <button
            onClick={() => setOpenModal(false)}
            className="bg-gray-200 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
