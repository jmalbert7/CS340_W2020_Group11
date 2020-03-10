//Import app created in app.js
const app = require('./app');

const port = 3000;

//App listening on port 3000
const server = app.listen(port, () =>{
    console.log('Express is running on port ' + port);
});