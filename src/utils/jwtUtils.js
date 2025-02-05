import jwt from 'jsonwebtoken';

const secretKey = 'minamabe';

export const createToken = (user) => {
  return jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};
