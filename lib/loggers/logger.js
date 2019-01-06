/*
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

const LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];

const priority = LEVELS.reduce(
  (accumulator, level, index) => Object.assign(accumulator, { [level]: index }),
  {}
);

class Logger {
  constructor(minimalLogLevel = 'warn') {
    this.minimalLogLevel = minimalLogLevel;
  }

  shouldSkip(level) {
    return priority[level] < priority[this.minimalLogLevel];
  }

  setMinimalLogLevel(minimalLogLevel) {
    this.minimalLogLevel = minimalLogLevel;
  }

  /* eslint-disable no-console */
  fatal(...rest) {
    if (this.shouldSkip('fatal')) return;
    console.error(...rest);
  }

  error(...rest) {
    if (this.shouldSkip('error')) return;
    console.error(...rest);
  }

  warn(...rest) {
    if (this.shouldSkip('warn')) return;
    console.warn(...rest);
  }

  info(...rest) {
    if (this.shouldSkip('info')) return;
    console.info(...rest);
  }

  debug(...rest) {
    if (this.shouldSkip('debug')) return;
    console.log(...rest);
  }

  trace(...rest) {
    if (this.shouldSkip('trace')) return;
    console.log(...rest);
  }
  /* eslint-enable no-console */
}

module.exports = Logger;
