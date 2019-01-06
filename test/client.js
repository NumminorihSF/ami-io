const net = require('net');
const AmiIo = require('../lib/client');
const expect = require('chai').expect;

describe('AmiIo.Client', () => {
  describe('#constructor()', () => {
    it('creates instance of Client', () => {
      expect(new AmiIo.Client()).to.be.instanceOf(AmiIo.Client);
    });

    it('has EventEmitter as proto', () => {
      expect(new AmiIo.Client()).to.be.instanceOf(
        require('events').EventEmitter
      );
    });

    it('use host from config', () => {
      expect(new AmiIo.Client({ host: '123' })).to.have.nested.property(
        'config.host',
        '123'
      );
    });

    it("use '127.0.0.1' as default host", () => {
      expect(new AmiIo.Client()).to.have.nested.property(
        'config.host',
        '127.0.0.1'
      );
    });

    it('use port from config', () => {
      expect(new AmiIo.Client({ port: 6666 })).to.have.nested.property(
        'config.port',
        6666
      );
    });

    it('use 5038 as default port', () => {
      expect(new AmiIo.Client()).to.have.nested.property('config.port', 5038);
    });

    it('use login from config', () => {
      expect(new AmiIo.Client({ login: 'trim' })).to.have.nested.property(
        'config.login',
        'trim'
      );
    });

    it("use 'admin' as default login", () => {
      expect(new AmiIo.Client()).to.have.nested.property(
        'config.login',
        'admin'
      );
    });

    it('use password from config', () => {
      expect(new AmiIo.Client({ password: 'ouch' })).to.have.nested.property(
        'config.password',
        'ouch'
      );
    });

    it("use 'admin' as default password", () => {
      expect(new AmiIo.Client()).to.have.nested.property(
        'config.password',
        'admin'
      );
    });

    it("use '<unknown>' as initial value for version", () => {
      expect(new AmiIo.Client()).to.have.property('version', '<unknown>');
    });
  });

  describe("Event: 'connected'", () => {
    it('sets #connected to true', () => {
      const client = new AmiIo.Client();

      client.emit('connected');
      expect(client.connected).to.be.equal(true);
    });
  });

  describe("Event: 'disconnected'", () => {
    it('sets #connected to false', () => {
      const client = new AmiIo.Client();

      client.emit('disconnected');
      expect(client.connected).to.be.equal(false);
    });

    it('calls reconnect function if #reconnectable is true', done => {
      const client = new AmiIo.Client();
      let reconnectCalled = false;

      client.reconnectable = true;
      client.timeout = 1;
      client.reconnect = function() {
        reconnectCalled = true;
      };
      client.emit('disconnected');
      setTimeout(() => {
        expect(reconnectCalled).to.be.equal(true);
        done();
      }, 1);
    });

    it('does not call reconnect function if #reconnectable is true', done => {
      const client = new AmiIo.Client();
      let called = false;

      client.reconnectable = false;
      client.timeout = 1;
      client.reconnect = function() {
        called = true;
      };
      client.emit('disconnected');
      setTimeout(() => {
        expect(called).to.be.equal(false);
        done();
      }, 20);
    });
  });

  describe("Event: 'needAuth'", () => {
    it('call #auth function', () => {
      const old = AmiIo.Client.prototype.auth;
      const client = new AmiIo.Client();
      let authCalled = false;

      AmiIo.Client.prototype.auth = function() {
        authCalled = true;
      };

      client.emit('needAuth');
      expect(authCalled).to.be.equal(true);
      AmiIo.Client.prototype.auth = old;
    });
  });

  describe("Event: 'needParseMessage'", () => {
    it('call #parseMessage function', () => {
      const old = AmiIo.Client.prototype.parseMessage;
      const client = new AmiIo.Client();
      let parseMessageCalled = false;

      AmiIo.Client.prototype.parseMessage = function() {
        parseMessageCalled = true;
      };
      client.emit('needParseMessage');
      expect(parseMessageCalled).to.be.equal(true);
      AmiIo.Client.prototype.parseMessage = old;
    });
  });

  describe("Event: 'needParseEvent'", () => {
    it('call #parseEvent function', () => {
      const old = AmiIo.Client.prototype.parseEvent;
      const client = new AmiIo.Client();
      let parseEventCalled = false;

      AmiIo.Client.prototype.parseEvent = function() {
        parseEventCalled = true;
      };
      client.emit('needParseEvent');
      expect(parseEventCalled).to.be.equal(true);
      AmiIo.Client.prototype.parseEvent = old;
    });
  });

  describe("Event: 'needParseResponse'", () => {
    it('call #parseResponse function', () => {
      const old = AmiIo.Client.prototype.parseResponse;
      const client = new AmiIo.Client();
      let parseResponseCalled = false;

      AmiIo.Client.prototype.parseResponse = function() {
        parseResponseCalled = true;
      };
      client.emit('needParseResponse');
      expect(parseResponseCalled).to.be.equal(true);
      AmiIo.Client.prototype.parseResponse = old;
    });
  });

  describe("Event: 'incorrectLogin'", () => {
    it('set #reconnectable to false', () => {
      const client = new AmiIo.Client();

      client.reconnectable = true;
      client.emit('incorrectLogin');
      expect(client.reconnectable).to.be.equal(false);
    });
  });

  describe("Event: 'incorrectServer'", () => {
    it('set #reconnectable to false', () => {
      const client = new AmiIo.Client();

      client.reconnectable = true;
      client.emit('incorrectServer');
      expect(client.reconnectable).to.be.equal(false);
    });
  });

  describe('#createClient()', () => {
    it('creates instance of Client', () => {
      expect(AmiIo.createClient()).to.be.instanceOf(AmiIo.Client);
    });

    it('has EventEmitter as prototype', () => {
      expect(AmiIo.createClient()).to.be.instanceOf(
        require('events').EventEmitter
      );
    });

    it('use host from config', () => {
      expect(AmiIo.createClient({ host: '123' })).to.have.nested.property(
        'config.host',
        '123'
      );
    });

    it("use '127.0.0.1' as default host", () => {
      expect(AmiIo.createClient()).to.have.nested.property(
        'config.host',
        '127.0.0.1'
      );
    });

    it('use port from config', () => {
      expect(AmiIo.createClient({ port: 6666 })).to.have.nested.property(
        'config.port',
        6666
      );
    });

    it('use 5038 as default port', () => {
      expect(AmiIo.createClient()).to.have.nested.property('config.port', 5038);
    });

    it('use login from config', () => {
      expect(AmiIo.createClient({ login: 'trim' })).to.have.nested.property(
        'config.login',
        'trim'
      );
    });

    it("use 'admin' as default login", () => {
      expect(AmiIo.createClient()).to.have.nested.property(
        'config.login',
        'admin'
      );
    });

    it('use password from config', () => {
      expect(AmiIo.createClient({ password: 'ouch' })).to.have.nested.property(
        'config.password',
        'ouch'
      );
    });

    it("use 'admin' as default password", () => {
      expect(AmiIo.createClient()).to.have.nested.property(
        'config.password',
        'admin'
      );
    });

    it("use '<unknown>' as initial value for version", () => {
      expect(AmiIo.createClient()).to.nested.property('version', '<unknown>');
    });
  });

  describe('#connect()', () => {
    let c;

    beforeEach(() => {
      c = new AmiIo.Client();
      c.initSocket = function() {};
    });

    it('set should reconnect to true, if need', () => {
      c.connect(true);
      expect(c.reconnectable).to.be.equal(true);
    });

    it('set should reconnect to false, if need', () => {
      c.connect(false);
      expect(c.reconnectable).to.be.equal(false);
    });

    it('set should reconnect to false, by default', () => {
      c.connect();
      expect(c.reconnectable).to.be.equal(false);
    });

    it('does not set reconnect timeout if does not should reconnect', () => {
      c.connect(false, 1000);
      expect(c.timeout).to.not.exist;
    });

    it('set reconnect timeout to number, if need', () => {
      c.connect(true, 1000);
      expect(c.reconnectTimeout).to.be.equal(1000);
    });

    it('set reconnect timeout to default if non number use', () => {
      c.connect(true, 'asd');
      expect(c.reconnectTimeout).to.be.equal(5000);
    });

    it('set reconnect timeout to 5000, by default', () => {
      c.connect(true);
      expect(c.reconnectTimeout).to.be.equal(5000);
    });

    it('use previous correct value as default', () => {
      c.connect(true, 1234);
      c.connect(true, 'rer');
      expect(c.reconnectTimeout).to.be.equal(1234);
    });
  });

  describe('#initSocket()', () => {
    const old = net.Socket.prototype.connect;
    let current;
    let client;

    before(() => {
      net.Socket.prototype.connect = function(port, host) {
        current = { port, host };
      };
    });

    beforeEach(() => {
      client = new AmiIo.Client();
      current = null;
    });

    it('create socket at #socket and connect', () => {
      client.initSocket();
      expect(current).to.deep.equal({ port: 5038, host: '127.0.0.1' });
    });

    it('set socket encoding to ASCII', () => {
      const old = net.Socket.prototype.setEncoding;

      net.Socket.prototype.setEncoding = function(enc) {
        expect(enc.toLowerCase()).to.be.equal('ascii');
      };
      client.initSocket();
      net.Socket.prototype.setEncoding = old;
    });

    it('close exist if socket present and is not destroyed', () => {
      let ended = false;

      client.socket = {
        destroyed: false,
        removeAllListeners() {},
        end() {
          ended = true;
        },
      };
      client.initSocket();
      expect(ended).to.be.equal(true);
    });

    it('remove all listeners from socket if socket present and is not destroyed', () => {
      let removed = false;

      client.socket = {
        destroyed: false,
        removeAllListeners() {
          removed = true;
        },
        end() {},
      };
      client.initSocket();
      expect(removed).to.be.equal(true);
    });

    it('remove all listeners from socket if socket present and is destroyed', () => {
      let removed = false;

      client.socket = {
        destroyed: true,
        removeAllListeners() {
          removed = true;
        },
        end() {},
      };
      client.initSocket();
      expect(removed).to.be.equal(true);
    });

    it('unref() new socket if last was unrefed', () => {
      let s = false;
      const old = net.Socket.prototype.unref;

      net.Socket.prototype.unref = function(enc) {
        s = true;
      };
      client.unrefed = true;
      client.initSocket();
      net.Socket.prototype.unref = old;
      expect(s).to.be.equal(true);
    });

    it("throw 'connect' event to client 'socketConnected' event", () => {
      let s = false;

      client.on('socketConnected', () => {
        s = true;
      });
      client.initSocket();
      client.socket.emit('connect');
      expect(s).to.be.equal(true);
    });

    it("throw 'error' event to client 'socketError' event", () => {
      let s = false;

      client.on('socketError', () => {
        s = true;
      });
      client.initSocket();
      client.socket.emit('error', {});
      expect(s).to.be.equal(true);
    });

    it("throw 'error' with code 'ECONNREFUSED' to client 'socketError' event", () => {
      let s = false;

      client.on('socketError', () => {
        s = true;
      });
      client.initSocket();
      client.socket.emit('error', { code: 'ECONNREFUSED' });
      expect(s).to.be.equal(true);
    });

    it("throw 'error' with code 'ECONNREFUSED' to client 'connectionRefused' event", () => {
      let s = false;

      client.on('connectionRefused', () => {
        s = true;
      });
      client.initSocket();
      client.socket.emit('error', { code: 'ECONNREFUSED' });
      expect(s).to.be.equal(true);
    });

    it("throw 'close' event to client 'disconnected' event", () => {
      let s = false;

      client.on('disconnected', () => {
        s = true;
      });
      client.initSocket();
      client.socket.emit('close');
      expect(s).to.be.equal(true);
    });

    it("throw 'timeout' event to client 'connectTimeout' event", () => {
      let s = false;

      client.on('connectTimeout', () => {
        s = true;
      });
      client.initSocket();
      client.socket.emit('timeout');
      expect(s).to.be.equal(true);
    });

    it("throw 'end' event to client 'connectEnd' event", () => {
      let s = false;

      client.on('connectEnd', () => {
        s = true;
      });
      client.initSocket();
      client.socket.emit('end');
      expect(s).to.be.equal(true);
    });

    it("throw 'data' event to client 'needAuth' event", () => {
      let s = false;

      client.on('needAuth', () => {
        s = true;
      });
      client.initSocket();
      client.socket.emit('data', '');
      expect(s).to.be.equal(true);
    });

    it("throw 'data' event to client 'needAuth' event only once", () => {
      let s = false;

      client.once('needAuth', c => {
        s = c;
      });
      client.initSocket();
      client.socket.emit('data', 'rew');
      client.socket.emit('data', 'awe');
      expect(s).to.be.equal('rew');
    });

    after(() => {
      net.Socket.prototype.connect = old;
    });
  });

  describe('#auth()', () => {
    let c;

    beforeEach(() => {
      c = new AmiIo.Client();
    });

    it("emit to object 'incorrectServer' then not asterisk Hello Message", () => {
      let d;

      c.on('incorrectServer', m => {
        d = m;
      });
      c.auth('bla Lan Bla');
      expect(d).to.be.equal('bla Lan Bla');
    });

    it('parse version from asterisk Hello Message', () => {
      c.socket = new (require('events')).EventEmitter();
      c.send = function() {};
      c.auth('Asterisk Call Manager/123.23-erfw2');
      expect(c.version).to.be.equal('123.23-erfw2');
    });

    it('create data listener on socket after success', () => {
      c.socket = new (require('events')).EventEmitter();
      c.send = function() {};

      let s = false;

      c.socket.on('newListener', event => {
        if (event === 'data') {
          s = true;
        }
      });
      c.auth('Asterisk Call Manager/123.23-erfw2');
      expect(s).to.be.equal(true);
    });

    it('try send something to socket after success', () => {
      c.socket = new (require('events')).EventEmitter();
      c.send = function() {};

      let s = false;

      c.send = function() {
        s = true;
      };
      c.auth('Asterisk Call Manager/123.23-erfw2');
      expect(s).to.be.equal(true);
    });
  });
});
