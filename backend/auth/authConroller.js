const db = require('../models');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Show login form
exports.showLogin = (req, res) => {
  res.render('auth/login');
};

// Handle login
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('error_msg', info.message);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
};

// Logout
exports.logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
};

// Show registration form
exports.showRegister = (req, res) => {
  res.render('auth/register');
};

// Handle registration
exports.register = async (req, res) => {
  const { username, password, password2 } = req.body;
  let errors = [];

  // Validate fields
  if (!username || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    return res.render('auth/register', {
      errors,
      username
    });
  }

  try {
    // Check if user exists
    const user = await db.User.findOne({ where: { username } });
    if (user) {
      errors.push({ msg: 'Username is already registered' });
      return res.render('auth/register', {
        errors,
        username
      });
    }

    // Create new user
    const newUser = new db.User({
      username,
      password,
      role: 'user' // Default role
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error_msg', 'Error during registration');
    res.redirect('/register');
  }
};