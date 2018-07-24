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

if (module.parent) {
    module.exports = require('./lib');
}
else {
    var lib = require('./lib');
    if (process.env.AMI_HOST || process.env.AMI_PORT || process.env.AMI_LOGIN || process.env.AMI_PASSWORD){
        var config = {
            host: process.env.AMI_HOST ,
            port: process.env.AMI_PORT,
            login: process.env.AMI_LOGIN,
            password: process.env.AMI_PASSWORD,
            encoding: process.env.AMI_ENCODING
        }
    }

    config = config || {};

    var args = process.argv.slice(2);
    var syntax = 'Use: [iojs|node] ami-io user password [host[:port]] [-h host] [-p port]\n' +
      ' -h host - AMI host (default 127.0.0.1)\n' +
      ' -p port - AMI port (default 5038)\n';

    if (args.indexOf('?') !== -1 || args.indexOf('help') !== -1 || args.indexOf('--help') !== -1) {
        console.info(syntax);
        process.exit();
    }

    if (args.indexOf('-f') !== -1){
        var file = args[args.indexOf('-f') + 1];
    }

    if (args.length < 3) {
        console.error(syntax);
        process.exit(1);
    }

    (function(){
        if (args[2].match(/[\w\d\.\-]+:?\d*/)){
            if (args[2].indexOf(':') != -1) {
                var host = args[2].slice(0, args[2].indexOf(':'));
                var port = args[2].slice(args[2].indexOf(':')+1);
            }
            else host = args[2];
        }
        else if (args.indexOf('-h') !== -1) host = args[args.indexOf('-h')+1];
        if (args.indexOf('-p') !== -1) port = args[args.indexOf('-p')+1];
        config.host = config.host || host;
        config.port = config.port || port;
    })();

    config.host = config.host || '127.0.0.1';
    config.port = config.port || 5038;
    config.login = config.login  || args[0] || 'admin';
    config.password = config.password || args[1] || 'password';

    var amiio = new lib.Client(config);
    var count = 0;
    var time = new Date();
    var eventsArray = [];
    if (file) amiio.on('event', function(event){
        eventsArray.push(event);
    });

    amiio.on('incorrectServer', function () {
        amiio.logger.error("Invalid AMI welcome message. Are you sure if this is AMI?");
        process.exit();
    });
    amiio.on('connectionRefused', function(){
        amiio.logger.error("Connection refused.");
        process.exit();
    });
    amiio.on('incorrectLogin', function () {
        amiio.logger.error("Incorrect login or password.");
        process.exit();
    });
    amiio.on('event', function(event){
        count++;
//events that ami sends by itself
    });
    amiio.on('responseEvent', function(event){
//evants that ami sends as part of responses
    });
    amiio.on('rawEvent', function(event){
//every event that ami sends (event + responseEvent)
    });
    amiio.on('connected', function(){
        amiio.send(new lib.Action.Ping(), function(err, data){
            if (err) amiio.logger.error('PING', err);
            amiio.logger.info('PING', data);
        });
        amiio.send(new lib.Action.CoreStatus(), function(err, data){
            if (err) return amiio.logger.error(err);
            return amiio.logger.info(data);
        });
        amiio.send(new lib.Action.CoreSettings(), function(err, data){
            if (err) return amiio.logger.error(err);
            return amiio.logger.info(data);
        });
        amiio.send(new lib.Action.Status(), function(err, data){
            if (err) return amiio.logger.error(err);
            return amiio.logger.info(data);
        });
        amiio.send(new lib.Action.ListCommands(), function(err, data){
            if (err) return amiio.logger.error(err);
            return amiio.logger.info(data);
        });
        amiio.send(new lib.Action.QueueStatus(), function(err, data){
            if (err) return amiio.logger.error(err);
            return amiio.logger.info(data);
        });
        amiio.send(new lib.Action.QueueSummary(), function(err, data){
            if (err) return amiio.logger.error(err);
            return amiio.logger.info(data);
        });
        amiio.send(new lib.Action.GetConfig('sip.conf'), function(err, data){
            if (err) return amiio.logger.error(err);
            return amiio.logger.info(data);
        });
        amiio.send(new lib.Action.GetConfigJson('sip.conf'), function(err, data){
            if (err) return amiio.logger.error(err);
            return amiio.logger.info(data);
        });
    });


    process.on('SIGINT', function () {
        amiio.disconnect();
        if (file) require('fs').writeFileSync(file, JSON.stringify(eventsArray.map(function(v){delete v.incomingData; return v;}), null, '  '), {encoding: 'utf8'});
        process.exit();
    });
    process.on('SIGTERM', function () {
        amiio.disconnect();
        if (file) require('fs').writeFileSync(file, JSON.stringify(eventsArray.map(function(v){delete v.incomingData; return v;}), null, '  '), {encoding: 'utf8'});
        process.exit();
    });
    setInterval(function(){
        console.log('Count of events:', count);
        console.log('Events in second:', count/(new Date() - time));
        console.log('Mem:', Math.floor(process.memoryUsage().rss/(1024*1024)));
        console.log('Heap:', Math.floor(process.memoryUsage().heapUsed*10000/process.memoryUsage().heapTotal)/100+'%',
          '('+Math.floor(process.memoryUsage().heapTotal/(1024*1024))+")");
//        process.emit('SIGINT');
    }, 300000);
    amiio.connect();
}


