import Jobseeker from './../../../models/Jobseeker';
import JobsApplied from './../../../models/JobsApplied';
import { authorizeRoles, isAuthenticated } from './../../../middlewares/auth';
import connectDB from './../../../libs/connectDB';

connectDB();
// For an API route to work, you need to export a function as default (a.k.a request handler),
// which then receives the following parameters:

// req: An instance of http.IncomingMessage, plus some pre-built middlewares
// res: An instance of http.ServerResponse, plus some helper functions

const handler = async (req, res) => {
  // To handle different HTTP methods in an API route, you can use --> req.method in your request handler
  if (req.method !== 'GET')
    return res
      .status(405)
      .json({ msg: `${req.method} method is not allowed for this endpoint.` });

  const user = await isAuthenticated(req, res);
  if (!user) return;

  const isAuthorize = await authorizeRoles(user._id, res, 'jobseeker');
  if (!isAuthorize) return;

  const findJobseeker = await Jobseeker.findOne({ user: user._id });

  const jobs = await JobsApplied.aggregate([
    // const jobsAppliedSchema = new mongoose.Schema(
    //     {
    //       job: {
    //         type: mongoose.Types.ObjectId,
    //         ref: 'job',
    //         required: true,
    //       },
    //       jobseeker: {
    //         type: mongoose.Types.ObjectId,
    //         ref: 'jobseeker',
    //         required: true,
    //       },
    { $match: { jobseeker: findJobseeker._id } },
    {
      $lookup: {
        from: 'jobs',
        let: { job_id: '$job' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$job_id'] } } },
          {
            // const jobSchema = new mongoose.Schema(
            //     {
            //       organization: {
            //         type: mongoose.Types.ObjectId,
            //         ref: 'organization',
            //         required: true,
            //       },
            $lookup: {
              from: 'organizations',
              let: { org_id: '$organization' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$org_id'] } } },
                {
                  $lookup: {
                    from: 'users',
                    let: { user_id: '$user' },
                    pipeline: [
                      { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
                    ],
                    as: 'user',
                  },
                },
                { $unwind: '$user' },
              ],
              as: 'organization',
            },
          },
          { $unwind: '$organization' },
        ],
        as: 'job',
      },
    },
    { $unwind: '$job' },
  ]);
  return res.status(200).json({ jobs });
};

export default handler;
