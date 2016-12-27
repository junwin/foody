// FoodLineInterpret


// Interpretation - will swith to LUIS soon
import { FoodRecord } from "./foodyTypes";
import { Kvp } from "./foodyTypes";


export var getFoodRecords = function (inputText: string, timestamp: Date, userId: string, userName: string): FoodRecord[] {
    var tsDate = timestamp;
    var inputLine = inputText;
    var foodItems = inputLine.split(",");
    var foodDate = getFoodDate(inputLine, timestamp);
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
            foodValue: getFoodValue(foodItems[item]),
            calories: getCalories(foodItems[item])
        };
        foodRecords.push(foodRecord);
    }
    return foodRecords;
}
module.exports.getFoodRecords = getFoodRecords;

export var getFoodValue = function (foodEntryText: string): number {
    var pos = foodEntryText.indexOf("p=");
    let val = 0;
    if (pos >= 0) {
        val = parseInt(foodEntryText.substring(pos + 2, pos + 4));
    }

    return val;

}
module.exports.getFoodValue = getFoodValue;


export var getNextKVP = function (entryText: string): Kvp {

    var kvpParts = entryText.split(":");
    let k = new KVP("", "");

    if (kvpParts.length > 1) {
        k = new KVP(kvpParts[0], getNextWord(kvpParts[1]));
    }

    return k;
}
module.exports.getNextKVP = getNextKVP;


export var getNextWord = function (text: string): string {
    // wordbreaks are " ", "," or end of text
    let word = "";
    for (var i = 0; i < text.length; i++) {
        if (text[i] == " " || text[i] == ",") {
            break;
        }
        word += text[i];
    }
    return word;
}

module.exports.getNextWord = getNextWord;

export var getFoodDate = function (foodEntryText: string, defaultDate: Date): Date {
    var pos = foodEntryText.indexOf("d:");
    let val = new Date(defaultDate);
    if (pos >= 0) {
        var kvp = getNextKVP(foodEntryText.substring(pos));
        val = new Date(kvp.value);

    }
    return val;
}
module.exports.getFoodDate = getFoodDate;

export var getCalories = function (foodEntryText: string): number {
    var pos = foodEntryText.indexOf("c=");
    let val = 0;
    if (pos >= 0) {
        val = parseInt(foodEntryText.substring(pos + 2, pos + 5));
    }

    return val;

}
module.exports.getCalories = getCalories;

class KVP {
    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    key: string;
    value: string;
}

