import db from './db';

const Finance = db.sequelize.define('finance', {
  userId: {
    type: db.Sequelize.STRING
  },
  sum: {
    type: db.Sequelize.FLOAT,
    defaultValue: 0
  },
  currency: {
    type: db.Sequelize.STRING,
    defaultValue: 'RUB'
  },
  category: {
    type: db.Sequelize.STRING,
    defaultValue: ''
  },
  comment: {
    type: db.Sequelize.STRING,
    defaultValue: ''
  },
  type: {
    type: db.Sequelize.INTEGER,
    defaultValue: 0
  },
  fileId: {
    type: db.Sequelize.STRING,
    defaultValue: ''
  }
});

export default Finance;
