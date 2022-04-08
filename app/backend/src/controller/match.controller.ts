import MatchService from '../services/match.service';

const service = new MatchService();

interface Imatchs {
  id: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: boolean
}

export default class MatchController {
  private matchs: Imatchs[];

  async getAll(): Promise<Imatchs[]> {
    const matchs = await service.getAll();
    this.matchs = matchs;
    return this.matchs;
  }
}
