import Job from './../../../../models/Job';
import JobsApplied from './../../../../models/JobsApplied';
import {
  authorizeRoles,
  isAuthenticated,
} from './../../../../middlewares/auth';
import mongoose from 'mongoose';
import connectDB from './../../../../libs/connectDB';

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

  const isAuthorize = await authorizeRoles(user._id, res, 'organization');
  if (!isAuthorize) return;

  const findJob = await Job.findOne({
    organization: isAuthorize._id,
    _id: req.query.id,
  });
  if (!findJob)
    return res.status(404).json({
      msg: `Job with ID ${req.query.id} not found within this organization`,
    });

  const applicants = await JobsApplied.aggregate([
    { $match: { job: new mongoose.Types.ObjectId(`${req.query.id}`) } },
    //   const jobsAppliedSchema = new mongoose.Schema(
    //   {
    //     job: {
    //       type: mongoose.Types.ObjectId,
    //       ref: 'job',
    //       required: true,
    //     },
    //     jobseeker: {
    //       type: mongoose.Types.ObjectId,
    //       ref: 'jobseeker',
    //       required: true,
    //     }
    {
      $lookup: {
        from: 'jobseekers',
        let: { jobseeker_id: '$jobseeker' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$jobseeker_id'] } } },
          {
            // const jobseekerSchema = new mongoose.Schema(
            //     {
            //    user: {
            //    type: mongoose.Types.ObjectId,
            //    ref: 'user',
            //    required: true,
            //     },
            $lookup: {
              from: 'users',
              let: { user_id: '$user' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
                { $project: { name: 1, avatar: 1, createdAt: 1, province: 1 } },
              ],
              as: 'user',
            },
          },
          { $unwind: '$user' },
        ],
        as: 'jobseeker',
      },
    },
    { $unwind: '$jobseeker' },
  ]);

  return res.status(200).json({ applicants });
};

export default handler;
