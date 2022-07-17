import { generateAccessToken } from './../../../utils/generateToken';
import jwt from 'jsonwebtoken';
import User from './../../../models/User';
import connectDB from './../../../libs/connectDB';

connectDB();
// For an API route to work, you need to export a function as default (a.k.a request handler),
// which then receives the following parameters:

// req: An instance of http.IncomingMessage, plus some pre-built middlewares
// res: An instance of http.ServerResponse, plus some helper functions

const handler = async (req, res) => {
  try {
    // To handle different HTTP methods in an API route, you can use --> req.method in your request handler
    if (req.method !== 'GET')
      return res.status(405).json({
        msg: `${req.method} method is not allowed for this endpoint.`,
      });

    const { jobseek_rfToken: token } = req.cookies;
    if (!token) return res.status(401).json({ msg: 'Invalid authentication.' });

    const decoded = jwt.verify(token, `${process.env.REFRESH_TOKEN_SECRET}`);
    if (!decoded.id)
      return res.status(401).json({ msg: 'Invalid authentication.' });

    const user = await User.findById(decoded.id);
    const accessToken = generateAccessToken({ id: user._id });

    return res.status(200).json({
      accessToken,
      user: {
        ...user._doc,
        password: '',
      },
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export default handler;
