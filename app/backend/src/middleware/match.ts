import { Request, Response } from 'express';
import MatchController from '../controller/match.controller';

const controller = new MatchController();

const finishMatch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  await controller.finishMatch(Number(id), body);
  res.json({ message: ' Finalizado' });
};

export default finishMatch;
