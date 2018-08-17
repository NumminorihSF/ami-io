var net = require('net');
var AmiIo = require('../lib/index.js');
var expect = require('chai').expect;


describe('AmiIo.Client', function(){

  describe('#constructor()', function(){

    it('creates instance of Client', function(done){
      expect(new AmiIo.Client()).to.be.instanceOf(AmiIo.Client);
      done();
    });

    it('has EventEmitter as prototype', function(done){
      expect(new AmiIo.Client()).to.be.instanceOf(require('events').EventEmitter);
      done();
    });

    it('use host from config', function(done){
      expect(new AmiIo.Client({host: '123'})).to.have.nested.property('config.host', '123');
      done();
    });

    it('use \'127.0.0.1\' as default host', function(done){
      expect(new AmiIo.Client()).to.have.nested.property('config.host', '127.0.0.1');
      done();
    });

    it('use port from config', function(done){
      expect(new AmiIo.Client({port: 6666})).to.have.nested.property('config.port', 6666);
      done();
    });

    it('use 5038 as default port', function(done){
      expect(new AmiIo.Client()).to.have.nested.property('config.port', 5038);
      done();
    });

    it('use login from config', function(done){
      expect(new AmiIo.Client({login: 'trim'})).to.have.nested.property('config.login', 'trim');
      done();
    });

    it('use \'admin\' as default login', function(done){
      expect(new AmiIo.Client()).to.have.nested.property('config.login', 'admin');
      done();
    });

    it('use password from config', function(done){
      expect(new AmiIo.Client({password: 'ouch'})).to.have.nested.property('config.password', 'ouch');
      done();
    });

    it('use \'admin\' as default password', function(done){
      expect(new AmiIo.Client()).to.have.nested.property('config.password', 'admin');
      done();
    });

    it('use \'ascii\' as default encoding', function(done){
      expect(new AmiIo.Client()).to.have.nested.property('config.encoding', 'ascii');
      done();
    });

    it('use encoding from config', function(done){
      expect(new AmiIo.Client({encoding: 'my-encoding'})).to.have.nested.property('config.encoding', 'my-encoding');
      done();
    });

    it('use \'<unknown>\' as initial value for version', function(done){
      expect(new AmiIo.Client()).to.have.property('version', '<unknown>');
      done();
    });

  });

  describe('Event: \'connected\'', function(){

    it('sets #connected to true', function(done){
      var c;
      (c = new AmiIo.Client()).emit('connected');
      expect(c.connected).to.be.equal(true);
      done();
    });

  });

  describe('Event: \'disconnected\'', function(){

    it('sets #connected to false', function(done){
      var c;
      (c = new AmiIo.Client()).emit('connected');
      c.emit('disconnected');
      expect(c.connected).to.be.equal(false);
      done();
    });

    it('calls reconnect function if #shouldReconnect is true', function(done){
      var c = new AmiIo.Client(), s;
      c.shouldReconnect = true;
      c.timeout = 1;
      c.reconnect = function(){
        s = true;
      };
      c.emit('disconnected');
      setTimeout(function(){
        expect(s).to.be.equal(true);
        done();
      }, 1);
    });

    it('does not call reconnect function if #shouldReconnect is true', function(done){
      var c = new AmiIo.Client(), s = false;
      c.shouldReconnect = false;
      c.timeout = 1;
      c.reconnect = function(){
        s = true;
      };
      c.emit('disconnected');
      setTimeout(function(){
        expect(s).to.be.equal(false);
        done();
      }, 20);
    });

  });

  describe('Event: \'needAuth\'', function(){

    it('call #auth function', function(done){
      var c, s = false;
      var old = AmiIo.Client.prototype.auth;
      AmiIo.Client.prototype.auth = function(){
        s = true;
      };
      (c = new AmiIo.Client());
      c.emit('needAuth');
      expect(s).to.be.equal(true);
      AmiIo.Client.prototype.auth = old;
      done();
    });

  });

  describe('Event: \'needParseMessage\'', function(){

    it('call #parseMessage function', function(done){
      var c, s = false;
      var old = AmiIo.Client.prototype.parseMessage;
      AmiIo.Client.prototype.parseMessage = function(){
        s = true;
      };
      (c = new AmiIo.Client());
      c.emit('needParseMessage');
      expect(s).to.be.equal(true);
      AmiIo.Client.prototype.parseMessage = old;
      done();
    });

  });

  describe('Event: \'needParseEvent\'', function(){

    it('call #parseEvent function', function(done){
      var c, s = false;
      var old = AmiIo.Client.prototype.parseEvent;
      AmiIo.Client.prototype.parseEvent = function(){
        s = true;
      };
      (c = new AmiIo.Client());
      c.emit('needParseEvent');
      expect(s).to.be.equal(true);
      AmiIo.Client.prototype.parseEvent = old;
      done();
    });

  });

  describe('Event: \'needParseResponse\'', function(){

    it('call #parseResponse function', function(done){
      var c, s = false;
      var old = AmiIo.Client.prototype.parseResponse;
      AmiIo.Client.prototype.parseResponse = function(){
        s = true;
      };
      (c = new AmiIo.Client());
      c.emit('needParseResponse');
      expect(s).to.be.equal(true);
      AmiIo.Client.prototype.parseResponse = old;
      done();
    });

  });

  describe('Event: \'incorrectLogin\'', function(){

    it('set #shouldReconnect to false', function(done){
      var c;
      c = new AmiIo.Client();
      c.shouldReconnect = true;
      c.emit('incorrectLogin');
      expect(c.shouldReconnect).to.be.equal(false);
      done();
    });

  });

  describe('Event: \'incorrectServer\'', function(){

    it('set #shouldReconnect to false', function(done){
      var c;
      c = new AmiIo.Client();
      c.shouldReconnect = true;
      c.emit('incorrectServer');
      expect(c.shouldReconnect).to.be.equal(false);
      done();
    });

  });

  describe('#createClient()', function(){

    it('creates instance of Client', function(done){
      expect(AmiIo.createClient()).to.be.instanceOf(AmiIo.Client);
      done();
    });

    it('has EventEmitter as prototype', function(done){
      expect(AmiIo.createClient()).to.be.instanceOf(require('events').EventEmitter);
      done();
    });

    it('use host from config', function(done){
      expect(AmiIo.createClient({host: '123'})).to.have.nested.property('config.host', '123');
      done();
    });

    it('use \'127.0.0.1\' as default host', function(done){
      expect(AmiIo.createClient()).to.have.nested.property('config.host', '127.0.0.1');
      done();
    });

    it('use port from config', function(done){
      expect(AmiIo.createClient({port: 6666})).to.have.nested.property('config.port', 6666);
      done();
    });

    it('use 5038 as default port', function(done){
      expect(AmiIo.createClient()).to.have.nested.property('config.port', 5038);
      done();
    });

    it('use login from config', function(done){
      expect(AmiIo.createClient({login: 'trim'})).to.have.nested.property('config.login', 'trim');
      done();
    });

    it('use \'admin\' as default login', function(done){
      expect(AmiIo.createClient()).to.have.nested.property('config.login', 'admin');
      done();
    });

    it('use password from config', function(done){
      expect(AmiIo.createClient({password: 'ouch'})).to.have.nested.property('config.password', 'ouch');
      done();
    });

    it('use \'admin\' as default password', function(done){
      expect(AmiIo.createClient()).to.have.nested.property('config.password', 'admin');
      done();
    });

    it('use \'<unknown>\' as initial value for version', function(done){
      expect(AmiIo.createClient()).to.nested.property('version', '<unknown>');
      done();
    });

  });

  describe('#connect()', function(){

    var c;

    beforeEach(function(){
      c = new AmiIo.Client();
      c.initSocket = function(){};
    });

    it('set should reconnect to true, if need', function(done){
      c.connect(true);
      expect(c.shouldReconnect).to.be.equal(true);
      done();
    });

    it('set should reconnect to false, if need', function(done){
      c.connect(false);
      expect(c.shouldReconnect).to.be.equal(false);
      done();
    });

    it('set should reconnect to false, by default', function(done){
      c.connect();
      expect(c.shouldReconnect).to.be.equal(false);
      done();
    });

    it ('does not set reconnect timeout if does not should reconnect', function(done){
      c.connect(false, 1000);
      expect(c.timeout).to.not.exist;
      done();
    });

    it('set reconnect timeout to number, if need', function(done){
      c.connect(true, 1000);
      expect(c.reconnectTimeout).to.be.equal(1000);
      done();
    });

    it('set reconnect timeout to default if non number use', function(done){
      c.connect(true, 'asd');
      expect(c.reconnectTimeout).to.be.equal(5000);
      done();
    });

    it('set reconnect timeout to 5000, by default', function(done){
      c.connect(true);
      expect(c.reconnectTimeout).to.be.equal(5000);
      done();
    });

    it('use previous correct value as default', function(done){
      c.connect(true, 1234);
      c.connect(true, 'rer');
      expect(c.reconnectTimeout).to.be.equal(1234);
      done();
    });

  });

  describe('#initSocket()', function(){

    var old = net.Socket.prototype.connect;
    var current;
    var c;
    before(function(){
      net.Socket.prototype.connect = function(port, host){
        current = {port: port, host: host};
      }
    });
    beforeEach(function(){
      c = new AmiIo.Client();
      current = null;
    });

    it('create socket at #socket and connect', function(){
      c.initSocket();
      expect(current).to.deep.equal({port: 5038, host: '127.0.0.1'});
    });

    it('set socket encoding to ASCII', function(){
      var old = net.Socket.prototype.setEncoding;
      net.Socket.prototype.setEncoding = function(enc){
        expect(enc.toLowerCase()).to.be.equal('ascii');
      };
      c.initSocket();
      net.Socket.prototype.setEncoding = old;
    });

    it('close exist if socket present and is not destroyed', function(){
      var ended = false;
      c.socket = {
        destroyed: false,
        removeAllListeners: function(){},
        end: function(){
          ended = true;
        }
      };
      c.initSocket();
      expect(ended).to.be.equal(true);
    });

    it('remove all listeners from socket if socket present and is not destroyed', function(){
      var removed = false;
      c.socket = {
        destroyed: false,
        removeAllListeners: function(){
          removed = true;
        },
        end: function(){}
      };
      c.initSocket();
      expect(removed).to.be.equal(true);
    });

    it('remove all listeners from socket if socket present and is destroyed', function(){
      var removed = false;
      c.socket = {
        destroyed: true,
        removeAllListeners: function(){
          removed = true;
        },
        end: function(){}
      };
      c.initSocket();
      expect(removed).to.be.equal(true);
    });

    it('unref() new socket if last was unrefed', function(){
      var s = false;
      var old = net.Socket.prototype.unref;
      net.Socket.prototype.unref = function(enc){
        s = true;
      };
      c.unrefed = true;
      c.initSocket();
      net.Socket.prototype.unref = old;
      expect(s).to.be.equal(true);
    });

    it('throw \'connect\' event to client \'socketConnected\' event', function(){
      var s = false;
      c.on('socketConnected', function(){s = true;});
      c.initSocket();
      c.socket.emit('connect');
      expect(s).to.be.equal(true);
    });

    it('throw \'error\' event to client \'socketError\' event', function(){
      var s = false;
      c.on('socketError', function(){s = true;});
      c.initSocket();
      c.socket.emit('error', {});
      expect(s).to.be.equal(true);
    });

    it('throw \'error\' with code \'ECONNREFUSED\' to client \'socketError\' event', function(){
      var s = false;
      c.on('socketError', function(){s = true;});
      c.initSocket();
      c.socket.emit('error', {code: 'ECONNREFUSED'});
      expect(s).to.be.equal(true);
    });

    it('throw \'error\' with code \'ECONNREFUSED\' to client \'connectionRefused\' event', function(){
      var s = false;
      c.on('connectionRefused', function(){s = true;});
      c.initSocket();
      c.socket.emit('error', {code: 'ECONNREFUSED'});
      expect(s).to.be.equal(true);
    });

    it('throw \'close\' event to client \'disconnected\' event', function(){
      var s = false;
      c.on('disconnected', function(){s = true;});
      c.initSocket();
      c.socket.emit('close');
      expect(s).to.be.equal(true);
    });

    it('throw \'timeout\' event to client \'connectTimeout\' event', function(){
      var s = false;
      c.on('connectTimeout', function(){s = true;});
      c.initSocket();
      c.socket.emit('timeout');
      expect(s).to.be.equal(true);
    });

    it('throw \'end\' event to client \'connectEnd\' event', function(){
      var s = false;
      c.on('connectEnd', function(){s = true;});
      c.initSocket();
      c.socket.emit('end');
      expect(s).to.be.equal(true);
    });

    it('throw \'data\' event to client \'needAuth\' event', function(){
      var s = false;
      c.on('needAuth', function(){s = true;});
      c.initSocket();
      c.socket.emit('data', '');
      expect(s).to.be.equal(true);
    });

    it('throw \'data\' event to client \'needAuth\' event only once', function(){
      var s = false;
      c.once('needAuth', function(c){s = c;});
      c.initSocket();
      c.socket.emit('data', 'rew');
      c.socket.emit('data', 'awe');
      expect(s).to.be.equal('rew');
    });

    after(function(){
      net.Socket.prototype.connect = old;
    });

  });

  describe('#auth()', function(){

    var c;

    beforeEach(function(){
      c = new AmiIo.Client();
    });

    it('emit to object \'incorrectServer\' then not asterisk Hello Message', function(done){
      var d;
      c.on('incorrectServer', function(m){
        d = m;
      });
      c.auth('bla Lan Bla');
      expect(d).to.be.equal('bla Lan Bla');
      done();
    });

    it('parse version from asterisk Hello Message', function(done){
      c.socket = new (require('events')).EventEmitter();
      c.send = function(){};
      c.auth('Asterisk Call Manager/123.23-erfw2');
      expect(c.version).to.be.equal('123.23-erfw2');
      done();
    });

    it('create data listener on socket after success', function(done){
      c.socket = new (require('events')).EventEmitter();
      c.send = function(){};
      var s = false;
      c.socket.on('newListener', function(event){
        if (event === 'data'){
          s = true;
        }
      });
      c.auth('Asterisk Call Manager/123.23-erfw2');
      expect(s).to.be.equal(true);
      done();
    });

    it('try send something to socket after success', function(done){
      c.socket = new (require('events')).EventEmitter();
      c.send = function(){};
      var s = false;
      c.send = function(){
        s = true;
      };
      c.auth('Asterisk Call Manager/123.23-erfw2');
      expect(s).to.be.equal(true);
      done();
    });


  });

});

