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
var CommandDialog = (function (_super) {
    __extends(CommandDialog, _super);
    function CommandDialog(serviceUri) {
        var _this = _super.call(this) || this;
        console.warn('CommandDialog class is deprecated. Use IntentDialog class instead.');
        _this.dialog = new IntentDialog_1.IntentDialog();
        return _this;
    }
    CommandDialog.prototype.begin = function (session, args) {
        this.dialog.begin(session, args);
    };
    CommandDialog.prototype.replyReceived = function (session, recognizeResult) {
        //this.dialog.replyReceived(session, recognizeResult);
    };
    CommandDialog.prototype.dialogResumed = function (session, result) {
        this.dialog.dialogResumed(session, result);
    };
    CommandDialog.prototype.recognize = function (context, cb) {
        this.dialog.recognize(context, cb);
    };
    CommandDialog.prototype.onBegin = function (handler) {
        this.dialog.onBegin(handler);
        return this;
    };
    CommandDialog.prototype.matches = function (patterns, dialogId, dialogArgs) {
        var _this = this;
        var list = (!Array.isArray(patterns) ? [patterns] : patterns);
        list.forEach(function (p) {
            _this.dialog.matches(new RegExp(p, 'i'), dialogId, dialogArgs);
        });
        return this;
    };
    CommandDialog.prototype.onDefault = function (dialogId, dialogArgs) {
        this.dialog.onDefault(dialogId, dialogArgs);
        return this;
    };
    return CommandDialog;
}(Dialog_1.Dialog));
exports.CommandDialog = CommandDialog;
//# sourceMappingURL=CommandDialog.js.map