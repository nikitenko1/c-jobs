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
          <JobCard
            id={item._id}
            key={item._id}
            logo={item.organization?.user.avatar}
            organization={item.organization?.user.name}
            province={`${item.organization?.user.province}`}
            city={`${item.organization?.user.city}`}
            description={item.overview}
            title={item.position}
            salary={item.salary}
            salaryType="month"
            type={item.employmentType}
          />
        ))}
      </div>
      <Link href="/jobs">
        <a className="bg-white m-auto block w-fit mt-20 px-10 py-2 border-2 rounded-full border-blue-600 text-blue-600">
          Find More Jobs
        </a>
      </Link>
    </div>
  );
};

export default JobContainer;
