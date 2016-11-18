"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


/******************** MONGO **********************/
const {MongoClient} = require("mongodb");
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  // We have a connection to the "tweeter" db, starting here.
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  const collection = db.collection('tweets');

  collection.find().toArray(function (err, result) {
    if (err) {
      console.log(err);
    } else if (result.length) {
      console.log('Found:', result);
    } else {
      console.log('No document(s) found with defined "find" criteria!');
    }
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

    var trialDB = {}
    delete result['_id'];
    trialDB['tweets'] = result;

    console.log("trialDB ---->", trialDB);

    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("result ---->", result);

    //Close connection
    // db.close();
  });

  // const trialDB = db.tweets(`{MONGODB_URI}`).find();
});
/******************** MONGO **********************/



// The in-memory database of tweets. It's a basic object with an array in it.
const db = require("./lib/in-memory-db");

console.log("db ---->", db);
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
// The `data-helpers` module provides an interface to the database of tweets.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// require it and pass the `db` parameter immediately:
const DataHelpers = require("./lib/data-helpers.js")(db);

// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.
const tweetsRoutes = require("./routes/tweets")(DataHelpers);

// Mount the tweets routes at the "/tweets" path prefix:
app.use("/tweets", tweetsRoutes);

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
