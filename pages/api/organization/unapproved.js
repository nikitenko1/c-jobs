import { authorizeRoles, isAuthenticated } from './../../../middlewares/auth';
import Organization from './../../../models/Organization';
import connectDB from './../../../libs/connectDB';

const Pagination = (req) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;
  return { page, skip, limit };
};

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
      .json({ msg: `${req.method} method not allowed for this endpoint.` });

  const user = await isAuthenticated(req, res);
  if (!user) return;

  const isAuthorize = await authorizeRoles(user._id, res, 'admin');
  if (!isAuthorize) return;

  const { skip, limit } = Pagination(req);

  //   const organizationSchema = new mongoose.Schema(
  //     {user: {
  //         type: mongoose.Types.ObjectId,
  //         ref: 'user',
  //         required: true,
  //        },
  //      status: {
  //         type: String,
  //         default: 'on review',
  //       },

  const unapprovedOrganization = await Organization.find({
    status: { $ne: 'accepted' },
  })
    .populate('user')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const totalOrganizations = await Organization.countDocuments();
  let totalPage = 0;

  if (unapprovedOrganization.length === 0) totalPage = 0;
  else {
    if (totalOrganizations % limit === 0) {
      totalPage = totalOrganizations / limit;
    } else {
      totalPage = Math.floor(totalOrganizations / limit) + 1;
    }
  }
  return res
    .status(200)
    .json({ organizations: unapprovedOrganization, totalPage });
};

export default handler;
