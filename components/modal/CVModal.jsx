import { useEffect, useRef } from 'react';
import PDFViewer from './../../utils/PDFViewer';

const CVModal = ({ openModal, setOpenModal, file }) => {
  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  const modalRef = useRef();
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
        } modal-box max-w-[700px] max-h-[550px] overflow-auto hide-scrollbar`}
      >
        <PDFViewer file={file} />
      </div>
    </div>
  );
};

export default CVModal;
