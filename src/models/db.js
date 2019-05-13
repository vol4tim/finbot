import Sequelize from 'sequelize';
import { PATH_DB } from '../config';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: PATH_DB,
  logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.model = {};

export default db;
