var express = require('express');
var app = express();
var db = require('./db/db');
var keys = require('./services/keys');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));
//importing passport functionality
var passportSetup = require('./services/passport-login');
//multer object creation
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

//Importing sso-routes
var ssoRoutes = require('./routes/sso-routes')

//set up routes for SSO
app.use('/auth', ssoRoutes);

var path = require('path');
app.use("/public", express.static(path.join(__dirname, 'public')));

//Define the template engine
app.use(express.static('public'));
app.set('view engine', 'pug');

//Route for homepage
app.get('/', function(req, res){
    res.render('home', {success: req.session.success});
});

//Login page
app.get('/login', function(req, res){
    res.render('login', {title: 'Log-in using coderlust account', success: req.session.success, errors: req.session.errors});
    req.session.erros = null;
});

//After succesful login, revert back to homepage
app.post('/', function(req, res){
    req.check('username', 'Enter username').not().isEmpty();
	req.check('password', 'invalid password').isLength({min: 4});
	var errors = req.validationErrors();
	if (errors) {
	  req.session.errors = errors;
	  req.session.success = false;
	  res.redirect(301, '/login');
    }    
    else {
        req.session.success = true;
        res.render('home', {success: req.session.success});
    }
});

//Sign up page
app.get('/signup', function(req, res){
    res.render('signup', {title: 'Sign up for coderlust', success: req.session.success, errors: req.session.errors});
    req.session.erros = null;
});

//Welcome page after susccesful sign up
app.post('/welcome', function(req, res){
    var username = req.body.username;
    var mail = req.body.email;
    var pass = req.body.password;
    var sql = "insert into user (`username`, `mail`, `pass`) VALUES ?"
    var values = [
        [username, mail, pass]
    ];
    //Check validity
    req.check('username', 'Enter username').not().isEmpty();
	req.assert('email', 'invalid email address').isEmail();
	req.check('password', 'invalid password').isLength({min: 4}).equals(req.body.confirmpassword);
	var errors = req.validationErrors();
	if (errors) {
	  console.log(errors);
	  req.session.errors = errors;
      req.session.success = false;
      //If errors then please revert back to signup page
	  res.redirect(301, '/signup');
	}
	else {
        req.session.success = true;
        db.query(sql, [values], function(error, rows){
            if(error) throw error;
            res.send("<h1>Welcome to coderlust</h1><br><br><b>To continue, Please go back to <a href='http://localhost:9000/'>Home</a> page and log-in</b>"); 
        });
    }
});

//Upload Photo on site
app.get('/upload', function(req, res){
    res.render('upload');
});

app.post('/upload', upload.single('imageupload'),function(req, res) {
  res.send("Thanks for uploading.. We will notify you once the content gets approved!");
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

//Listen on 9000 port
var server = app.listen(9000, function(){
    var port = server.address().port;

    console.log("Your app is running at http://localhost:%s", port);
});