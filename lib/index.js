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

var Action = require('./action.js');
var Response = require('./response.js');
var AmiEvent = require('./event.js');
var SilentLogger = require('./silent-logger');

function Client(config) {
    Client.super_.call(this);

    this.connected = false;
    this.shouldReconnect = false;
    config = config || {};
    this.logger = config.logger || logger;
    config.host = config.host || '127.0.0.1';
    config.port = config.port || 5038;
    config.login = config.login || 'admin';
    config.password = config.password || 'admin';
    config.encoding = config.encoding || 'ascii';
    this.config = config;
    this.tailInput = '';
    this.responses = {};
    this.originateResponses = {};
    this.callbacks = {};
    this.unformatWait = {};
    this.follows = {};
    this.version = '<unknown>';

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

    return this;
}

(function() {
    var util = require('util');
    var EventEmitter = require('events').EventEmitter;
    util.inherits(Client, EventEmitter);
})();

Client.prototype.connect = function (shouldReconnect, reconnectTimeout) {
    if (shouldReconnect){
        this.shouldReconnect = Boolean(shouldReconnect);
        this.reconnectTimeout = Number(reconnectTimeout) || this.reconnectTimeout || 5000;
    }
    else this.shouldReconnect = false;
    this.logger.debug('Opening connection');
    this.messagesQueue = [];
    this.initSocket();
};

Client.prototype.initSocket = function () {
    this.logger.trace('Initializing socket');

    if (this.socket){
        if (!this.socket.destroyed) {
            this.socket.end();
        }
        this.socket.removeAllListeners();
    }

    this.socket = new net.Socket();
    this.socket.setEncoding(this.config.encoding);
    if (this.unrefed) this.socket.unref();

    this.socket.on('connect', function() {
        this.emit('socketConnected');
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

Client.prototype.auth = function (data) {
    this.logger.debug('First message:', data);
    if (data.match(/Asterisk Call Manager/)) {
        this._setVersion(data);
        this.socket.on('data', function (data) {
            this.splitMessages(data);
        }.bind(this));
        this.send(new Action.Login(this.config.login, this.config.password), function (error, response) {
            if (error) {
              if (error instanceof Response) this.emit('incorrectLogin');
              else this.emit('error', error);
            }
            else if (response && response.response === 'Success') this.emit('connected');
            else this.emit('incorrectLogin');
        }.bind(this));
    } else {
        this.emit('incorrectServer', data);
    }
};

Client.prototype.splitMessages = function (data) {
    this.logger.trace('Data:', data);
    var buffer = this.tailInput.concat(data.replace(constants.regexpEom, constants.eom));
    var messages  = buffer.split(constants.eom);
    this.tailInput = messages.pop(); //If all messages aren't spitted, tailInput = '',
    // else tailInput = part of last message and will concat with second part of it
    for (var i=0; i < messages.length; i++) {
        (function (message) {
            this.emit('needParseMessage', message);
        }.bind(this))(messages[i]);
    }
};

Client.prototype.parseMessage = function (raw) {
    this.logger.trace('Message:',raw);
    if (raw.match(/^Response: /)) {
        var response = new Response(raw);
        if (response.actionid) this.responses[response.actionid] = response;
        return this.emit('needParseResponse', response);
    }
    if (raw.match(/^Event: /)) return this.emit('needParseEvent', new AmiEvent(raw));
    return this._parseUnformatMessage(raw);
};

Client.prototype._parseUnformatMessage = function(raw){
    var keys = Object.keys(this.unformatWait);
    if (keys.length === 0) return this.logger.warn("Unexpected: \n<< %s >>", raw);
    var self = this;
    Response.tryFormat({raw: raw}, function(err, data){
        if (err) return self.logger.warn("Fail fromat:", err);
        if (!self.unformatWait[data.type]) return self.logger.warn("Doesn't wait:", data.type);
        if (!self.unformatWait[data.type].res || self.unformatWait[data.type].res.length === 0){
            if (data.res.length == 1) self.unformatWait[data.type].res = data.res;
            else {
                self.unformatWait[data.type].res = [data.res[1].replace('%REPLACE_ACTION_ID%', self.unformatWait[data.type].id), data.res[0].replace('%REPLACE_ACTION_ID%', self.unformatWait[data.type].id)];
            }
        }
        else self.unformatWait[data.type].res.push(data.res[0].replace('%REPLACE_ACTION_ID%', self.unformatWait[data.type].id));

        clearTimeout(self.unformatWait.queues.timeout);

        if (self.unformatWait[data.type].res.length ===1 ) return self.emit('needParseMessage', self.unformatWait[data.type].res[0]);
        (self.unformatWait[data.type].timeout = setTimeout(function(){
            self.unformatWait[data.type].res.push(data.res[2].replace('%REPLACE_ACTION_ID%', self.unformatWait[data.type].id));
            self.unformatWait[data.type].res.forEach(function(mes){
                self.emit('needParseMessage', mes);
            });
        }, 100)).unref();
    });
};

Client.prototype.parseEvent = function (eObj) {
    this.logger.debug('AmiEvent:', eObj);
    var id = eObj.actionid;
    if (id !== undefined && this.responses[id] !== undefined && this.callbacks[id] !== undefined) {
        this.emit('responseEvent', eObj);
        if (!this.responses[id].events) {
            this.logger.fatal('No events in this.responses.');
            this.logger.fatal(this.responses[id]);
            this.responses[id].events = [];
        }
        this.responses[id].events.push(eObj);
        if (this.originateResponses[id]){
            if (eObj.event === 'OriginateResponse'){
                if (eObj.response && eObj.response.match(/Success/i)) {
                    this.callbacks[id](null, eObj);
                }
                else this.callbacks[id](eObj);
            }
        }
        else {
            if (
              eObj.event.indexOf('Complete') !== -1 || eObj.event.indexOf('DBGetResponse') !== -1
              || (eObj.eventlist && eObj.eventlist.indexOf('Complete') !== -1)
            ) {
                if (this.responses[id].response && this.responses[id].response.match(/Success/i)) {
                    this.callbacks[id](null, this.responses[id]);
                }
                else this.callbacks[id](this.responses[id]);
            }
        }
    } else {
        this.emit('event', eObj);
        //this.emit('amiEvent' + eObj.event, eObj);
    }
    this.emit('rawEvent', eObj);
    this.emit('rawEvent.'+eObj.event, eObj);
};

Client.prototype.parseResponse = function (res) {
    this.logger.debug('Response:', res);
    var id = res.actionid;
    if (res.message !== undefined && (res.message.indexOf('follow') !== -1)) {
        return this.responses[id] = res;
    }
    if (this.callbacks[id]) {
        if (!this.originateResponses[id]){
            if (res.response && res.response.match(/success/i)) this.callbacks[id](null, res);
            else this.callbacks[id](res);
        }
    }
};

Client.prototype.reconnect = function (shouldReconnect) {
    this.shouldReconnect = shouldReconnect || false;
    this.initSocket();
};

Client.prototype.disconnect = function () {
    this.shouldReconnect = false;
    this.send(new Action.Logoff(), function () {
        this.logger.info('Logged out');
    }.bind(this));
    this.logger.info('Closing connection');
    this.removeAllListeners();
    this.socket.removeAllListeners();
    this.socket.end();
    this.emit('disconnected');
};

Client.prototype.useLogger = function(logger){
    this.logger = logger;
};

Client.prototype.send = function (action, callback) {
    var self = this;
    this.logger.debug('Send:', action);
    if (!this.connected) {
        if (action.Action !== 'Login') {
            return callback(new Error('Server is disconnected'));
        }
    }
    this.socket.write(action.format(), function(err){
        if (err) {
            return callback(err);
        }
        var timeout;

        (timeout = setTimeout(function(){
            if (self.callbacks[action.ActionID]) self.callbacks[action.ActionID](new Error('ERRTIMEDOUT'));
        }.bind(this), 300000)).unref();

        this.callbacks[action.ActionID] = function(err, data){
            clearTimeout(timeout);
            delete self.callbacks[action.ActionID];
            delete self.responses[action.ActionID];
            delete self.originateResponses[action.ActionID];
            delete self.unformatWait[action.ActionID];
            return callback(err, data);
        };

        if (action.Action && action.Action.toLowerCase() === "queues") {
            this.unformatWait[action.Action.toLowerCase()] = {id: action.ActionID, timeout: null, res:[]};
        }
        else if (action.Action && action.Action.toLowerCase() === "originate" && action.WaitEvent) {
            this.originateResponses[action.ActionID] = {};
        }
        this.responses[action.ActionID] = "";
    }.bind(this));
};

Client.prototype.unref = function(){
    this.unrefed = true;
    if (this.socket) this.socket.unref();
};

Client.prototype.ref = function(){
    delete this.unrefed;
    if (this.socket) this.socket.ref();
};

Client.prototype._setVersion = function(version){
    var v = version.match(/Asterisk call manager\/([\d\.]*[\-\w\d\.]*)/i);
    if (v){
        this.version = v[1];
    }
};

Client.prototype.getVersion = function(){
    return this.version;
};


exports.createClient = function(config){
    return new Client(config);
};

exports.Client = Client;
exports.Action = Action;
exports.Actions = Action;
exports.Event = AmiEvent;
exports.Response = Response;
exports.SilentLogger = SilentLogger;
