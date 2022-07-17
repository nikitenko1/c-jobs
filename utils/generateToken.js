import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, `${process.env.ACCESS_TOKEN}`, {
    expiresIn: '7d',
  });
};

export const generateActivationToken = (payload) => {
  return jwt.sign(payload, `${process.env.ACTIVATION_TOKEN}`, {
    expiresIn: '30m',
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, `${process.env.REFRESH_TOKEN}`, {
    expiresIn: '30d',
  });
};
