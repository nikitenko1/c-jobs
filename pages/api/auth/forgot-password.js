import User from './../../../models/User';
import sendEmail from './../../../utils/sendMail';
import { generateAccessToken } from './../../../utils/generateToken';
import { authMsg } from './../../../utils/mailMsg';
import { validateEmail } from './../../../utils/validator';
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
      .json({ msg: `${req.method} method is not allowed for this endpoint.` });

  const { email } = req.body;
  if (!email)
    return res.status(400).json({ msg: 'Please fill in email address.' });

  if (!validateEmail(email))
    return res.status(400).json({ msg: 'Please fill in valid email address.' });

  const findUser = await User.findOne({ email });
  if (!findUser) return res.status(404).json({ msg: 'Email not found.' });

  const token = generateAccessToken({ email });
  const url = `${process.env.CLIENT_URL}/reset/${token}`;
  const emailMsg = authMsg('Reset Password', url);

  sendEmail(email, 'Reset Password', emailMsg);

  return res
    .status(200)
    .json({ msg: 'Reset password link has been sent to your email.' });
};

export default handler;
