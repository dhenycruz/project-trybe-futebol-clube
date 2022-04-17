import { Router } from 'express';
import login from '../controller/login.controller';

const loginRoute = Router();

loginRoute.post(
  '/login',
  async (req, res, next) => {
    const { email } = req.body;
    const result = login.verifyEmail(email);

    if (result !== true) return res.status(result.status).json({ message: result.message });

    next();
  },
  (req, res, next) => {
    const { password } = req.body;
    const result = login.verifyPassword(password);

    if (result !== true) return res.status(result.status).json({ message: result.message });
    next();
  },
  async (req, res) => {
    const { email, password } = req.body;
    const result = await login.logining(email, password);
    res.status(200).json(result);
  },
);

loginRoute.get('/login/validate', async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'No authorization!' });

  const result = await login.validateLogin(authorization);
  res.json(result);
});

export default loginRoute;
