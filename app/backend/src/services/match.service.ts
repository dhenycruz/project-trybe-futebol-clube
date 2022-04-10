import Match from '../database/models/Match';
import Club from '../database/models/Club';

interface Imatchs {
  id: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: boolean
}

interface InewMatch {
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: boolean
}

export default class MatchService {
  private matchs: Imatchs[];

  private newMatch: InewMatch;

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

  async createMatch(bodyMatch: InewMatch): Promise <Imatchs> {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = bodyMatch;
    const newMatch = await Match.create({
      homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
    });
    this.newMatch = newMatch;
    return newMatch;
  }
}
