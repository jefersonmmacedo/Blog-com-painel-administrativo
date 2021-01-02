const Sequelize = require('sequelize');
const connection = require('../database/database');

// Criando a tabela de Categorias no banco de dados

const User = connection.define('users', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//User.sync({force:true});

module.exports = User;