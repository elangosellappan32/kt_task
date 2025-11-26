const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../models');

module.exports = function(passport) {
  // // Setting up the login with password and username
  passport.use(
    new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
      try {
        const user = await db.User.scope('withPassword').findOne({ where: { username } });
        
        if (!user) {
          return done(null, false, { message: 'That username is not registered' });
        }

        // check the matched password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  // save user ID into the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // load the user data from the session ID
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};