import { isAuthenticated } from './../../../middlewares/auth';
import Jobseeker from './../../../models/Jobseeker';
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
      .json({ msg: `${req.method} method is not allowed for this endpoint` });

  const user = await isAuthenticated(req, res);
  if (!user) return;

  const jobseeker = await Jobseeker.findOne({ user: req.query.id }).populate(
    'user'
  );
  if (!jobseeker)
    return res
      .status(404)
      .json({ msg: `Jobseeker with user ID ${req.query.id} not found.` });

  return res.status(200).json({ jobseeker });
};

export default handler;
