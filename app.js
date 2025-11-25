const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');
require('dotenv').config();

//database connection comes before the passport
const db = require('./backend/models');


const app = express();

// checking the database connection 
async function startServer() {
  try {
    // Connecting to database
    await db.sequelize.authenticate();
    console.log('Database connected...');
    
    // prepare passport after DB is connected
    require('./backend/config/passport')(passport);
    
    // prepare routes and middlewares
    setupApp();
    
    // getting server is started 
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

function setupApp() {
  // prepare view template
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.set('view options', { pretty: true });  // better ui experience

  // setting up Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(methodOverride('_method'));

  // setting up sessions
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  }));

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Flash message
  app.use(flash());

  // Global variable for success and error message 
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.csrfToken = ''; // Empty token for now
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });

  // routes for backend 
  app.use('/', require('./backend/routes'));
}

startServer();

module.exports = app;