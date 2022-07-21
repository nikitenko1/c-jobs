import Job from './../../../models/Job';
import connectDB from './../../../libs/connectDB';

connectDB();

// For an API route to work, you need to export a function as default (a.k.a request handler),
// which then receives the following parameters:

// req: An instance of http.IncomingMessage, plus some pre-built middlewares
// res: An instance of http.ServerResponse, plus some helper functions

const handler = async (req, res) => {
  if (req.method !== 'GET')
    return res
      .status(405)
      .json({ msg: `${req.method} method is not allowed for this endpoint.` });

  const latestJob = await Job.aggregate([
    {
      $lookup: {
        from: 'organizations',
        let: { org_id: '$organization' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$org_id'] } } },
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
