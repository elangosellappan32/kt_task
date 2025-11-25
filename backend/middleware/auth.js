// Ensure user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/login');
};

// Ensure user is admin
exports.ensureAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  req.flash('error_msg', 'Unauthorized');
  res.redirect('/dashboard');
};