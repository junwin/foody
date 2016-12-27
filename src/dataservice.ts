//  basic dataservices for Foody

import { FoodRecord } from "./foodyTypes";
import { Kvp } from "./foodyTypes";


var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');


// Save a set of food items
var saveFoodItems = function (url: string, foodRecords: FoodRecord[]) {

    MongoClient.connect(url, function (err: any, db: any) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        insertDocuments(db, foodRecords, function (err: any, result: any) {
            db.close();
            
        });
    });
}

module.exports.saveFoodItems = saveFoodItems;


//  Mongo CRUD functions
var insertDocuments = function (db: any, foodRecord: any, callback: any) {
    // Get the documents collection
    var collection = db.collection('foodrecords');
    // Insert some documents
    collection.insertMany(foodRecord, function (err: any, result: any) {
        assert.equal(err, null);
        assert.equal(foodRecord.length, result.result.n);
        assert.equal(foodRecord.length, result.ops.length);
        console.log("Inserted 1 documents into the collection");
        callback(err, result);
    });
}


var getFoodItems = function (url: string, userId: string, startDate: Date, endDate: Date, callback: any) {

    MongoClient.connect(url, function (err: any, db: any) {
        assert.equal(null, err);

        console.log("Connected successfully to server");
        findDocuments(db, userId, startDate, endDate, callback);
    });

}

module.exports.getFoodItems = getFoodItems;

var deleteFoodItems = function (url: string, userId: string, startDate: Date, endDate: Date, callback: any) {

    MongoClient.connect(url, function (err: any, db: any) {
        assert.equal(null, err);

        console.log("Connected successfully to server");
        deleteDocuments(db, userId, startDate, endDate, callback);
    });

}

module.exports.deleteFoodItems = deleteFoodItems;

var deleteFoodItemsOnDate = function (url: string, userId: string, date: Date, callback: any) {
    let startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    deleteFoodItems(url, userId, startDate, endDate, callback);
}

module.exports.deleteFoodItemsOnDate = deleteFoodItemsOnDate;

var findDocuments = function (db: any, userIdent: string, startDate: Date, endDate: Date, callback: any) {
    // Get the documents collection
    var collection = db.collection('foodrecords');
    // Find some documents
    // ,{ "userId" : userIdent }
    collection.find({
        "timestamp": { "$gte": new Date(startDate), "$lt": new Date(endDate) }, "userId": userIdent
    }).sort({ foodRecordDate: 1 }).toArray(function (err: any, docs: any) {
        assert.equal(err, null);
        db.close();
        callback(docs);
    });
}


var deleteDocuments = function (db: any, userIdent: string, startDate: Date, endDate: Date, callback: any) {
    // Get the documents collection
    var collection = db.collection('foodrecords');
    let filter = { "foodRecordDate": { "$gte": new Date(startDate), "$lt": new Date(endDate) }, "userId": userIdent };
    let res = collection.deleteMany(filter, function (err: any, result: any) {
        if (err) {
            console.log(err);
        }
        console.log(result);
        //db.close();
        callback(result);
    });
}

