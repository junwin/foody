//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Bot Framework: http://botframework.com
//
// Bot Builder SDK Github:
// https://github.com/Microsoft/BotBuilder
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
"use strict";
var UniversalBot_1 = require("../bots/UniversalBot");
var ConsoleConnector_1 = require("../bots/ConsoleConnector");
var TextBot = (function () {
    function TextBot(options) {
        if (options === void 0) { options = {}; }
        console.warn('TextBot class is deprecated. Use UniversalBot with a ConsoleConnector class.');
        // Map options into settings
        var oBot = {};
        for (var key in options) {
            switch (key) {
                case 'defaultDialogId':
                    oBot.defaultDialogId = options.defaultDialogId;
                    break;
                case 'defaultDialogArgs':
                    oBot.defaultDialogArgs = options.defaultDialogArgs;
                    break;
                case 'groupWelcomeMessage':
                    this.groupWelcomeMessage = options.groupWelcomeMessage;
                    break;
                case 'userWelcomeMessage':
                    this.userWelcomeMessage = options.userWelcomeMessage;
                    break;
                case 'goodbyeMessage':
                    this.goodbyeMessage = options.goodbyeMessage;
                    break;
                case 'userStore':
                case 'sessionStore':
                    console.error('TextBot custom stores no longer supported. Use UniversalBot with a custom IBotStorage implementation instead.');
                    throw new Error('TextBot custom stores no longer supported.');
            }
        }
        // Initialize connector & universal bot
        this.connector = new ConsoleConnector_1.ConsoleConnector();
        this.bot = new UniversalBot_1.UniversalBot(this.connector, oBot);
    }
    TextBot.prototype.on = function (event, listener) {
        this.bot.on(event, listener);
        return this;
    };
    TextBot.prototype.add = function (id, dialog) {
        this.bot.dialog(id, dialog);
        return this;
    };
    TextBot.prototype.configure = function (options) {
        console.error("TextBot.configure() is no longer supported. You should either pass all options into the constructor or update code to use the new UniversalBot class.");
        throw new Error("TextBot.configure() is no longer supported.");
    };
    TextBot.prototype.listenStdin = function () {
        return this.connector.listen();
    };
    TextBot.prototype.beginDialog = function (address, dialogId, dialogArgs) {
        console.error("TextBot.beginDialog() is no longer supported. The schema for sending proactive messages has changed and you should update your code to use the new UniversalBot class.");
        throw new Error("TextBot.beginDialog() is no longer supported.");
    };
    TextBot.prototype.processMessage = function (message, callback) {
        console.error("TextBot.processMessage() is no longer supported. The schema for messages has changed and you should update your code to use the new UniversalBot class.");
        throw new Error("TextBot.processMessage() is no longer supported.");
    };
    return TextBot;
}());
exports.TextBot = TextBot;
//# sourceMappingURL=TextBot.js.map