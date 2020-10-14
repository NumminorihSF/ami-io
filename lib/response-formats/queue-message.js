function formatQueueMessage(message, callback) {
  const res = [];
  const strings = message.raw.split('\r\n');

  let queue = strings[0].match(/^[\w\d_\-.]* /);

  if (queue && queue[0]) queue = queue[0].trim();

  let calls = strings[0].match(/has \d* call/);

  if (calls && calls[0]) calls = parseInt(calls[0].substr(3), 10);

  let strategy = strings[0].match(/in '\w*' strategy/);

  if (strategy && strategy[0])
    strategy = strategy[0].replace(/(^in )|'|( strategy$)/g, '');

  let holdtime = strings[0].match(/\d*s holdtime/);

  if (holdtime && holdtime[0]) holdtime = holdtime[0].replace(/\D*/g, '');

  let talktime = strings[0].match(/\d*s talktime/);

  if (talktime && talktime[0]) talktime = talktime[0].replace(/\D*/g, '');

  let w = strings[0].match(/W:[\d.]*,/);

  if (w && w[0]) w = w[0].replace(/[W:,]/g, '');

  let c = strings[0].match(/C:[\d.]*,/);

  if (c && c[0]) c = c[0].replace(/[C:,]/g, '');

  let a = strings[0].match(/A:[\d.]*,/);

  if (a && a[0]) a = a[0].replace(/[A:,]/g, '');

  let sl = strings[0].match(/SL:.*$/);

  if (sl && sl[0]) sl = sl[0].substr(3);

  const members = [];

  let i = 2;

  for (i = 2; i < strings.length; i++) {
    if (strings[i].match(/Callers/)) break;
    members.push(strings[i].match(/.*? \(.*?\)/)[0].trim());
  }

  const callers = [];

  for (i++; i < strings.length; i++) {
    callers.push(strings[i].trim());
  }

  res.push(
    `Event: Queues\r\nQueue: ${queue}\r\nMembers: ${members.join(';')}\r\n` +
      `Strategy: ${strategy}\r\n` +
      `Calls: ${calls}\r\n` +
      `Callers: ${callers.join(';')}\r\n` +
      `Weight: ${w}\r\n` +
      `CallsAnswered: ${c}\r\n` +
      `HoldTime: ${holdtime}\r\n` +
      `TalkTime: ${talktime}\r\n` +
      `CallsAnswered: ${c}\r\n` +
      `CallsAbandoned: ${a}\r\n` +
      `ServiceLevel: ${sl}\r\n` +
      `Strategy: ${strategy}\r\n` +
      `ActionID: %REPLACE_ACTION_ID%`
  );

  res.push(
    'Response: Success\r\nActionID: %REPLACE_ACTION_ID%' +
      '\r\nMessage: Queues will follow'
  );
  res.push('Event: QueuesComplete\r\nActionID: %REPLACE_ACTION_ID%');

  return callback(null, { type: 'queues', res });
}

module.exports = formatQueueMessage;
