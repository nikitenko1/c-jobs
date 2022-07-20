import Job from './../../../models/Job';
import { authorizeRoles, isAuthenticated } from '../../../middlewares/auth';
import connectDB from './../../../libs/connectDB';

connectDB();

// For an API route to work, you need to export a function as default (a.k.a request handler),
// which then receives the following parameters:

// req: An instance of http.IncomingMessage, plus some pre-built middlewares
// res: An instance of http.ServerResponse, plus some helper functions

const handler = async (req, res) => {
  const user = await isAuthenticated(req, res);
  if (!user) return;

  const isAuthorize = await authorizeRoles(user._id, res, 'organization');
  if (!isAuthorize) return;

  const position = await Job.aggregate([
    { $match: { organization: isAuthorize._id } },
    // const jobSchema = new mongoose.Schema(
    //   {
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
          // const organizationSchema = new mongoose.Schema(
          //   {
          //     user: {
          //       type: mongoose.Types.ObjectId,
          //       ref: 'user',
          //       required: true,
          //     },
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
    { $unwind: '$organization' },
    { $sort: { createdAt: -1 } },
  ]);

  return res.status(200).json({ position });
};

export default handler;
