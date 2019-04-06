const express = require('express');
const mongoose = require('mongoose');
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

/* GET home page. */
app.get('/', (req,res) => res.json({
	msg: "Hello! Welcome to BAWN(Backend API with NodeJS)"
}));

app.post('/register', (req, res) => {

	const newUser = new User({
	    name: req.body.name,
	    email: req.body.email,
	    password: req.body.password
	});

	newUser
	    .save()
	    .then(user => res.json(user))
	    .catch(err => res.json(err));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
