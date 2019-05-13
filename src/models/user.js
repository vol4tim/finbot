import db from './db';

const User = db.sequelize.define('user', {
  userId: {
    type: db.Sequelize.STRING,
    unique: true
  },
  username: {
    type: db.Sequelize.STRING,
    unique: true
  }
});

export default User;
