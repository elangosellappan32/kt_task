const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login Page
router.get('/login', (req, res) => res.render('auth/login'));

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { 
      return next(err); 
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});

module.exports = router;
