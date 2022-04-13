import { Op } from 'sequelize';
import ClubService from './club.service';
import Match from '../database/models/Match';
import LeaderboardBase from './leaderboardBase.service';

const serviceClub = new ClubService();

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

export default class Leaderboard extends LeaderboardBase {
  private totalLossesHome: number;

  private totalLossesAway: number;

  private totalGoals: number;

  private totalGoalsOwn: number;

  private classification: IClubPerfomance[];

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

  async calculateTeamPerformanceAll(clubId:number, clubName: string, matchs: Match[]) {
    const points = this.pointsHome(clubId, matchs) + this.pointsAway(clubId, matchs);
    const wins = this.countWinshome(clubId, matchs) + this.countWinsAway(clubId, matchs);
    const draws = this.countDrawHome(clubId, matchs) + this.countDrawAway(clubId, matchs);
    const losses = this.countLossesHome(clubId, matchs) + this.countLossesAway(clubId, matchs);
    const goals = this.countGoals(clubId, matchs);
    const goalsOwn = this.countGoalsOwn(clubId, matchs);

    return {
      name: clubName,
      totalPoints: points,
      totalGames: matchs.length,
      totalVictories: wins,
      totalDraws: draws,
      totalLosses: losses,
      goalsFavor: goals,
      goalsOwn,
      goalsBalance: goals - goalsOwn,
      efficiency: Number(((points / (matchs.length * 3)) * 100).toFixed(2)),
    };
  }

  async calculateTeamPerformanceHome(clubId:number, clubName: string, matchs: Match[]) {
    const points = this.pointsHome(clubId, matchs);
    const wins = this.countWinshome(clubId, matchs);
    const draws = this.countDrawHome(clubId, matchs);
    const losses = this.countLossesHome(clubId, matchs);
    const goals = this.countGoals(clubId, matchs);
    const goalsOwn = this.countGoalsOwn(clubId, matchs);

    return {
      name: clubName,
      totalPoints: points,
      totalGames: matchs.length,
      totalVictories: wins,
      totalDraws: draws,
      totalLosses: losses,
      goalsFavor: goals,
      goalsOwn,
      goalsBalance: goals - goalsOwn,
      efficiency: Number(((points / (matchs.length * 3)) * 100).toFixed(2)),
    };
  }

  async calculateTeamPerformanceAway(clubId:number, clubName: string, matchs: Match[]) {
    const points = this.pointsAway(clubId, matchs);
    const wins = this.countWinsAway(clubId, matchs);
    const draws = this.countDrawAway(clubId, matchs);
    const losses = this.countLossesAway(clubId, matchs);
    const goals = this.countGoals(clubId, matchs);
    const goalsOwn = this.countGoalsOwn(clubId, matchs);

    return {
      name: clubName,
      totalPoints: points,
      totalGames: matchs.length,
      totalVictories: wins,
      totalDraws: draws,
      totalLosses: losses,
      goalsFavor: goals,
      goalsOwn,
      goalsBalance: goals - goalsOwn,
      efficiency: Number(((points / (matchs.length * 3)) * 100).toFixed(2)),
    };
  }

  async getLeaderAll() {
    const clubs = await serviceClub.getAll();
    const result = await Promise.all(clubs.map(async (club) => {
      const matchs = await Match.findAll({
        where: {
          inProgress: false,
          [Op.or]: [{ homeTeam: club.id }, { awayTeam: club.id }],
        },
      });
      return this.calculateTeamPerformanceAll(club.id, club.clubName, matchs);
    }));

    return this.classificationTeams(result);
  }

  async getLeaderHome() {
    const clubs = await serviceClub.getAll();
    const result = await Promise.all(clubs.map(async (club) => {
      const matchs = await Match.findAll({
        where: { inProgress: false, homeTeam: club.id },
      });
      return this.calculateTeamPerformanceHome(club.id, club.clubName, matchs);
    }));

    return this.classificationTeams(result);
  }

  async getLeaderAway() {
    const clubs = await serviceClub.getAll();
    const result = await Promise.all(clubs.map(async (club) => {
      const matchs = await Match.findAll({
        where: { inProgress: false, awayTeam: club.id },
      });
      return this.calculateTeamPerformanceAway(club.id, club.clubName, matchs);
    }));

    return this.classificationTeams(result);
  }

  classificationTeams(clubsPerfomance: IClubPerfomance[]) {
    const classification = [...clubsPerfomance].sort((a: IClubPerfomance, b: IClubPerfomance) => {
      if (a.totalPoints < b.totalPoints) return 1;
      if (a.totalPoints > b.totalPoints) return -1;
      if (a.totalVictories < b.totalVictories) return 1;
      if (a.totalVictories > b.totalVictories) return -1;
      if (a.goalsBalance < b.goalsBalance) return 1;
      if (a.goalsBalance > b.goalsBalance) return -1;
      if (a.goalsFavor < b.goalsFavor) return 1;
      if (a.goalsFavor > b.goalsFavor) return -1;
      if (a.goalsOwn < b.goalsOwn) return 1;
      if (a.goalsOwn > b.goalsOwn) return -1;

      return 0;
    });

    this.classification = classification;
    return classification;
  }
}
