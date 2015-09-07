var Message = require('../lib/message.js');
var Event = require('../lib/event.js');
var expect = require('chai').expect;


describe('AmiIo.Event', function(){

  describe('#constructor()', function(){

    it('creates instance of Event', function(done){
      expect(new Event('')).to.be.instanceOf(Event);
      done();
    });

    it('has Message as prototype', function(done){
      expect(new Event('')).to.be.instanceOf(Message);
      done();
    });

    it('spawns .parse() function from prototype', function(done){
      var spawned = false;
      var old = Event.prototype.parse;
      Event.prototype.parse = function(){
        spawned = true;
      };
      new Event('');
      expect(spawned).to.be.equal(true);
      Event.prototype.parse = old;
      done();
    });

  });

});

