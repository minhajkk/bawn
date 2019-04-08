const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const app = express();

// Body parser middleware
app.use(express.urlencoded({ extended: false }));

const db = 'mongodb+srv://admin:admin@cluster0-rkrbc.mongodb.net/bawn_db?retryWrites=true';

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Init passport
app.use(passport.initialize());
require('./config/passport')(passport);

/* GET home page. */
app.get('/', (req,res) => res.json({
	msg: "Hello! Welcome to BAWN(Backend API with NodeJS)"
}));

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const listsRouter = require('./routes/lists');
app.use('/users/lists', listsRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
