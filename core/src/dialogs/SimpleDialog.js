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
var consts = require("../consts");
var logger = require("../logger");
var SimpleDialog = (function (_super) {
    __extends(SimpleDialog, _super);
    function SimpleDialog(fn) {
        var _this = _super.call(this) || this;
        _this.fn = fn;
        return _this;
    }
    SimpleDialog.prototype.begin = function (session, args) {
        this.fn(session, args);
    };
    SimpleDialog.prototype.replyReceived = function (session) {
        this.fn(session);
    };
    SimpleDialog.prototype.dialogResumed = function (session, result) {
        this.fn(session, result);
    };
    return SimpleDialog;
}(Dialog_1.Dialog));
exports.SimpleDialog = SimpleDialog;
function createWaterfall(steps) {
    return function waterfallAction(s, r) {
        var skip = function (result) {
            result = result || {};
            if (result.resumed == null) {
                result.resumed = Dialog_1.ResumeReason.forward;
            }
            waterfallAction(s, result);
        };
        // Check for continuation of waterfall
        if (r && r.hasOwnProperty('resumed')) {
            // Ignore re-prompts
            if (r.resumed !== Dialog_1.ResumeReason.reprompt) {
                // Adjust step based on users utterance
                var step = s.dialogData[consts.Data.WaterfallStep];
                switch (r.resumed) {
                    case Dialog_1.ResumeReason.back:
                        step -= 1;
                        break;
                    default:
                        step++;
                }
                // Handle result
                if (step >= 0 && step < steps.length) {
                    // Execute next step of the waterfall
                    try {
                        logger.info(s, 'waterfall() step %d of %d', step + 1, steps.length);
                        s.dialogData[consts.Data.WaterfallStep] = step;
                        steps[step](s, r, skip);
                    }
                    catch (e) {
                        s.error(e);
                    }
                }
                else {
                    // End the current dialog and return results to parent
                    s.endDialogWithResult(r);
                }
            }
        }
        else if (steps && steps.length > 0) {
            // Start waterfall
            try {
                logger.info(s, 'waterfall() step %d of %d', 1, steps.length);
                s.dialogData[consts.Data.WaterfallStep] = 0;
                steps[0](s, r, skip);
            }
            catch (e) {
                s.error(e);
            }
        }
        else {
            // Empty waterfall so end dialog with not completed
            logger.warn(s, 'waterfall() empty waterfall detected');
            s.endDialogWithResult({ resumed: Dialog_1.ResumeReason.notCompleted });
        }
    };
}
exports.createWaterfall = createWaterfall;
//# sourceMappingURL=SimpleDialog.js.map