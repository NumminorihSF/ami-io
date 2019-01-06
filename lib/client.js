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

const net = require('net');
const EventEmitter = require('events');

const logger = new (require('./loggers/logger.js'))();
const { EOM, REGEXP_EOM } = require('./constants.js');

const Action = require('./action.js');
const Response = require('./response.js');
const AmiEvent = require('./event.js');

const CONFIG_DEFAULTS = {
  logger,
  host: '127.0.0.1',
  port: 5038,
  login: 'admin',
  password: 'admin',
};

class Client extends EventEmitter {
  constructor(config = {}) {
    super();

    this.connected = false;
    this.reconnectable = false;
    this.config = Object.freeze(Object.assign({}, CONFIG_DEFAULTS, config));
    this.logger = this.config.logger;
    this.tailInput = '';
    this.responses = {};
    this.originateResponses = {};
    this.callbacks = {};
    this.unformatWait = {};
    this.follows = {};
    this.version = '<unknown>';

    this.addListeners();
  }

  addListeners() {
    this.on('connected', () => {
      this.connected = true;
    });
    this.on('needAuth', data => this.auth(data));
    this.on('needParseMessage', raw => this.parseMessage(raw));
    this.on('needParseEvent', eObj => this.parseEvent(eObj));
    this.on('needParseResponse', response => this.parseResponse(response));
    this.on('disconnected', () => {
      this.connected = false;
      if (this.reconnectable) {
        setTimeout(() => {
          this.reconnect(this.reconnectable);
        }, this.reconnectTimeout);
      }
    });
    this.on('incorrectLogin', () => {
      this.reconnectable = false;
    });
    this.on('incorrectServer', () => {
      this.reconnectable = false;
    });
  }
  connect(reconnectable, reconnectTimeout) {
    if (reconnectable) {
      this.reconnectable = Boolean(reconnectable);
      this.reconnectTimeout =
        Number(reconnectTimeout) || this.reconnectTimeout || 5000;
    } else this.reconnectable = false;
    this.logger.debug('Opening connection');
    this.messagesQueue = [];
    this.initSocket();
  }

  initSocket() {
    this.logger.trace('Initializing socket');

    if (this.socket) {
      if (!this.socket.destroyed) {
        this.socket.end();
      }
      this.socket.removeAllListeners();
    }

    this.socket = new net.Socket();
    this.socket.setEncoding('ascii');
    if (this.unrefed) this.socket.unref();

    this.socket.on('connect', () => {
      this.emit('socketConnected');
    });

    this.socket.on('error', error => {
      this.logger.debug('Socket error:', error);
      if (error.code == 'ECONNREFUSED') this.emit('connectionRefused');
      this.emit('socketError', error);
    });

    this.socket.on('close', had_error => {
      this.emit('disconnected', had_error);
    });

    this.socket.on('timeout', () => {
      this.emit('connectTimeout');
    });

    this.socket.on('end', () => {
      this.emit('connectEnd');
    });

    this.socket.once('data', data => {
      this.emit('needAuth', data);
    });

    this.socket.connect(this.config.port, this.config.host);
  }

  auth(data) {
    this.logger.debug('First message:', data);
    if (data.match(/Asterisk Call Manager/)) {
      this._setVersion(data);
      this.socket.on('data', data => {
        this.splitMessages(data);
      });
      this.send(
        new Action.Login(this.config.login, this.config.password),
        (error, response) => {
          if (error) {
            if (error instanceof Response) this.emit('incorrectLogin');
            else this.emit('error', error);
          } else if (response && response.response === 'Success')
            this.emit('connected');
          else this.emit('incorrectLogin');
        }
      );
    } else {
      this.emit('incorrectServer', data);
    }
  }

  splitMessages(data) {
    this.logger.trace('Data:', data);

    const buffer = this.tailInput.concat(data.replace(REGEXP_EOM, EOM));
    const messages = buffer.split(EOM);

    this.tailInput = messages.pop(); // If all messages aren't spitted, tailInput = '',
    // else tailInput = part of last message and will concat with second part of it
    for (let i = 0; i < messages.length; i++) {
      (function(message) {
        this.emit('needParseMessage', message);
      }.bind(this)(messages[i]));
    }
  }

  parseMessage(raw) {
    this.logger.trace('Message:', raw);
    if (raw.match(/^Response: /)) {
      const response = new Response(raw);

      if (response.actionid) this.responses[response.actionid] = response;

      return this.emit('needParseResponse', response);
    }
    if (raw.match(/^Event: /))
      return this.emit('needParseEvent', new AmiEvent(raw));

    return this._parseUnformatMessage(raw);
  }

  _parseUnformatMessage(raw) {
    const keys = Object.keys(this.unformatWait);

    if (keys.length === 0)
      return this.logger.warn('Unexpected: \n<< %s >>', raw);

    const self = this;

    Response.tryFormat({ raw }, (err, data) => {
      if (err) return self.logger.warn('Fail fromat:', err);
      if (!self.unformatWait[data.type])
        return self.logger.warn("Doesn't wait:", data.type);
      if (
        !self.unformatWait[data.type].res ||
        self.unformatWait[data.type].res.length === 0
      ) {
        if (data.res.length == 1) self.unformatWait[data.type].res = data.res;
        else {
          self.unformatWait[data.type].res = [
            data.res[1].replace(
              '%REPLACE_ACTION_ID%',
              self.unformatWait[data.type].id
            ),
            data.res[0].replace(
              '%REPLACE_ACTION_ID%',
              self.unformatWait[data.type].id
            ),
          ];
        }
      } else
        self.unformatWait[data.type].res.push(
          data.res[0].replace(
            '%REPLACE_ACTION_ID%',
            self.unformatWait[data.type].id
          )
        );

      clearTimeout(self.unformatWait.queues.timeout);

      if (self.unformatWait[data.type].res.length === 1)
        return self.emit(
          'needParseMessage',
          self.unformatWait[data.type].res[0]
        );
      (self.unformatWait[data.type].timeout = setTimeout(() => {
        self.unformatWait[data.type].res.push(
          data.res[2].replace(
            '%REPLACE_ACTION_ID%',
            self.unformatWait[data.type].id
          )
        );
        self.unformatWait[data.type].res.forEach(mes => {
          self.emit('needParseMessage', mes);
        });
      }, 100)).unref();
    });
  }

  parseEvent(eObj) {
    this.logger.debug('AmiEvent:', eObj);

    const id = eObj.actionid;

    if (
      id !== undefined &&
      this.responses[id] !== undefined &&
      this.callbacks[id] !== undefined
    ) {
      this.emit('responseEvent', eObj);
      if (!this.responses[id].events) {
        this.logger.fatal('No events in this.responses.');
        this.logger.fatal(this.responses[id]);
        this.responses[id].events = [];
      }
      this.responses[id].events.push(eObj);
      if (this.originateResponses[id]) {
        if (eObj.event === 'OriginateResponse') {
          if (eObj.response && eObj.response.match(/Success/i)) {
            this.callbacks[id](null, eObj);
          } else this.callbacks[id](eObj);
        }
      } else if (
        eObj.event.indexOf('Complete') !== -1 ||
        eObj.event.indexOf('DBGetResponse') !== -1 ||
        (eObj.eventlist && eObj.eventlist.indexOf('Complete') !== -1)
      ) {
        if (
          this.responses[id].response &&
          this.responses[id].response.match(/Success/i)
        ) {
          this.callbacks[id](null, this.responses[id]);
        } else this.callbacks[id](this.responses[id]);
      }
    } else {
      this.emit('event', eObj);
      // this.emit('amiEvent' + eObj.event, eObj);
    }
    this.emit('rawEvent', eObj);
    this.emit(`rawEvent.${eObj.event}`, eObj);
  }

  parseResponse(res) {
    this.logger.debug('Response:', res);

    const id = res.actionid;

    if (res.message !== undefined && res.message.indexOf('follow') !== -1) {
      return (this.responses[id] = res);
    }

    if (this.callbacks[id]) {
      if (!this.originateResponses[id]) {
        if (res.response && res.response.match(/success/i))
          this.callbacks[id](null, res);
        else this.callbacks[id](res);
      }
    }
  }

  reconnect(reconnectable) {
    this.reconnectable = reconnectable || false;
    this.initSocket();
  }

  disconnect() {
    this.reconnectable = false;
    this.send(new Action.Logoff(), () => {
      this.logger.info('Logged out');
    });
    this.logger.info('Closing connection');
    this.removeAllListeners();
    this.socket.removeAllListeners();
    this.socket.end();
    this.emit('disconnected');
  }

  useLogger(logger) {
    this.logger = logger;
  }

  send(action, callback) {
    const self = this;

    this.logger.debug('Send:', action);
    if (!this.connected) {
      if (action.Action !== 'Login') {
        return callback(new Error('Server is disconnected'));
      }
    }
    this.socket.write(action.format(), err => {
      if (err) {
        return callback(err);
      }

      let timeout;

      (timeout = setTimeout(() => {
        if (self.callbacks[action.ActionID])
          self.callbacks[action.ActionID](new Error('ERRTIMEDOUT'));
      }, 300000)).unref();

      this.callbacks[action.ActionID] = function(err, data) {
        clearTimeout(timeout);
        delete self.callbacks[action.ActionID];
        delete self.responses[action.ActionID];
        delete self.originateResponses[action.ActionID];
        delete self.unformatWait[action.ActionID];

        return callback(err, data);
      };

      if (action.Action && action.Action.toLowerCase() === 'queues') {
        this.unformatWait[action.Action.toLowerCase()] = {
          id: action.ActionID,
          timeout: null,
          res: [],
        };
      } else if (
        action.Action &&
        action.Action.toLowerCase() === 'originate' &&
        action.WaitEvent
      ) {
        this.originateResponses[action.ActionID] = {};
      }
      this.responses[action.ActionID] = '';
    });
  }

  unref() {
    this.unrefed = true;
    if (this.socket) this.socket.unref();
  }

  ref() {
    delete this.unrefed;
    if (this.socket) this.socket.ref();
  }

  _setVersion(version) {
    const v = version.match(/Asterisk call manager\/([\d\.]*[\-\w\d\.]*)/i);

    if (v) {
      this.version = v[1];
    }
  }

  getVersion() {
    return this.version;
  }
}

exports.Client = Client;

exports.createClient = function(config) {
  return new Client(config);
};
