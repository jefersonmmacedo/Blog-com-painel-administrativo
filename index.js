const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const connection = require('./database/database');
const CategoriesController = require('./categories/CategoriesController');
const ArticlesController = require('./articles/ArticlesController')


//View Engine
app.set('view engine', 'ejs');

//Arquivos estáticos
app.use(express.static('public'));

//Body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Conexão com o banco de dados
connection
    .authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados executada com sucesso');
    }).catch((error) => {
        console.log(error + ': Falha na conexãocom o banco de dados! Verifique seus códigos e tente novamente.');
    });

//Renderizando a página inicial
app.get("/", ( req, res) => {
    res.render("index");
});

// utilizando as rotas externas
app.use('/', CategoriesController)
app.use('/', ArticlesController)

app.listen(80, () => {
    console.log("Servidor executando com sucesso!");
});