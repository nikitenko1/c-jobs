import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { MdCheck } from 'react-icons/md';
import { changeApplicantStatus } from './../../redux/slices/applicantSlice';
import HireModal from './../modal/HireModal';

const UserCard = ({ isApplicant, item, info }) => {
  return <div>UserCard</div>;
};

export default UserCard;
