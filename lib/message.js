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
    var self = this;
    var result = Object.keys(this).reduce(function(res, key){
        if (key === 'variables') {
            return res;
        }
        if (typeof self[key] === 'function') {
            return res;
        }
        return res + key + ": " + self[key] + constants.eol;
    }, '');


    result = Object.keys(this.variables || {}).reduce(function (res, key) {
          return res + 'Variable: ' + key + '=' + self.variables[key] + constants.eol;
      }, result) + constants.eol;
    return result;
};

Message.prototype.parse = function (data) {
    data = data.split(constants.eol);

    var lastVariable = '';
    for (var i = 0; i < data.length; i++){
        var value = data[i].split(':');
        var keyName = value.shift().toLowerCase().replace(/-/g, '_');
        var keyValue = value.join(':').replace(/(^\s+)|(\s+$)/g, '');
        var subKey;
        var subVal;
        if (keyName === 'variable') {
            lastVariable = keyValue;
        }
        else if (keyName === 'value'){
            this.variables[lastVariable] = keyValue;
            lastVariable = '';
        }
        else if (/^chanvariable/.test(keyName)){
            this[keyName] = this[keyName] || {};
            subVal = keyValue.split('=');
            subKey = subVal.shift().toLowerCase();
            this[keyName][subKey] = subVal.join('=');
            continue;
        }
        this.set(keyName, keyValue);
    }
    //if (Object.keys(this.variables).length === 0) delete this.variables;
    this.incomingData = data;
};

Message.prototype.set = function (name, value) {
    this[name] = value;
};

module.exports = Message;
