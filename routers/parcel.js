const mongoose = require('mongoose');

const Sender = require('../models/sender');
const Parcel = require('../models/parcel');

module.exports = {

    getByAddress: function (req, res) {
        Parcel.find({address: req.query.address })
        .populate('sender')
        .exec(function (err, parcel) {
            if (err) return res.json(err);
            if (!parcel) return res.json();
            res.json(parcel);
        })
    },

    updateOne: function (req, res) {
        console.log(req.body._id);
        console.log(req.body.address);
        Parcel.findByIdAndUpdate(req.body._id, {address: req.body.address }, function (err, parcel) {
            if (err) return res.status(400).json(err);
            if (!parcel) return res.status(404).json();

            res.json(parcel);
        });
    },

    deleteById: function (req, res) {
        Parcel.findByIdAndDelete(req.body._id, function (err, parcel) {
            if (err) return res.status(400).json(err);
            if (!parcel) return res.status(404).json();
        })
    },

    updateAndIncrement: function (req, res) {
        Parcel.findByIdAndUpdate(req.body._id, {$inc: { cost: 10 } }, function (err, parcel) {
            if (err) return res.status(400).json(err);
            if (!parcel) return res.status(404).json();

            res.json(parcel);
        })
    }


};