let express = require("express");
let app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: false }));


app.listen(8080);


// MONGOOSE
const mongoose = require('mongoose');

const senders = require('./routers/sender');
const parcels = require('./routers/parcel');

// const url = 'mongodb://localhost:27017/POMS'
const url = 'mongodb://10.128.0.2:27017'
mongoose.connect(url, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }

    console.log('Successfully connected to Mongoose');

});

// SENDER
app.get('/sender/:sender', senders.getAll);
app.post('/sender', senders.createOne);
app.delete('/sender', senders.deleteOne);
app.put('/sender', senders.updateOne);
app.put('/sender/parcel', senders.addParcel);

// PARCEL
app.get('/parcel', parcels.getByAddress);
app.put('/parcel', parcels.updateOne);