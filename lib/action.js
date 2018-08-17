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

function Action(name) {
    Action.super_.bind(this)();
    this.id = this.getId();
    this.set('ActionID', this.id);
    this.set('Action', name);
}

(function(){
    var Message = require('./message.js');
    var util = require('util');
    util.inherits(Action, Message);
})();

Action.prototype.getId = (function() {
    var id = 0;
    return function() {
        return ++id;
    }
})();

function Login(username, secret) {
    Login.super_.bind(this, 'Login')();
    this.set('Username', username);
    this.set('Secret', secret );
}


function CoreShowChannels() {
    CoreShowChannels.super_.bind(this, 'CoreShowChannels')();
}


function Ping() {
    Ping.super_.bind(this, 'Ping')();
}


function Hangup() {
    Hangup.super_.bind(this, 'Hangup')();
}

function CoreStatus() {
    CoreStatus.super_.bind(this, 'CoreStatus')();
}

function Status() {
    Status.super_.bind(this, 'Status')();
}

function DahdiShowChannels() {
    DahdiShowChannels.super_.bind(this, 'DahdiShowChannels')();
}


function CoreSettings() {
    CoreSettings.super_.bind(this, 'CoreSettings')();
}

function ListCommands() {
    ListCommands.super_.bind(this, 'ListCommands')();
}

function Logoff() {
    Logoff.super_.bind(this, 'Logoff')();
}

function AbsoluteTimeout() {
    AbsoluteTimeout.super_.bind(this, 'AbsoluteTimeout')();
}

function SipShowPeer() {
    SipShowPeer.super_.bind(this, 'SIPshowpeer')();
}

function SipShowRegistry() {
    SipShowRegistry.super_.bind(this, 'SIPshowregistry')();
}

function SipQualifyPeer() {
    SipQualifyPeer.super_.bind(this, 'SIPqualifypeer')();
}

function SipPeers() {
    SipPeers.super_.bind(this, 'SIPpeers')();
}

function AgentLogoff() {
    AgentLogoff.super_.bind(this, 'AgentLogoff')();
}

function Agents() {
    Agents.super_.bind(this, 'Agents')();
}

function AttendedTransfer() {
    AttendedTransfer.super_.bind(this, 'Atxfer')();
}

function ChangeMonitor() {
    ChangeMonitor.super_.bind(this, 'ChangeMonitor')();
}

function Command() {
    Command.super_.bind(this, 'Command')();
}

function CreateConfig() {
    CreateConfig.super_.bind(this, 'CreateConfig')();
}

function DahdiDialOffHook() {
    DahdiDialOffHook.super_.bind(this, 'DahdiDialOffHook')();
}

function DahdiDndOff() {
    DahdiDndOff.super_.bind(this, 'DahdiDndOff')();
}

function DahdiDndOn() {
    DahdiDndOn.super_.bind(this, 'DahdiDndOn')();
}

function DahdiHangup() {
    DahdiHangup.super_.bind(this, 'DahdiHangup')();
}

function DahdiRestart() {
    DahdiRestart.super_.bind(this, 'DahdiRestart')();
}

function DbDel() {
    DbDel.super_.bind(this, 'DbDel')();
}

function DbDeltree() {
    DbDeltree.super_.bind(this, 'DbDeltree')();
}

function DbGet() {
    DbGet.super_.bind(this, 'DbGet')();
}

function DbPut() {
    DbPut.super_.bind(this, 'DbPut')();
}

function ExtensionState() {
    ExtensionState.super_.bind(this, 'ExtensionState')();
}

function GetConfig(fileName) {
    GetConfig.super_.bind(this, 'GetConfig')();
    this.Filename = fileName;
}

function GetConfigJson(fileName) {
    GetConfigJson.super_.bind(this, 'GetConfigJson')();
    this.Filename = fileName;
}

function GetVar() {
    GetVar.super_.bind(this, 'GetVar')();
}

function JabberSend() {
    JabberSend.super_.bind(this, 'JabberSend')();
}

function ListCategories() {
    ListCategories.super_.bind(this, 'ListCategories')();
}

function PauseMonitor() {
    PauseMonitor.super_.bind(this, 'PauseMonitor')();
}

function UnpauseMonitor() {
    UnpauseMonitor.super_.bind(this, 'UnpauseMonitor')();
}

function StopMonitor() {
    StopMonitor.super_.bind(this, 'StopMonitor')();
}

function LocalOptimizeAway() {
    LocalOptimizeAway.super_.bind(this, 'LocalOptimizeAway')();
}

function SetVar() {
    SetVar.super_.bind(this, 'SetVar')();
}

function Reload() {
    Reload.super_.bind(this, 'Reload')();
}

function PlayDtmf() {
    PlayDtmf.super_.bind(this, 'PlayDtmf')();
}

function Park() {
    Park.super_.bind(this, 'Park')();
}

function ParkedCalls() {
    ParkedCalls.super_.bind(this, 'ParkedCalls')();
}

function Monitor() {
    Monitor.super_.bind(this, 'Monitor')();
    this.Format = 'wav';
    this.Mix = 'true';
}

function ModuleCheck() {
    ModuleCheck.super_.bind(this, 'ModuleCheck')();
}

function ModuleLoad() {
    ModuleLoad.super_.bind(this, 'ModuleLoad')();
    this.LoadType = 'Load';
}

function ModuleUnload() {
    ModuleUnload.super_.bind(this, 'ModuleUnload')();
    this.LoadType = 'Unload';
}

function ModuleReload() {
    ModuleReload.super_.bind(this, 'ModuleReload')();
    this.LoadType = 'Reload';
}

function MailboxCount() {
    MailboxCount.super_.bind(this, 'MailboxCount')();
}

function MailboxStatus() {
    MailboxStatus.super_.bind(this, 'MailboxStatus')();
}

function VoicemailUsersList() {
    VoicemailUsersList.super_.bind(this, 'VoicemailUsersList')();
}

function Redirect() {
    Redirect.super_.bind(this, 'Redirect')();
}

function Bridge() {
    Bridge.super_.bind(this, 'Bridge')();
}

function ShowDialPlan() {
    ShowDialPlan.super_.bind(this, 'ShowDialPlan')();
}

function SendText() {
    SendText.super_.bind(this, 'SendText')();
}

function Queues() {
    Queues.super_.bind(this, 'Queues')();
}

function QueueUnpause(asteriskInterface, queue, reason) {
    QueueUnpause.super_.bind(this, 'QueuePause')();
    this.set('Paused', 'false');
    this.set('Interface', asteriskInterface);

    if (undefined !== queue) {
        this.set('Queue', queue);
    }

    if (undefined !== reason) {
        this.set('Reason', reason);
    }
}

function QueuePause(asteriskInterface, queue, reason) {
    QueuePause.super_.bind(this, 'QueuePause')();
    this.set('Paused', 'true');
    this.set('Interface', asteriskInterface);

    if (undefined !== queue) {
        this.set('Queue', queue);
    }

    if (undefined !== reason) {
        this.set('Reason', reason);
    }
}

function QueueSummary() {
    QueueSummary.super_.bind(this, 'QueueSummary')();
}

function QueueRule() {
    QueueRule.super_.bind(this, 'QueueRule')();
}

function QueueStatus() {
    QueueStatus.super_.bind(this, 'QueueStatus')();
}

function QueueReset() {
    QueueReset.super_.bind(this, 'QueueReset')();
}

function QueueRemove(asteriskInterface, queue) {
    QueueRemove.super_.bind(this, 'QueueRemove')();
    this.set('Interface', asteriskInterface);
    this.set('Queue', queue);
}

function Originate() {
    Originate.super_.bind(this, 'Originate')();
}

function QueueAdd(asteriskInterface, queue) {
    QueueAdd.super_.bind(this, 'QueueAdd')();
    this.set('Interface', asteriskInterface);
    this.set('Queue', queue);
}

function QueueLog() {
    QueueLog.super_.bind(this, 'QueueLog')();
}

function MeetmeList(conference) {
    MeetmeList.super_.bind(this, 'MeetmeList')();
    if(conference != null) {
        this.set('Conference', conference);
    }
}

function MeetmeMute(meetme, usernum) {
    MeetmeMute.super_.bind(this, 'MeetmeMute')();
    this.set('Meetme', meetme);
    this.set('Usernum', usernum);
}

function MeetmeUnmute(meetme, usernum) {
    MeetmeUnmute.super_.bind(this, 'MeetmeUnmute')();
    this.set('Meetme', meetme);
    this.set('Usernum', usernum);
}

function ConfbridgeListRooms() {
    ConfbridgeListRooms.super_.bind(this, 'ConfbridgeListRooms')();
}

function ConfbridgeList(conference) {
    ConfbridgeList.super_.bind(this, 'ConfbridgeList')();
    this.set('Conference', conference);
}

function ConfbridgeKick(conference, channel) {
    ConfbridgeKick.super_.bind(this, 'ConfbridgeKick')();
    this.set('Conference', conference);
    this.set('Channel', channel);
}

function ConfbridgeLock(conference) {
    ConfbridgeLock.super_.bind(this, 'ConfbridgeLock')();
    this.set('Conference', conference);
}

function ConfbridgeUnlock(conference) {
    ConfbridgeUnlock.super_.bind(this, 'ConfbridgeUnlock')();
    this.set('Conference', conference);
}

function ConfbridgeMute(conference, channel) {
    ConfbridgeMute.super_.bind(this, 'ConfbridgeMute')();
    this.set('Conference', conference);
    this.set('Channel', channel);
}

function ConfbridgeUnmute(conference, channel) {
    ConfbridgeUnmute.super_.bind(this, 'ConfbridgeUnmute')();
    this.set('Conference', conference);
    this.set('Channel', channel);
}

function AGI(channel, command, commandId) {
    AGI.super_.bind(this, 'AGI')();
    this.set('Channel', channel);
    this.set('Command', command);
    this.set('CommandID', commandId);
}

function BlindTransfer(channel, context, extension) {
    BlindTransfer.super_.bind(this, 'BlindTransfer')();
    this.set('Channel', channel);
    this.set('Context', context);
    this.set('Exten', extension);
}

function SIPpeerstatus() {
    SIPpeerstatus.super_.bind(this, 'SIPpeerstatus')();
}

function BridgeList() {
    BridgeList.super_.bind(this, 'BridgeList')();
}

function BridgeInfo() {
    BridgeInfo.super_.bind(this, 'BridgeInfo')();
}

(function() {
    var actions = [
        Login,
        Logoff,
        Ping,
        Hangup,
        CoreShowChannels,
        CoreStatus,
        CoreSettings,
        Status,
        DahdiShowChannels,
        ListCommands,
        AbsoluteTimeout,
        SipShowPeer,
        SipShowRegistry,
        SipQualifyPeer,
        SipPeers,
        AgentLogoff,
        Agents,
        AttendedTransfer,
        ChangeMonitor,
        Command,
        CreateConfig,
        DahdiDialOffHook,
        DahdiDndOff,
        DahdiDndOn,
        DahdiHangup,
        DahdiRestart,
        DbDel,
        DbDeltree,
        DbGet,
        DbPut,
        ExtensionState,
        GetConfig,
        GetConfigJson,
        GetVar,
        SetVar,
        JabberSend,
        ListCategories,
        PauseMonitor,
        LocalOptimizeAway,
        Reload,
        PlayDtmf,
        Park,
        ParkedCalls,
        Monitor,
        ModuleCheck,
        ModuleLoad,
        ModuleUnload,
        ModuleReload,
        MailboxCount,
        MailboxStatus,
        VoicemailUsersList,
        Originate,
        Redirect,
        Bridge,
        UnpauseMonitor,
        StopMonitor,
        ShowDialPlan,
        SendText,
        Queues,
        QueueUnpause,
        QueuePause,
        QueueSummary,
        QueueStatus,
        QueueRemove,
        QueueRule,
        QueueAdd,
        QueueLog,
        MeetmeList,
        MeetmeMute,
        MeetmeUnmute,
        ConfbridgeListRooms,
        ConfbridgeList,
        ConfbridgeKick,
        ConfbridgeLock,
        ConfbridgeUnlock,
        ConfbridgeMute,
        ConfbridgeUnmute,
        AGI,
        QueueReset,
        BlindTransfer,
        SIPpeerstatus,
        BridgeList,
        BridgeInfo
    ];
    var util = require('util');
    for (var i = 0; i < actions.length; i++) {
        util.inherits(actions[i], Action);
        exports[actions[i].name] = actions[i];
    }
    exports.Action = Action;
})();


