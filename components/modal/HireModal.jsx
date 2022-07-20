import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { sendInvitation } from './../../redux/slices/invitationSlice';
import Loader from './../global/Loader';

const HireModal = ({ openModal, setOpenModal, userName, id, job }) => {
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
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

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!position) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please provide job position.' },
      });
    }

    setLoading(true);
    await dispatch(
      sendInvitation({
        jobId: position,
        userId: id,
        token: `${auth.accessToken}`,
      })
    );
    setLoading(false);
  };

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
        } modal-box max-w-[500px] max-h-[600px] overflow-auto hide-scrollbar`}
      >
        <div className="modal-box-header">
          <h1 className="text-lg font-medium">Hire {userName} As</h1>
          <AiOutlineClose
            className="cursor-auto"
            onClick={() => setOpenModal(false)}
          />
        </div>
        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <select
              name="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full h-10 px-2 rounded-md bg-white border border-gray-300 text-sm"
            >
              <option value="">- Select Position -</option>
              {job.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.position}
                </option>
              ))}
            </select>
            <button
              className={`${
                loading
                  ? 'bg-gray-200 hover:bg-gray-200 cursor-auto'
                  : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
              } transition-[background] w-full py-3 text-sm rounded-md mt-8 text-white`}
            >
              {loading ? <Loader /> : 'Send Invitation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HireModal;
