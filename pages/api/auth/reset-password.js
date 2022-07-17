import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './../../../models/User';
import connectDB from './../../../libs/connectDB';

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
      .json({ msg: `${req.method} method is not allowed for this endpoint.` });

  const { token, password } = req.body;
  if (!token)
    return res.status(400).json({ msg: 'Invalid reset password token.' });

  if (!password)
    return res.status(400).json({ msg: 'Please fill in new password.' });

  if (password.length < 8)
    return res
      .status(400)
      .json({ msg: 'Password should be at least 8 characters.' });

  const decoded = jwt.verify(token, `${process.env.ACCESS_TOKEN}`);
  if (!decoded.email)
    return res.status(400).json({ msg: 'Invalid reset password token.' });

  const findUser = await User.findOne({ email: decoded.email });
  if (!findUser) return res.status(404).json({ msg: 'User not found.' });

  const passwordHash = await bcrypt.hash(password, 12);

  await User.findOneAndUpdate(
    { email: decoded.email },
    { password: passwordHash }
  );

  return res.status(200).json({ msg: 'Password has been reset successfully.' });
};

export default handler;
