import Job from './../../../models/Job';
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

  const latestJob = await Job.aggregate([
    //   const jobSchema = new mongoose.Schema({
    //     organization: {
    //       type: mongoose.Types.ObjectId,
    //       ref: 'organization',
    //       required: true,
    //     },
    //     category: {
    //       type: mongoose.Types.ObjectId,
    //       ref: 'category',
    //       required: true,
    //     },
    //   });
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
              pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$user_id'] } } }],
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
    { $limit: 8 },
  ]);

  const categoryDisplay = await Job.aggregate([
    {
      //   const jobSchema = new mongoose.Schema({
      //     category: {
      //       type: mongoose.Types.ObjectId,
      //       ref: 'category',
      //       required: true,
      //     },
      //   });
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $group: {
        _id: '$category._id',
        name: { $first: '$category.name' },
        image: { $first: '$category.image' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        count: 1,
        image: 1,
        name: 1,
      },
    },
    { $limit: 8 },
  ]);

  return res.status(200).json({
    latestJob,
    categoryDisplay,
  });
};

export default handler;
