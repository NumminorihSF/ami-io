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

function Response(data) {
    Response.super_.call(this);
    this.parse(data);
    this.events = [];
}

(function(){
    var Message = require('./message.js');
    var util = require('util');
    util.inherits(Response, Message);
})();

Response.tryFormat = function(m, callback){
    var raw = m.raw; 
    var strings = raw.split('\r\n');
    if (!strings || !strings.length) return callback(new Error("Unexpected after split"));
    if (strings[0].match(/.* has .* calls .* in .*/i)) {
        m.strings = strings;
        return _formatQueues(m, callback);
    }
    return callback(new Error("Undefined format"));
    
};

function _formatQueues (m, callback){
    var res = [];
    var strings = m.strings;

    var queue = strings[0].match(/^[\w\d_\-\.]* /);
    if (queue && queue[0]) queue = queue[0].trim();

    var calls = strings[0].match(/has \d* call/);
    if (calls && calls[0]) calls = parseInt(calls[0].substr(3));

    var strategy = strings[0].match(/in '\w*' strategy/);
    if (strategy && strategy[0]) strategy = strategy[0].replace(/(^in )|\'|( strategy$)/g, '');

    var holdtime = strings[0].match(/\d*s holdtime/);
    if (holdtime && holdtime[0]) holdtime = holdtime[0].replace(/\D*/g,'');

    var talktime = strings[0].match(/\d*s talktime/);
    if (talktime && talktime[0]) talktime = talktime[0].replace(/\D*/g,'');


    var w = strings[0].match(/W:[\d\.]*,/);
    if (w && w[0]) w = w[0].replace(/[W:,]/g,'');

    var c = strings[0].match(/C:[\d\.]*,/);
    if (c && c[0]) c = c[0].replace(/[C:,]/g,'');

    var a = strings[0].match(/A:[\d\.]*,/);
    if (a && a[0]) a = a[0].replace(/[A:,]/g,'');

    var sl = strings[0].match(/SL:.*$/);
    if (sl && sl[0]) sl = sl[0].substr(3);

    var members = [];
    for (var i = 2; i < strings.length; i++){
        if (strings[i].match(/Callers/)) break;
        members.push(strings[i].match(/.*? \(.*?\)/)[0].trim());
    }

    var callers = [];
    for (i++; i < strings.length; i++){
        callers.push(strings[i].trim());
    }

    res.push('Event: Queues\r\nQueue: '+queue+'\r\nMembers: '+members.join(';')+'\r\n' +
        'Strategy: ' +strategy + '\r\n' +
        'Calls: ' +calls + '\r\n' +
        'Callers: ' + callers.join(';') + '\r\n' +
        'Weight: ' +w + '\r\n' +
        'CallsAnswered: ' +c + '\r\n' +
        'HoldTime: ' +holdtime + '\r\n' +
        'TalkTime: ' +talktime + '\r\n' +
        'CallsAnswered: ' +c + '\r\n' +
        'CallsAbandoned: ' +a + '\r\n' +
        'ServiceLevel: ' +sl + '\r\n' +
        'Strategy: ' +strategy + '\r\n'+
        'ActionID: %REPLACE_ACTION_ID%');

    res.push('Response: Success\r\nActionID: %REPLACE_ACTION_ID%'+
        '\r\nMessage: Queues will follow');
    res.push('Event: QueuesComplete\r\nActionID: %REPLACE_ACTION_ID%');
    return callback(null, {type: 'queues', res: res});
}

module.exports = Response;


