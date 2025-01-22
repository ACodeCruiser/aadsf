const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up session
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
}));

// Serve static files (CSS, JS, etc.)
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://khannusrat8220:N9310487906@cluster0.iecmf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));


// User schema for MongoDB
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Routes for HTML Pages
app.get('/index2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index2.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/category', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'category.html'));
});

app.get('/food-menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Food-Menu.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Contact.html'));
});

app.get('/cart', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'Cart.html'));
  } else {
    res.redirect('/login.html');  // Redirect to login if not logged in
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    req.session.user = user;
    res.redirect('/food-menu'); // Redirect to food menu page after login
  } else {
    res.redirect('/login'); // Redirect back to login page if invalid credentials
  }
});

// Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login'); // Redirect to login page after logout
  });
});

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/login'); // Redirect to login page if not logged in
  }
}

// Protect routes that require login (Food-Menu, Cart, etc.)
app.use('/food-menu', isLoggedIn);
app.use('/cart', isLoggedIn);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
