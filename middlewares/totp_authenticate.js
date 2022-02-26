const passport = require("passport");
const helper = require('../helpers/common')
module.exports = (req, res, next) => {
    passport.authenticate('totp', { failureRedirect: '/verify-otp' }, function(err, user, info) {
        

        req.session.authFactors = [ 'totp' ]
        //req.locals.loggedInUser = user;
        next();

    })(req, res, next);
};


