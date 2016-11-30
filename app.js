/*-----------------------------------------------------------------------------


-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('./core/');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url =  process.env.MONGO_CONN_URL || "mongodb://localhost:27017/myproject";
//

//=========================================================
// Bot Setup 
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());


//==========.===============================================
// Activity Events
//=========================================================

bot.on('conversationUpdate', function (message) {
   // Check for group conversations
    if (message.address.conversation.isGroup) {
        // Send a hello message when bot is added
        if (message.membersAdded) {
            message.membersAdded.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                            .address(message.address)
                            .text("Hello everyone!");
                    bot.send(reply);
                }
            });
        }

        // Send a goodbye message when bot is removed
        if (message.membersRemoved) {
            message.membersRemoved.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                        .address(message.address)
                        .text("Goodbye");
                    bot.send(reply);
                }
            });
        }
    }
});

bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("Hello %s... Thanks very much for adding me. Say help for options.", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});

bot.on('deleteUserData', function (message) {
    // User asked to delete their data
});


//=========================================================
// Bots Middleware
//=========================================================

// Anytime the major version is incremented any existing conversations will be restarted.
bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('bye', 'Bye :)', { matches: /^bye/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i });


// Install logging middleware

bot.use({
    botbuilder: function (session, next) {
        if (/^\/log on/i.test(session.message.text)) {
            session.userData.isLogging = true;
            session.send('Logging is now turned on');
        } else if (/^\/log off/i.test(session.message.text)) {
            session.userData.isLogging = false;
            session.send('Logging is now turned off');
        } else {
            if (session.userData.isLogging) {
                console.log('Message Received: ', session.message.text);
               
            }
            //console.log('Message Received: ', session.message.text);
             if(session.message.text.indexOf('@k3node')>=0)   {
                    var startPos = session.message.text.indexOf('@k3node') + 13;
                    session.message.text = session.message.text.substring(startPos);
             }
             //console.log('Message Received: ', session.message.text);
            next();
        }
    }
});

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("Foody - the food tracking bot (Pre-Release 0.1 fun edition)")
            .text("track the things you eat the easy way.")
            .images([
                 builder.CardImage.create(session, "http://docs.botframework.com/images/demo_bot_image.png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hi... I am foody a bot for Skype. I can help you track what you eat here on Skype.");
        session.beginDialog('/help');
    },
    function (session, results) {
        // Display menu
        session.beginDialog('/menu');
    },
    function (session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }
]);
bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "What would you todo?", "logfood|show|(quit)");
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });

bot.dialog('/help', [
    function (session) {
        session.endDialog("Global commands that are available anytime:\n\n* menu - Exits a demo and returns to the menu.\n* goodbye - End this conversation.\n* help - Displays these commands.");
    }
]);


bot.dialog('/logfood', [
    function (session) {
        //session.send("Just follow the prompts and you can quit at any time by saying 'cancel'.");
        builder.Prompts.text(session, "Tell me the food items, use a comma to separate multiple items.");
    },
    function (session, results) {
        var tsDate =new  Date(session.message.timestamp);
        var inputLine = results.response;
        var foodItems = inputLine.split(",");
        var foodArray = [];
        for(var item in foodItems)
        {
            
            var foodRecord = {
                userId:session.message.user.id,   
                userName: session.message.user.name,       
                timestamp:tsDate,
                text:foodItems[item],
                item:foodItems[item],
                qty:0,
                units:"",
                foodValue:getPoints(foodItems[item]),
                calories:0
            };
            foodArray.push(foodRecord);
        }
        
        msg = session.message.user.id + " : " + session.message.user.name + " : " + session.message.timestamp + " : " + results.response;
        session.send("You entered .'%s'", msg);

        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            
            console.log("Connected successfully to server");
            insertDocuments(db, foodArray, function() {           
            db.close();
            });
        });
    

        session.endDialog();
    }
]);


bot.dialog('/show', [
    function (session, results) {


        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            var endDate = Date.now();
            var startDate = endDate - 7*24*3600000;
            console.log("Connected successfully to server");
            findDocuments(db, session, startDate, endDate, function(docs) {  
                var responseMsg = "";
                for (var i in docs)
                {
                    var recordDate = new Date(docs[i].timestamp);
                    localDate = convertUTCDateToLocalDate(recordDate);
                    responseMsg = responseMsg + localDate.toDateString() + ": " + docs[i].text + "\n\n";
                    
                }      


                session.send(responseMsg)  ; 
                db.close();
            });
        });

        session.endDialog();
    }
]);





bot.dialog('/receipt', [
    function (session) {       
        // Send a receipt without images
        cost1 =  250*elapsed(session);
        item1 = "Chicago:" + elapsed(session);
        cost2 =  300*elapsed(session);
        item2 = "New York:" + elapsed(session);
        msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("Recipient's Name")
                    .items([
                        
                        builder.ReceiptItem.create(session, cost1, item1),
                        builder.ReceiptItem.create(session, cost2, item2)
                    ])
                    .facts([
                        builder.Fact.create(session, "1234567898", "Meeting Id"),
                        builder.Fact.create(session, "HH1234PRJ", "CostCenter")
                    ])
                    .tax("$0.00")
                    .total("$"+(cost1+cost2))
            ]);
        session.endDialog(msg);
    }
]);

bot.dialog('/signin', [ 
    function (session) { 
        // Send a signin 
        var msg = new builder.Message(session) 
            .attachments([ 
                new builder.SigninCard(session) 
                    .text("You must first signin to your account.") 
                    .button("signin", "http://example.com/") 
            ]); 
        session.endDialog(msg); 
    } 
]); 


bot.dialog('/actions', [
    function (session) { 
        session.send("Bots can register global actions, like the 'help' & 'goodbye' actions, that can respond to user input at any time. You can even bind actions to buttons on a card.");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    ])
                    .buttons([
                        builder.CardAction.dialogAction(session, "weather", "Seattle, WA", "Current Weather")
                    ])
            ]);
        session.send(msg);

        session.endDialog("The 'Current Weather' button on the card above can be pressed at any time regardless of where the user is in the conversation with the bot. The bot can even show the weather after the conversation has ended.");
    }
]);

// Create a dialog and bind it to a global action
bot.dialog('/weather', [
    function (session, args) {
        session.endDialog("The weather in %s is 71 degrees and raining.", args.data);
    }
]);
bot.beginDialogAction('weather', '/weather');   // <-- no 'matches' option means this can only be triggered by a button.

// Interpretation - will swith to LUIS soon

var getPoints = function(foodEntryText) {
    var pos = foodEntryText.indexOf("p=") ;
    if(pos >=0)
    {
        val = foodEntryText.substring(pos+2, pos+4);
        return val;
    }
    
    return 0;
    
}


//  Mongo CRUD functions
var insertDocuments = function(db, foodRecord, callback) {
  // Get the documents collection
  var collection = db.collection('foodrecords');
  // Insert some documents
  collection.insertMany(
    foodRecord
  , function(err, result) {
    assert.equal(err, null);
    assert.equal(foodRecord.length, result.result.n);
    assert.equal(foodRecord.length, result.ops.length);
    console.log("Inserted 1 documents into the collection");
    callback(result);
  });
}


var findDocuments = function(db, session, startDate, endDate, callback) {
  // Get the documents collection
  var collection = db.collection('foodrecords');
  // Find some documents
  collection.find({ "timestamp" : { "$gte" : new Date(startDate), "$lt" : new Date(endDate) }}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}


// Date functions
function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
}

