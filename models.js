const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: 'auth_demo_db',
  dialect: 'postgres',
  operatorsAliases: false,
  define: { 
    underscored: true
  }
});


const User = sequelize.define('user', {
  name: Sequelize.STRING,
  password_digest: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true
  }
});

const Tweet = sequelize.define('tweet', {
  text: Sequelize.STRING,
});

User.hasMany(Tweet);
Tweet.belongsTo(User);

module.exports = {
  User,
  Tweet,
  sequelize
};
