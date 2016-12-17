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
var Session = require("./Session");
var Message = require("./Message");
var Dialog = require("./dialogs/Dialog");
var DialogAction = require("./dialogs/DialogAction");
var Prompts = require("./dialogs/Prompts");
var SimpleDialog = require("./dialogs/SimpleDialog");
var EntityRecognizer = require("./dialogs/EntityRecognizer");
var Library = require("./bots/Library");
var UniversalBot = require("./bots/UniversalBot");
var ChatConnector = require("./bots/ChatConnector");
var ConsoleConnector = require("./bots/ConsoleConnector");
var BotStorage = require("./storage/BotStorage");
var CardAction = require("./cards/CardAction");
var HeroCard = require("./cards/HeroCard");
var CardImage = require("./cards/CardImage");
var ReceiptCard = require("./cards/ReceiptCard");
var SigninCard = require("./cards/SigninCard");
var ThumbnailCard = require("./cards/ThumbnailCard");
var Keyboard = require("./cards/Keyboard");
var Middleware = require("./middleware/Middleware");
var IntentRecognizerSet = require("./dialogs/IntentRecognizerSet");
var RegExpRecognizer = require("./dialogs/RegExpRecognizer");
var LuisRecognizer = require("./dialogs/LuisRecognizer");
var IntentDialog = require("./dialogs/IntentDialog");
exports.Session = Session.Session;
exports.Message = Message.Message;
exports.AttachmentLayout = Message.AttachmentLayout;
exports.TextFormat = Message.TextFormat;
exports.CardAction = CardAction.CardAction;
exports.HeroCard = HeroCard.HeroCard;
exports.CardImage = CardImage.CardImage;
exports.ReceiptCard = ReceiptCard.ReceiptCard;
exports.ReceiptItem = ReceiptCard.ReceiptItem;
exports.Fact = ReceiptCard.Fact;
exports.SigninCard = SigninCard.SigninCard;
exports.ThumbnailCard = ThumbnailCard.ThumbnailCard;
exports.Keyboard = Keyboard.Keyboard;
exports.Dialog = Dialog.Dialog;
exports.ResumeReason = Dialog.ResumeReason;
exports.DialogAction = DialogAction.DialogAction;
exports.PromptType = Prompts.PromptType;
exports.ListStyle = Prompts.ListStyle;
exports.Prompts = Prompts.Prompts;
exports.SimplePromptRecognizer = Prompts.SimplePromptRecognizer;
exports.RecognizeOrder = IntentRecognizerSet.RecognizeOrder;
exports.IntentRecognizerSet = IntentRecognizerSet.IntentRecognizerSet;
exports.IntentDialog = IntentDialog.IntentDialog;
exports.RecognizeMode = IntentDialog.RecognizeMode;
exports.LuisRecognizer = LuisRecognizer.LuisRecognizer;
exports.RegExpRecognizer = RegExpRecognizer.RegExpRecognizer;
exports.SimpleDialog = SimpleDialog.SimpleDialog;
exports.EntityRecognizer = EntityRecognizer.EntityRecognizer;
exports.Library = Library.Library;
exports.UniversalBot = UniversalBot.UniversalBot;
exports.ChatConnector = ChatConnector.ChatConnector;
exports.ConsoleConnector = ConsoleConnector.ConsoleConnector;
exports.MemoryBotStorage = BotStorage.MemoryBotStorage;
exports.Middleware = Middleware.Middleware;
// Deprecated classes
var deprecatedBCB = require("./deprecated/BotConnectorBot");
var deprecatedLD = require("./deprecated/LuisDialog");
var deprecatedCD = require("./deprecated/CommandDialog");
var deprecatedTB = require("./deprecated/TextBot");
exports.BotConnectorBot = deprecatedBCB.BotConnectorBot;
exports.LuisDialog = deprecatedLD.LuisDialog;
exports.CommandDialog = deprecatedCD.CommandDialog;
exports.TextBot = deprecatedTB.TextBot;
//# sourceMappingURL=botbuilder.js.map