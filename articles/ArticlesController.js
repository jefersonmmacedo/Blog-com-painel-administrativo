const express = require('express');
const Article = require('./Article');
const router = express.Router();
const Category = require('../categories/Category');
const Slugify = require('slugify')

router.get('/articles', (req, res) => {
    res.send("Artigo Criado com sucesso!");
});


//Rota para listagem de artigos
router.get('/admin/articles', (req, res) => {
    Article.findAll({
        order: [
            ['id','DESC'] 
            ],
        include: {model: Category}
    }).then((articles) => {
        res.render('admin/articles/articles', {articles: articles});
    })
    
});


//Rota da pagina de criacao de novo artigo
router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories});
    });
});

//Rota para salvar artigos
router.post('/admin/articles/save', (req, res) => {
    let title = req.body.title;
    let subtitle = req.body.subtitle;
    let image = req.body.image;
    let body = req.body.body;
    let category = req.body.category

    if (title != undefined) {
        Article.create({
            title: title,
            slug: Slugify(title),
            subtitle: subtitle,
            image: image,
            body: body,
            categoryId: category

        }).then(() => {
            res.redirect ('/admin/articles')
        })
    } else {
        res.redirect ('/admin')
    }

});

// Rota para deletar artigos
router.post('/admin/articles/delete', (req, res) => {
    let id = req.body.id;

    if ( id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where:{
                    id:id
                }
            }).then(() => {
                res.redirect('/admin/articles');
            })
        } else {
            res.redirect('/admin/articles/new');
        }
    } else {
        res.redirect('/admin/articles/new')
    }
});

//Rota para edicao de artigos
router.get('/admin/articles/edit/:id', (req, res) => {
    let id = req.params.id;

    if(isNaN(id)) {
        res.redirect('/admin/articles');
    }
    Article.findByPk(id).then(article => {
        if (article != undefined) {
            Category.findAll().then( categories => {
                res.render('admin/articles/edit', {categories: categories, article: article})
            })
        } else {
            res.redirect('/admin/articles');
        };
    }).catch(err => {
        res.redirect('/admin/articles');
    });
});

//Rota para atualizacao dos artigos
router.post('/admin/articles/update', (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let subtitle = req.body.subtitle;
    let image = req.body.image;
    let categoryId = req.body.categoryId;
    let body = req.body.body;

    Article.update({title:title, slug: Slugify(title), subtitle: subtitle, image:image, categoryId: categoryId, body: body},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles');
    }).catch( err => {
        res.redirect('/admin/dashboard');
    });
});


//Rota e lógica da paginação de artigos
router.get('/articles/page/:num', (req, res) => {
    let page = req.params.num;
    let offset = 0;

    if (isNaN(page) || page == 1 ) {
        offset = 0;
    } else {
        offset = (parseInt(page) -1 ) * 4;
    }

    Article.findAndCountAll({
        order: [
            ['id','DESC'] 
            ],
        limit: 4,
        offset: offset
    }).then(articles => {

        let next;
        if (offset + 4 >= articles.count) {
            next = false;
        } else {
            next = true;
        }

        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/page', {result: result, categories: categories})
        })
    })
});

module.exports = router;