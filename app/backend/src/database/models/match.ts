import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';
import Club from './club';

class Match extends Model {
  public id!: number;

  public homeTeam!: number;

  public homeTeamGoals!: number;

  public awayTeam!: number;

  public awayTeamGoals!: number;

  public inProgress!: boolean;
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
  inProgress: { type: BOOLEAN },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matchs',
  timestamps: false,
});

Club.hasMany(Match, { foreignKey: 'home_team', as: 'homeClub' });
Match.belongsTo(Club, { foreignKey: 'home_team', as: 'homeClub' });
Club.hasMany(Match, { foreignKey: 'away_team', as: 'awayClub' });
Match.belongsTo(Club, { foreignKey: 'away_team', as: 'awayClub' });

export default Match;
