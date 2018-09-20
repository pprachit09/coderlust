var express = require('express');
var mysql = require('mysql');
var app = express();
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));

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
    res.render('signup', {title: 'form validation', success: req.session.success, errors: req.session.errors});
	req.session.erros = null;
});

app.post('/welcome', function(req, res){
    var username = req.body.username;
    var mail = req.body.email;
    var pass = req.body.password;
    var sql = "insert into user (`username`, `mail`, `pass`) VALUES ?"
    var values = [
        [username, mail, pass]
    ];
	//check validity
	req.check('username', 'Enter username').not().isEmpty();
	req.assert('email', 'invalid email address').isEmail();
	req.check('password', 'invalid password').isLength({min: 4}).equals(req.body.confirmpassword);
	var errors = req.validationErrors();
	if (errors) {
	  console.log(errors);
	  req.session.errors = errors;
	  req.session.success = false;
	  res.redirect('/signup');
	}
	else {
	  req.session.success = true;
	  connection.query(sql, [values], function(error, rows, fields){
        if(!!error){
            console.log("Error in query");
            console.log(error)
        } else{
            res.send("Welcome to coderlust "+username);
        }
    });
	}
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