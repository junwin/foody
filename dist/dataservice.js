//  basic dataservices for Foody
"use strict";
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
// Save a set of food items
var saveFoodItems = function (url, foodRecords) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        insertDocuments(db, foodRecords, function (err, result) {
            db.close();
        });
    });
};
module.exports.saveFoodItems = saveFoodItems;
//  Mongo CRUD functions
var insertDocuments = function (db, foodRecord, callback) {
    // Get the documents collection
    var collection = db.collection('foodrecords');
    // Insert some documents
    collection.insertMany(foodRecord, function (err, result) {
        assert.equal(err, null);
        assert.equal(foodRecord.length, result.result.n);
        assert.equal(foodRecord.length, result.ops.length);
        console.log("Inserted 1 documents into the collection");
        callback(err, result);
    });
};
var getFoodItems = function (url, userId, startDate, endDate, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        findDocuments(db, userId, startDate, endDate, callback);
    });
};
module.exports.getFoodItems = getFoodItems;
var deleteFoodItems = function (url, userId, startDate, endDate, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        deleteDocuments(db, userId, startDate, endDate, callback);
    });
};
module.exports.deleteFoodItems = deleteFoodItems;
var deleteFoodItemsOnDate = function (url, userId, date, callback) {
    var startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    var endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    deleteFoodItems(url, userId, startDate, endDate, callback);
};
module.exports.deleteFoodItemsOnDate = deleteFoodItemsOnDate;
var findDocuments = function (db, userIdent, startDate, endDate, callback) {
    // Get the documents collection
    var collection = db.collection('foodrecords');
    // Find some documents
    // ,{ "userId" : userIdent }
    collection.find({
        "timestamp": { "$gte": new Date(startDate), "$lt": new Date(endDate) }, "userId": userIdent
    }).sort({ foodRecordDate: 1 }).toArray(function (err, docs) {
        assert.equal(err, null);
        db.close();
        callback(docs);
    });
};
var deleteDocuments = function (db, userIdent, startDate, endDate, callback) {
    // Get the documents collection
    var collection = db.collection('foodrecords');
    var filter = { "foodRecordDate": { "$gte": new Date(startDate), "$lt": new Date(endDate) }, "userId": userIdent };
    var res = collection.deleteMany(filter, function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
        //db.close();
        callback(result);
    });
};
//# sourceMappingURL=dataservice.js.map