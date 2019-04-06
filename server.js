const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
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

app.post('/register', (req, res) => {

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
