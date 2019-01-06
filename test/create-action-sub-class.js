const createActionSubClass = require('../lib/create-action-sub-class');
const { expect } = require('chai');

describe('create-action-sub-class', () => {
  it('throws if any optional parameter have default value', () => {
    class Parent {}

    expect(() =>
      createActionSubClass(
        {
          name: 'test',
          defaults: { arg1: '' },
          optional: ['arg1'],
          params: ['arg1'],
        },
        Parent
      )
    ).to.throw(Error, `Unexpected default value for field arg1.`);
  });

  it('throws if any optional parameter missed in all parameters list', () => {
    class Parent {}

    expect(() =>
      createActionSubClass(
        {
          name: 'test',
          defaults: {},
          optional: ['arg1'],
          params: [],
        },
        Parent
      )
    ).to.throw(Error, `Did not found optional field arg1 in params.`);
  });

  it('does not throw if descriptor is valid', () => {
    class Parent {}

    expect(() =>
      createActionSubClass(
        {
          name: 'test',
          defaults: {},
          optional: ['arg1'],
          params: ['arg1'],
        },
        Parent
      )
    ).not.to.throw(Error);
  });

  it("returns a subclass with proper #name 's value", () => {
    class MyClass {}

    const SubClass = createActionSubClass({ name: 'test' }, MyClass);

    const instance = new SubClass();

    expect(instance).to.be.instanceOf(SubClass);
    expect(instance).to.be.instanceOf(MyClass);
    expect(SubClass.name).to.be.equal('test');
  });

  describe('returned subclass', () => {
    function sharedTests(getInstance) {
      it('calls super with #name', () => {
        let called = false;
        let args = null;

        class Super {
          constructor(...rest) {
            called = true;
            args = rest;
          }
        }

        const SubClass = createActionSubClass({ name: 'test' }, Super);

        getInstance(SubClass);

        expect(called).to.be.equal(true);
        expect(args).to.be.deep.equal(['test']);
      });

      it('throws if undefined is passed as 1st arg', () => {
        class Super {}

        const SubClass = createActionSubClass({ name: 'test' }, Super);

        expect(() => getInstance(SubClass, undefined)).to.throw(
          Error,
          "Can't work with passed undefined as the 1st arg"
        );
      });

      it('works fine if 1 arg is { param1: null } (set it into 1st parameter)', () => {
        class Super {}

        const SubClass = createActionSubClass(
          { name: 'test', params: ['param1', 'param2'] },
          Super
        );

        const instance = getInstance(SubClass, { param1: null });

        expect(instance).to.have.own.property('param1', null);
      });

      it('works fine if 1 arg is { param1: some string } (set it into 1st parameter)', () => {
        class Super {}

        const SubClass = createActionSubClass(
          { name: 'test', params: ['param1', 'param2'] },
          Super
        );

        const instance = getInstance(SubClass, { param1: 'null' });

        expect(instance).to.have.own.property('param1', 'null');
      });

      it('use defaults if no extra arguments passed', () => {
        class Super {}

        const SubClass = createActionSubClass(
          {
            name: 'test',
            params: ['param1', 'param2'],
            defaults: { param1: 'value1', param2: 'value2' },
          },
          Super
        );

        const instance = getInstance(SubClass);

        expect(instance).to.have.own.property('param1', 'value1');
        expect(instance).to.have.own.property('param2', 'value2');
      });
    }

    describe('in case of `new Class(...args)`', () => {
      sharedTests((Class, ...rest) => new Class(...rest));

      it('works fine if 1 arg is null (set it into 1st parameter)', () => {
        class Super {}

        const SubClass = createActionSubClass(
          { name: 'test', params: ['param1', 'param2'] },
          Super
        );

        const instance = new SubClass(null);

        expect(instance).to.have.own.property('param1', null);
      });

      it('works fine if 1 arg is some string (set it into 1st parameter)', () => {
        class Super {}

        const SubClass = createActionSubClass(
          { name: 'test', params: ['param1', 'param2'] },
          Super
        );

        const instance = new SubClass('null');

        expect(instance).to.have.own.property('param1', 'null');
      });
    });

    describe('in case of `Class.from(...args)`', () => {
      sharedTests((Class, ...rest) => Class.from(...rest));

      it('throws as error if 1 arg is null', () => {
        class Super {}

        const SubClass = createActionSubClass(
          { name: 'test', params: ['param1', 'param2'] },
          Super
        );

        expect(() => SubClass.from(null)).to.throw(
          Error,
          'test.from() can be called only without arguments or with named arguments (pass plain object)'
        );
      });

      it('throws an error if 1 arg is some string', () => {
        class Super {}

        const SubClass = createActionSubClass(
          { name: 'test', params: ['param1', 'param2'] },
          Super
        );

        expect(() => SubClass.from('null')).to.throw(
          Error,
          'test.from() can be called only without arguments or with named arguments (pass plain object)'
        );
      });
    });
  });
});
