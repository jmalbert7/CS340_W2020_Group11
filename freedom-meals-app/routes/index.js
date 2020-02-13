const express = require('express');

//router responds to any requests from the root url
const router = express.Router();

router.get('/', (req, res) =>{
    res.render('home', {title:'Freedom Meals - Home'});
});

router.get('/recipes', (req, res) =>{
    //TODO: Replace object with query to database
    let recipes = [
        {
            name: "lasagne",
            description: "meaty, cheesy",
            difficulty: "intermediate",
            time: 120,
            id: 1
        },
        {
            name: "panini",
            description: "meaty, cheesy, bready ",
            difficulty: "easy",
            time: 15,
            id: 2
        },
        {
            name: "panini",
            description: "meaty, cheesy",
            difficulty: "easy",
            time: 15,
            id: 3
        },
        {
            name: "panini",
            description: "meaty, cheesy",
            difficulty: "easy",
            time: 15,
            id: 4
        }
    ];
    res.render('recipes', {title:'Browse Recipes', recipes});
});

module.exports = router;