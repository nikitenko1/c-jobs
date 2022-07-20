import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { createJob, updateJob } from './../../redux/slices/jobSlice';
import { getDataAPI } from './../../utils/fetchData';
import Editor from './../../utils/Editor';
import Loader from './../global/Loader';

const CreateJobModal = ({ openModal, setOpenModal, selectedItem }) => {
  const [skills, setSkills] = useState([]);
  const [description, setDescription] = useState('');
  const [requirement, setRequirement] = useState('');
  const [position, setPosition] = useState('');
  const [jobLevel, setJobLevel] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [salary, setSalary] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryData, setCategoryData] = useState([]);

  const dispatch = useDispatch();
  const { auth, alert } = useSelector((state) => state);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!position) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in job position.' },
      });
    }

    if (!jobLevel) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in job level.' },
      });
    }

    if (!employmentType) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in employment type.' },
      });
    }

    if (skills.length < 1) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in at least 1 skill.' },
      });
    }

    if (salary < 1000) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Salary should be at least USD 1.000' },
      });
    }

    if (!description) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in job overview.' },
      });
    }

    if (description.length < 100) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Job overview should be at least 100 characters.' },
      });
    }

    if (!requirement) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in job requirement.' },
      });
    }

    if (keywords.length < 1) {
      return dispatch({
        type: 'alert/alert',
        payload: { error: 'Please fill in at least 1 keyword.' },
      });
    }

    setLoading(true);

    if (Object.keys(selectedItem).length > 0) {
      await dispatch(
        updateJob({
          position,
          jobLevel,
          category,
          employmentType,
          skills,
          keywords,
          salary,
          requirements: requirement,
          overview: description,
          token: `${auth.accessToken}`,
          id: `${selectedItem._id}`,
        })
      );
    } else {
      await dispatch(
        createJob({
          position,
          jobLevel,
          category,
          employmentType,
          skills,
          keywords,
          salary,
          requirements: requirement,
          overview: description,
          token: `${auth.accessToken}`,
        })
      );
    }
    setLoading(false);
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getDataAPI('category/organization', auth.accessToken);
      setCategoryData(res.data.categories);
    };

    fetchCategory();
  }, [auth]);

  useEffect(() => {
    if (Object.keys(selectedItem).length > 0) {
      setSkills(selectedItem.skills);
      setDescription(selectedItem.overview);
      setRequirement(selectedItem.requirements);
      setPosition(selectedItem.position);
      setJobLevel(selectedItem.jobLevel);
      setEmploymentType(selectedItem.employmentType);
      setSalary(selectedItem.salary);
      setKeywords(selectedItem.keywords);
      setCategory(selectedItem.category);
    }

    return () => {
      setSkills([]);
      setDescription('');
      setRequirement('');
      setPosition('');
      setJobLevel('');
      setEmploymentType('');
      setSalary(0);
      setKeywords([]);
      setCategory('');
    };
  }, [selectedItem]);

  const handleRemoveSkill = (idx) => {
    const skillCopy = [...skills];
    skillCopy.splice(idx, 1);
    setSkills(skillCopy);
  };

  const handleRemoveKeyword = (idx) => {
    const keywordCopy = [...keywords];
    keywordCopy.splice(idx, 1);
    setKeywords(keywordCopy);
  };

  const handleChangeKeywords = (e) => {
    if (e.key === ',' && e.target.value !== ',') {
      const val = e.target.value;
      if (keywords.includes(val.substring(0, val.length - 1)))
        e.target.value = '';
      else {
        setKeywords([...keywords, val.substring(0, val.length - 1)]);
        e.target.value = '';
      }
    }
  };

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
          <h1 className="font-medium text-lg">
            {Object.keys(selectedItem).length > 0 ? 'Edit Job' : 'Create Job'}
          </h1>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="position" className="text-sm">
                Position
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="outline-0 border border-gray-300 mt-3 text-sm rounded-md w-full px-2 h-10"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="category" className="text-sm">
                Category
              </label>
              <select
                name="category"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="outline-0 border border-gray-300 mt-3 text-sm rounded-md w-full px-2 h-10 bg-white"
              >
                <option value="">- Category -</option>
                {categoryData.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="jobLevel" className="text-sm">
                Job Level
              </label>
              <select
                name="jobLevel"
                id="jobLevel"
                value={jobLevel}
                onChange={(e) => setJobLevel(e.target.value)}
                className="outline-0 border border-gray-300 mt-3 text-sm rounded-md w-full px-2 h-10 bg-white"
              >
                <option value="">- Job Level -</option>
                <option value="internship">Internship</option>
                <option value="entryLevel">Entry Level / Junior</option>
                <option value="associate">Associate / Supervisor</option>
                <option value="manager">Mid-Senior Level / Manager</option>
                <option value="director">Director / Executive</option>
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="employmentType" className="text-sm">
                Employment Type
              </label>
              <select
                name="employmentType"
                id="employmentType"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="outline-0 border border-gray-300 mt-3 text-sm rounded-md w-full px-2 h-10 bg-white"
              >
                <option value="">- Employment Type -</option>
                <option value="fullTime">Full Time</option>
                <option value="partTime">Part TIme</option>
                <option value="freelance">Freelance</option>
                <option value="contractual">Contractual</option>
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="skills" className="text-sm">
                Skills Required (Separate with comma (,))
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
            <div className="mb-6">
              <label htmlFor="salary" className="text-sm">
                Salary
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={salary}
                onChange={(e) => setSalary(parseInt(e.target.value))}
                className="outline-0 border border-gray-300 mt-3 rounded-md w-full text-sm px-2 h-10"
                min={1}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="text-sm">
                Job Overview
              </label>
              <Editor content={description} setContent={setDescription} />
            </div>
            <div className="mb-6">
              <label htmlFor="requirement" className="text-sm">
                Requirements
              </label>
              <Editor content={requirement} setContent={setRequirement} />
            </div>
            <div className="mb-6">
              <label htmlFor="skills" className="text-sm">
                Keywords (Separate with comma (,))
              </label>
              <div className="border border-gray-300 mt-3 rounded-md flex items-center px-2 min-h-20 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap my-2">
                  {keywords.map((item, idx) => (
                    <div
                      key={item}
                      className="rounded-md bg-gray-100 px-3 py-1 flex items-center gap-2 break-words"
                    >
                      <p className="text-sm">{item}</p>
                      <div className="bg-gray-300 text-gray-600 w-fit rounded-full p-1 cursor-pointer">
                        <AiOutlineClose
                          onClick={() => handleRemoveKeyword(idx)}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  onKeyUp={(e) => handleChangeKeywords(e)}
                  className="outline-0 text-sm w-full px-2 h-10 flex-1"
                />
              </div>
            </div>
            <div className="flex items-center gap-5 justify-center text-sm">
              <button
                className={`${
                  alert.loading
                    ? 'bg-gray-200 hover:bg-gray-200 cursor-auto'
                    : 'bg-blue-500 hover:bg-blue-700 cursor-pointer'
                } transition-[background] text-sm w-full py-3 text-white rounded-md mt-7`}
              >
                {loading ? (
                  <Loader />
                ) : Object.keys(selectedItem).length > 0 ? (
                  'Save Changes'
                ) : (
                  'Post Job'
                )}
              </button>
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="bg-gray-200 hover:bg-gray-400 transition-[background] text-sm w-full py-3 text-blue-600 rounded-md mt-7"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobModal;
