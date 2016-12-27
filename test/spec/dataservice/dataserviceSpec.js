describe("DataService", function () {
  var DataService = require('../../../dist/dataservice');
  var lineInterpreter = require('../../../dist/foodLineInterpret');
  var ds
  var url = process.env.MONGO_CONN_URL || "mongodb://localhost:27017/myproject";
  var foodRecords;
  var timestamp = new Date();


  beforeEach(function () {
    // ds = new DataService.ds("aaa");
    foodRecords = lineInterpreter.getFoodRecords("3 eggs p=6", timestamp, "fred123", "fred");
    url = process.env.MONGO_CONN_URL || "mongodb://localhost:27017/myproject";
  });

  it("should be able to connect", function () {
    DataService.saveFoodItems(url, foodRecords, function (err, resuly) {
      expect(err).toEqual(null);
    });
    //expect(ds.saveVal).toEqual("xx");
  });

  it("should be able to Add and restore", function () {

    let endDate = new Date();
    //let startDate = new Date(endDate.getFullYear, endDate.getMonth, endDate.getDay,0,0,0,0);
    let startDate = new Date(endDate);
    startDate.setHours(0, 0, 0, 0);
    let userId = "fred" + startDate.getTime();
    let recs = lineInterpreter.getFoodRecords("33 eggs p=99", timestamp, userId, "fred");


    var d;
    var flag;
    runs(function () {
      DataService.saveFoodItems(url, recs, function (err, resuly) {
        expect(err).toEqual(null);
      });
      DataService.getFoodItems(url, userId, startDate, endDate, function (docs) {
        d = docs;
        flag = true;
      });
    });

    waitsFor(function () { return flag; }, "query should have run", 1050);

    runs(function () {
      expect(d.length).toEqual(1);
    });


  });

  it("should be able to Add delete", function () {

    let endDate = new Date();
    //let startDate = new Date(endDate.getFullYear, endDate.getMonth, endDate.getDay,0,0,0,0);
    let startDate = new Date(endDate);
    startDate.setHours(0, 0, 0, 0);
    let userId = "fred" + startDate.getTime();
    let recs = lineInterpreter.getFoodRecords("33 eggs p=99", timestamp, userId, "fred");
    var d;
    var flag;

    runs(function () {
      DataService.saveFoodItems(url, recs, function (err, result) {
        expect(err).toEqual(null);
      });

      DataService.deleteFoodItems(url, userId, startDate, endDate, function (x) {
        console.log("deleted items");
      });


      DataService.getFoodItems(url, userId, startDate, endDate, function (docs) {
        d = docs;
        flag = true;
      });

    });

    waitsFor(function () { return flag; }, "query should have run", 1050);

    runs(function () {
      expect(d.length).toEqual(0);
    });


  });

   it("should be able delete for some specific date and user", function () {

    let endDate = new Date();
    //let startDate = new Date(endDate.getFullYear, endDate.getMonth, endDate.getDay,0,0,0,0);
    let startDate = new Date(endDate);
    startDate.setHours(0, 0, 0, 0);
    let userId = "fred" + startDate.getTime();
    let recs = lineInterpreter.getFoodRecords("33 eggs p=99", timestamp, userId, "fred");
    var d;
    var flag;

    runs(function () {
      DataService.saveFoodItems(url, recs, function (err, resuly) {
        expect(err).toEqual(null);
      });

      DataService.deleteFoodItemsOnDate(url, userId, endDate, function (x) {
        console.log("deleted items");
      });


      DataService.getFoodItems(url, userId, startDate, endDate, function (docs) {
        d = docs;
        flag = true;
      });

    });

    waitsFor(function () { return flag; }, "query should have run", 1050);

    runs(function () {
      expect(d.length).toEqual(0);
    });


  });

  describe("dateservice crud", function () {
    /*
   beforeEach(function() {
     ds = new dataservice;
   });

   it("should be able to insert", function() {
     expect(player.isPlaying).toBeFalsy();

     // demonstrates use of 'not' with a custom matcher
     expect(player).not.toBePlaying(song);
   });
   */

  });

});
