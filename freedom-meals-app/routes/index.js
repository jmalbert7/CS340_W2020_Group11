const express = require('express');
var mysql = require('../dbcon.js');
var app = express();

//router responds to any requests from the root url
var homepage = express.Router();

//homepage router will retrieve all recipes from the Recipes table
homepage.get('/', (req, res) =>{
    //TODO: Replace object with query to database
    /*let recipes = [
        {
            name: "lasagne",
            description: "meaty, cheesy",
            difficulty: "intermediate",
            time: 120,
            id: 1
        }
    ];*/
    var recipes = [];
    mysql.pool.query('SELECT * FROM Recipes', function(err, rows, fields){
        if(err){
            next(err);
            return; 
        }
        let recipes = rows;
        res.render('recipes', {title:'Browse Recipes', recipes});
    });
});

//homepage router will retrieve recipes from the Recipes table with a specific time parameter
homepage.get('/:time', (req, res) =>{
    var recipes = [];
    var timeCriteria = req.params.time;
    //TODO: Add WHERE clause to query
    mysql.pool.query('SELECT * FROM Recipes WHERE time <= ?', [timeCriteria], function(err, rows, fields){
        if(err){
            next(err);
            return; 
        }
        let recipes = rows;
        res.render('recipes', {title:'Browse Recipes', recipes});
    });
});

//homepage router to post a new recipe to the recipes table
homepage.post('/', (req, res) =>{
    
    
});
app.use('/', homepage);

module.exports = app;