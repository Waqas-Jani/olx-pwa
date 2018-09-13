var mongoose = require('mongoose');

var viewSchema = mongoose.Schema({
    _postId: {
        type: String,
        required: true
    },
    _userId: {
        type: String,
        required: true,
    },
});

var View = module.exports = mongoose.model('ViewLater', viewSchema);
