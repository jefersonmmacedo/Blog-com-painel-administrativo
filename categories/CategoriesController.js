const express = require('express');
const router = express.Router();

router.get('/categories', (req, res) => {
    res.send("Rote de Categorias criada")
});

router.get('/admin/categories', (req, res) => {
    res.send("'Rota administrativa de categorias'")
});

router.get('/admin/categories/new', (req, res) => {
    res.send("Rota administrativa de criação de categorias")
});

module.exports = router