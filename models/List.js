const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Task = require('../models/Task');

const ListSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId, ref: 'user',
        select: false,
    },
    tasks: [{type: Task.schema}]
});

module.exports = List = mongoose.model('list', ListSchema);