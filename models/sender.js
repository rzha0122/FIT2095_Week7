const mongoose = require('mongoose');

const senderSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    sender: {
        type: String,
        required: true,
        validate: {
            validator: function (senderValue) {
                return senderValue.length > 3;
            },
            message: 'Name should be greater than 3 characters'
        }
    },
    parcels: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Parcels'
    }]
    

});

module.exports = mongoose.model('Senders', senderSchema);