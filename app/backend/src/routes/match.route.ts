import { Router } from 'express';
import MatchController from '../controller/match.controller';

const matchRouter = Router();
const controller = new MatchController();

matchRouter.get(
  '/matchs',
  async (_req, res) => {
    const result = await controller.getAll();
    res.json(result);
  },
);

export default matchRouter;
