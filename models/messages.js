var mongoose = require('mongoose');

var MessageSchema = mongoose.Schema({

    name: {
        type: String,

    },
    phone: {
        type: String,

    },
    message: {
        type: String,

    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
    }


});

var Messages = module.exports = mongoose.model('Messages', MessageSchema);