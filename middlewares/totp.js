const passport = require("passport");
const helper = require('../helpers/common')
module.exports = (req, res, next) => {
    passport.use(new TotpStrategy(
        function(user, done) {
          TotpKey.findOne({ userId: user._id }, function (err, key) {
            if (err) { return done(err); }
            return done(null, key.key, key.period);
          });
        }
      ));
};