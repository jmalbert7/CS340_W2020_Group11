//import modules
const express = require('express');
const path = require('path');   //for working with file directory
const routes = require('./routes/index');


//Create the express application
const app = express();

//Refer to handlebars documentation for this, CS290 info seems to be out of date
const handlebars = require('express-handlebars');

app.engine('handlebars', handlebars());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

//When any request to app is received, use the routes file
app.use('/', routes);
app.use(express.static('public'));

//Export app so it can be used in other files
module.exports = app;