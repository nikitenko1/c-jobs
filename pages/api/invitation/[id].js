import { authorizeRoles, isAuthenticated } from './../../../middlewares/auth';
import Invitation from './../../../models/Invitation';
import connectDB from './../../../libs/connectDB';

connectDB();

// For an API route to work, you need to export a function as default (a.k.a request handler),
// which then receives the following parameters:

// req: An instance of http.IncomingMessage, plus some pre-built middlewares
// res: An instance of http.ServerResponse, plus some helper functions

const handler = async (req, res) => {
  if (req.method !== 'PATCH')
    return res
      .status(405)
      .json({ msg: `${req.method} method is not allowed for this endpoint.` });

  const user = await isAuthenticated(req, res);
  if (!user) return;

  const isAuthorize = await authorizeRoles(user._id, res, 'jobseeker');
  if (!isAuthorize) return;

  const { status } = req.body;
  if (!status)
    return res
      .status(400)
      .json({ msg: 'Please provide new status for the invitation.' });

  const findInvitation = await Invitation.findOne(
    { _id: req.query.id },
    { status: 'on review' }
  );
  if (!findInvitation)
    return res.status(404).json({ msg: `Invitation not found.` });

  await Invitation.findOneAndUpdate({ _id: req.query.id }, { status });

  return res
    .status(200)
    .json({ msg: `Invitation status has been ${status} successfully.` });
};

export default handler;
