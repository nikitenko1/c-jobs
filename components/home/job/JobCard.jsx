import { useRouter } from 'next/router';
import React from 'react';

const JobCard = ({ id }) => {
  const router = useRouter();
  return <div onClick={() => router.push(`/job/${id}`)}>JobCard</div>;
};

export default JobCard;
