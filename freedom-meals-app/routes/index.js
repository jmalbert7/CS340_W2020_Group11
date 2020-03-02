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

orderpage.get('/', (req, res) => {
    var orders = [];
    console.log(req.session.customer_id);
    var customer_id = req.session.customer_id;
    var sql = "SELECT Orders.order_id, Orders.order_date, Orders.delivery_date, Orders.order_status, Recipes.recipe_name FROM Orders JOIN Recipes_in_Orders ON Orders.order_id = Recipes_in_Orders.order_id JOIN Recipes ON Recipes_in_Orders.recipe_id = Recipes.recipe_id WHERE customer_id = ?;";
    mysql.pool.query(sql, [customer_id], function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        let orders = rows;
        console.log(orders);
        res.render('orders', { title: 'Your Orders', orders});
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
                //TODO: change to /orders page?? Or display a welcome message??
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

loginpage.post('/', (req, res) =>{
    console.log(req.body);
    var first_name = req.body.inputFirstName;
    var last_name = req.body.inputLastName;
    var email = req.body.inputEmail;
    var phone = req.body.inputPhoneNumber;
    var password = req.body.inputPassword;

    var sql = "INSERT INTO `Customers` (`first_name`, `last_name`, `email`, `password`, `phone`, `admin`) VALUES (?, ?, ?, ?, ?, '1')";

    if(first_name && last_name && email && phone && password){
        mysql.pool.query(sql, [first_name, last_name, email, password, phone], function(err, rows, fields){
            console.log('customer added');
        });
    } else {
        res.send('Please enterall required information');
        res.end();
    }
});
app.use('/login', loginpage);


module.exports = app;