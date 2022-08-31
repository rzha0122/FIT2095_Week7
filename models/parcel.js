const mongoose = require('mongoose');

const parcelSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    sender: { type: String, required: true },
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
    shipType: { type: String, required: true },
    cost: { type: Number, required: true },

});

module.exports = mongoose.model('Parcels', parcelSchema);