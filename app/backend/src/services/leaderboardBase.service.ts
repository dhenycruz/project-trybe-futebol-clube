import Match from '../database/models/Match';

export default class LeaderboardBase {
  private totalDrawHome: number;

  private totalDrawAway: number;

  private totalPointsHome: number;

  private totalPointsAway: number;

  private totalWinsHome: number;

  private totalWinsAway: number;

  pointsHome(clubId:number, matchs: Match[]) {
    const totalPoints = matchs.reduce((pts, match) => {
      let sumPts = pts;
      const { homeTeam, homeTeamGoals, awayTeamGoals } = match;

      if (homeTeam === clubId && homeTeamGoals > awayTeamGoals) {
        sumPts += 3;
      }
      if (homeTeam === clubId && homeTeamGoals === awayTeamGoals) {
        sumPts += 1;
      }

      return sumPts;
    }, 0);

    this.totalPointsHome = totalPoints;
    return totalPoints;
  }

  pointsAway(clubId: number, matchs: Match[]) {
    const totalPoints = matchs.reduce((pts, match) => {
      let sumPts = pts;
      const { awayTeam, homeTeamGoals, awayTeamGoals } = match;

      if (awayTeam === clubId && homeTeamGoals < awayTeamGoals) {
        sumPts += 3;
      }
      if (awayTeam === clubId && homeTeamGoals === awayTeamGoals) {
        sumPts += 1;
      }

      return sumPts;
    }, 0);

    this.totalPointsAway = totalPoints;
    return totalPoints;
  }

  countWinsAway(clubId:number, matchs: Match[]) {
    const totalWins = matchs.reduce((pts, match) => {
      let sumWins = pts;
      const { awayTeam, homeTeamGoals, awayTeamGoals } = match;

      if (awayTeam === clubId && homeTeamGoals < awayTeamGoals) {
        sumWins += 1;
      }

      return sumWins;
    }, 0);

    this.totalPointsAway = totalWins;
    return totalWins;
  }

  countWinshome(clubId:number, matchs: Match[]) {
    const totalWins = matchs.reduce((wins, match) => {
      let sumWins = wins;
      const { homeTeam, homeTeamGoals, awayTeamGoals } = match;

      if (homeTeam === clubId && homeTeamGoals > awayTeamGoals) {
        sumWins += 1;
      }

      return sumWins;
    }, 0);

    this.totalPointsHome = totalWins;
    return totalWins;
  }

  countDrawHome(clubId: number, matchs: Match[]) {
    const totalDraws = matchs.reduce((draws, match) => {
      let sumDraws = draws;
      const { homeTeam, homeTeamGoals, awayTeamGoals } = match;

      if (homeTeam === clubId && homeTeamGoals === awayTeamGoals) {
        sumDraws += 1;
      }

      return sumDraws;
    }, 0);

    this.totalDrawHome = totalDraws;
    return totalDraws;
  }

  countDrawAway(clubId: number, matchs: Match[]) {
    const totalDraws = matchs.reduce((draws, match) => {
      let sumDraws = draws;
      const { awayTeam, homeTeamGoals, awayTeamGoals } = match;

      if (awayTeam === clubId && homeTeamGoals === awayTeamGoals) {
        sumDraws += 1;
      }

      return sumDraws;
    }, 0);

    this.totalDrawAway = totalDraws;
    return totalDraws;
  }
}
