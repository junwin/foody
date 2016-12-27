/*-----------------------------------------------------------------------------


-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('./core/');
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var DS = require('./dist/dataservice');
var ResponseBuilder = require('./dist/responserBuilder');
var FoodLineInterpret = require('./dist/foodLineInterpret');


// Connection URL
var url = process.env.MONGO_CONN_URL || "mongodb://localhost:27017/myproject";
//

//=========================================================
// Bot Setup 
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

MongoClient.connect(url, function (err, db) {
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

//http://localhost:3978/foodrecords/2c1c7fa3/5
server.get('/foodrecords/:userId/:numberOfDays', getFoodRecs);

function getFoodRecs(req, res, next) {
    var numberOfDays = parseInt(req.params.numberOfDays);
    var endDate = Date.now();
    var startDate = endDate - numberOfDays * 24 * 3600000;

    DS.getFoodItems(url, req.params.userId, startDate, endDate, function (docs) {
        res.send(JSON.stringify(docs));
    });
    next();
}



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
            if (session.message.text.indexOf('@k3node') >= 0) {
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
            .title("Foody - the food tracking bot (Pre-Release 0.2 fun edition)")
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
        builder.Prompts.choice(session, "What would you todo?", "logfood|show|delete|(quit)");
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
         var tsDate = new Date(session.message.timestamp);
        var inputLine = results.response;
      
        var foodArray = FoodLineInterpret.getFoodRecords(inputLine, tsDate, session.message.user.id, session.message.user.name)
       

        msg = session.message.user.id + " : " + session.message.user.name + " : " + session.message.timestamp + " : " + results.response;
        session.send("You entered .'%s'", msg);

        DS.saveFoodItems(url, foodArray);
        session.endDialog();
    }
]);


bot.dialog('/show', [
    function (session, results) {

        var numberOfDays = 2;
        if (session.message.text.indexOf("week") >= 0) {
            numberOfDays = 7;
        }
        if (session.message.text.indexOf("day") >= 0) {
            numberOfDays = 1;
        }
        var endDate = Date.now();
        var startDate = endDate - numberOfDays * 24 * 3600000;
        DS.getFoodItems(url, session.message.user.id, startDate, endDate, function (docs) {
            //var responseMsg = "";
            var responseMsg = ResponseBuilder.buildResponse(docs);

            session.send(responseMsg);
            //db.close();
        });

        session.endDialog();
    }
]);


bot.dialog('/delete', [
    function (session) {
        builder.Prompts.text(session, "Sure, just tell me the food date you want to delete.");
    },
    function (session, results) {
        var foodDate = new Date(results.response);

        DS.deleteFoodItemsOnDate(url, session.message.user.id, foodDate, function () {

            session.send("I deleted any entries for:" + foodDate);

        });

        session.endDialog();
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






