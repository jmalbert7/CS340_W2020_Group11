//import modules
const express = require('express');
const path = require('path');   //for working with file directory
const routes = require('./routes/index');
var mysql = require('./dbcon.js');

//Create the express application
const app = express();

//Refer to handlebars documentation for this, CS290 info seems to be out of date
const handlebars = require('express-handlebars');

app.engine('handlebars', handlebars());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.set('mysql', mysql);

//When any request to app is received, use the routes file
app.use('/', routes);
app.use(express.static('public'));

app.use(function(req,res){
    res.status(404);
    res.render('404');
});
  
app.use(function(err, req, res, next){
console.error(err.stack);
res.status(500);
res.render('500');
});


//Export app so it can be used in other files
module.exports = app;