const Message = require('../lib/message.js');
const Response = require('../lib/response.js');
const expect = require('chai').expect;

describe('AmiIo.Response', () => {
  describe('#constructor()', () => {
    it('creates instance of Response', done => {
      expect(new Response('')).to.be.instanceOf(Response);
      done();
    });

    it('has Message as prototype', done => {
      expect(new Response('')).to.be.instanceOf(Message);
      done();
    });

    it('spawns .parse() function from prototype', done => {
      let spawned = false;
      const old = Response.prototype.parse;

      Response.prototype.parse = function() {
        spawned = true;
      };
      new Response('');
      expect(spawned).to.be.equal(true);
      Response.prototype.parse = old;
      done();
    });
  });
});
