//validate auth for admin
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view the resource');
  res.redirect('/login');
};

//role check for admin
exports.ensureAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  req.flash('error_msg', 'Unauthorized');
  res.redirect('/dashboard');
};