import { Router } from 'express';
import Leaderboard from '../services/leaderboard.service';

const service = new Leaderboard();

const leaderBoardRouter = Router();

leaderBoardRouter.get(
  '/leaderboard/home',
  async (_req, res) => {
    const result = await service.getLeaderAll();
    res.json(result);
  },
);

export default leaderBoardRouter;
