const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const connection = require('./database/database');
const CategoriesController = require('./categories/CategoriesController');
const ArticlesController = require('./articles/ArticlesController')
const Category = require('./categories/Category')
const Article = require('./articles/Article')


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
    Article.findAll({
        include: {model: Category},
        order: [
            ['id','DESC'] 
            ]
    }).then((articles) => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
    });
});

//Renderizando a página inicial apenas com as postagens da categoria selecionada
app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}],
        order: [['id', 'DESC']]
    }).then( category => {
       if (category != undefined) {
        Category.findAll().then( categories => {
            res.render('index', {articles: category.articles, categories: categories})
        });
       } else {
           res.redirect('/');
       }
    }).catch(err => {
        res.redirect('/');
    });
});


//Página de notícias individuais
app.get('/:slug', (req, res) => {
    let slug = req.params.slug;

    Article.findOne({
        include: {model: Category},
        where: {
            slug: slug
        }
    }).then(article => {
        if ( article != undefined) {
            res.render('singleArticle', {article: article})
        } else {
            res.redirect('/')
        }
    }).catch ( err => {
        res.redirect('/')
    });
});

//Renderizando a página inicl da administração
app.get("/admin/dashboard", ( req, res) => {
    res.render("admin/index");
});

// utilizando as rotas externas
app.use('/', CategoriesController)
app.use('/', ArticlesController)

app.listen(80, () => {
    console.log("Servidor executando com sucesso!");
});