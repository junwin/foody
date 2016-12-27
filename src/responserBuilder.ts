// responseBuilder

import { FoodRecord } from "./foodyTypes";

var buildResponse = function (docs: FoodRecord[]) {

    var responseMsg = "";
    let totFoodValue = 0;
    let currDay = -1;

    for (var i in docs) {
        //var recordDate = convertUTCDateToLocalDate(docs[i].foodRecordDate);
        var recordDate = docs[i].foodRecordDate;

        if (currDay == -1) {
            currDay = recordDate.getDay();
            responseMsg = responseMsg + recordDate.toDateString() + "\n\n";
        }
        if (currDay != recordDate.getDay()) {
            currDay = recordDate.getDay();
            responseMsg = responseMsg + "foodValue:" + totFoodValue + "\n\n";
            responseMsg = responseMsg + recordDate.toDateString() + "\n\n";
            totFoodValue = 0;
        }

        totFoodValue += docs[i].foodValue;

        //responseMsg = responseMsg + convertUTCDateToLocalDate(recordDate).toDateString() + ": " + docs[i].text + "\n\n";
        responseMsg = responseMsg + docs[i].text + "\n\n";

    }
    if (totFoodValue > 0) {
        responseMsg = responseMsg + "foodValue:" + totFoodValue + "\n\n";
    }
    return responseMsg;
}
module.exports.buildResponse = buildResponse;


// Date functions
function convertUTCDateToLocalDate(date: Date): Date {

    let offset = date.getTimezoneOffset() * 60 * 1000;
    if (offset == 0) {
        // force it to work on skype for US Central grrrr.
        offset = 6 * 3600000;
    }
    let newDate = new Date(date.getTime() - offset);

    //console.log('date: %s  offset: %s  newDate %s',date, offset, newDate); 
    //var offset = date.getTimezoneOffset() / 60;
    //var hours = date.getHours();

    //newDate.setHours(hours - offset);

    return newDate;
}

