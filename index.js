var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createConnection({
    //properties
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'codelerlust',
    port : '3306'
});

connection.connect(function(error) {
    //callback
    if (!!error){
        console.log("Error connecting to database");
        console.log(error)
    } else {
        console.log("Connected");
    }
})

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', function(req, res){
    res.render('index');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/signup', function(req, res){
    res.render('signup');
});

app.post('/welcome', function(req, res){
    var username = req.body.name;
    var mail = req.body.email;
    var pass = req.body.pass;
    var sql = "insert into user (`username`, `mail`, `pass`) VALUES ?"
    var values = [
        [username, mail, pass]
    ];
    //res.send(username);
    connection.query(sql, [values], function(error, rows, fields){
        if(!!error){
            console.log("Error in query");
            console.log(error)
        } else{
            res.send("Welcome to coderlust "+username);
        }
    });
});

app.get('/testing', function(req, res){
    connection.query("select * from user", function(error, rows, fields){
        if(!!error){
            console.log("Error in query");
        } else{
            console.log(rows[0].ID);
        }
    });
});

app.get('/quit', function(req, res){
    res.send('Bye Express');
});

var server = app.listen(9000, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Your app is running at http://%s:%s", host, port);
});