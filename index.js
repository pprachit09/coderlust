var express = require('express');
var app = express();

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', function(req, res){
    res.render('index');
});

app.get('/quit', function(req, res){
    res.send('Bye Express');
});

var server = app.listen(9000, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Your app is running at http://%s:%s", host, port);
});