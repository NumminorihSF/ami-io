var Message = require('../lib/message.js');
var Event = require('../lib/event.js');
var expect = require('chai').expect;


describe('AmiIo.Event', function(){

  describe('#constructor()', function(){

    it('creates instance of Event', function(){
      expect(new Event('')).to.be.instanceOf(Event);
    });

    it('has Message as prototype', function(){
      expect(new Event('')).to.be.instanceOf(Message);
    });

    it('spawns .parse() function from prototype', function(){
      var spawned = false;
      var old = Event.prototype.parse;
      Event.prototype.parse = function(){
        spawned = true;
      };
      new Event('');
      expect(spawned).to.be.equal(true);
      Event.prototype.parse = old;
    });

    it('has #parse() === Message#parse()', function(){
      expect(Event.prototype.parse).to.be.equal(Message.prototype.parse);
    });
  });
});

