import Category from './../../../models/Category';
import { authorizeRoles, isAuthenticated } from './../../../middlewares/auth';
import connectDB from './../../../libs/connectDB';

connectDB();

// For an API route to work, you need to export a function as default (a.k.a request handler),
// which then receives the following parameters:

// req: An instance of http.IncomingMessage, plus some pre-built middlewares
// res: An instance of http.ServerResponse, plus some helper functions

const handler = async (req, res) => {
  // To handle different HTTP methods in an API route, you can use --> req.method in your request handler
  if (req.method !== 'POST')
    return res
      .status(405)
      .json({ msg: `${req.method} method is not alloewd for this endpoint.` });

  const user = await isAuthenticated(req, res);
  if (!user) return;

  const isAuthorize = await authorizeRoles(user._id, res, 'admin');
  if (!isAuthorize) return;

  const { name, image } = req.body;
  if (!name || !image)
    return res
      .status(400)
      .json({ msg: 'Please provide category name and image.' });

  const findCategory = await Category.findOne({ name });
  if (findCategory)
    return res.status(400).json({ msg: `${name} category already exists.` });

  const newCategory = new Category({ name, image });
  await newCategory.save();

  return res.status(200).json({
    msg: `${name} category has been created successfully.`,
    category: newCategory,
  });
};

export default handler;
