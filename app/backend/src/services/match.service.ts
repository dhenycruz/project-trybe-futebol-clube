import Match from '../database/models/match';
import Club from '../database/models/club';

interface Imatchs {
  id: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: boolean
}

export default class MatchService {
  private matchs: Imatchs[];

  async getAll(): Promise<Imatchs[]> {
    const matchs = await Match.findAll({
      include: [
        { model: Club, as: 'homeClub', attributes: { exclude: ['id'] } },
        { model: Club, as: 'awayClub', attributes: { exclude: ['id'] } },
      ],
    });
    this.matchs = matchs;
    return matchs;
  }
}
