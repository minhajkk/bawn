const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', (req, res) => {

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

router.post('/login', (req, res) => {
	const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(400).json({ email: "User account does not exist" });

        } else {
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    const payload = { id: user.id, name: user.name };

                    // Sign Token
                    jwt.sign(
                        payload,
                        'worsKeptSecret', { expiresIn: 3600 },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token,
                                name: user.name
                            });
                        }
                    );


                } else {
                    return res.status(400).json({ email: "Passwords is invalid" });
                }
            })
        }
    })
});

// Me route
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({ "me": req.user })
});

module.exports = router;