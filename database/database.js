const Sequelize = require('sequelize');
const connection = new Sequelize('novo-blog', 'root', '211902fluminense', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;