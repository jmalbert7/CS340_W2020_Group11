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
    console.log('in the homepage / router');
    if(!req.session.cart){
        console.log('new session');
        req.session.cart = [];
    }
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

//When user clicks the 'Add to Cart' button a post request is made to save the recipe_id 
//in the session array that holds the user's recipe selections
homepage.post('/', (req, res) => {
    console.log("request body " + req.body.hiddenRecipeId);
    
    req.session.cart.push(req.body.hiddenRecipeId);
    console.log('length ' + req.session.cart.length);
    req.session.cart.forEach(element => { 
        console.log("loop " + element); 
    }); 
    req.session.save();
    res.status = 200;
    res.readystate = 4;
});

//homepage router to post a new recipe to the recipes table
homepage.post('/add', (req, res) => {
    console.log('inside add recipe route, customer_id = ' + req.session.customer_id);
	console.log(req.body)
	var mysql = req.app.get('mysql');
	var sql = "INSERT INTO Recipes (recipe_name, time, difficulty, directions) VALUES (?,?,?,?)";
	var inserts = [req.body.recipeName, req.body.time, req.body.difficulty, req.body.directions];
	sql = mysql.pool.query(sql, inserts, function(error, results, fields){
		if(error)
		{
			console.log(JSON.stringify(error))
			res.write(JSON.stringify(error));
			res.end();
		}
		else
		{
			res.redirect('/recipes');
		}
	});
});
app.use('/recipes', homepage);

/*Begin Order handlers*/
var orderpage = express.Router();

//Displays order history for customer, customer must be logged in first
orderpage.get('/', (req, res) => {
    //TODO: Render the curent status of the cart
    var orders = [];
    var cart = [];
    //cart = req.session.cart;
    req.session.cart.forEach(element => { 
        cart.push({recipe_id : element, recipe_name: null});
    });

    cart.forEach(element => { 
        console.log("cart " + element.recipe_id);
    });

    cart.forEach(element => {       
        var sql2 = "SELECT recipe_name FROM Recipes WHERE recipe_id = ?";
        mysql.pool.query(sql2, [element.recipe_id], function (err, recipe) {
        if (err) {
            next(err);
            return;
        }
        console.log(recipe[0].recipe_name);
        console.log(element.recipe_name);
        element.recipe_name = recipe[0].recipe_name;
        console.log(element.recipe_name);
        });
    });
       
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
        
        res.render('orders', { title: 'Your Orders', orders, cart});
    });
});

//This route places the order for the recipes currently in the cart
orderpage.post('/add/:id', (req, res) =>{

});
app.use('/orders', orderpage);

/*Begin Ratings Handlers*/
var ratingpage = express.Router();

//Display user's ratings for all recipes they have ordered
ratingpage.get('/', (req, res) =>{
    var recipeRatings = [];
    console.log('in rating get');
    console.log(req.session.customer_id);
    var customer_id = req.session.customer_id;
    //TODO: Fix this query
    var sql = "SELECT `Recipe_Ratings`.`rating`, `Recipe_Ratings`.`date_rated` FROM Orders RIGHT JOIN Recipes_in_Orders ON Orders.order_id = Recipes_in_Orders.order_id LEFT JOIN Recipe_Ratings ON Recipes_in_Orders.recipe_id = Recipe_Ratings.recipe_id WHERE Recipe_Ratings.customer_id = ? AND Orders.customer_id = ?";
    mysql.pool.query(sql, [customer_id, customer_id], function(err, rows, fields){
        if (err) {
            next(err);
            return;
        }
        let recipeRatings = rows;
        console.log(recipeRatings);
        res.render('rating', { title: 'Your Ratings', recipeRatings});
    });
})
app.use('/rating', ratingpage);

/*Begin Profile Handlers*/
var profilepage = express.Router();

//Display User's Customer information
profilepage.get('/', (req, res) =>{
    var customerInfo = [];
    console.log('in profile get');
    console.log(req.session.customer_id);
    var customer_id = req.session.customer_id;
    var sql = "SELECT first_name, last_name, email, password, phone, admin FROM Customers WHERE customer_id = ?";
    mysql.pool.query(sql, [customer_id], function(err, rows, fields){
        if (err) {
            next(err);
            return;
        }
        let customerInfo = rows;
        console.log(customerInfo);
        res.render('profile', { title: 'Your Profile', customerInfo});
    });
});
app.use('/profile', profilepage);

/*Begin Login Handlers*/
var loginpage = express.Router();

//Simply displays the login page
loginpage.get('/', (req, res) =>{
    console.log('in the login router');
    res.render('login', { title: 'Login'})
});

//Route to sign in an existing user
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

//Route to create a new user
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
            sql = "SELECT `customer_id` FROM `Customers` WHERE `email` = ? AND `password` = ?";
            mysql.pool.query(sql, [email, password], function(err, rows, fields){
                console.log(rows);
                var context = rows;
                console.log(context[0]);
                console.log(context[0].customer_id)
                req.session.customer_id = context[0].customer_id;
                res.redirect('/recipes');
            });
        });
    } else {
        res.send('Please enter all required information');
        res.end();
    }
});
app.use('/login', loginpage);


module.exports = app;