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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dialog_1 = require("./Dialog");
var EntityRecognizer_1 = require("./EntityRecognizer");
var Message_1 = require("../Message");
var Library_1 = require("../bots/Library");
var Keyboard_1 = require("../cards/Keyboard");
var CardAction_1 = require("../cards/CardAction");
var Channel = require("../Channel");
var consts = require("../consts");
var logger = require("../logger");
var PromptType;
(function (PromptType) {
    PromptType[PromptType["text"] = 0] = "text";
    PromptType[PromptType["number"] = 1] = "number";
    PromptType[PromptType["confirm"] = 2] = "confirm";
    PromptType[PromptType["choice"] = 3] = "choice";
    PromptType[PromptType["time"] = 4] = "time";
    PromptType[PromptType["attachment"] = 5] = "attachment";
})(PromptType = exports.PromptType || (exports.PromptType = {}));
var ListStyle;
(function (ListStyle) {
    ListStyle[ListStyle["none"] = 0] = "none";
    ListStyle[ListStyle["inline"] = 1] = "inline";
    ListStyle[ListStyle["list"] = 2] = "list";
    ListStyle[ListStyle["button"] = 3] = "button";
    ListStyle[ListStyle["auto"] = 4] = "auto";
})(ListStyle = exports.ListStyle || (exports.ListStyle = {}));
var SimplePromptRecognizer = (function () {
    function SimplePromptRecognizer() {
    }
    SimplePromptRecognizer.prototype.recognize = function (args, callback, session) {
        function findChoice(args, text) {
            var best = EntityRecognizer_1.EntityRecognizer.findBestMatch(args.enumValues, text);
            if (!best) {
                var n = EntityRecognizer_1.EntityRecognizer.parseNumber(text);
                if (!isNaN(n) && n > 0 && n <= args.enumValues.length) {
                    best = { index: n - 1, entity: args.enumValues[n - 1], score: 1.0 };
                }
            }
            return best;
        }
        // Recognize value
        var score = 0.0;
        var response;
        var text = args.utterance.trim();
        switch (args.promptType) {
            default:
            case PromptType.text:
                // This is an open ended question so it's a little tricky to know what to pass as a confidence
                // score. Currently we're saying that we have 0.1 confidence that we understand the users intent
                // which will give all of the prompts parents a chance to capture the utterance. If no one 
                // captures the utterance we'll return the full text of the utterance as the result.
                score = 0.5;
                response = text;
                break;
            case PromptType.number:
                var n = EntityRecognizer_1.EntityRecognizer.parseNumber(text);
                if (!isNaN(n)) {
                    var score = n.toString().length / text.length;
                    response = n;
                }
                break;
            case PromptType.confirm:
                var b = EntityRecognizer_1.EntityRecognizer.parseBoolean(text);
                if (typeof b !== 'boolean') {
                    var best = findChoice(args, text);
                    if (best) {
                        b = (best.index === 0); // enumValues == ['yes', 'no']
                    }
                }
                if (typeof b == 'boolean') {
                    score = 1.0;
                    response = b;
                }
                break;
            case PromptType.time:
                var entity = EntityRecognizer_1.EntityRecognizer.recognizeTime(text, args.refDate ? new Date(args.refDate) : null);
                if (entity) {
                    score = entity.entity.length / text.length;
                    response = entity;
                }
                break;
            case PromptType.choice:
                var best = findChoice(args, text);
                if (best) {
                    score = best.score;
                    response = best;
                }
                break;
            case PromptType.attachment:
                if (args.attachments && args.attachments.length > 0) {
                    score = 1.0;
                    response = args.attachments;
                }
                break;
        }
        // Return results
        if (score > 0) {
            callback({ score: score, resumed: Dialog_1.ResumeReason.completed, promptType: args.promptType, response: response });
        }
        else {
            callback({ score: score, resumed: Dialog_1.ResumeReason.notCompleted, promptType: args.promptType });
        }
    };
    return SimplePromptRecognizer;
}());
exports.SimplePromptRecognizer = SimplePromptRecognizer;
var Prompts = (function (_super) {
    __extends(Prompts, _super);
    function Prompts() {
        return _super.apply(this, arguments) || this;
    }
    Prompts.prototype.begin = function (session, args) {
        args = args || {};
        args.promptAfterAction = args.hasOwnProperty('promptAfterAction') ? args.promptAfterAction : Prompts.options.promptAfterAction;
        args.retryCnt = 0;
        for (var key in args) {
            if (args.hasOwnProperty(key)) {
                session.dialogData[key] = args[key];
            }
        }
        this.sendPrompt(session, args);
    };
    Prompts.prototype.replyReceived = function (session, result) {
        var args = session.dialogData;
        if (result.error || result.resumed == Dialog_1.ResumeReason.completed) {
            result.promptType = args.promptType;
            session.endDialogWithResult(result);
        }
        else if (typeof args.maxRetries === 'number' && args.retryCnt >= args.maxRetries) {
            result.promptType = args.promptType;
            result.resumed = Dialog_1.ResumeReason.notCompleted;
            session.endDialogWithResult(result);
        }
        else {
            args.retryCnt++;
            this.sendPrompt(session, args, true);
        }
    };
    Prompts.prototype.dialogResumed = function (session, result) {
        // Comming back from an action so re-prompt the user.
        var args = session.dialogData;
        if (args.promptAfterAction) {
            this.sendPrompt(session, args);
        }
    };
    Prompts.prototype.recognize = function (context, cb) {
        var args = context.dialogData;
        Prompts.options.recognizer.recognize({
            promptType: args.promptType,
            utterance: context.message.text,
            locale: context.message.textLocale,
            attachments: context.message.attachments,
            enumValues: args.enumValues,
            refDate: args.refDate
        }, function (result) {
            if (result.error) {
                cb(result.error, null);
            }
            else {
                cb(null, result);
            }
        });
    };
    Prompts.prototype.sendPrompt = function (session, args, retry) {
        if (retry === void 0) { retry = false; }
        logger.debug("prompts::sendPrompt called");
        if (retry && typeof args.retryPrompt === 'object' && !Array.isArray(args.retryPrompt)) {
            // Send native IMessage
            session.send(args.retryPrompt);
        }
        else if (typeof args.prompt === 'object' && !Array.isArray(args.prompt)) {
            // Send native IMessage
            session.send(args.prompt);
        }
        else {
            // Calculate list style.
            var style = ListStyle.none;
            if (args.promptType == PromptType.choice || args.promptType == PromptType.confirm) {
                style = args.listStyle;
                if (style == ListStyle.auto) {
                    if (Channel.supportsKeyboards(session, args.enumValues.length)) {
                        style = ListStyle.button;
                    }
                    else if (!retry && args.promptType == PromptType.choice) {
                        style = args.enumValues.length < 3 ? ListStyle.inline : ListStyle.list;
                    }
                    else {
                        style = ListStyle.none;
                    }
                }
            }
            // Get message message
            var prompt;
            if (retry) {
                if (args.retryPrompt) {
                    prompt = Message_1.Message.randomPrompt(args.retryPrompt);
                }
                else {
                    var type = PromptType[args.promptType];
                    prompt = Message_1.Message.randomPrompt(Prompts.defaultRetryPrompt[type]);
                    args.localizationNamespace = consts.Library.system;
                    logger.debug("prompts::sendPrompt setting ns to %s", args.localizationNamespace);
                }
            }
            else {
                prompt = Message_1.Message.randomPrompt(args.prompt);
            }
            var locale = session.preferredLocale();
            prompt = session.localizer.gettext(locale, prompt, args.localizationNamespace);
            // Append list
            var connector = '';
            var list;
            var msg = new Message_1.Message();
            switch (style) {
                case ListStyle.button:
                    var buttons = [];
                    for (var i = 0; i < session.dialogData.enumValues.length; i++) {
                        var option = session.dialogData.enumValues[i];
                        buttons.push(CardAction_1.CardAction.imBack(session, option, option));
                    }
                    msg.text(prompt)
                        .attachments([new Keyboard_1.Keyboard(session).buttons(buttons)]);
                    break;
                case ListStyle.inline:
                    list = ' (';
                    args.enumValues.forEach(function (v, index) {
                        var value = v.toString();
                        list += connector + (index + 1) + '. ' + session.localizer.gettext(locale, value, consts.Library.system);
                        if (index == args.enumValues.length - 2) {
                            connector = index == 0 ? session.localizer.gettext(locale, "list_or", consts.Library.system) : session.localizer.gettext(locale, "list_or_more", consts.Library.system);
                        }
                        else {
                            connector = ', ';
                        }
                    });
                    list += ')';
                    msg.text(prompt + '%s', list);
                    break;
                case ListStyle.list:
                    list = '\n   ';
                    args.enumValues.forEach(function (v, index) {
                        var value = v.toString();
                        list += connector + (index + 1) + '. ' + session.localizer.gettext(locale, value, args.localizationNamespace);
                        connector = '\n   ';
                    });
                    msg.text(prompt + '%s', list);
                    break;
                default:
                    msg.text(prompt);
                    break;
            }
            // Send message
            session.send(msg);
        }
        session.sendBatch();
    };
    Prompts.configure = function (options) {
        if (options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    Prompts.options[key] = options[key];
                }
            }
        }
    };
    Prompts.text = function (session, prompt, options) {
        var args = options || {};
        args.promptType = PromptType.text;
        args.prompt = prompt;
        beginPrompt(session, args);
    };
    Prompts.number = function (session, prompt, options) {
        var args = options || {};
        args.promptType = PromptType.number;
        args.prompt = prompt;
        beginPrompt(session, args);
    };
    Prompts.confirm = function (session, prompt, options) {
        var locale = session.preferredLocale();
        var args = options || {};
        args.promptType = PromptType.confirm;
        args.prompt = prompt;
        args.enumValues = [
            session.localizer.gettext(locale, 'confirm_yes', consts.Library.system),
            session.localizer.gettext(locale, 'confirm_no', consts.Library.system)
        ];
        args.listStyle = args.hasOwnProperty('listStyle') ? args.listStyle : ListStyle.auto;
        beginPrompt(session, args);
    };
    Prompts.choice = function (session, prompt, choices, options) {
        var args = options || {};
        args.promptType = PromptType.choice;
        args.prompt = prompt;
        args.listStyle = args.hasOwnProperty('listStyle') ? args.listStyle : ListStyle.auto;
        var c = EntityRecognizer_1.EntityRecognizer.expandChoices(choices);
        if (c.length == 0) {
            console.error("0 length choice for prompt:", prompt);
            throw "0 length choice list supplied";
        }
        args.enumValues = c;
        beginPrompt(session, args);
    };
    Prompts.time = function (session, prompt, options) {
        var args = options || {};
        args.promptType = PromptType.time;
        args.prompt = prompt;
        beginPrompt(session, args);
    };
    Prompts.attachment = function (session, prompt, options) {
        var args = options || {};
        args.promptType = PromptType.attachment;
        args.prompt = prompt;
        beginPrompt(session, args);
    };
    return Prompts;
}(Dialog_1.Dialog));
Prompts.options = {
    recognizer: new SimplePromptRecognizer(),
    promptAfterAction: true
};
Prompts.defaultRetryPrompt = {
    text: "default_text",
    number: "default_number",
    confirm: "default_confirm",
    choice: "default_choice",
    time: "default_time",
    attachment: "default_file"
};
exports.Prompts = Prompts;
Library_1.systemLib.dialog(consts.DialogId.Prompts, new Prompts());
function beginPrompt(session, args) {
    // Fixup prompts
    if (typeof args.prompt == 'object' && args.prompt.toMessage) {
        args.prompt = args.prompt.toMessage();
    }
    if (typeof args.retryPrompt == 'object' && args.retryPrompt.toMessage) {
        args.retryPrompt = args.retryPrompt.toMessage();
    }
    session.beginDialog(consts.DialogId.Prompts, args);
}
/**
 * Internal dialog that prompts a user to confirm a cancelAction().
 * dialogArgs: {
 *      confirmPrompt: string;
 *      message?: string;
 *      dialogIndex?: number;
 *      endConversation?: boolean;
 * }
 */
Library_1.systemLib.dialog(consts.DialogId.ConfirmCancel, [
    function (session, args) {
        session.dialogData.dialogIndex = args.dialogIndex;
        session.dialogData.message = args.message;
        session.dialogData.endConversation = args.endConversation;
        Prompts.confirm(session, args.confirmPrompt);
    },
    function (session, results) {
        if (results.response) {
            if (session.dialogData.message) {
                session.send(session.dialogData.message);
            }
            if (session.dialogData.endConversation) {
                session.endConversation();
            }
            else {
                session.cancelDialog(session.dialogData.dialogIndex);
            }
        }
        else {
            session.endDialogWithResult({ resumed: Dialog_1.ResumeReason.reprompt });
        }
    }
]);
/**
 * Begins a new dialog as an interruption. If the stack has a depth of 1 that means
 * only the interruption exists so it will be replaced with the new dialog. Otherwise,
 * the interruption will stay on the stack and ensure that ResumeReason.reprompt is
 * returned.  This is to fix an issue with waterfalls that they can advance when we
 * don't want them too.
 * dialogArgs: {
 *      dialogId: string;
 *      dialogArgs?: any;
 * }
 */
Library_1.systemLib.dialog(consts.DialogId.Interruption, [
    function (session, args) {
        if (session.sessionState.callstack.length > 1) {
            session.beginDialog(args.dialogId, args.dialogArgs);
        }
        else {
            session.replaceDialog(args.dialogId, args.dialogArgs);
        }
    },
    function (session, results) {
        session.endDialogWithResult({ resumed: Dialog_1.ResumeReason.reprompt });
    }
]);
//# sourceMappingURL=Prompts.js.map