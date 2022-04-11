import { Router } from 'express';
import verifyToken from '../middleware/verifyToken';
import MatchController from '../controller/match.controller';
import finishMatch from '../middleware/match';

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

matchRouter.post(
  '/matchs',
  verifyToken,
  async (req, res, next) => {
    const { body } = req;
    const result = await controller.validateEqualsTeams(body);
    if (result !== true) return res.status(result.status).json({ message: result.message });

    next();
  },

  async (req, res, next) => {
    const { body } = req;
    const result = await controller.validateExistsClub(body);
    if (result !== true) return res.status(result.status).json({ message: result.message });

    next();
  },

  async (req, res) => {
    const { body } = req;
    const result = await controller.createMatch(body);
    res.status(201).json(result);
  },
);

matchRouter.patch(
  '/matchs/:id/finish',
  verifyToken,
  finishMatch,
);

matchRouter.patch(
  '/matchs/:id',
  verifyToken,
  async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    await controller.editMatch(Number(id), body);
    res.json({ message: 'Editado com sucesso!' });
  },
);

export default matchRouter;
