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
var Dialog_1 = require("../dialogs/Dialog");
var IntentDialog_1 = require("../dialogs/IntentDialog");
var LuisRecognizer_1 = require("../dialogs/LuisRecognizer");
var LuisDialog = (function (_super) {
    __extends(LuisDialog, _super);
    function LuisDialog(serviceUri) {
        var _this = _super.call(this) || this;
        console.warn('LuisDialog class is deprecated. Use IntentDialog with a LuisRecognizer instead.');
        var recognizer = new LuisRecognizer_1.LuisRecognizer(serviceUri);
        _this.dialog = new IntentDialog_1.IntentDialog({ recognizers: [recognizer] });
        return _this;
    }
    LuisDialog.prototype.begin = function (session, args) {
        this.dialog.begin(session, args);
    };
    LuisDialog.prototype.replyReceived = function (session, recognizeResult) {
        //this.dialog.replyReceived(session, recognizeResult);
    };
    LuisDialog.prototype.dialogResumed = function (session, result) {
        this.dialog.dialogResumed(session, result);
    };
    LuisDialog.prototype.recognize = function (context, cb) {
        this.dialog.recognize(context, cb);
    };
    LuisDialog.prototype.onBegin = function (handler) {
        this.dialog.onBegin(handler);
        return this;
    };
    LuisDialog.prototype.on = function (intent, dialogId, dialogArgs) {
        this.dialog.matches(intent, dialogId, dialogArgs);
        return this;
    };
    LuisDialog.prototype.onDefault = function (dialogId, dialogArgs) {
        this.dialog.onDefault(dialogId, dialogArgs);
        return this;
    };
    return LuisDialog;
}(Dialog_1.Dialog));
exports.LuisDialog = LuisDialog;
//# sourceMappingURL=LuisDialog.js.map