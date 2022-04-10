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

interface InewMatch {
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: boolean
}

export default class MatchController {
  private matchs: Imatchs[];

  private newMatch: Imatchs;

  async getAll(): Promise<Imatchs[]> {
    const matchs = await service.getAll();
    this.matchs = matchs;
    return this.matchs;
  }

  async getQueryString(queryString: string): Promise<Imatchs[]> {
    const matchs = await service.getQueryString(queryString);
    this.matchs = matchs;
    return this.matchs;
  }

  async createMatch(bodyMatch: InewMatch): Promise <Imatchs> {
    const result = await service.createMatch(bodyMatch);
    this.newMatch = result;
    return this.newMatch;
  }
}
