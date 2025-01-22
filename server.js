const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

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

// Connect to MongoDB (no deprecated options needed now)
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));
  const orderSchema = new mongoose.Schema({
    userId: String,
    items: [String], // Array of item names
    totalPrice: Number,
    paymentMethod: String,
    deliveryAddress: {
        name: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    },
    date: { type: Date, default: Date.now },
});

// Define the Order model
const Order = mongoose.model('Order', orderSchema);

// Save order route
app.post('/api/order', async (req, res) => {
    try {
        const { items, totalPrice, paymentMethod, deliveryAddress } = req.body;

        const order = new Order({
            userId: req.session.user ? req.session.user._id : 'guest',
            items,
            totalPrice,
            paymentMethod,
            deliveryAddress,
        });

        await order.save();
        res.status(201).send({ message: 'Order placed successfully', orderId: order._id });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to place the order' });
    }
});

// User schema for MongoDB
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Serve static files (CSS, JS)
app.use(express.static('public'));

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    req.session.user = user;
    res.redirect('/food-menu.html'); // Redirect to food menu page after login
  } else {
    res.redirect('/login.html');
  }
});

// Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html'); // Redirect to login page after logout
  });
});

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/login.html');
  }
}

// Protect routes that require login
app.use('/food-menu.html', isLoggedIn);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
