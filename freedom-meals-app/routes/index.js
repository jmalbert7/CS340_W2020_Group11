const express = require('express');
var mysql = require('../dbcon.js');
var app = express();

//router responds to any requests from the root url
var homepage = express.Router();

//homepage router will retrieve all recipes from the Recipes table
homepage.get('/', (req, res) => {
    /*let recipes = [
        {
            name: "lasagne",
            description: "meaty, cheesy",
            difficulty: "intermediate",
            time: 120,
            id: 1
        }
    ];*/
    console.log('in the homepage / router')
    var recipes = [];
    mysql.pool.query('SELECT * FROM Recipes', function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        let recipes = rows;
        res.render('recipes', { title: 'Browse Recipes', recipes });
    });
});

//homepage router will retrieve recipes from the Recipes table with a specific time parameter
homepage.get('/:time', (req, res) => {
    var recipes = [];
    var timeCriteria = req.params.time;
    console.log('in the homepage /time router');
    mysql.pool.query('SELECT * FROM Recipes WHERE time <= ?', [timeCriteria], function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        let recipes = rows;
        res.render('recipes', { title: 'Browse Recipes', recipes });
    });
});

//homepage router to post a new recipe to the recipes table
homepage.post('/', (req, res) => {


});
app.use('/recipes', homepage);

/*Begin Order handlers*/
var orderpage = express.Router();

orderpage.get('/orders', (req, res) => {
    var orders = [];
    var sql = "SELECT order_id, order_date, delivery_date, order_status FROM Orders JOIN Customers ON Orders.customer_id = Customers.customer_id WHERE Customers.customer_id = customerIdInput";
    mysql.pool.query('', function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        let recipes = rows;
        res.render('recipes', { title: 'Browse Recipes', recipes });
    });
});
app.use('/orders', orderpage);

/*Begin Login Handlers*/
var loginpage = express.Router();
loginpage.get('/', (req, res) =>{
    console.log('in the login router');
    res.render('login', { title: 'Login'})
});
app.use('/login', loginpage);

module.exports = app;