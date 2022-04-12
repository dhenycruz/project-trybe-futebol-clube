import { Op } from 'sequelize';
import ClubService from './club.service';
import Match from '../database/models/Match';

const serviceClub = new ClubService();

export default class Leaderboard {
  private totalPointsHome: number;

  private totalPointsAway: number;

  private totalWinsHome: number;

  private totalWinsAway: number;

  private totalDrawHome: number;

  private totalDrawAway: number;

  private totalLossesHome: number;

  private totalLossesAway: number;

  private totalGoals: number;

  private totalGoalsOwn: number;

  countGoals(clubId: number, matchs: Match[]) {
    const totalGoals = matchs.reduce((goals, match) => {
      let sumGoals = goals;
      const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = match;

      if (homeTeam === clubId) {
        sumGoals += homeTeamGoals;
      }

      if (awayTeam === clubId) {
        sumGoals += awayTeamGoals;
      }

      return sumGoals;
    }, 0);

    this.totalGoals = totalGoals;
    return totalGoals;
  }

  countGoalsOwn(clubId: number, matchs: Match[]) {
    const totalGoalsOwn = matchs.reduce((goalsOwn, match) => {
      let sumGoals = goalsOwn;
      const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = match;

      if (homeTeam === clubId) {
        sumGoals += awayTeamGoals;
      }

      if (awayTeam === clubId) {
        sumGoals += homeTeamGoals;
      }

      return sumGoals;
    }, 0);

    this.totalGoalsOwn = totalGoalsOwn;
    return totalGoalsOwn;
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

  countLossesHome(clubId: number, matchs: Match[]) {
    const totalLosses = matchs.reduce((losses, match) => {
      let sumLosses = losses;
      const { homeTeam, homeTeamGoals, awayTeamGoals } = match;

      if (homeTeam === clubId && homeTeamGoals < awayTeamGoals) {
        sumLosses += 1;
      }

      return sumLosses;
    }, 0);

    this.totalLossesHome = totalLosses;
    return totalLosses;
  }

  countLossesAway(clubId: number, matchs: Match[]) {
    const totalLosses = matchs.reduce((pts, match) => {
      let sumLosses = pts;
      const { awayTeam, homeTeamGoals, awayTeamGoals } = match;

      if (awayTeam === clubId && homeTeamGoals > awayTeamGoals) {
        sumLosses += 1;
      }

      return sumLosses;
    }, 0);

    this.totalLossesAway = totalLosses;
    return totalLosses;
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

      if (awayTeam === clubId && homeTeamGoals > awayTeamGoals) {
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

  async calculateTeamPerformance(clubId:number, clubName: string, matchs: Match[]) {
    const points = this.pointsHome(clubId, matchs) + this.pointsAway(clubId, matchs);
    const wins = this.countWinshome(clubId, matchs) + this.countWinsAway(clubId, matchs);
    const draws = this.countDrawHome(clubId, matchs) + this.countDrawAway(clubId, matchs);
    const losses = this.countLossesHome(clubId, matchs) + this.countLossesAway(clubId, matchs);
    const goals = this.countGoals(clubId, matchs);
    const goalsOwn = this.countGoalsOwn(clubId, matchs);

    return {
      Team: clubName,
      totalPoints: points,
      totalGames: matchs.length,
      totalVictories: wins,
      totalDraws: draws,
      totalLosses: losses,
      goalsFavor: goals,
      goalsOwn,
      goalsBalance: goals - goalsOwn,
      efficiency: (points / (matchs.length * 3)) * 100,
    };
  }

  async getLeaderAll() {
    const clubs = await serviceClub.getAll();
    return Promise.all(clubs.map(async (club) => {
      const matchs = await Match.findAll({
        where: {
          inProgress: false,
          [Op.or]: [{ homeTeam: club.id }, { awayTeam: club.id }],
        },
      });
      return this.calculateTeamPerformance(club.id, club.clubName, matchs);
    }));
  }
}
