const Logger = require('../lib/loggers/logger.js');
const expect = require('chai').expect;

describe('AmiIo.Logger', function() {
  describe('#constructor()', () => {
    it ('creates instance of Logger', function(){
      expect(new Logger()).to.be.instanceOf(Logger);
    });

    it ('sets minimalLogLevel', function(){
      expect(new Logger('some').minimalLogLevel).to.be.equal('some');
    })

  });

  describe('#setMinimalLogLevel()', () => {
    it('sets minimalLogLevel\'s value', function(){
      const logger = new Logger();
      logger.setMinimalLogLevel('123de');
      expect(logger.minimalLogLevel).to.be.equal('123de');
    });

  });

  ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach((level) => {
  describe(`#${level}()`, function(){
    it('does not throw', function(){
      const logger = new Logger();
      expect(() => logger[level]()).to.not.throw(Error);
    });
  });    
});
  });
