import { Request, Response, NextFunction } from 'express';
import AuthToken from '../token/token';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Not authorization' });
  const result = await AuthToken.authToken(authorization);

  if (result === false) return { status: 401, message: 'Token invalid!' };

  next();
};

export default verifyToken;
