import { Router } from 'express';
import LoginController from '../controller/login.controller';

const loginRoute = Router();

const login = new LoginController();

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

export default loginRoute;
