const express = require('express');
var mysql = require('../dbcon.js');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.use(session({secret:'SuperSecretPassword'}));

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
homepage.post('/add', (req, res) => {
    console.log('inside add recipe route, customer_id = ' + req.session.customer_id);

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
loginpage.post('/auth', (req, res) => {
    console.log(req.body);
    var userEmail = req.body.email;
    var password = req.body.password;
    var sql = "SELECT `customer_id` FROM `Customers` WHERE `email` = ? AND `password` = ?";
    if(userEmail && password){
        mysql.pool.query(sql, [userEmail, password], function(err, rows, fields){
            if(rows.length > 0){
                console.log(rows);
                const context = rows;
                console.log(context[0]);
                req.session.loggedin = true;
                req.session.customer_id = context[0].customer_id;
                console.log(req.session.customer_id);
                //TODO: change to /orders page
                res.redirect('/recipes');
            } else{
                res.send('Incorrect username and or password');
            }
            res.end();
        });
    } else {
        res.send('Please enter your email and password');
        res.end();
    }
});
app.use('/login', loginpage);


module.exports = app;