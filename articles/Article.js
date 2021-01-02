const { TEXT } = require('sequelize');
const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');


// Criando a tabela de Artigos no banco de dados

const Article = connection.define ('articles', {
    title:{
        type: Sequelize.STRING,
        allowNUll: false
    }, 
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    subtitle: {
        type: Sequelize.TEXT,
        allowNUll: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNUll: false
    },   
    image: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Efetuando o relacionamento entre os módulos
//hasMany = Tem muitos ( Categoria tem muitos artigos);
Category.hasMany(Article);
//belongsTo = Pertence à ... ( Artigo pertence a uma categoria)/
Article.belongsTo(Category);

//Article.sync({force:true});

module.exports = Article;