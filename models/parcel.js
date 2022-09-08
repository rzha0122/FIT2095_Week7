const mongoose = require('mongoose');

const parcelSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'Senders'
    },
    address: { type: String, required: true },
    weight: { type: Number,
        required: true,
        validate: {
            validator: function (weightValue) {
                return weightValue > 0;
            },
            message: 'Weight should be greater than 0'
        }
    },
    fragile: { type: Boolean, required: true },
    cost: { type: Number,
        required: true,
        validate: {
            validator: function (costValue) {
                return costValue > 0;
            },
            message: 'Cost should be greater than 0'
        }
    },

});

module.exports = mongoose.model('Parcels', parcelSchema);