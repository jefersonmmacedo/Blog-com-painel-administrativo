const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require ('../middlewares/adminAuth');;


//Login
router.get('/admin/login', (req, res) => {
    res.render('admin/login')
})

//Autenticaçao
router.post('/admin/authenticate', (req, res) => {
    let email = req.body.email;
  
    let password = req.body.password;

    User.findOne({where: {email: email}}).then(user => {
        if (user != undefined) {
            let correct = bcrypt.compareSync(password, user.password);
            if (correct) {
                usuario = req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    image: user.image
                }
                res.redirect("/admin/dashboard")
            } else {
                res.redirect('/admin/login')
            }
        } else {
            res.redirect('/admin/login')
        }
    })
})

// Listagem de usuarios 
router.get('/admin/users',adminAuth, (req, res) => {
    User.findAll({
     order: [
         ['id','DESC'] 
         ]
    }).then( users => {
        res.render('admin/users/users', {users: users})
    })
 })

// Adicionando novoas usuarios
router.get('/admin/users/new',adminAuth, (req, res) => {
   User.findAll().then( users => {
       res.render('admin/users/new', {users: users})
   })
})


//Salvando novos usuarios
router.post('/admin/users/save', (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let image = req.body.image;
    let password = req.body.password;
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    User.findOne({where: {email: email}}).then( user => {
        if (user == undefined ) {
                User.create({
                    name: name,
                    username: username,
                    email: email,
                    image: image,
                    password: hash
                }).then(() => {
                    res.redirect('/admin/users')
                })
            } else {
                res.redirect('/admin/users/new')

            }

    })

    
})


//deletendo usuarios
router.post('/admin/users/delete', (req, res) => {
    let id = req.body.id;

    if(id != undefined) {
        if( !isNaN(id)) {
            User.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/users')
            })
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }
});

router.post("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect('/')
})



module.exports = router;