import Match from '../database/models/Match';
import Club from '../database/models/Club';
import validateMatch from '../validation/match.validation';

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

export default class MatchService {
  private matchs: Match[];

  private newMatch: InewMatch;

  private queryString: boolean;

  constructor() {
    this.queryString = true;
  }

  async get(id: number): Promise<Match[]> {
    const matchs = await Match.findAll({
      where: { homeTeam: id, $or: [{ awayTeam: id }] },
      attributes: { exclude: ['home_team', 'away_team'] },
      include: [
        { model: Club, as: 'homeClub', attributes: { exclude: ['id'] } },
        { model: Club, as: 'awayClub', attributes: { exclude: ['id'] } },
      ],
    });
    this.matchs = matchs;
    return matchs;
  }

  async getAll(): Promise<Match[]> {
    const matchs = await Match.findAll({
      attributes: { exclude: ['home_team', 'away_team'] },
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

  async validateEqualsTeams(bodyMatch: InewMatch): Promise <IError | true> {
    this.newMatch = bodyMatch;
    const { homeTeam, awayTeam } = bodyMatch;
    if (!validateMatch.validateEqualsTeams(homeTeam, awayTeam)) {
      return { status: 401, message: 'It is not possible to create a match with two equal teams' };
    }

    return true;
  }

  async validateExistsClub(bodyMatch: InewMatch): Promise <IError | true> {
    this.newMatch = bodyMatch;
    const { homeTeam, awayTeam } = bodyMatch;

    const homeClub = await Club.findAll({ where: { id: homeTeam } });
    const awayClub = await Club.findAll({ where: { id: awayTeam } });

    if (!homeClub.length || !awayClub.length) {
      return { status: 401, message: 'There is no team with such id!' };
    }

    return true;
  }

  async createMatch(bodyMatch: InewMatch): Promise <Match> {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = bodyMatch;

    const newMatch = await Match.create({
      homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
    });
    this.newMatch = newMatch;
    return newMatch;
  }

  async finishMatch(id: number, body: IBodyMatch) {
    this.queryString = false;
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = body;

    await Match.update(
      { inProgress: false, homeTeam, awayTeam, homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );
  }

  async editMatch(id: number, body: IBodyMatch) {
    this.queryString = false;
    const { homeTeamGoals, awayTeamGoals } = body;

    await Match.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );
  }
}
