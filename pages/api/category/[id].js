import Category from './../../../models/Category';
import { authorizeRoles, isAuthenticated } from './../../../middlewares/auth';
import connectDB from './../../../libs/connectDB';

connectDB();
// For an API route to work, you need to export a function as default (a.k.a request handler),
// which then receives the following parameters:

// req: An instance of http.IncomingMessage, plus some pre-built middlewares
// res: An instance of http.ServerResponse, plus some helper functions

const handler = async (req, res) => {
  const user = await isAuthenticated(req, res);
  if (!user) return;

  const isAuthorize = await authorizeRoles(user._id, res, 'admin');
  if (!isAuthorize) return;

  const categoryId = req.query.id;
  const findCategory = await Category.findById(categoryId);

  if (!findCategory)
    return res
      .status(404)
      .json({ msg: `Category with ID ${categoryId} not found.` });

  switch (req.method) {
    case 'PATCH':
      const { name, image } = req.body;
      if (!name || !image)
        return res
          .status(400)
          .json({ msg: 'Please provide category name and image.' });

      const updatedCategory = await Category.findOneAndUpdate(
        { _id: categoryId },
        { name, image },
        { new: true }
      );

      return res.status(200).json({
        msg: 'Category has been updated successfully.',
        category: updatedCategory,
      });
    case 'DELETE':
      await Category.findOneAndDelete({ _id: categoryId });

      return res
        .status(200)
        .json({ msg: 'Category has been deleted successfully.' });
    default:
      return res
        .status(405)
        .json({ msg: `${req.method} method is not allowed for this endpoint` });
  }
};

export default handler;
