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

var net = require('net');

var logger = new (require('./logger.js'))();
var constants = require('./constants.js');

var action = require('./action.js');
var response = require('./response.js');
var Event = require('./event.js');


function Connect(config) {
    Connect.super_.call(this);
    this.connected = false;
    this.shouldReconnect = false;
    this.config = config;
    this.messagesQueue = [];
    this.responses = {};
    this.callbacks = {};
    this.on('connected', function () {
        this.connected = true;
    }.bind(this));
    this.on('needAuth', this.auth);
    this.on('needParseMessage', this.parseMessage);
    this.on('needParseEvent', this.parseEvent);
    this.on('needParseResponse', this.parseResponse);
    this.on('disconnected', function () {
        this.connected = false;
        if (this.shouldReconnect) {
            setTimeout(function(){
                this.reconnect(this.shouldReconnect);
            }.bind(this), this.reconnectTimeout);
        }
    }.bind(this));
    this.on('incorrectLogin', function () {
        this.shouldReconnect = false;
    }.bind(this));
    this.on('incorrectServer', function () {
        this.shouldReconnect = false;
    }.bind(this));
}

(function() {
    var util = require('util');
    var EventEmitter = require('events').EventEmitter;
    util.inherits(Connect, EventEmitter);
})();

Connect.prototype.connect = function (shouldReconnect, reconnectTimeout) {
    if (shouldReconnect){
        this.shouldReconnect = Boolean(shouldReconnect);
        this.reconnectTimeout = Number(reconnectTimeout) || this.reconnectTimeout || 5000;
    }
    else this.shouldReconnect = false;
    this.logger.debug('Opening connection');
    this.messagesQueue = [];
    this.initSocket();
};

Connect.prototype.initSocket = function () {
    this.logger.trace('Initializing socket');

    if (this.socket){
        if (!this.socket.destroyed) {
            this.socket.removeAllListeners();
            this.socket.end();
        }
    }

    this.socket = new net.Socket();
    this.socket.setEncoding('ascii');

    this.socket.on('connect', function() {
        this.emit('connect');
    }.bind(this));

    this.socket.on('error', function (error) {
        this.logger.debug('Socket error:', error);
        if (error.code == 'ECONNREFUSED') this.emit('connectionRefused');
        this.emit('socketError', error);
    }.bind(this));

    this.socket.on('close', function (had_error) {
        this.emit('disconnected', had_error);
    }.bind(this));

    this.socket.on('timeout', function () {
        this.emit('connectTimeout');
    }.bind(this));

    this.socket.on('end', function () {
        this.emit('connectEnd');
    }.bind(this));

    this.socket.once('data', function (data) {
        this.emit('needAuth', data);
    }.bind(this));

    this.socket.connect(this.config.port, this.config.host);
};

Connect.prototype.auth = function (data) {
    this.logger.debug('First message:', data);
    if (data.match(/Asterisk Call Manager/)) {
        this.socket.on('data', function (data) {
            this.splitMessages(data);
        }.bind(this));
        this.send(new action.Login(this.config.login, this.config.password), function (error, response) {
            if (response.response === 'Success') this.emit('connected');
            else this.emit('incorrectLogin');
        }.bind(this));
    } else {
        this.emit('incorrectServer', data);
    }
};

Connect.prototype.splitMessages = function (data) {
    this.logger.trace('Data:', data);
    data = data.replace(constants.regexpEom, constants.eom);
    this.messagesQueue.concat(data.split(constants.eom));
    this.messagesQueue.pop();
    for (var i=0; i < this.messagesQueue.length; i++){
        setImmediate(function() {
            (function (message) {
                this.emit('needParseMessage', message);
            }.bind(this))(this.messagesQueue[i]);
        }.bind(this));
    }
    this.messagesQueue.length = 0;
};

Connect.prototype.parseMessage = function (raw) {
    this.logger.trace('Message:',raw);
    if (raw.match(/^Event: /)) return this.emit('needParseEvent', new Event(raw));
    if (raw.match(/^Response: /)) return this.emit('needParseResponse', new response.Response(raw));
    this.logger.warn("Unexpected: \n<< %s >>", raw);
};

Connect.prototype.parseEvent = function (eObj) {
    this.logger.debug('Event:', eObj);
    var id = eObj.actionid;
    if (id !== undefined && this.responses[id] !== undefined && this.callbacks[id] !== undefined) {
        this.responses[id].events.push(eObj);
        if (
            eObj.event.indexOf('Complete') !== -1 || eObj.event.indexOf('DBGetResponse') !== -1
            || (eObj.eventlist && eObj.eventlist.indexOf('Complete') !== -1)
        ) {
            this.callbacks[id](this.responses[id]);
            delete this.callbacks[id];
            delete this.responses[id];
        }
    } else {
        this.emit('event', eObj);
        //this.emit('amiEvent' + eObj.event, eObj);
    }
};

Connect.prototype.parseResponse = function (res) {
    this.logger.debug('Response:', res);
    var id = res.actionid;
    if (res.message !== undefined && (res.message.indexOf('follow') !== -1)) return this.responses[id] = res;
    if (this.callbacks[id]) {
        if (this.responses.match(/Success/i)) this.callbacks[id](null, res);
      //  else if (this.responses.match(/Error/i)) this.callbacks[id](res);
        else this.callbacks[id](res);
        delete this.callbacks[id];
        delete this.responses[id];
    }
};

Connect.prototype.reconnect = function (shouldReconnect) {
    this.shouldReconnect = shouldReconnect || false;
    this.initSocket();
};

Connect.prototype.disconnect = function () {
    this.shouldReconnect = false;
    this.send(new action.Logoff(), function () {
        this.logger.info('Logged out');
    }.bind(this));
    this.logger.info('Closing connection');
    this.removeAllListeners();
    this.socket.removeAllListeners();
    this.socket.end();
    this.emit('disconnected');
};

Connect.prototype.useLogger = function(logger){
    this.logger = logger;
};

Connect.prototype.logger = logger;

Connect.prototype.send = function (action, callback) {
    this.logger.debug('Send:', action);
    this.callbacks[action.ActionID] = callback;
    this.responses[action.ActionID] = "";
    this.socket.write(action.format());
};

exports.Connect = Connect;
exports.Action = action;
exports.Actions = action;
exports.Event = Event;
exports.Response = response;

