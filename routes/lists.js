const express = require('express');
const passport = require('passport');
const Task  = require('../models/Task');
const List  = require('../models/List');

const router = express.Router();

/**
 * Create a new todo list of logged in user
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    new List({
    	name: req.body.name,
    	user: req.user,
    	tasks: []
    })
    .save()
    .then(list => res.json({id: list.id}))
    .catch(err => console.log(err));
});

/**
 * Get whole list of todo list
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    List.find({user: req.user})
    	.then(list => res.json(list))
    	.catch(err => console.log(err));
});


/**
 * Add new task i list
 */
router.post('/:id/tasks', passport.authenticate('jwt', { session: false }), (req, res) => {
    List.findById(req.params.id)
    	.then(list=> {
    		const task = new Task({name: req.body.name})
    		list.tasks.push(task);
    		list.save()
    			.then(list => res.json(list))
    			.catch(err => console.log(err));
    	})
    	.catch(err => console.log(err));
});

/**
 * Get tasks of a list
 */
router.get('/:id/tasks', passport.authenticate('jwt', { session: false }), (req, res) => {
    List.find({'_id': req.params.id, user: req.user})
        .then(list => res.json(list))
        .catch(err => console.log(err))
});

module.exports = router;
