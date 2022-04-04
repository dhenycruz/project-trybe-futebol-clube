import { Router } from 'express';
import ClubController from '../controller/club.controller';

const clubRouter = Router();
const controller = new ClubController();

clubRouter.get(
  '/clubs',
  async (_req, res) => {
    const result = await controller.getAll();
    res.json(result);
  },
);

export default clubRouter;
