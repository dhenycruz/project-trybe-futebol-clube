import service from '../services/leaderboard.service';

interface IClubPerfomance {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: number
}

class ControllerLeaderBoard {
  private table: IClubPerfomance[];

  async getLeaderAll(): Promise <IClubPerfomance[]> {
    const result = await service.getLeaderAll();
    this.table = result;
    return result;
  }

  async getLeaderHome(): Promise <IClubPerfomance[]> {
    const result = await service.getLeaderHome();
    this.table = result;
    return result;
  }

  async getLeaderAway(): Promise <IClubPerfomance[]> {
    const result = await service.getLeaderAway();
    this.table = result;
    return result;
  }
}

export default new ControllerLeaderBoard();
