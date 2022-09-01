let express = require("express");
let app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use('/css', express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use('/js', express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use(express.static('images'))
app.use(express.static('css'));


// MONGOOSE
const mongoose = require('mongoose');
const Parcel = require('./models/parcel');

const url = 'mongodb://localhost:27017/POMS'
mongoose.connect(url, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }

    console.log('Successfully connected to Mongoose');

});



app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
})

app.get('/addparcel', function (req, res) {
    res.sendFile(__dirname + "/views/addparcel.html");
})

app.post('/addparcel', function (req, res) {
    let sender = req.body.sender;
    let address = req.body.address;
    let weight = parseFloat(req.body.weight);
    let fragile = (req.body.fragile === 'yes');
    let shipType = req.body.type;
    let cost = parseFloat(req.body.cost);

    if (sender.length < 3 || address.length < 3 || weight < 0) {
        res.sendFile(__dirname + "/views/invalid.html")
    }
    else {
        let parcel = new Parcel({
            _id: new mongoose.Types.ObjectId(),
            sender: sender,
            address: address,
            weight: weight,
            fragile: fragile,
            shipType: shipType,
            cost: cost
        })
        parcel.save(function (err) {
            if (err) throw err;
            console.log("Successfully added parcels")
        })
        res.redirect("/getparcels");
    }
})

app.get('/getparcels', function (req, res) {
    Parcel.find({}, function (err, docs) {
        res.render(__dirname + "/views/getparcels.html", {postDb: docs});
    });

})

app.post('/getbysender', function (req, res) {
    let sender = req.body.sender;
    let filter = { sender: sender };

    Parcel.find(filter, function (err, docs) {
        res.render(__dirname + "/views/getparcels.html", {postDb: docs});
    });

})

app.post('/getbyweight', function (req, res) {
    let weightOne = parseFloat(req.body.weightOne);
    let weightTwo = parseFloat(req.body.weightTwo)

    Parcel.where('weight').gte(weightOne).lte(weightTwo).exec(function (err, docs) {
        res.render(__dirname + "/views/getparcels.html", {postDb: docs});
    })

})

app.get('/deleteparcel', function (req, res) {
    res.render(__dirname + "/views/deleteparcel.html");
})

app.post('/deleteparcel', function(req, res) {
    let id = req.body.id;
    let sender = req.body.sender;
    let weight = parseFloat(req.body.weight);

    let deletion = req.body.deletion;

    if (id.length > 0) {
        let filter = { _id: mongoose.Types.ObjectId(id) };
        Parcel.deleteOne(filter, function (err, doc) {
            console.log("Successfully deleted");
        })
        res.redirect("/getparcels")
    }
    else if (sender.length > 0 && weight > 0) {
        let filter = { sender: sender, weight: weight };
        Parcel.deleteMany(filter, function (err, docs){
            console.log("Successfully deleted (many)");
        });
        res.redirect("/getparcels");
    }
    else if (deletion == 'weight') {
        let weight = parseFloat(req.body.deletionValue);
        let filter = { weight: weight };
        Parcel.deleteMany(filter, function (err, docs) {
            console.log("Successfullt deleted many");
        });
        res.redirect("/getparcels");
    }
    else if (deletion == 'address') {
        let address = req.body.deletionValue;
        let filter = { address: address };
        Parcel.deleteMany(filter, function (err, docs) {
            console.log("Successfully deleted many");
        });
        res.redirect("/getparcels")
    }
    else if (deletion =='fragile') {
        let fragile = (req.body.deletionValue == 'yes');
        let filter = { fragile: fragile };
        Parcel.deleteMany(filter, function (err, docs) {
            console.log("Successfully deleted many");
        });
        res.redirect("/getparcels");
    }
    else {
        res.sendFile(__dirname + "/views/invalid.html");
    }
})


app.get('/updateparcel', function (req, res) {
    res.sendFile(__dirname + "/views/updateparcel.html");
})


app.post("/updateparcel", function (req, res) {
    let id = req.body.id;
    let sender = req.body.sender;
    let address = req.body.address;
    let weight = parseFloat(req.body.weight);
    let fragile = (req.body.fragile === 'yes');
    let shipType = req.body.type;
    let cost = parseFloat(req.body.cost);

    let filter = { _id: mongoose.Types.ObjectId(id) };
    let theUpdate = {
      $set: {
        sender: sender,
        address: address,
        weight: weight,
        fragile: fragile,
        shipType: shipType,
        cost: cost,
      },
    };
    Parcel.updateOne(filter, theUpdate, function (err, doc) {
        console.log("Updated document");
    });
    res.redirect("/getparcels");

  });

app.use(function(req, res, next) {
    res.status(404);
    res.sendFile(__dirname + "/views/404.html");
})
app.listen(8080);