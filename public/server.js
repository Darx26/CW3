//Import dependencies modules
const express = require('express')
const path = require("path");
//const bodyParser = require('body-parser)

//Create an Express.js instance:
const app = express()

//config Express.js
app.use(express.json())
app.set('port', 3000)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next();
})

//logger middleware
app.use(function (req, res, next) {
    console.log("In comes a " + req.method + " to " + req.url);
    next();
});

// Static file middleware for serving images
const imagePath = path.resolve(__dirname, "images");
app.use('/images', express.static(imagePath));

// Custom middleware for handling non-existent images only when the path starts with "/images"
app.get('/images', (req, res, next) => {
    // Check if the file exists
    const filePath = path.join(imagePath, req.url);

    if (!require('fs').existsSync(filePath)) { //checks if file exists in filePath
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("Image not found");
    } else {
        // If the file exists, continue to the next middleware
        next();
    }
});

//connect to MongoDB
const MongoClient = require('mongodb').MongoClient;

let db;

MongoClient.connect('mongodb+srv://haydenfdes:hayden26@cluster0.biskd8a.mongodb.net', (err, client) => {
    db = client.db('cw2')
})

//display a message for root path to show that API is working
app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/lessons')
})

//get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    //console.log('collection name:', req.collection)
    return next()
})

//retrieve all the objects from a collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((err, results) => {
        if (err) return next(err)
        res.send(results)
    })
})

//post object into collection
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insertOne(req.body, (err, results) => {
        if (err) return next(err)
        res.send(results.ops) //to send unique id
    })
})

const ObjectID = require('mongodb').ObjectID
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (err, result) => {
        if (err) return next(err)
        res.send(result)
    })
})

//to update records
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
        { _id: new ObjectID(req.params.id) },
        { $set: req.body },
        { safe: true, multi: false }, //to update only once the code is fully executed safely without errors
        (err, result) => {
            if (err) return next(err)
            res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' })
        }
    )
})

//GET to perform back-end search
app.get('/collection/:collectionName/search/:k', (req, res) => {
    const key = req.params.k.toLowerCase();

    console.log("Searched term: " + key); //logs searched term

    const searchQuery = { //checks subject and location field for searched term
        $or: [
            { subject: { $regex: new RegExp(key, "i") } },
            { location: { $regex: new RegExp(key, "i") } }
        ]
    };

    req.collection.find(searchQuery).toArray((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        res.send(results); //sends results back
    });
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Running")
})