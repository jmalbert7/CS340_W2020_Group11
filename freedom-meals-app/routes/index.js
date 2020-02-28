const express = require('express');
var mysql = require('../dbcon.js');

//router responds to any requests from the root url
const router = express.Router();

router.get('/', (req, res) =>{
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


module.exports = router;