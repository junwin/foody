/*-----------------------------------------------------------------------------


-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('./core/');

//=========================================================
// Bot Setup 
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 80, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: '1adb6c46-d3ad-4a6c-bf2e-edc69df81338',
    appPassword: 'ViRRhcD9YtjKwo85EFjcXWE'
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

// Handle changes to the conversation participents
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        var membersAdded = message.membersAdded
            .map((m) => {
                var isSelf = m.id === message.address.bot.id;
                return (isSelf ? message.address.bot.name : m.name) + ' (Id: ' + m.id + ')';
            })
            .join(', ');

        var reply = new builder.Message()
            .address(message.address)
            .text('Welcome ' + membersAdded);
        bot.send(reply);
        console.log('Added Members' + membersAdded)
    }

    if (message.membersRemoved) {
        var membersRemoved = message.membersRemoved
            .map((m) => {
                var isSelf = m.id === message.address.bot.id;
                return (isSelf ? message.address.bot.name : m.name) + ' (Id: ' + m.id + ')';
            })
            .join(', ');

        var reply = new builder.Message()
            .address(message.address)
            .text('The following members ' + membersRemoved + ' were removed or left the conversation :(');
        bot.send(reply);
        console.log('Removed Members' + membersRemoved)
    }
});


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
        if(session.message.text.toLowerCase() == 'help')
        {
            session.beginDialog('/help');
        }
        if(session.message.text.toLowerCase() == 'bill')
        {
            session.beginDialog('/receipt');
        }
        if(session.message.text.toLowerCase() == 'feedback')
        {
            session.beginDialog('/prompts');
        }
        if(session.message.text.toLowerCase() == 'start')
        {
            session.send('meeting timer is started:' + Date());
            console.log('meeting started:' +  Date());
            session.userData.StartedMeeting =  Date();      
        }
        if(session.message.text.toLowerCase() == 'end')
        {         
            session.userData.EndedMeeting =  Date();
            x = Date.parse(session.userData.EndedMeeting);
            y = Date.parse(session.userData.StartedMeeting);
            z = elapsed(session);
            var endMsg = 'meeting timer is ended:' + Date() + " : " + session.userData.StartedMeeting + ' elapsed:' + z;
            session.send(endMsg);
            console.log(endMsg);
            session.beginDialog('/prompts');
        }
        //session.beginDialog('/help');
    },
    function (session, results) {
        // Display menu
        //session.beginDialog('/menu');
    },
    function (session, results) {
        // Always say goodbye
        //session.send("Ok... See you later!");
    }
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "What demo would you like to run?", "prompts|picture|cards|list|carousel|receipt|actions|(quit)");
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
    //function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
    //    session.replaceDialog('/menu');
   // }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });

bot.dialog('/help', [
    function (session) {
        session.endDialog("Global commands that are available anytime:\n\n* bill - Show the current meeting bill.\n* bye - End this conversation.\n* end - End meeting.\n*  start - Start meeting.\n* help - Displays these commands.");
    }
]);

bot.dialog('/prompts', [
    function (session, results) {
        var style = builder.ListStyle.button;
        builder.Prompts.choice(session, "Hey what did you think of the meeting?", "great|ok|meh", { listStyle: style });
    },
    function (session, results) {
        //session.send("You chose '%s'", results.response.entity);
        //session.endDialog(results.response.entity);
        //results.entity.text;
        session.endDialog();
        console.log('option chosen:' + results.response.entity);
        //builder.Promp.ts.confirm(session, "Prompts.confirm()\n\nSimple yes/no questions are possible. Answer yes or no now.");
    },
    function (session, results) {
        var msg = new builder.Message(session);
        session.endDialog(msg);
    }
]);

function elapsed(session)
{
    session.userData.EndedMeeting =  Date();
    x = Date.parse(session.userData.EndedMeeting);
    y = Date.parse(session.userData.StartedMeeting);
    z = (x -  y)/3600000;
    return z.toFixed(3);
}

bot.dialog('/cards', [
    function (session) {
        session.send("You can use Hero & Thumbnail cards to send the user visually rich information...");

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
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))
            ]);
        session.send(msg);

        msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.ThumbnailCard(session)
                    .title("Thumbnail Card")
                    .subtitle("Pikes Place Market")
                    .text("<b>Pike Place Market</b> is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market"))
            ]);
        session.endDialog(msg);
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
