const mongoose = require('mongoose');

// pass javascript object in Schema - > holds custom configuration.

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema);

