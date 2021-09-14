const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    phone: {
        type: String
    },
    type: {
        type: String, 
        default: 'personal'
    },
    date: {
        type: Date, 
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        refer: 'user'
    }
});

module.exports = mongoose.model("contact", ContactSchema);