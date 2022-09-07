const mongoose = require('mongoose');

const Sender = require('../models/sender');
const Parcel = require('../models/parcel');

module.exports = {

    getAll: function (req, res) {
        Sender.find({sender: req.params.sender })
        .populate('parcels')
        .exec(function (err, sender) {
            if (err) return res.json(err);
            if (!sender) return res.json();
            res.json(sender);
        });
    },


    createOne: function (req, res) {
        console.log(req.body);
        let newSenderDetails = req.body;
        console.log(newSenderDetails);
        newSenderDetails._id = new mongoose.Types.ObjectId();
        console.log(newSenderDetails);

        Sender.create(newSenderDetails, function (err, sender) {
            if (err) return res.status(400).json(err);
            console.log('Sender added');
            res.json(sender);
        });

    },

    deleteOne: function (req, res) {
        Sender.findOneAndRemove({_id: req.body }, function (err) {
            if (err) return res.status(400).json(err);

            res.json();
        });
    },

    updateOne: function (req, res) {
        Sender.findByIdAndUpdate(req.body._id, {sender: req.body.sender }, function (err, sender) {
            if (err) return res.status(400).json(err);
            if (!sender) return res.status(404).json();
            
            res.json(sender);

        });
    },

    addParcel: function (req, res) {

        Sender.findOne({_id: req.body._id }, function (err, sender) {
            if (err) return res.status(400).json(err);
            if (!sender) return res.status(404).json();


            let parcel = req.body.parcel;
            parcel._id = mongoose.Types.ObjectId();
            parcel.sender = mongoose.Types.ObjectId(req.body._id);

            let parcelObject = new Parcel(parcel);

            parcelObject.save(function (err) {
                console.log("Saved parcel");
            });

            sender.parcels.push(parcelObject)
            sender.save(function (err) {
                if (err) return res.status(500).json(err);
                
                res.json(sender);
            });
        });
    }



};