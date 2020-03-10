const express = require('express');
var mysql = require('../dbcon.js');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.use(session({ secret: 'SuperSecretPassword' }));

function checkIfLoggedIn(loggedin) {
    if (loggedin === true) {
        return true;
    }
    console.log('not logged in');
        return false;
}

//router responds to any requests from the root url
var homepage = express.Router();

//homepage router will retrieve all recipes from the Recipes table
homepage.get('/', (req, res) => {
	var sessionID;
	
    console.log('in the homepage / router');
    if (!req.session.cart) {
        console.log('new session');
        req.session.cart = [];
    }
    var recipes = [];
    var sql = "SELECT Recipes.recipe_id, recipe_name, time, difficulty, IFNULL(TRUNCATE(AVG(rating), 1), 'Not Yet Rated') AS rating FROM Recipes LEFT JOIN Recipe_Ratings ON Recipes.recipe_id = Recipe_Ratings.recipe_id GROUP BY Recipes.recipe_id";
    mysql.pool.query(sql, function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        let recipes = rows;
		
		if (req.session.customer_id)
		{
			sessionID = req.session.customer_id;
			console.log("Session ID: " + sessionID);
        }
        console.log(recipes);		
        res.render('recipes', { title: 'Browse Recipes', recipes, sessionID});
    });
});

//homepage router will retrieve recipes from the Recipes table with a specific time parameter
homepage.get('/:time', (req, res) => {
    var recipes = [];
    var timeCriteria = req.params.time;
    console.log('in the homepage /time router');
    var sql = "SELECT Recipes.recipe_id, recipe_name, time, difficulty, IFNULL(TRUNCATE(AVG(`rating`), 1), 'Not Yet Rated') AS rating FROM Recipes LEFT JOIN Recipe_Ratings ON Recipes.recipe_id=Recipe_Ratings.recipe_id WHERE time <= ? GROUP BY Recipes.recipe_id";
    mysql.pool.query(sql, [timeCriteria], function (err, rows, fields) {
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
    res.send();
});

//homepage router to add a new recipe to the recipes table
homepage.post('/add', (req, res) => {
    console.log('inside add recipe route, customer_id = ' + req.session.customer_id);
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Recipes (recipe_name, time, difficulty, ingredients) VALUES (?,?,?,?)";
    var inserts = [req.body.recipeName, req.body.time, req.body.difficulty, req.body.ingredients];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
            res.redirect('/recipes');
        }
    });
});
app.use('/recipes', homepage);

/*Begin Order handlers*/
var orderpage = express.Router();

//Displays order history for customer, customer must be logged in first
orderpage.get('/', (req, res) => {
    var loggedin = req.session.loggedin;
    console.log('LOGGEDIN= ' + loggedin);
    if (!checkIfLoggedIn(loggedin)) {
        req.session.lastLink = '/orders';
        req.session.save();
        res.redirect('/login');
    } else{
        var orders = [];
        var cart = [];
        console.log("req body in orderpage get request " + req.body.method);
    
        req.session.cart.forEach(element => {
            cart.push({ recipe_id: element, recipe_name: null });
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
                
                console.log(element.recipe_name);
                element.recipe_name = recipe[0].recipe_name;
                console.log(element.recipe_name);
            });
        });
    
        console.log(req.session.customer_id);
        var customer_id = req.session.customer_id;
        var orders = [];
        var sql = "SELECT Orders.order_id, DATE_FORMAT(Orders.order_date, \'%m/%d/%Y\') AS order_date, DATE_FORMAT(Orders.delivery_date, \'%m/%d/%Y\') AS delivery_date, Orders.order_status, Recipes.recipe_name FROM Orders JOIN Recipes_in_Orders ON Orders.order_id = Recipes_in_Orders.order_id JOIN Recipes ON Recipes_in_Orders.recipe_id = Recipes.recipe_id WHERE customer_id = ? ORDER BY Orders.order_id DESC;";
        mysql.pool.query(sql, [customer_id], function (err, rows, fields) {
            if (err) {
                console.log(JSON.stringify(err));
                res.end();
            }
            else{
                let orders = rows;
                console.log(orders);
                res.render('orders', { title: 'Your Orders', cart, orders});
            }
        });
    }
    
});

//This route removes a recipe from the cart session array when a user 
orderpage.post('/remove', (req, res) => {
    console.log("REMOVE: request body " + req.body.hiddenRecipeId);
    var value = req.body.hiddenRecipeId;

    for (var i = 0; i < req.session.cart.length; i++) {
        console.log("in remove loop " + req.session.cart[i]);
        if (req.session.cart[i] === value) {
            req.session.cart.splice(i, 1);
            console.log("Recipe removed: " + req.body.hiddenRecipeId);
        }
    }
    console.log('length ' + req.session.cart.length);
    req.session.cart.forEach(element => {
        console.log("loop " + element);
    });
    req.session.save();
    res.status = 200;
    res.readystate = 4;
    res.end();
});

//This route places the order for the recipes currently in the cart
orderpage.post('/add', (req, res) =>{

	// Add record to Orders table.
	var customer_id = req.session.customer_id;
	var order_id;
	var recipe_id;
	
	var sql = "INSERT INTO Orders (order_date, order_status, customer_id) VALUES ((SYSDATE()), 'PROCESSED', ?)";
	mysql.pool.query(sql, [customer_id], function(err, rows, fields){
		if(err)
		{
			console.log(JSON.stringify(err));
			res.end();
		}
		else
		{
			// Get order_id value.
			order_id = rows.insertId;
			
			// Add records in Recipes_in_Orders table.
			for (var i = 0; i < req.session.cart.length; i++)
			{
				recipe_id = req.session.cart[i];
				// console.log("recipe_id to add to Recipes_in_Orders table: " + recipe_id);
				var sql = "INSERT INTO Recipes_in_Orders (recipe_id, order_id) VALUES (?, ?)";
				mysql.pool.query(sql, [recipe_id, order_id], function(err, rows, fields){
					if(err)
					{
						console.log(JSON.stringify(err));
						res.end();
					}
					else
					{	
						// Clear the cart.
						for (var j = req.session.cart.length - 1; j >= 0 ; j--)
						{
							req.session.cart.splice(j, 1);
							
							if (j == 0)
							{
								console.log("Done clearing the cart!");
								
								res.redirect('/orders');
							}
						}
						
						// console.log("End of inner FOR-loop - Clearing cart.");
					}
				});
			}
			
			console.log("End of outer FOR-loop - Inserting recipes in Recipes_in_Orders table.");
		}
	});
});

//This route cancels an order requested by the customer.
orderpage.post('/remove', (req, res) => { 
    console.log("REMOVE: request body " + req.body.hiddenRecipeId);
    var value = req.body.hiddenRecipeId;
    
    for(var i = 0; i < req.session.cart.length; i++){
        console.log("in remove loop " + req.session.cart[i])
        if(req.session.cart[i] === value){
            req.session.cart.splice(i, 1);
            console.log("Recipe removed: " + req.body.hiddenRecipeId);
        }
    }
    console.log('length ' + req.session.cart.length);
    req.session.cart.forEach(element => { 
        console.log("loop " + element);
    }); 
    req.session.save();
    res.status = 200;
    res.readystate = 4;
    res.end();
});

//This route places the order for the recipes currently in the cart
orderpage.post('/cancel', (req, res) =>{

	// Delete records from Recipes_in_Orders table.
	var customer_id = req.session.customer_id;
	var order_id = req.body.orderID;
	var sql = "DELETE FROM Recipes_in_Orders WHERE order_id = ?"; 
	mysql.pool.query(sql, [order_id], function(err, rows, fields){
		if(err)
		{
			console.log(JSON.stringify(err));
			res.end();
		}
		else
		{
			// Update record in Orders table.
			sql = "UPDATE Orders SET order_status = 'CANCELED' WHERE order_id = ?";
			mysql.pool.query(sql, [order_id], function(err, rows, fields){
				if(err)
				{
					console.log(JSON.stringify(err));
					res.end();
				}
				else
				{
					res.redirect('/orders');
				}
			});
		}
	});
});

app.use('/orders', orderpage);

/*Begin Ratings Handlers*/
var ratingpage = express.Router();

//Display user's ratings for all recipes they have ordered
ratingpage.get('/', (req, res) => {
    var loggedin = req.session.loggedin;
    console.log('LOGGEDIN= ' + loggedin);
    if (!checkIfLoggedIn(loggedin)) {
        req.session.lastLink = '/rating';
        req.session.save();
        res.redirect('/login');
    } else{
        var recipeRatings = [];
        console.log('in rating get');
        console.log("customer_id = " + req.session.customer_id);
        var customer_id = req.session.customer_id;
        var sql = "SELECT `Recipes`.`recipe_id`, `Recipes`.`recipe_name`, `Recipe_Ratings`.`rating`, DATE_FORMAT(`Recipe_Ratings`.`date_rated`, \'%m/%d/%Y\') AS `date_rated` FROM `Recipes_in_Orders` JOIN `Recipes` ON `Recipes_in_Orders`.`recipe_id`=`Recipes`.`recipe_id` LEFT JOIN `Orders` ON `Recipes_in_Orders`.`order_id`=`Orders`.`order_id` LEFT JOIN `Recipe_Ratings` ON (`Orders`.`customer_id`=`Recipe_Ratings`.`customer_id` AND `Recipes_in_Orders`.`recipe_id`=`Recipe_Ratings`.`recipe_id`) WHERE `Orders`.`customer_id`= ? GROUP BY `Recipes`.`recipe_name` ORDER BY `Orders`.`order_date` DESC";
        mysql.pool.query(sql, [customer_id], function (err, rows, fields) {
            if (err) {
                console.log(JSON.stringify(err));
                res.end();
            }
            let recipeRatings = rows;
            console.log(recipeRatings);
            res.render('rating', { title: 'Your Ratings', recipeRatings });
        });
    }
});

//Rating router to add or update rating
ratingpage.post('/add', (req, res) => {
    console.log('inside add ratings route, customer_id = ' + req.session.customer_id);
    console.log(req.body);
    var mysql = req.app.get('mysql');
    var customer_id = req.session.customer_id;
    var ratingType = req.body.ratingType;

    // If user is adding a new rating...
    if (ratingType == "NEW") {
        var sql = "INSERT INTO Recipe_Ratings (`rating`, `date_rated`, `customer_id`, `recipe_id`) VALUES (?, (SYSDATE()), ?, ?)";
        mysql.pool.query(sql, [req.body.rating, customer_id, req.body.recipeID], function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            else {
                res.redirect('/rating');
            }
        });
    }

    // If user is updating an existing rating...
    if (ratingType == "EXISTING") {
        var sql = "UPDATE Recipe_Ratings SET rating = ?, date_rated = (SYSDATE()) WHERE customer_id = ? AND recipe_id = ?";
        mysql.pool.query(sql, [req.body.rating, customer_id, req.body.recipeID], function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            else {
                res.redirect('/rating');
            }
        });
    }
});
app.use('/rating', ratingpage);

/*Begin Profile Handlers*/
var profilepage = express.Router();

//Display User's Customer information
profilepage.get('/', (req, res) => {
    var loggedin = req.session.loggedin;
    console.log('LOGGEDIN= ' + loggedin);
    if (!checkIfLoggedIn(loggedin)) {
        req.session.lastLink = '/profile';
        req.session.save();
        res.redirect('/login');
    } else{
        var customerInfo = [];
        console.log('in profile get');
        console.log(req.session.customer_id);
        var customer_id = req.session.customer_id;
        var sql = "SELECT customer_id, first_name, last_name, email, password, phone, admin FROM Customers WHERE customer_id = ?";
        mysql.pool.query(sql, [customer_id], function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            let customerInfo = rows;
            console.log(customerInfo);
            res.render('profile', { title: 'Your Profile', customerInfo });
        });
    }
});

profilepage.post('/edit', (req, res) => {
    var customerInfo = [];
    console.log('in profile POST');
    console.log(req.body.customer_id +" " + req.body.first_name + " " + req.body.last_name + " " + req.body.email + " " + req.body.password + " " + req.body.phone + " " + req.body.admin);

    var sql = "SELECT first_name, last_name, email, password, phone FROM Customers WHERE customer_id = ?";
    mysql.pool.query(sql, [req.body.customer_id], function (err, result) {
        if (err) {
            next(err);
            return;
        }
        if (result.length == 1) {
            var curVals = result[0];
            console.log("curvals " + curVals);
            var sql2 = "UPDATE Customers SET first_name=?, last_name=?, email=?, password=?, phone=? WHERE customer_id=?";
            mysql.pool.query(sql2, 
                [req.body.first_name || curVals.first_name, req.body.last_name || curVals.last_name, req.body.email || curVals.email, req.body.password || curVals.password,  req.body.phone || curVals.phone, req.body.customer_id],
                function(err, result){
                    if(err){
                        next(err);
                        return;
                    }
                    console.log('result');
                    res.render('profile');
            });
        }
    });


});

profilepage.post('/update', (req, res) => {

});
app.use('/profile', profilepage);

/*Begin Login Handlers*/
var loginpage = express.Router();

//Simply displays the login page
loginpage.get('/', (req, res) => {
    console.log('in the login router');
    res.render('login', { title: 'Login' })
});

//Route to sign in an existing user
loginpage.post('/auth', (req, res) => {
    console.log(req.body);
    var userEmail = req.body.email;
    var password = req.body.password;
    var sql = "SELECT `customer_id` FROM `Customers` WHERE `email` = ? AND `password` = ?";
    if (userEmail && password) {
        mysql.pool.query(sql, [userEmail, password], function (err, rows, fields) {
            if (rows.length > 0) {
                console.log(rows);
                const context = rows;
                console.log(context[0]);
                req.session.loggedin = true;
                req.session.customer_id = context[0].customer_id;
                req.session.save();
                console.log(req.session.customer_id);
                if (req.session.lastLink != null) {
                    res.redirect(req.session.lastLink);
                } else {
                    res.redirect('/recipes');
                }
            } else {
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
loginpage.post('/', (req, res) => {
    console.log(req.body);
    var first_name = req.body.inputFirstName;
    var last_name = req.body.inputLastName;
    var email = req.body.inputEmail;
    var phone = req.body.inputPhoneNumber;
    var password = req.body.inputPassword;

    var sql1 = "SELECT email FROM Customers WHERE email = ?";
    mysql.pool.query(sql1, [email], function (err, rows, fields) {
        if(rows.length > 0){
            res.send(email + ' is already registered to an account');
        }
        else{
            console.log('new email');
            var sql2 = "INSERT INTO `Customers` (`first_name`, `last_name`, `email`, `password`, `phone`, `admin`) VALUES (?, ?, ?, ?, ?, '1')";

            if (first_name && last_name && email && phone && password) {
                mysql.pool.query(sql2, [first_name, last_name, email, password, phone], function (err, rows, fields) {
                    console.log('customer added');
                    sql = "SELECT `customer_id` FROM `Customers` WHERE `email` = ? AND `password` = ?";
                    mysql.pool.query(sql, [email, password], function (err, rows, fields) {
                        console.log(rows);
                        var context = rows;
                        console.log(context[0]);
                        console.log(context[0].customer_id)
                        req.session.loggedin = true;
                        req.session.customer_id = context[0].customer_id;
                        req.session.save();
                        res.redirect('/recipes');
                    });
                });
            } else {
                res.send('Please enter all required information');
                res.end();
            }
        }
    }); 
});
app.use('/login', loginpage);


module.exports = app;
