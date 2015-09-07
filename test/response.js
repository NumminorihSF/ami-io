var Message = require('../lib/message.js');
var Response = require('../lib/response.js');
var expect = require('chai').expect;


describe('AmiIo.Response', function(){

  describe('#constructor()', function(){

    it('creates instance of Response', function(done){
      expect(new Response('')).to.be.instanceOf(Response);
      done();
    });

    it('has Message as prototype', function(done){
      expect(new Response('')).to.be.instanceOf(Message);
      done();
    });

    it('spawns .parse() function from prototype', function(done){
      var spawned = false;
      var old = Response.prototype.parse;
      Response.prototype.parse = function(){
        spawned = true;
      };
      new Response('');
      expect(spawned).to.be.equal(true);
      Response.prototype.parse = old;
      done();
    });

  });

});

