var passport = require('passport');
var googleAuth = require('passport-google-oauth20');
var keys = require('./keys');
var db = require('../db/db');

passport.use(
    new googleAuth({
    //Parameters of google login
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clinentID,
        clientSecret: keys.google.clientSecret
    }, function(accessToken, refreshToken, profile,done){
    //Callback function of passport
        //console.log(profile);
        var sql = "insert into Google (`ID`, `displayName`, `objectType`) VALUES ?"
        var values = [
            [profile.id, profile.displayName, profile.gender    ]
        ];
        db.query(sql, [values], function(error, rows){
            if(error) throw error; 
        });
    })
)
