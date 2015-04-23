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
            password: process.env.AMI_PASSWORD
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
        amiio.logger.info('event!!!', event);
    });
    amiio.on('connected', function(){
        amiio.send(new lib.Action.Ping(), function(err, data){
            if (err) /*return*/ amiio.logger.error('PING', err);
            /*return*/ amiio.logger.info('PING', data);
            process.exit();
        });
        //amiio.send(new lib.Action.CoreStatus(), function(err, data){
        //    if (err) return amiio.logger.error(err);
        //    return amiio.logger.info(data);
        //});
        //amiio.send(new lib.Action.CoreSettings(), function(err, data){
        //    if (err) return amiio.logger.error(err);
        //    return amiio.logger.info(data);
        //});
        //amiio.send(new lib.Action.Status(), function(err, data){
        //    if (err) return amiio.logger.error(err);
        //    return amiio.logger.info(data);
        //});
        //amiio.send(new lib.Action.ListCommands(), function(err, data){
        //    if (err) return amiio.logger.error(err);
        //    return amiio.logger.info(data);
        //});
        //amiio.send(new lib.Action.QueueStatus(), function(err, data){
        //    if (err) return amiio.logger.error(err);
        //    return amiio.logger.info(data);
        //});
        //amiio.send(new lib.Action.GetConfig('sip.conf'), function(err, data){
        //    if (err) return amiio.logger.error(err);
        //    return amiio.logger.info(data);
        //});
        //amiio.send(new lib.Action.GetConfigJson('sip.conf'), function(err, data){
        //    if (err) return amiio.logger.error(err);
        //    return amiio.logger.info(data);
        //});
    });


    process.on('SIGINT', function () {
        amiio.disconnect();
        process.exit();
    });
    process.on('SIGTERM', function () {
        amiio.disconnect();
        process.exit();
    });
    setTimeout(function(){
        process.emit('SIGINT');
    }, 60000);
    amiio.connect();
}




