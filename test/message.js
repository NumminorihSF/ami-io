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

    it('parse message with multiple ChanVariableKey correctly', function(){
      var mes = [
        "Event: Bridge",
        "Privilege: call,all",
        "Timestamp: 1469112499.321389",
        "Bridgestate: Unlink",
        "Bridgetype: core",
        "Channel1: SIP/with-TSE-LIM2-0000a194",
        "Channel2: Local/5842@from-queue-0000af99;1",
        "Uniqueid1: 1469111531.131272",
        "Uniqueid2: 1469111552.131275",
        "CallerID1: 4959810606",
        "CallerID2: 5836",
        "ChanVariable(SIP/with-TSE-LIM2-0000a194): CDR(linkedid)=1469111531.131272",
        "ChanVariable(SIP/with-TSE-LIM2-0000a194): CDR(dst)=5899",
        "ChanVariable(Local/5842@from-queue-0000af99;1): CDR(linkedid)=1469111531.131272",
        "ChanVariable(Local/5842@from-queue-0000af99;1): CDR(dst)=5842"].join('\r\n');
      message.parse(mes);
      expect(JSON.stringify(message)).to.deep.equal(JSON.stringify({
        variables: {},
        event: 'Bridge',
        privilege: 'call,all',
        timestamp: '1469112499.321389',
        bridgestate: 'Unlink',
        bridgetype: 'core',
        channel1: 'SIP/with-TSE-LIM2-0000a194',
        channel2: 'Local/5842@from-queue-0000af99;1',
        uniqueid1: '1469111531.131272',
        uniqueid2: '1469111552.131275',
        callerid1: '4959810606',
        callerid2: '5836',
        'chanvariable(sip/with_tse_lim2_0000a194)': { 'cdr(linkedid)': '1469111531.131272', 'cdr(dst)': '5899' },
        'chanvariable(local/5842@from_queue_0000af99;1)': { 'cdr(linkedid)': '1469111531.131272', 'cdr(dst)': '5842' },
        incomingData:
            [ 'Event: Bridge',
              'Privilege: call,all',
              'Timestamp: 1469112499.321389',
              'Bridgestate: Unlink',
              'Bridgetype: core',
              'Channel1: SIP/with-TSE-LIM2-0000a194',
              'Channel2: Local/5842@from-queue-0000af99;1',
              'Uniqueid1: 1469111531.131272',
              'Uniqueid2: 1469111552.131275',
              'CallerID1: 4959810606',
              'CallerID2: 5836',
              'ChanVariable(SIP/with-TSE-LIM2-0000a194): CDR(linkedid)=1469111531.131272',
              'ChanVariable(SIP/with-TSE-LIM2-0000a194): CDR(dst)=5899',
              'ChanVariable(Local/5842@from-queue-0000af99;1): CDR(linkedid)=1469111531.131272',
              'ChanVariable(Local/5842@from-queue-0000af99;1): CDR(dst)=5842' ] }));
    });

  });

});

