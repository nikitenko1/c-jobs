import {
  authorizeRoles,
  isAuthenticated,
} from './../../../../middlewares/auth';
import Organization from './../../../../models/Organization';
import sendEmail from './../../../../utils/sendMail';
import { orgStatusMsg } from './../../../../utils/mailMsg';
import connectDB from './../../../../libs/connectDB';

connectDB();

// For an API route to work, you need to export a function as default (a.k.a request handler),
// which then receives the following parameters:

// req: An instance of http.IncomingMessage, plus some pre-built middlewares
// res: An instance of http.ServerResponse, plus some helper functions

const handler = async (req, res) => {
  // To handle different HTTP methods in an API route, you can use --> req.method in your request handler
  if (req.method !== 'PATCH')
    return res
      .status(405)
      .json({ msg: `${req.method} method not allowed for this endpoint.` });

  const user = await isAuthenticated(req, res);
  if (!user) return;

  const isAuthorize = await authorizeRoles(user._id, res, 'admin');
  if (!isAuthorize) return;

  const findOrganization = await Organization.findById(req.query.id).populate(
    'user'
  );
  if (!findOrganization)
    return res
      .status(404)
      .json({ msg: `Organization with ID ${req.query.id} not found.` });

  if (findOrganization.status === 'accepted')
    return res
      .status(400)
      .json({ msg: 'Organization has been accepted before.' });

  await Organization.findOneAndUpdate(
    { _id: req.query.id },
    { status: 'accepted' }
  );

  const emailMsg = orgStatusMsg('accept');
  sendEmail(
    findOrganization.user.email,
    'Organization Approval Status',
    emailMsg
  );

  return res.status(200).json({
    msg: `Organization with ID ${req.query.id} has been accepted successfully.`,
  });
};

export default handler;
