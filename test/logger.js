var Logger = require('../lib/logger.js');
var expect = require('chai').expect;


describe('AmiIo.Logger', function(){

  describe('#constructor()', function(){
    it ('create instance of Logger', function(done){
      expect(new Logger()).to.be.instanceOf(Logger);
      done();
    });

    it ('set level', function(done){
      expect(new Logger('some').level).to.be.equal('some');
      done();
    })

  });

  describe('#setLevel()', function(){

    it('set level value', function(){
      var l = new Logger();
      l.setLevel('123de');
      expect(l.level).to.be.equal('123de');
    });

  });

  describe('#trace()', function(){
    it('not throw', function(done){
      expect(Logger.prototype.trace).to.not.throw(Error);
      done();
    });
  });

  describe('#debug()', function(){
    it('not throw', function(done){
      expect(Logger.prototype.debug).to.not.throw(Error);
      done();
    });
  });

  describe('#info()', function(){
    it('not throw', function(done){
      expect(Logger.prototype.info).to.not.throw(Error);
      done();
    });
  });

  describe('#warn()', function(){
    it('not throw', function(done){
      expect(Logger.prototype.warn).to.not.throw(Error);
      done();
    });
  });

  describe('#error()', function(){
    it('not throw', function(done){
      expect(Logger.prototype.error).to.not.throw(Error);
      done();
    });
  });

  describe('#fatal()', function(){
    it('not throw', function(done){
      expect(Logger.prototype.fatal).to.not.throw(Error);
      done();
    });
  });

});