const express = require('express');
const router = express.Router();

router.get('/articles', (req, res) => {
    res.send("Rota de artigos criada");
});

router.get('/admin/articles', (req, res) => {
    res.send ("Rota de Administração de Artigos Criada");
});

router.get('/admin/articles/new', (req, res) => {
    res.send ("Rota de Administração de criação de Artigos Criada");
});

module.exports = router;