import { Router } from 'express';
import controller from '../controller/leaderBoard.controller';

const leaderBoardRouter = Router();

leaderBoardRouter.get(
  '/leaderboard/',
  async (_req, res) => {
    const result = await controller.getLeaderAll();
    res.json(result);
  },
);

leaderBoardRouter.get(
  '/leaderboard/home',
  async (_req, res) => {
    const result = await controller.getLeaderHome();
    res.json(result);
  },
);

leaderBoardRouter.get(
  '/leaderboard/Away',
  async (_req, res) => {
    const result = await controller.getLeaderAway();
    res.json(result);
  },
);

export default leaderBoardRouter;
