const express = require('express');

//router responds to any requests from the root url
const router = express.Router();

router.get('/', (req, res) =>{
    res.render('home', {title:'Freedom Meals - Home'});
});

router.get('/recipes', (req, res) =>{
    res.render('recipes', {title:'Browse Recipes'});
});

module.exports = router;