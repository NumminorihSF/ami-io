const Message = require('../lib/message.js');
const Event = require('../lib/event.js');
const expect = require('chai').expect;

describe('AmiIo.Event', () => {
  describe('#constructor()', () => {
    it('creates instance of Event', () => {
      expect(new Event('')).to.be.instanceOf(Event);
    });

    it('has Message as prototype', () => {
      expect(new Event('')).to.be.instanceOf(Message);
    });

    it('spawns .parse() function from prototype', () => {
      let spawned = false;
      const old = Event.prototype.parse;

      Event.prototype.parse = function() {
        spawned = true;
      };
      new Event('');
      expect(spawned).to.be.equal(true);
      Event.prototype.parse = old;
    });

    it('has #parse() === Message#parse()', () => {
      expect(Event.prototype.parse).to.be.equal(Message.prototype.parse);
    });
  });
});
