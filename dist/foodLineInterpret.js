// FoodLineInterpret
"use strict";
exports.getFoodValue = function (foodEntryText) {
    var pos = foodEntryText.indexOf("p=");
    var val = 0;
    if (pos >= 0) {
        val = parseInt(foodEntryText.substring(pos + 2, pos + 4));
    }
    return val;
};
module.exports.getFoodValue = exports.getFoodValue;
var getNextKVP = function (entryText) {
    var kvpParts = entryText.split(":");
    var k = new KVP("", "");
    if (kvpParts.length > 1) {
        var k_1 = new KVP(kvpParts[0], getNextWord(kvpParts[1]));
    }
    return k;
};
var getNextWord = function (text) {
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
//module.exports.getNextWord = getNextWord;
exports.getFoodDate = function (foodEntryText) {
    var pos = foodEntryText.indexOf("d:");
    var val = new Date();
    if (pos >= 0) {
        var kvp = getNextKVP(foodEntryText.substring(pos));
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