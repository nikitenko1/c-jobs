import { useRouter } from 'next/router';
import { toCurrency } from './../../../utils/toCurrency';

const JobCard = ({
  id,
  logo,
  organization,
  province,
  city,
  title,
  type,
  description,
  salary,
  salaryType,
}) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/job/${id}`)}
      className="hover:border-2 border hover:border-blue-600 border-gray-200 shadow-md p-5 hover:bg-gray-200 rounded-md transition-[transform] cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full border border-gray-300 shrink-0">
          <img
            src={logo}
            alt={organization}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-medium">{organization}</h1>
          <p className="mt-2 text-xs text-gray-500">
            {province}, {city}
          </p>
        </div>
      </div>
      <div className="mb-10 mt-6">
        <h1 className="font-semibold text-xl">{title}</h1>
        <p className="font-medium text-gray-500 text-sm mt-1">
          {type === 'fullTime'
            ? 'Full Time'
            : type === 'partTime'
            ? 'Part Time'
            : type === 'freelance'
            ? 'Freelance'
            : 'Contractual'}
        </p>
        <div
          className="mt-3 text-gray-400 text-sm"
          dangerouslySetInnerHTML={{ __html: description.slice(0, 30) + '...' }}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p className="font-semibold text-xl">{toCurrency(salary)}</p>
          <sub className="text-xs text-gray-500 font-medium">/{salaryType}</sub>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
