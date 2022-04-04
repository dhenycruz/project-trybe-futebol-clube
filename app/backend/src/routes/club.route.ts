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

clubRouter.get(
  '/clubs/:id',
  async (req, res) => {
    const { id } = req.params;
    const result = await controller.get(Number(id));
    if (!result) return res.status(404).send('Club Not Found');
    res.json(result);
  },
);

export default clubRouter;
