## 1.2.1
Add `encoding` into config to allow replace default `ascii` encoding with `utf8`.  

### 1.2.0
- Add BridgeInfo, BridgeList, SIPpeerstatus actions. ([@oxygen](https://github.com/oxygen))

### 1.1.2
Update readme to describe work with variables.

## 1.1.0

Add silent logger.


## 1.0.0
* Now channel variables (`ChanVariable*`-like key in event) do not rewrite. 
It make an child object, where all key-value pairs are contained. 
It can brake some application so it is an major release. 
For example:
 
```
Event: Bridge
Privilege: call,all
Timestamp: 1469112499.321389
Bridgestate: Unlink
Bridgetype: core
Channel1: SIP/with-TSE-LIM2-0000a194
Channel2: Local/5842@from-queue-0000af99;1
Uniqueid1: 1469111531.131272
Uniqueid2: 1469111552.131275
CallerID1: 4959810606
CallerID2: 5836
ChanVariable(SIP/with-TSE-LIM2-0000a194): CDR(linkedid)=1469111531.131272
ChanVariable(SIP/with-TSE-LIM2-0000a194): CDR(dst)=5899
ChanVariable(Local/5842@from-queue-0000af99;1): CDR(linkedid)=1469111531.131272
ChanVariable(Local/5842@from-queue-0000af99;1): CDR(dst)=5842


Maps to=>
{
  variables: {},
  event: 'Bridge',
  privilege: 'call,all',
  timestamp: '1469112499.321389',
  bridgestate: 'Unlink',
  bridgetype: 'core',
  channel1: 'SIP/with-TSE-LIM2-0000a194',
  channel2: 'Local/5842@from-queue-0000af99;1',
  uniqueid1: '1469111531.131272',
  uniqueid2: '1469111552.131275',
  callerid1: '4959810606',
  callerid2: '5836',
  'chanvariable(sip/with_tse_lim2_0000a194)': { 
    'cdr(linkedid)': '1469111531.131272', 
    'cdr(dst)': '5899' 
  },
  'chanvariable(local/5842@from_queue_0000af99;1)': { 
    'cdr(linkedid)': '1469111531.131272', 
    'cdr(dst)': '5842' 
  },
  incomingData: [ ... ] 
}


```




## 0.2.9
* Fix crash if socket is closed and lib try send action.
