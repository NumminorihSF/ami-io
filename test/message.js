var Message = require('../lib/message.js');
var expect = require('chai').expect;
var eol = require('../lib/constants').eol;
var eom = require('../lib/constants').eom;

describe('AmiIo.Message', function(){

  describe('#constructor()', function(){

    it('creates instance of Message', function(done){
      expect(new Message()).to.be.instanceOf(Message);
      done();
    });

  });

  describe('#format()', function(){

    it('format empty message to EOL success', function(done){
      expect(Message.prototype.format.call({variables: {}})).to.be.equal(eol);
      done();
    });

    it('format many variables success', function(done){
      expect(Message.prototype.format.call({
        variables: {
          first: 'first',
          SeConD: 'second',
          third: '3'
        }
      })).to.be.equal('Variable: first=first'+eol+'Variable: SeConD=second'+eol+'Variable: third=3'+eom);
      done();
    });

    it('format some message without variables success', function(done){
      expect(Message.prototype.format.call({
        first: 'first',
        SeConD: 'second',
        third: '3'
      })).to.be.equal('first: first'+eol+'SeConD: second'+eol+'third: 3'+eom);
      done();
    });

    it('format any massage success', function(done){
      expect(Message.prototype.format.call({
        first: 'first',
        SeConD: 'second',
        third: '3',
        variables: {
          first: 'first',
          SeConD: 'second',
          third: '3'
        }
      })).to.be.equal('first: first'+eol+'SeConD: second'+eol+'third: 3'+eol+
        'Variable: first=first'+eol+'Variable: SeConD=second'+eol+'Variable: third=3'+eom);
      done();
    });

    it('ignore functions at fields', function(done){
      expect(Message.prototype.format.call({
        variables: {
          first: 'first',
          SeConD: 'second',
          third: '3'
        },
        f: function(){}
      })).to.be.equal('Variable: first=first'+eol+'Variable: SeConD=second'+eol+'Variable: third=3'+eom);
      done();
    });

  });

  describe('#parse()', function(){

    var message;

    beforeEach(function(){
      message = new Message();
    });

    it('has correct field .incomingData with split strings', function(done){
      message.parse('My: message'+eol+'Second: value');
      expect(message.incomingData).to.deep.equal(['My: message', 'Second: value']);
      done();
    });

    it('set field correct', function(done){
      message.parse('My: message'+eol+'Second: value');
      expect(message.my).to.be.equal('message');
      done();
    });

    it('set variables correct', function(done){
      message.parse('Variable: My'+eol+'Value: message'+eol+'Variable: SecOnD'+eol+'Value: const');
      expect(message.variables).to.deep.equal({My: 'message', 'SecOnD':'const'});
      done();
    });

  });

});

