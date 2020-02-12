//Import app created in app.js
const app = require('./app');

//App listening on port 3000
const server = app.listen(3000, () =>{
    console.log('Express is running on port ${server.address().port}');
});