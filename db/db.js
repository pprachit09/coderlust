//database connection
var mysql = require('mysql');
var keys = require('../services/keys');

//database connection parameters
var connection = mysql.createConnection({
    //properties
    host : keys.mysql.host,
    user : keys.mysql.user,
    password : keys.mysql.password,
    database : keys.mysql.database,
    port : keys.mysql.port
});

//connect to database
connection.connect(function(error) {
    //callback
    if (!!error){
        console.log("Error connecting to database");
        console.log(error)
    } else {
        console.log("Connected");
    }
})

module.exports = connection;