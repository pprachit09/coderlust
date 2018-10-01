var router = require('express').Router();
var passport =require('passport');

//SSO login with google
router.get('/google', passport.authenticate('google',{
    scope: ['profile']
}));

//logout 
router.get('/logout', function(req, res){
    //handling with passport
});

//Route back from google
router.get('/google/redirect', passport.authenticate('google'), function(req, res){
    res.send("Done");
});

module.exports = router;