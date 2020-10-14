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

const actionSpecifications = require('./action-specifications.js');
const createActionSubClass = require('./create-action-sub-class');
const getId = require('./get-id.js');
const Message = require('./message.js');

const emptyObject = Object.freeze({});

class Action extends Message {
  static from(params = emptyObject) {
    return Object.assign(new Action(params.Action), params);
  }

  constructor(name) {
    super();
    this.id = getId();
    this.set('ActionID', this.id);
    this.set('Action', name);
  }
}

actionSpecifications.forEach((actionSpecification) => {
  module.exports[actionSpecification.name] = createActionSubClass(
    actionSpecification,
    Action
  );
});

module.exports.createAction = function createAction(actionSpecification) {
  return createActionSubClass(actionSpecification, Action);
};

module.exports.Action = Action;
