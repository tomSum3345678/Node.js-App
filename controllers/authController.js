// controllers/authController.js
const passport = require('passport');
const User = require('../models/User');

// Display login page
exports.showLoginPage = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('login', {
    title: 'Login',
    messages: req.session.messages || []
  });
  req.session.messages = [];
};

// Process local login
exports.processLogin = (req, res, next) => {
  // Check if form data exists
  if (!req.fields || !req.fields.email || !req.fields.password) {
    console.log('Missing credentials in request fields:', req.fields);
    req.session.messages = ['Please provide email and password'];
    return res.redirect('/login');
  }
  
  console.log('Login attempt with email:', req.fields.email);
  
  // Manually assign req.fields values to req.body so Passport can access them
  req.body = {
    email: req.fields.email,
    password: req.fields.password
  };

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return next(err);
    }

    if (!user) {
      console.log('Authentication failed:', info.message);
      req.session.messages = [info.message || 'Invalid email address or password'];
      return res.redirect('/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }

      console.log('User logged in successfully:', user.email);
      const redirectTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      return res.redirect(redirectTo);
    });
  })(req, res, next);
};

// Handle Google login
exports.googleCallback = (req, res) => {
  console.log('Render Log - Google Callback User:', req.user);
  console.log('Render Log - Session:', req.session);
  const redirectTo = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};

// Handle logout
exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  });
};

// Check authentication status
exports.checkAuthStatus = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        userId: req.user.userId,
        email: req.user.email,
        displayName: req.user.displayName,
        role: req.user.role,
        picture: req.user.picture
      }
    });
  } else {
    res.json({
      authenticated: false
    });
  }
};

exports.showSignupPage = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('signup', {
    title: 'Signup',
    messages: req.session.messages || []
  });
  req.session.messages = [];
};

exports.processSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.fields;

    if (!email || !password || !confirmPassword) {
      req.session.messages = ['Please fill in all required fields'];
      return res.redirect('/signup');
    }

    if (password !== confirmPassword) {
      req.session.messages = ['Passwords do not match'];
      return res.redirect('/signup');
    }

    if (password.length < 6) {
      req.session.messages = ['Password must be at least 6 characters long'];
      return res.redirect('/signup');
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.session.messages = ['Email is already registered'];
      return res.redirect('/signup');
    }


    const generateUserId = async () => {
      const randomNum = Math.floor(Math.random() * 900000) + 100000;
      const userId = `USER${randomNum}`;
      const existingUser = await User.findOne({ userId });
      if (existingUser) {
        return generateUserId();
      }
      return userId;
    };

    const userId = await generateUserId();


    const newUser = new User({
      userId,
      email,
      password, 
      firstName,
      lastName,
      provider: 'local',
      role: 'end-user',
      permissions: ['view_products', 'place_orders'],
      createdAt: new Date(),
      lastLogin: new Date()
    });

    await newUser.save();

    console.log('New user created:', newUser.email, 'with userId:', newUser.userId);

    req.session.messages = ['Account created successfully! Please log in'];
    res.redirect('/login');
  } catch (error) {
    console.error('Error during signup:', error);
    req.session.messages = ['An error occurred during signup. Please try again later'];
    res.redirect('/signup');
  }
};
