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

const { EOL } = require('./constants.js');

const FIELDS_TO_SKIP_WHILE_FORMAT = ['variables', 'inputData'];

class Message {
  static parse(rawData) {
    const message = new Message();

    message.parse(rawData);

    return message;
  }

  constructor() {
    this.variables = {};
  }

  format() {
    return `${this.formatFields()}${this.formatVariables()}${EOL}`;
  }

  formatFields() {
    return Object.keys(this)
      .filter(key => !FIELDS_TO_SKIP_WHILE_FORMAT.includes(key))
      .filter(
        key =>
          typeof this[key] !== 'function' && typeof this[key] !== 'undefined'
      )
      .reduce(
        (accumulator, key) => `${accumulator}${key}: ${this[key]}${EOL}`,
        ''
      );
  }

  formatVariables() {
    return Object.keys(this.variables).reduce(
      (accumulator, key) =>
        `${accumulator}Variable: ${key}=${this.variables[key]}${EOL}`,
      ''
    );
  }

  parse(rawData) {
    const data = rawData.split(EOL);

    let lastVariable = '';

    for (let i = 0; i < data.length; i++) {
      const value = data[i].split(':');
      const keyName = value
        .shift()
        .toLowerCase()
        .replace(/-/g, '_');
      const keyValue = value.join(':').replace(/(^\s+)|(\s+$)/g, '');
      let subKey;
      let subVal;

      if (keyName === 'variable') {
        lastVariable = keyValue;
      } else if (keyName === 'value') {
        this.variables[lastVariable] = keyValue;
        lastVariable = '';
      } else if (/^chanvariable/.test(keyName)) {
        this[keyName] = this[keyName] || {};
        subVal = keyValue.split('=');
        subKey = subVal.shift().toLowerCase();
        this[keyName][subKey] = subVal.join('=');
        continue; // eslint-disable-line no-continue
      }
      this.set(keyName, keyValue);
    }

    this.incomingData = data;
  }

  set(name, value) {
    if (name === 'variables') {
      throw new Error(
        'Can\'t set field with name = "variables". Use Message#setVariable(name, value).'
      );
    }
    this[name] = value;
  }

  setVariable(name, value) {
    this.variables[name] = value;
  }
}

module.exports = Message;
