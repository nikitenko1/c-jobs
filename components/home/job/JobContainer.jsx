import Link from 'next/link';
import JobCard from './JobCard';

const JobContainer = ({ jobs }) => {
  return (
    <div className="py-20 md:px-16 px-8">
      <h1 className="text-4xl md:text-3xl font-medium text-center mb-12">
        <span className="text-blue-600">Latest</span> Jobs
      </h1>
      <div>
        {jobs.map((item) => (
          <JobCard id={item._id} key={item._id} />
        ))}
      </div>
    </div>
  );
};

export default JobContainer;
