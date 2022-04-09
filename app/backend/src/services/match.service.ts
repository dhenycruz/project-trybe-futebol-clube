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

  private queryString: boolean;

  constructor() {
    this.queryString = true;
  }

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

  async getQueryString(queryString: string) {
    if (queryString === 'false') {
      this.queryString = false;
    } else {
      this.queryString = true;
    }

    const matchs = await Match.findAll({
      where: { inProgress: this.queryString },
      include: [
        { model: Club, as: 'homeClub', attributes: { exclude: ['id'] } },
        { model: Club, as: 'awayClub', attributes: { exclude: ['id'] } },
      ],
    });
    this.matchs = matchs;
    return matchs;
  }
}
