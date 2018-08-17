ami-io - node.js/io.js client for Asterisk AMI.
===========================

[![Greenkeeper badge](https://badges.greenkeeper.io/NumminorihSF/ami-io.svg)](https://greenkeeper.io/)

This is a AMI client.  List of available commands is below.

Install with:

    npm install ami-io


## Usage

Simple example:

```js

    var AmiIo = require("ami-io"),
        SilentLogger = new AmiIo.SilentLogger(), //use SilentLogger if you just want remove logs
        amiio = AmiIo.createClient(),
        amiio2 = new AmiIo.Client({ logger: SilentLogger });

    //Both of this are similar

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
        amiio.logger.info('event:', event);
    });
    amiio.connect();
    amiio.on('connected', function(){
        setTimeout(function(){
            amiio.disconnect();
            amiio.on('disconnected', process.exit());
        },30000);
    });

```

Used events you can see below.

### Standalone run

You can use `node index.js user password [host[:port]] [-h host] [-p port]` to test lib and watch events on screen.
Also, if you use `-f filePath` parameter on run - before close node, it will try to write array of events to file.


# API

## Connection Events

`client` will emit some events about the state of the connection to the AMI.

### "connectionRefused"

`client` will emit `connectionRefused` if server refused connection.

### "incorrectServer"

`client` will emit `incorrectServer` if server, you try connect is not an AMI.

### "incorrectLogin"

`client` will emit `incorrectLogin` if login or password aren't valid.

### "connected"

`client` will emit `connect` after connect to AMI and success authorize.

### "disconnected"

`client` will emit `disconnect` when connection close.

## AMI Events

### "event"

`client` will emit `event` when has new event object. All of them should find at
https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Events.

### "responseEvent"

`client` will emit `responseEvent` when some response has event as part of itself.

### "rawEvent"

`client` will emit `rawEvent` when has new event object or a part of response object.
Note that use event and rawEvent at the same time is not a good idea.

### "rawEvent."+eventName

`client` will emit `rawEvent.`+eventName when has new event object or a part of response object.
You can find event names at https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Events



# Methods

## amiio.createClient()

* `amiio.createClient() = amiio.createClient({port:5038, host:'127.0.0.1', login:'admin', password:'admin', encoding: 'ascii'})`

If some of object key are undefined - will use default value.

* `host`: which host amiio should use. Defaults to `127.0.0.1`.
* `port`: which port amiio should use. Defaults to `5038`.
* `login`: Default to `admin`.
* `password`: Default to `admin`.
* `encoding`: which encoding should amiio use to transfer data. Defaults to `ascii`. **Be careful** with changing 
encoding to any other value manually, cause in order to AMI's protocol spec, AMI use ASCII. 


## client.connect([shouldReconnect[, reconnectTimeout]])

When connecting to AMI servers you can use: `client.connect(true)` to create connection with auto-reconnect.
Auto-reconnect works only if auth was success. If you use `client.disconnect()` connection will close and
shouldn't be any reconnect.
If use `client.connect()` reconnect will not work.

Default reconnect timeout is 5000ms.

Also you may want to set timeout of reconnecting. Then use `client.connect(true, timeoutInMs)`.
You don't need to set up timeout for every time you connect (in one client object). After `client.disconnect()`
timeout will not be set to default, so you can use `client.connect(true)` to connect again with similar timeout.


## client.disconnect()

Forcibly close the connection to the AMI server.  Also stop reconnecting.


```js
    var amiio = require("ami-io"),
        client = amiio.createClient();

    client.connect();
    //Some code here
    client.disconnect();
```


## client.unref()

Call `unref()` on the underlying socket connection to the AMI server,
allowing the program to exit once no more commands are pending.

```js
var AmiIo = require("ami-io");
var client = AmiIo.createClient();

/*
    Calling unref() will allow this program to exit immediately after the get command finishes.
    Otherwise the client would hang as long as the client-server connection is alive.
*/
client.unref();
//will close process if only AmiIo is in it.
client.connect();
```

## client.ref()

Call `ref()` will cancel `unref()` effect.

## client.useLogger

Use `client.useLogger(LoggerObject)` if you want to use some another logger.
By default use console and ignore any logging levels.

```js
var AmiIo = require("ami-io");
var client = AmiIo.createClient();
var client.useLogger(logger);
```

logger should has `trace`,`debug`,`info`,`warn`,`error`,`fatal` methods.
Of course you can emulate them if some lib has not it.


# Extras

Some other things you might like to know about.

## client.connected

`true` if client is connected of `false` if it is not.

## client.reconnectionTimeout

Timeout for reconnect. If you didn't want reconnect ever, `client.reconnectionTimeout == undefined`.

## client.shouldReconnect

`true` if will be reconnect, or `false` if will not.

# Send action to AMI

Available actions:

* AGI
* AbsoluteTimeout
* AgentLogoff
* Agents
* AttendedTransfer
* BlindTransfer
* Bridge
* ChangeMonitor
* Command
* ConfbridgeKick
* ConfbridgeList
* ConfbridgeListRooms
* ConfbridgeLock
* ConfbridgeMute
* ConfbridgeUnlock
* ConfbridgeUnmute
* CoreSettings
* CoreShowChannels
* CoreStatus
* CreateConfig
* DahdiDialOffHook
* DahdiDndOff
* DahdiDndOn
* DahdiHangup
* DahdiRestart
* DahdiShowChannels
* DbDel
* DbDeltree
* DbGet
* DbPut
* ExtensionState
* GetConfig
* GetConfigJson
* GetVar
* Hangup
* JabberSend
* ListCategories
* ListCommands
* LocalOptimizeAway
* Login
* Logoff
* MailboxCount
* MailboxStatus
* MeetmeList
* MeetmeMute
* MeetmeUnmute
* ModuleCheck
* ModuleLoad
* ModuleReload
* ModuleUnload
* Monitor
* Originate
* Park
* ParkedCalls
* PauseMonitor
* Ping
* PlayDtmf
* QueueAdd
* QueueLog
* QueuePause
* QueueRemove
* QueueRule
* QueueStatus
* QueueSummary
* QueueUnpause
* Queues
* Redirect
* Reload
* SendText
* SetVar
* ShowDialPlan
* SipPeers
* SipQualifyPeer
* SipShowPeer
* SipShowRegistry
* Status
* StopMonitor
* UnpauseMonitor
* VoicemailUsersList
* SIPpeerstatus
* BridgeList
* BridgeInfo

Description of all commands and variables they need, you can find at
https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Actions
All values, needed in commands, should passed like this:

```js
    var action = new amiio.Action.QueueSummary();
    action.queue = "some queue's name";
    amiioClient.send(action, function(err, data){
        if (err){
            //in current time - may be without error. need test
            //err === null if ami response match(/success/i), else response will pass as error
        }
    });
```

### Custom Action
If there is not action you need inside available list, you may build action manual 
and set all variables and fields by yourself. For example:
```js
var action = new amiio.Action.Action('MuteAudio');
``` 

### Action Variables

If you need send some variables to AMI, use `action.variables` object like this:

```js
    var action = new amiio.Action.SomeAction();
    action.variables.VariableA = 1;
    action.variables.VariableB = 2;
    action.variables.VariableC = 3;
```
Or you can do it like this:
```js
    var action = new amiio.Action.SomeAction();
    action.variables = {
      VariableA: 1,
      VariableB: 2,
      VariableC: 3
    };
```

Be sure, that you don't use the same names for different values.

## Action.Originate

Now, you can send OriginateAction with response like OriginateResponse event.
See https://wiki.asterisk.org/wiki/display/AST/Asterisk+13+ManagerEvent_OriginateResponse for description.

```js
    var action = new amiio.Action.Originate();
    action.Channel = 'sip/123';
    action.Context = 'default';
    action.Exten = '456';
    action.Priority = 1;
    action.Async = true;
    action.WaitEvent = true;
    
    amiioClient.send(action, function(err, data){
        if (err){
            //err will be event like OriginateResponse if (#response !== 'Success')
        }
        else {
            //data is event like OriginateResponse if (#response === 'Success')
        }
    });
```

## SilentLogger

If you want remove logs, you may use `AmiIo.SilentLogger`'s instance as logger.
Just pass it as argument to AmiIo constructor.

## LICENSE - "MIT License"

Copyright (c) 2015 Konstantine Petryaev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
