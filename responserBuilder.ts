// responseBuilder
import { FoodRecord } from "./foodyTypes";

var buildResponse  = function(docs: FoodRecord[]) {

    var responseMsg = "";
            let totFoodValue =0;
            let currDay = -1;
                
            for (var i in docs)
            {
                var recordDate = new Date(docs[i].foodRecordDate);
                var tl = recordDate;
                //var tl = convertUTCDateToLocalDate(recordDate);
                if (currDay == -1) {
                    currDay = tl.getDay();
                    responseMsg = responseMsg + recordDate.toDateString() + "\n\n";
                }
                if(currDay != tl.getDay()) {
                    currDay = tl.getDay();
                    responseMsg = responseMsg + "foodValue:" + totFoodValue + "\n\n";
                    responseMsg = responseMsg + recordDate.toDateString() + "\n\n";
                    totFoodValue =0;
                }

                totFoodValue += docs[i].foodValue;
                //responseMsg = responseMsg + convertUTCDateToLocalDate(recordDate).toDateString() + ": " + docs[i].text + "\n\n";
                responseMsg = responseMsg + docs[i].text + "\n\n";
                
            }  
            if (totFoodValue >0) {
                responseMsg = responseMsg + "foodValue:" + totFoodValue + "\n\n";
            }
            return responseMsg;
}
module.exports.buildResponse = buildResponse;
