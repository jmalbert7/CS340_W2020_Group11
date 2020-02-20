var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_alberjes',
  password        : '3526',
  database        : 'cs340_alberjes'
});

module.exports.pool = pool;