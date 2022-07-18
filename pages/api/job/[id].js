import Job from './../../../models/Job';
import { authorizeRoles, isAuthenticated } from './../../../middlewares/auth';
import mongoose from 'mongoose';
import connectDB from './../../../libs/connectDB';

connectDB();

// For an API route to work, you need to export a function as default (a.k.a request handler),
// which then receives the following parameters:

// req: An instance of http.IncomingMessage, plus some pre-built middlewares
// res: An instance of http.ServerResponse, plus some helper functions

const handler = async (req, res) => {
  const jobId = req.query.id;
  let user;
  let isAuthorize;
  switch (req.method) {
    case 'GET':
      const job = await Job.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(jobId) } },
        //   const jobSchema = new mongoose.Schema({
        //     organization: {
        //       type: mongoose.Types.ObjectId,
        //       ref: 'organization',
        //       required: true,
        //     },
        {
          $lookup: {
            from: 'organizations',
            let: { org_id: '$organization' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$org_id'] } } },
              //   const organizationSchema = new mongoose.Schema(
              //   {
              //  user: {
              //  type: mongoose.Types.ObjectId,
              //  ref: 'user',
              //  required: true,
              // },})
              {
                $lookup: {
                  from: 'users',
                  let: { user_id: '$user' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
                    {
                      $project: {
                        name: 1,
                        avatar: 1,
                        province: 1,
                        city: 1,
                        district: 1,
                        postalCode: 1,
                      },
                    },
                  ],
                  as: 'user',
                },
              },
              { $unwind: '$user' },
            ],
            as: 'organization',
          },
        },
      ]);
      if (job.length === 0)
        return res.status(404).json({ msg: `Job with ID ${jobId} not found.` });
      return res.status(200).json({ job });

    case 'DELETE':
      user = await isAuthenticated(req, res);
      if (!user) return;

      isAuthorize = await authorizeRoles(user._id, res, 'organization');
      if (!isAuthorize) return;

      const deletedJob = await Job.findOneAndDelete({ _id: jobId });
      if (!deletedJob)
        return res.status(404).json({ msg: `Job with ID ${jobId} not found.` });

      return res
        .status(200)
        .json({ msg: 'Job has been deleted successfully.' });

    case 'PATCH':
      user = await isAuthenticated(req, res);
      if (!user) return;

      isAuthorize = await authorizeRoles(user._id, res, 'organization');
      if (!isAuthorize) return;

      const {
        position,
        employmentType,
        jobLevel,
        category,
        skills,
        salary,
        overview,
        requirements,
        keywords,
      } = req.body;
      if (
        !position ||
        !employmentType ||
        !category ||
        !jobLevel ||
        skills.length < 1 ||
        salary < 1 ||
        !overview ||
        !requirements ||
        keywords.length < 1
      )
        return res
          .status(400)
          .json({ msg: 'Please fill in every field in form to create job.' });

      if (overview.length < 100)
        return res
          .status(400)
          .json({ msg: 'Job overview should be at least 100 characters.' });

      const updatedJob = await Job.findOneAndUpdate(
        { _id: jobId, organization: isAuthorize._id },
        {
          position,
          jobLevel,
          employmentType,
          category,
          skills,
          salary,
          overview,
          requirements,
          keywords,
        },
        { new: true }
      );
      if (!updatedJob)
        return res.status(404).json({
          msg: `Job with ID ${jobId} not found within your organization.`,
        });

      return res.status(200).json({
        msg: 'Job has been updated successfully.',
        job: updatedJob,
      });

    default:
      // To handle different HTTP methods in an API route, you can use --> req.method in your request handler
      return res.status(405).json({
        msg: `${req.method} method is not allowed for this endpoint.`,
      });
  }
};

export default handler;
