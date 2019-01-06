const Message = require('../lib/message.js');
const expect = require('chai').expect;
const { EOL, EOM } = require('../lib/constants');

describe('AmiIo.Message', () => {
  describe('#constructor()', () => {
    it('creates instance of Message', done => {
      expect(new Message()).to.be.instanceOf(Message);
      done();
    });
  });

  describe('#format()', () => {
    it('format empty message to EOL success', done => {
      const message = new Message();

      expect(message.format()).to.be.equal(EOL);
      done();
    });

    it('format many variables success', done => {
      const message = new Message();

      message.variables = {
        first: 'first',
        SeConD: 'second',
        third: '3',
      };
      expect(message.format()).to.be.equal(
        `Variable: first=first${EOL}Variable: SeConD=second${EOL}Variable: third=3${EOM}`
      );
      done();
    });

    it('format some message without variables success', () => {
      const message = new Message();

      Object.assign(message, {
        first: 'first',
        SeConD: 'second',
        third: '3',
      });
      expect(message.format()).to.be.equal(
        `first: first${EOL}SeConD: second${EOL}third: 3${EOM}`
      );
    });

    it('format any massage success', () => {
      const message = new Message();

      Object.assign(message, {
        first: 'first',
        SeConD: 'second',
        third: '3',
        variables: {
          first: 'first',
          SeConD: 'second',
          third: '3',
        },
      });
      expect(message.format()).to.be.equal(
        `first: first${EOL}SeConD: second${EOL}third: 3${EOL}Variable: first=first${EOL}Variable: SeConD=second${EOL}Variable: third=3${EOM}`
      );
    });

    it('ignore functions at fields', done => {
      const message = new Message();

      Object.assign(message, {
        variables: {
          first: 'first',
          SeConD: 'second',
          third: '3',
        },
        f() {},
      });
      expect(message.format()).to.be.equal(
        `Variable: first=first${EOL}Variable: SeConD=second${EOL}Variable: third=3${EOM}`
      );
      done();
    });
  });

  describe('#parse()', () => {
    let message;

    beforeEach(() => {
      message = new Message();
    });

    it('has correct field .incomingData with split strings', done => {
      message.parse(`My: message${EOL}Second: value`);
      expect(message.incomingData).to.deep.equal([
        'My: message',
        'Second: value',
      ]);
      done();
    });

    it('set field correct', done => {
      message.parse(`My: message${EOL}Second: value`);
      expect(message.my).to.be.equal('message');
      done();
    });

    it('set variables correct', done => {
      message.parse(
        `Variable: My${EOL}Value: message${EOL}Variable: SecOnD${EOL}Value: const`
      );
      expect(message.variables).to.deep.equal({
        My: 'message',
        SecOnD: 'const',
      });
      done();
    });

    it('parse message with multiple ChanVariableKey correctly', () => {
      const mes = [
        'Event: Bridge',
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
        'ChanVariable(Local/5842@from-queue-0000af99;1): CDR(dst)=5842',
      ].join('\r\n');

      message.parse(mes);
      expect(JSON.stringify(message)).to.deep.equal(
        JSON.stringify({
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
          'chanvariable(sip/with_tse_lim2_0000a194)': {
            'cdr(linkedid)': '1469111531.131272',
            'cdr(dst)': '5899',
          },
          'chanvariable(local/5842@from_queue_0000af99;1)': {
            'cdr(linkedid)': '1469111531.131272',
            'cdr(dst)': '5842',
          },
          incomingData: [
            'Event: Bridge',
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
            'ChanVariable(Local/5842@from-queue-0000af99;1): CDR(dst)=5842',
          ],
        })
      );
    });
  });

  describe('.parse()', () => {
    it('has correct field .incomingData with split strings', done => {
      const message = Message.parse(`My: message${EOL}Second: value`);

      expect(message.incomingData).to.deep.equal([
        'My: message',
        'Second: value',
      ]);
      done();
    });

    it('set field correct', done => {
      const message = Message.parse(`My: message${EOL}Second: value`);

      expect(message.my).to.be.equal('message');
      done();
    });

    it('set variables correct', done => {
      const message = Message.parse(
        `Variable: My${EOL}Value: message${EOL}Variable: SecOnD${EOL}Value: const`
      );

      expect(message.variables).to.deep.equal({
        My: 'message',
        SecOnD: 'const',
      });
      done();
    });

    it('parse message with multiple ChanVariableKey correctly', () => {
      const mes = [
        'Event: Bridge',
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
        'ChanVariable(Local/5842@from-queue-0000af99;1): CDR(dst)=5842',
      ].join('\r\n');
      const message = Message.parse(mes);

      expect(JSON.stringify(message)).to.deep.equal(
        JSON.stringify({
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
          'chanvariable(sip/with_tse_lim2_0000a194)': {
            'cdr(linkedid)': '1469111531.131272',
            'cdr(dst)': '5899',
          },
          'chanvariable(local/5842@from_queue_0000af99;1)': {
            'cdr(linkedid)': '1469111531.131272',
            'cdr(dst)': '5842',
          },
          incomingData: [
            'Event: Bridge',
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
            'ChanVariable(Local/5842@from-queue-0000af99;1): CDR(dst)=5842',
          ],
        })
      );
    });
  });
});
