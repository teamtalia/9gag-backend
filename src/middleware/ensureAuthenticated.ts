import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import authConfig from '../config/auth';
import TokenPayloadType from '../contracts/TokenPayloadType';

const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let response;
  const status = 500;
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');

  if (!authHeader) {
    res.status(401).json({ message: 'Token not provided.' });
  }
  try {
    const decoded = jwt.verify(token, authConfig.secret);
    req.token = decoded as TokenPayloadType;
    return next();
  } catch (e) {
    response = { message: 'Invalid token.' };
  }
  res.status(status).json(response);
};

export default ensureAuthenticated;
