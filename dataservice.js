var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var ds = function(mongoUrl) {
    this.url = mongoUrl;
    this.saveVal = "xyxyxy";
    this.save = function(zz) {
        this.saveVal = zz;
    }

}

module.exports.ds = ds;

// Save a set of food items
var saveFoodItems = function(url, foodArray) {

    MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);            
            console.log("Connected successfully to server");
            insertDocuments(db, foodArray, function() {           
                db.close();
            });
        });
}

module.exports.saveFoodItems = saveFoodItems;

  
//  Mongo CRUD functions
var insertDocuments = function(db, foodRecord, callback) {
  // Get the documents collection
  var collection = db.collection('foodrecords');
  // Insert some documents
  collection.insertMany(foodRecord, function(err, result) {
            assert.equal(err, null);
            assert.equal(foodRecord.length, result.result.n);
            assert.equal(foodRecord.length, result.ops.length);
            console.log("Inserted 1 documents into the collection");
            callback(result);
        });
}


var getFoodItems = function(url, userId, startDate, endDate, callback) {

    MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);

            console.log("Connected successfully to server");
            findDocuments(db, userId, startDate, endDate, callback);
        });

}

module.exports.getFoodItems = getFoodItems;


var findDocuments = function(db, userIdent, startDate, endDate, callback) {
  // Get the documents collection
  var collection = db.collection('foodrecords');
  // Find some documents
  // ,{ "userId" : userIdent }
  collection.find( {
          "timestamp" : { "$gte" : new Date(startDate), "$lt" : new Date(endDate) }, "userId" : userIdent      
    }  ).sort({foodRecordDate: 1}).toArray(function(err, docs) {
    assert.equal(err, null);
    db.close();
    callback(docs);
  });
}

