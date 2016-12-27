// FoodLineInterpret
"use strict";
exports.getFoodRecords = function (inputText, timestamp, foodDate, userId, userName) {
    var tsDate = timestamp;
    var inputLine = inputText;
    var foodItems = inputLine.split(",");
    //var foodDate = getFoodDate(inputLine, timestamp);
    var foodRecords = [];
    for (var item in foodItems) {
        var foodRecord = {
            userId: userId,
            userName: userName,
            timestamp: tsDate,
            foodRecordDate: foodDate,
            text: foodItems[item],
            item: foodItems[item],
            qty: 0,
            units: "",
            foodValue: exports.getFoodValue(foodItems[item]),
            calories: exports.getCalories(foodItems[item])
        };
        foodRecords.push(foodRecord);
    }
    return foodRecords;
};
module.exports.getFoodRecords = exports.getFoodRecords;
exports.getFoodValue = function (foodEntryText) {
    var pos = foodEntryText.indexOf("p=");
    var val = 0;
    if (pos >= 0) {
        val = parseInt(foodEntryText.substring(pos + 2, pos + 4));
    }
    return val;
};
module.exports.getFoodValue = exports.getFoodValue;
exports.getNextKVP = function (entryText) {
    var kvpParts = entryText.split(":");
    var k = new KVP("", "");
    if (kvpParts.length > 1) {
        k = new KVP(kvpParts[0], exports.getNextWord(kvpParts[1]));
    }
    return k;
};
module.exports.getNextKVP = exports.getNextKVP;
exports.getNextWord = function (text) {
    // wordbreaks are " ", "," or end of text
    var word = "";
    for (var i = 0; i < text.length; i++) {
        if (text[i] == " " || text[i] == ",") {
            break;
        }
        word += text[i];
    }
    return word;
};
module.exports.getNextWord = exports.getNextWord;
exports.getFoodDate = function (foodEntryText, defaultDate) {
    var pos = foodEntryText.indexOf("d:");
    var val = new Date(defaultDate);
    if (pos >= 0) {
        var kvp = exports.getNextKVP(foodEntryText.substring(pos));
        val = new Date(kvp.value);
    }
    return val;
};
module.exports.getFoodDate = exports.getFoodDate;
exports.getCalories = function (foodEntryText) {
    var pos = foodEntryText.indexOf("c=");
    var val = 0;
    if (pos >= 0) {
        val = parseInt(foodEntryText.substring(pos + 2, pos + 5));
    }
    return val;
};
module.exports.getCalories = exports.getCalories;
var KVP = (function () {
    function KVP(key, value) {
        this.key = key;
        this.value = value;
    }
    return KVP;
}());
//# sourceMappingURL=foodLineInterpret.js.map