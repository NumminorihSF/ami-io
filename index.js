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
/* eslint-disable no-console */
const lib = require('./lib');

if (module.parent) {
  module.exports = lib;
} else {
  const config = {
    host: process.env.AMI_HOST,
    port: process.env.AMI_PORT,
    login: process.env.AMI_LOGIN,
    password: process.env.AMI_PASSWORD,
    encoding: process.env.AMI_ENCODING,
  };
  let file = null;

  const args = process.argv.slice(2);
  const syntax =
    'Use: [iojs|node] ami-io user password [host[:port]] [-h host] [-p port]\n' +
    ' -h host - AMI host (default 127.0.0.1)\n' +
    ' -p port - AMI port (default 5038)\n';

  if (
    args.indexOf('?') !== -1 ||
    args.indexOf('help') !== -1 ||
    args.indexOf('--help') !== -1
  ) {
    console.info(syntax);
    process.exit();
  }

  if (args.indeincludes('-f')) {
    file = args[args.indexOf('-f') + 1];
  }

  if (args.length < 3) {
    console.error(syntax);
    process.exit(1);
  }

  (function () {
    if (args[2].match(/[\w\d.-]+:?\d*/)) {
      if (args[2].indexOf(':') !== -1) {
        config.host = config.host || args[2].slice(0, args[2].indexOf(':'));
        config.port = config.port || args[2].slice(args[2].indexOf(':') + 1);
      } else config.host = config.host || args[2];
    } else if (args.indexOf('-h') !== -1)
      config.host = config.host || args[args.indexOf('-h') + 1];
    if (args.indexOf('-p') !== -1)
      config.port = config.port || args[args.indexOf('-p') + 1];
  })();

  config.host = config.host || '127.0.0.1';
  config.port = config.port || 5038;
  config.login = config.login || args[0] || 'admin';
  config.password = config.password || args[1] || 'password';

  const amiio = new lib.Client(config);
  let count = 0;
  const time = Date.now();
  const eventsArray = [];

  if (file)
    amiio.on('event', (event) => {
      eventsArray.push(event);
    });

  amiio.on('incorrectServer', () => {
    amiio.logger.error(
      'Invalid AMI welcome message. Are you sure if this is AMI?'
    );
    process.exit();
  });
  amiio.on('connectionRefused', () => {
    amiio.logger.error('Connection refused.');
    process.exit();
  });
  amiio.on('incorrectLogin', () => {
    amiio.logger.error('Incorrect login or password.');
    process.exit();
  });
  // eslint-disable-next-line no-unused-vars
  amiio.on('event', (event) => {
    count++;
    // events that ami sends by itself
  });
  // eslint-disable-next-line no-unused-vars
  amiio.on('responseEvent', (event) => {
    // events that ami sends as part of responses
  });
  // eslint-disable-next-line no-unused-vars
  amiio.on('rawEvent', (event) => {
    // every event that ami sends (event + responseEvent)
  });
  amiio.on('connected', () => {
    amiio.send(new lib.Action.Ping(), (err, data) => {
      if (err) return amiio.logger.error('PING', err);

      return amiio.logger.info('PING', data);
    });

    amiio.send(new lib.Action.CoreStatus(), (err, data) => {
      if (err) return amiio.logger.error(err);

      return amiio.logger.info(data);
    });

    amiio.send(new lib.Action.CoreSettings(), (err, data) => {
      if (err) return amiio.logger.error(err);

      return amiio.logger.info(data);
    });

    amiio.send(new lib.Action.Status(), (err, data) => {
      if (err) return amiio.logger.error(err);

      return amiio.logger.info(data);
    });

    amiio.send(new lib.Action.ListCommands(), (err, data) => {
      if (err) return amiio.logger.error(err);

      return amiio.logger.info(data);
    });

    amiio.send(new lib.Action.QueueStatus(), (err, data) => {
      if (err) return amiio.logger.error(err);

      return amiio.logger.info(data);
    });

    amiio.send(new lib.Action.QueueSummary(), (err, data) => {
      if (err) return amiio.logger.error(err);

      return amiio.logger.info(data);
    });

    amiio.send(new lib.Action.GetConfig('sip.conf'), (err, data) => {
      if (err) return amiio.logger.error(err);

      return amiio.logger.info(data);
    });

    amiio.send(new lib.Action.GetConfigJson('sip.conf'), (err, data) => {
      if (err) return amiio.logger.error(err);

      return amiio.logger.info(data);
    });
  });

  process.on('SIGINT', () => {
    amiio.disconnect();
    if (file)
      // eslint-disable-next-line global-require
      require('fs').writeFileSync(
        file,
        JSON.stringify(
          eventsArray.map((v) => {
            delete v.incomingData;

            return v;
          }),
          null,
          '  '
        ),
        { encoding: 'utf8' }
      );
    process.exit();
  });

  process.on('SIGTERM', () => {
    amiio.disconnect();
    if (file)
      // eslint-disable-next-line global-require
      require('fs').writeFileSync(
        file,
        JSON.stringify(
          eventsArray.map((v) => {
            delete v.incomingData;

            return v;
          }),
          null,
          '  '
        ),
        { encoding: 'utf8' }
      );
    process.exit();
  });

  setInterval(() => {
    console.log(`Count of events: ${count}`);
    console.log(`Events in second: ${count / (Date.now() - time)}`);
    console.log(
      `Mem: ${Math.floor(process.memoryUsage().rss / (1024 * 1024))}`
    );
    console.log(
      `Heap: ${
        Math.floor(
          (process.memoryUsage().heapUsed * 10000) /
            process.memoryUsage().heapTotal
        ) / 100
      }% (${Math.floor(process.memoryUsage().heapTotal / (1024 * 1024))})`
    );
  }, 300000);

  amiio.connect();
}

/* eslint-enable no-console */
