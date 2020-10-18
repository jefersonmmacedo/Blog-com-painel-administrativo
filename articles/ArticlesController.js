const express = require('express');
const Article = require('./Article');
const router = express.Router();
const Category = require('../categories/Category');
const Slugify = require('slugify')

router.get('/articles', (req, res) => {
    res.send("Artigo Criado com sucesso!");
});

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

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories});
    });
});

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
    })
})

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
    })
});

module.exports = router;