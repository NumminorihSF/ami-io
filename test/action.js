var Message = require('../lib/message.js');
var Action = require('../lib/action.js');
var expect = require('chai').expect;


describe('AmiIo.Action', function(){

  describe('#Action',function() {

    describe('#constructor()', function () {

      it('creates instance of Action', function (done) {
        expect(new Action.Action('')).to.be.instanceOf(Action.Action);
        done();
      });

      it('has Message as prototype', function (done) {
        expect(new Action.Action('')).to.be.instanceOf(Message);
        done();
      });

      it('sets up numeric id of action', function(done){
        expect(new Action.Action('').id).to.be.a('number');
        done();
      });

      it('sets up ActionID field to id of action', function(done){
        var a = new Action.Action('');
        expect(a.id).to.be.equal(a.ActionID);
        done();
      });

      it('sets up Action (name) field to name of action', function(done){
        var a = new Action.Action('dvskljkljaer');
        expect(a.Action).to.be.equal('dvskljkljaer');
        done();
      });

    });

    describe('#getId()', function () {

      it('return incremental id', function (done) {
        expect(Action.Action.prototype.getId() + 1).to.be.equal(Action.Action.prototype.getId());
        done();
      });

    });

  });

  for(var a in Action){
    if (a === 'Action') {
      continue;
    }
    (function(a) {
      describe('#' + a + '()', function () {

        it('do not throw Error', function(done){
            expect(function(){
              new Action[a]();
            }).to.not.throw(Error);
            done();
        });

        it('has Action.Action as prototype', function(done){
            expect(new Action[a]()).to.be.instanceOf(Action.Action);
            done();
        });

        it('create instance of '+ a, function(done){
          expect(new Action[a]()).to.be.instanceOf(Action[a]);
          done();
        });

        var getVals = function(object){
          return Object.keys(object).reduce(function(res, val){res.push(object[val]); return res}, []);
        };
        if (Action[a].length > 0){
          it('use 1st arg at state', function(done){
            expect(getVals(
              new Action[a]('first argument')
              )
            ).to.include('first argument');
            done();
          });

          if (Action[a].length > 1) {
            it('use 2nd arg at state', function(done){
              expect(getVals(
                new Action[a]('first', 'second argument')
                )
              ).to.include('second argument');
              done();
            });

            if (Action[a].length > 2) {
              it('use 3rd arg at state', function(done){
                expect(getVals(
                  new Action[a]('first', 'second', 'third argument')
                  )
                ).to.include('third argument');
                done();
              });

              if (Action[a].length > 3) {
                it('use 4th arg at state', function(done){
                  expect(getVals(
                      new Action[a]('first', 'second', 'third', 'forth state')
                    )
                  ).to.include('forth state');
                  done();
                });
              }
            }
          }
        }


      });
    })(a);
  }
});

