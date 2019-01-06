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

module.exports = [
  { name: 'Login', params: ['Username', 'Secret'] },
  { name: 'CoreShowChannels', params: [] },
  { name: 'Ping', params: [] },
  { name: 'Hangup', params: [] },
  { name: 'CoreStatus', params: [] },
  { name: 'Status', params: [] },
  { name: 'DahdiShowChannels', params: [] },
  { name: 'CoreSettings', params: [] },
  { name: 'ListCommands', params: [] },
  { name: 'Logoff', params: [] },
  { name: 'AbsoluteTimeout', params: [] },
  { name: 'SipShowPeer', params: [] },
  { name: 'SipShowRegistry', params: [] },
  { name: 'SipQualifyPeer', params: [] },
  { name: 'SipPeers', params: [] },
  { name: 'AgentLogoff', params: [] },
  { name: 'Agents', params: [] },
  { name: 'AttendedTransfer', params: [] },
  { name: 'ChangeMonitor', params: [] },
  { name: 'Command', params: [] },
  { name: 'CreateConfig', params: [] },
  { name: 'DahdiDialOffHook', params: [] },
  { name: 'DahdiDndOff', params: [] },
  { name: 'DahdiDndOn', params: [] },
  { name: 'DahdiHangup', params: [] },
  { name: 'DahdiRestart', params: [] },
  { name: 'DbDel', params: [] },
  { name: 'DbDeltree', params: [] },
  { name: 'DbGet', params: [] },
  { name: 'DbPut', params: [] },
  { name: 'ExtensionState', params: [] },
  { name: 'GetConfig', params: ['Filename'] },
  { name: 'GetConfigJson', params: ['Filename'] },
  { name: 'GetVar', params: [] },
  { name: 'JabberSend', params: [] },
  { name: 'ListCategories', params: [] },
  { name: 'PauseMonitor', params: [] },
  { name: 'UnpauseMonitor', params: [] },
  { name: 'StopMonitor', params: [] },
  { name: 'LocalOptimizeAway', params: [] },
  { name: 'SetVar', params: [] },
  { name: 'Reload', params: [] },
  { name: 'PlayDtmf', params: [] },
  { name: 'Park', params: [] },
  { name: 'ParkedCalls', params: [] },
  {
    name: 'Monitor',
    params: ['format', 'mix'],
    defaults: { format: 'wav', mix: true },
  },
  { name: 'ModuleCheck', params: [] },
  { name: 'ModuleLoad', params: ['LoadType'], defaults: { LoadType: 'Load' } },
  {
    name: 'ModuleUnload',
    params: ['LoadType'],
    defaults: { LoadType: 'Unload' },
  },
  {
    name: 'ModuleReload',
    params: ['LoadType'],
    defaults: { LoadType: 'record' },
  },
  { name: 'MailboxCount', params: [] },
  { name: 'MailboxStatus', params: [] },
  { name: 'VoicemailUsersList', params: [] },
  { name: 'Redirect', params: [] },
  { name: 'Bridge', params: [] },
  { name: 'ShowDialPlan', params: [] },
  { name: 'SendText', params: [] },
  { name: 'Queues', params: [] },
  {
    name: 'QueuePause',
    params: ['Interface', 'Paused', 'Queue', 'Reason'],
    optional: ['Queue', 'Reason'],
    defaults: { Paused: true },
  },
  { name: 'QueueSummary', params: [] },
  { name: 'QueueRule', params: [] },
  { name: 'QueueStatus', params: [] },
  { name: 'QueueReset', params: [] },
  { name: 'QueueRemove', params: ['Interface', 'Queue'] },
  { name: 'Originate', params: [] },
  { name: 'QueueAdd', params: ['Interface', 'Queue'] },
  { name: 'QueueLog', params: [] },
  { name: 'MeetmeList', params: ['Conference'], optional: ['Conference'] },
  { name: 'MeetmeMute', params: ['Meetme', 'Usernum'] },
  { name: 'MeetmeUnmute', params: ['Meetme', 'Usernum'] },
  { name: 'ConfbridgeListRooms', params: [] },
  { name: 'ConfbridgeList', params: ['Conference'] },
  { name: 'ConfbridgeKick', params: ['Conference', 'Channel'] },
  { name: 'ConfbridgeLock', params: ['Conference'] },
  { name: 'ConfbridgeUnlock', params: ['Conference'] },
  { name: 'ConfbridgeMute', params: ['Conference', 'Channel'] },
  { name: 'ConfbridgeUnmute', params: ['Conference', 'Channel'] },
  { name: 'AGI', params: ['Channel', 'Command', 'CommandId'] },
  { name: 'BlindTransfer', params: ['Channel', 'Context', 'Extension'] },
  { name: 'SIPpeerstatus' },
  { name: 'BridgeList' },
  { name: 'BridgeInfo' },
];
