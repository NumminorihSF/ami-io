/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 (NumminorihSF) Konstantine Petryaev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Checks if there are no default values for optional fields.
 * @param {Object<string, *>} defaults - Default values for existed fields.
 * @param {Array<string>} optional - Names for optional fields.
 * @throws In case of any optional field have default value.
 * @private
 */
function ensureIfNoDefaultsForOptional(defaults, optional) {
  optional.forEach((fieldName) => {
    if (Object.prototype.hasOwnProperty.call(defaults, fieldName)) {
      throw new Error(`Unexpected default value for field ${fieldName}.`);
    }
  });
}

/**
 * Checks if every optional field exists in regular fields list.
 * @param {Array<string>} params - Names for non-optional fields.
 * @param {Array<string>} optional - Names for optional fields.
 * @throws In case of any optional field missed in regular fields list.
 * @private
 */
function ensureIfOptionalExistsInParams(params, optional) {
  optional.forEach((fieldName) => {
    if (params.includes(fieldName)) return;

    throw new Error(`Did not found optional field ${fieldName} in params.`);
  });
}

/**
 * Transforms array of arguments into object with named arguments.
 * @param {Array<*>} args - Arguments passed into action constructor.
 * @param {Array<string>} params - List of params' names.
 * @returns {Object<string, *>} Named arguments.
 * @private
 */
function getArgsObject(args, params) {
  const result = params.reduce((resultLocal, field, i) => {
    if (i < args.length) {
      resultLocal[field] = args[i];
    }

    return resultLocal;
  }, {});

  return result;
}

function applyDefaults(self, defaults) {
  return Object.assign(self, defaults);
}

const emptyObject = {};
const emptyArray = [];

module.exports = function createActionSubClass(
  {
    name,
    params: paramNames = emptyArray,
    optional = emptyArray,
    defaults = emptyObject,
  },
  ParentClass
) {
  ensureIfNoDefaultsForOptional(defaults, optional);
  ensureIfOptionalExistsInParams(paramNames, optional);

  const ResultClass = class extends ParentClass {
    static from(...params) {
      if (params.length === 0) return new ResultClass();
      if (params[0] === undefined) {
        throw new Error("Can't work with passed undefined as the 1st arg");
      }

      if (typeof params[0] === 'object' && params[0] !== null) {
        return new ResultClass(params[0]);
      }

      throw new Error(
        `${name}.from() can be called only without arguments or with named arguments (pass plain object)`
      );
    }

    constructor(...args) {
      super(name);

      if (args.length === 0) {
        // action without passed arguments, will use manual params setup
        return applyDefaults(this, defaults);
      }

      const [params] = args;

      if (typeof params === 'undefined') {
        throw new Error("Can't work with passed undefined as the 1st arg");
      }

      // Backward capability
      if (params === null || typeof params !== 'object') {
        return new ResultClass(getArgsObject(args, paramNames));
      }

      applyDefaults(this, defaults);

      Object.assign(this, params);
    }
  };

  Object.defineProperty(ResultClass, 'name', { value: name });

  return ResultClass;
};
