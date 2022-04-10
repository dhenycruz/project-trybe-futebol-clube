import { Request, Response } from 'express';
import MatchController from '../controller/match.controller';

const controller = new MatchController();

const finishMatch = async (req: Request, res: Response) => {
  const { id } = req.params;
  await controller.finishMatch(Number(id));
  res.send();
};

export default finishMatch;
