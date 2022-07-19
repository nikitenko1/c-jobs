import Category from './../../../models/Category';
import { isAuthenticated } from './../../../middlewares/auth';
import connectDB from './../../../libs/connectDB';

connectDB();

const Pagination = (req) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;
  return { page, skip, limit };
};

// For an API route to work, you need to export a function as default (a.k.a request handler),
// which then receives the following parameters:

// req: An instance of http.IncomingMessage, plus some pre-built middlewares
// res: An instance of http.ServerResponse, plus some helper functions

const handler = async (req, res) => {
  if (req.method !== 'GET')
    return res
      .status(405)
      .json({ msg: `${req.method} method is not allowed for this endpoint.` });

  const user = await isAuthenticated(req, res);
  if (!user) return;

  const { skip, limit } = Pagination(req);

  const categories = await Category.find()
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);
  const totalCategories = await Category.countDocuments();

  let totalPage = 0;
  if (categories.length === 0) totalPage = 0;
  else {
    if (totalCategories % limit === 0) {
      totalPage = totalCategories / limit;
    } else {
      totalPage = Math.floor(totalCategories / limit) + 1;
    }
  }

  return res.status(200).json({ categories, totalPage });
};

export default handler;
