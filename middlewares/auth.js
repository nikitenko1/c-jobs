const jwt = require('jsonwebtoken');
import User from './../models/User';
import Organization from '../models/Organization';
import Jobseeker from '../models/Jobseeker';

export const isAuthenticated = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: 'Invalid authentication.' });

  const decoded = jwt.verify(token, `${process.env.ACCESS_TOKEN}`);
  if (!decoded.id)
    return res.status(401).json({ msg: 'Invalid authentication.' });

  const user = await User.findById(decoded.id);
  if (!user) return res.status(401).json({ msg: 'Invalid authentication.' });

  return user;
};

export const authorizeRoles = async (userId, res, ...roles) => {
  const user = await User.findById(userId);
  if (!roles.includes(user.role)) {
    return res.status(403).json({
      msg: `User with account type ${user.role} cannot access to this page.`,
    });
  }
  let userDetail;
  if (user.role === 'organization') {
    userDetail = await Organization.findOne({ user: userId }).populate('user');
    return userDetail;
  } else if (user.role === 'jobseeker') {
    userDetail = await Jobseeker.findOne({ user: userId }).populate('user');
    return userDetail;
  }

  return true;
};
