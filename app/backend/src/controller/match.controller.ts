import service from '../services/match.service';
import { IMatchs } from '../interfaces/match.interface';

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
  private matchs: IMatchs[];

  private newMatch: IMatchs;

  private error: IError | true;

  async getAll(): Promise<IMatchs[]> {
    const matchs = await service.getAll();
    this.matchs = matchs;
    return this.matchs;
  }

  async getQueryString(queryString: string): Promise<IMatchs[]> {
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

  async createMatch(bodyMatch: InewMatch): Promise <IMatchs> {
    const result = await service.createMatch(bodyMatch);
    this.newMatch = result;
    return this.newMatch;
  }

  async finishMatch(id: number, body: IBodyMatch) {
    this.error = true;
    await service.finishMatch(id, body);
  }

  async editMatch(id: number, body: IBodyMatch) {
    this.error = true;
    await service.editMatch(id, body);
  }
}
