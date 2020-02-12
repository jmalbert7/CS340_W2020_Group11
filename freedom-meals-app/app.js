//import modules
const express = require('express');
const routes = require('./routes/index');

//Create the express application
const app = express();

//When any request to app is received, use the routes file
app.use('/', routes);

//Export app so it can be used in other files
module.exports = app;