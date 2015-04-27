/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 (NumminorihSF) Konstantine Petryaev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var constants = require('./constants.js');

function Message() {
    this.variables = {};
}

Message.prototype.format = function () {
    var result = '';
    for (var key in this) {
        if (key === 'variables') continue;
        if (this.hasOwnProperty(key)) {
            if (typeof (this[key]) === 'function') continue;
            result = result + key + ": " + this[key] + constants.eol;
        }
    }
    for (key in this.variables) {
        result = result + 'Variable: ' + key + '=' + this.variables[key] + constants.eol;
    }
    result = result + constants.eol;
    return result;
};

Message.prototype.parse = function (data) {
    data = data.split(constants.eol);
    for (var i = 0; i < data.length; i++){
        var value = data[i].split(':');
        var keyName = value.shift().toLowerCase().replace(/-/g, '_');
        var keyValue = value.join(':').replace(/[(^\s+)(\s+$)]/g, '');
        this.set(keyName, keyValue);
    }
    this.incomingData = data;
};

Message.prototype.set = function (name, value) {
    this[name] = value;
};

module.exports = Message;
