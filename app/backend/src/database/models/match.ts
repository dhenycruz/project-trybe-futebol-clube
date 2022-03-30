import { Model, INTEGER } from 'sequelize';
import db from '.';
import Club from './club';

class Match extends Model {
  public id!: number;

  public homeTeam!: number;

  public homeTeamGoals!: number;

  public awayTeam!: number;

  public awayTeamGoals!: number;

  public inProgress!: number;
}

Match.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeam: { type: INTEGER },
  homeTeamGoals: { type: INTEGER },
  awayTeam: { type: INTEGER },
  awayTeamGoals: { type: INTEGER },
  inProgress: { type: INTEGER },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'match',
  timestamps: false,
});

/* Associations */
Club.belongsTo(Club, {
  foreignKey: 'home_team', as: 'clubs',
});

Club.belongsTo(Club, {
  foreignKey: 'away_team', as: 'clubs',
});

export default Match;
