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

interface IBodyMatch {
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number
}

interface InewMatch {
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: boolean
}

interface IError {
  status: number;
  message: string;
}

export default class MatchController {
  private matchs: Imatchs[];

  private newMatch: Imatchs;

  private error: IError | true;

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

  async validateEqualsTeams(bodyMatch: InewMatch): Promise <IError | true> {
    const result = await service.validateEqualsTeams(bodyMatch);
    this.error = result;
    return result;
  }

  async validateExistsClub(bodyMatch: InewMatch): Promise <IError | true> {
    const result = await service.validateExistsClub(bodyMatch);
    this.error = result;
    return result;
  }

  async createMatch(bodyMatch: InewMatch): Promise <Imatchs> {
    const result = await service.createMatch(bodyMatch);
    this.newMatch = result;
    return this.newMatch;
  }

  async finishMatch(id: number, body: IBodyMatch) {
    this.error = true;
    await service.finishMatch(id, body);
  }
}
