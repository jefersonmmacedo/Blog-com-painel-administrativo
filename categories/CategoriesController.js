const express = require('express');
const router = express.Router();
const Category = require('./Category')
const Slugify = require('slugify')


//Rota para acesso dos visitantes do site
router.get('/categories', (req, res) => {
    res.send("Rote de Categorias criada")
});

//Rota administrativa para listagem das categorias
router.get('/admin/categories', (req, res) => {
        Category.findAll().then(categories => {
        res.render('admin/categories/categories', {categories: categories});
    });
});

//Rota administrativa para adição de nova categoria
router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new')
});


//Rota administrativa para salvar categorias no banco de dados
router.post('/admin/categories/save', (req, res) =>{
    var title = req.body.title;

    if ( title != undefined) {
            Category.create({
                title: title,
                slug: Slugify(title)
            }).then(() => {
                 res.redirect('/admin/categories')
            })
    } else {
        res.redirect('/')
    }
})

// Rota administrativa para exclusão de categorias no banco de dados
router.post ("/admin/categories/delete", (req, res) => {
    let id = req.body.id;

    if (id != undefined) {
        if (!isNaN(id)){
            Category.destroy({
                where: {
                    id:id
                }
            }).then(() => {
                res.redirect('/admin/categories')
            })
        } else { // Se ID não fou um número
            res.redirect('/admin/categories/new')
        }
    } else { // Se ID for NULL
        res.redirect ('/admin/categories/new')
    }
});

//Rota administrativa para carregar a categoria a ser atualizada
router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;

   if(isNaN(id)){
    res.redirect('/admin/categories')
   }

    Category.findByPk(id).then(category => {
        if(category != undefined) {
            res.render('admin/categories/edit', {category: category})
        } else {
            res.redirect('/admin/categories')
        }
    }).catch(err => {
        res.redirect('/admin/categories')
    })
});

//Rota para atualizar a categoria no banco
router.post('/admin/categories/update', (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title: title,slug: Slugify(title)}, {
        where:{
            id:id
        }
    }).then(() => {
        res.redirect('/admin/categories')
    }).catch( err => {
        res.redirect('/admin')
    })

})


module.exports = router