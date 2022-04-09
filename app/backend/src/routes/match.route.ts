import { Router } from 'express';
import MatchController from '../controller/match.controller';

const matchRouter = Router();
const controller = new MatchController();

interface Ireq {
  query: {
    inProgress: string,
  }
}

matchRouter.get(
  '/matchs',
  async (req: Ireq, res) => {
    const { inProgress } = req.query;

    if (!inProgress) {
      const result = await controller.getAll();
      return res.json(result);
    }

    const resultQUery = await controller.getQueryString(inProgress);
    res.json(resultQUery);
  },
);

export default matchRouter;
