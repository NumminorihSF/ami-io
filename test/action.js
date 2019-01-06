const Message = require('../lib/message.js');
const Action = require('../lib/action.js');
const expect = require('chai').expect;

describe('AmiIo.Action', () => {
  describe('#Action', () => {
    describe('#constructor()', () => {
      it('creates instance of Action', () => {
        expect(new Action.Action('')).to.be.instanceOf(Action.Action);
      });

      it('has Message as prototype', () => {
        expect(new Action.Action('')).to.be.instanceOf(Message);
      });

      it('sets up numeric id of action', () => {
        expect(new Action.Action('').id).to.be.a('number');
      });

      it('sets up ActionID field to id of action', () => {
        const action = new Action.Action('');

        expect(action.id).to.be.equal(action.ActionID);
      });

      it('sets up Action (name) field to name of action', () => {
        const action = new Action.Action('dvskljkljaer');

        expect(action.Action).to.be.equal('dvskljkljaer');
      });
    });

    describe('#getId()', () => {
      it('returns incremental id', () => {
        const previousId = Action.Action.prototype.getId();
        const currentId = Action.Action.prototype.getId();

        expect(currentId).to.be.equal(previousId + 1);
      });
    });
  });

  for (const actionName in Action) {
    if (actionName === 'Action' || actionName === 'createAction') {
      continue;
    }

    describe(`#${actionName}()`, () => {
      it('do not throw Error', () => {
        expect(() => {
          new Action[actionName]();
        }).to.not.throw(Error);
      });

      it('has Action.Action as prototype', () => {
        expect(new Action[actionName]()).to.be.instanceOf(Action.Action);
      });

      it(`create instance of ${actionName}`, () => {
        expect(new Action[actionName]()).to.be.instanceOf(Action[actionName]);
      });

      const getVals = function(object) {
        return Object.keys(object).reduce((res, val) => {
          res.push(object[val]);

          return res;
        }, []);
      };

      if (Action[actionName].length > 0) {
        it('use 1st arg at state', () => {
          expect(getVals(new Action[actionName]('first argument'))).to.include(
            'first argument'
          );
        });

        if (Action[actionName].length > 1) {
          it('use 2nd arg at state', () => {
            expect(
              getVals(new Action[actionName]('first', 'second argument'))
            ).to.include('second argument');
          });

          if (Action[actionName].length > 2) {
            it('use 3rd arg at state', () => {
              expect(
                getVals(
                  new Action[actionName]('first', 'second', 'third argument')
                )
              ).to.include('third argument');
            });

            if (Action[actionName].length > 3) {
              it('use 4th arg at state', () => {
                expect(
                  getVals(
                    new Action[actionName](
                      'first',
                      'second',
                      'third',
                      'forth state'
                    )
                  )
                ).to.include('forth state');
              });
            }
          }
        }
      }
    });
  }
});
