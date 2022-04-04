import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

class Club extends Model {
  public id!: number;

  public clubName!: string;
}

Club.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  clubName: {
    type: STRING,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'club',
  timestamps: false,
});

export default Club;
