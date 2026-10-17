/* Firestore rules and server functions, against the Firebase emulators (run by tests/server/run.sh in CI). */
process.env.GCLOUD_PROJECT = process.env.GCLOUD_PROJECT || 'pip-sky-islands';
const fs = require('fs');
const path = require('path');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const F = require('../../functions/index.js');
const admin = require('../../functions/node_modules/firebase-admin');
const T = F._test;

let bad = 0, n = 0;
const gh = !!process.env.GITHUB_ACTIONS;
const ok = (c, m) => { n++; if (!c) { bad++; console.log((gh ? '::error::' : '  - ') + m); } };
const check = async (p, m) => { try { await p; ok(true, m); } catch (e) { ok(false, m + ': ' + (e && e.message)); } };

(async () => {
  const env = await initializeTestEnvironment({ projectId: process.env.GCLOUD_PROJECT, firestore: { rules: fs.readFileSync(path.join(__dirname, '../../firestore.rules'), 'utf8') } });
  const db = admin.firestore();
  const as = (uid) => env.authenticatedContext(uid).firestore();
  const seed = async (p, d) => env.withSecurityRulesDisabled((c) => c.firestore().doc(p).set(d));
  const cls = { owner: 'T1', name: 'Room 12', teacher: 'Ms. Lee', pack: 'ca-4', code: 'ABC234', ts: 1, now: [], tasks: [], v: 1 };

  /* ---------- rules ---------- */
  await check(assertSucceeds(as('T1').doc('classes/C1').set(cls)), 'owner makes a class');
  await check(assertFails(as('T1').doc('classes/C2').set({ ...cls, co: ['X'] })), 'a new class cannot start with co-teachers');
  await check(assertFails(as('T1').doc('classes/C1').update({ co: ['X'] })), 'the owner cannot add a co-teacher directly');
  await seed('classes/C1', { ...cls, co: ['T2', 'T3'], coNames: { T2: 'Mr. Kim', T3: 'Ms. Ito' } });
  await seed('classes/C1/members/P1_k1', { owner: 'P1', kid: 'k1', name: 'Maya', pack: 'ca-4', code: 'ABC234', ts: 1, sum: '{}' });
  await check(assertSucceeds(as('T2').doc('classes/C1').update({ tasks: [{ id: 't1', isl: ['frac'] }], ts: 2 })), 'a co-teacher sends a task');
  await check(assertFails(as('T2').doc('classes/C1').update({ name: 'Mine now' })), 'a co-teacher cannot rename the class');
  await check(assertFails(as('T2').doc('classes/C1').update({ code: 'ZZZ999' })), 'a co-teacher cannot change the code');
  await check(assertFails(as('T2').doc('classes/C1').update({ co: ['T2'], coNames: { T2: 'Mr. Kim' } })), 'a co-teacher cannot remove another co-teacher');
  await check(assertSucceeds(as('T2').collection('classes/C1/members').get()), 'a co-teacher sees the progress summaries');
  await check(assertSucceeds(as('T2').collection('classes').where('co', 'array-contains', 'T2').get()), "a co-teacher finds the class");
  await check(assertFails(as('P9').collection('classes/C1/members').get()), 'a stranger cannot see summaries');
  await check(assertFails(as('T2').doc('classes/C1').delete()), 'a co-teacher cannot delete the class');
  await check(assertSucceeds(as('T3').doc('classes/C1').update({ co: ['T2'], coNames: { T2: 'Mr. Kim' } })), 'a co-teacher can leave');
  await check(assertSucceeds(as('T1').doc('classes/C1').update({ co: [], coNames: {} })), 'the owner removes co-teachers');
  await check(assertSucceeds(as('P1').doc('users/P1/kids/k1').set({ data: '{}', name: 'Maya', ts: 1, v: 1, mail: '{"v":1}' })), 'a child save may carry the email summary');
  await check(assertFails(as('P1').doc('users/P1/kids/k2').set({ data: '{}', name: 'Leo', ts: 1, v: 1, mail: 'x'.repeat(13000) })), 'the email summary is size-limited');
  await check(assertSucceeds(as('P1').doc('users/P1/kids/k1').update({ mail: '{"v":1,"name":"Maya"}' })), 'the email summary is saved as its own small update');
  await check(assertSucceeds(as('P1').doc('users/P1/push/abc').set({ t: 'token', ts: 1, ua: 'Chrome' })), 'a device token is saved');
  await check(assertFails(as('P2').doc('users/P1/push/abc').get()), "no one else reads a family's device tokens");
  await check(assertFails(as('P1').doc('users/P1/push/abd').set({ t: 'token', evil: 1 })), 'device token documents hold only known fields');
  await seed('classes/C3', { ...cls });
  await check(assertSucceeds(as('T1').doc('tinv/INV234').set({ cid: 'C3', owner: 'T1', exp: Date.now() + 864e5 })), 'the owner makes a co-teacher invite');
  await check(assertFails(as('T2').doc('tinv/INV235').set({ cid: 'C3', owner: 'T2', exp: Date.now() + 864e5 })), "no invites to someone else's class");
  await check(assertFails(as('T2').doc('tinv/INV234').get()), 'invites are not readable by others');
  await check(assertFails(as('P1').doc('mailstate/P1').get()), 'server data is not readable from the app');
  const goal = { kind: 'right', need: 500, reward: 'Pajama day', start: '2026-10-12', end: '2026-10-18', ts: 1 };
  await seed('classes/C6', { ...cls, co: ['T2'] });
  await check(assertSucceeds(as('T1').doc('classes/C6').update({ goal })), 'the teacher starts a class quest');
  await check(assertSucceeds(as('T2').doc('classes/C6').update({ goal: { ...goal, need: 600 }, goalHave: 12 })), 'a co-teacher can change the quest');
  await check(assertFails(as('T1').doc('classes/C6').update({ goal: { ...goal, kind: 'coins' } })), 'a quest has a known kind');
  await check(assertFails(as('T1').doc('classes/C6').update({ goal: { ...goal, need: 5000000 } })), 'a quest has a sensible size');
  await check(assertFails(as('T1').doc('classes/C6').update({ goal: { ...goal, reward: 'x'.repeat(80) } })), 'the reward is short');
  await check(assertFails(as('P1').doc('classes/C6').update({ goalHave: 9999 })), 'a family cannot change the class total');

  /* ---------- co-teacher join (server function) ---------- */
  await db.doc('users/T2').set({ role: 'teacher', teacherName: 'Mr. Kim' });
  await db.doc('tinv/JOIN23').set({ cid: 'C3', owner: 'T1', exp: Date.now() + 864e5 });
  await db.doc('tinv/OLD234').set({ cid: 'C3', owner: 'T1', exp: Date.now() - 1000 });
  const r = await T.joinCo('T2', 'join23');
  const c3 = (await db.doc('classes/C3').get()).data();
  ok(r.cid === 'C3' && c3.co.includes('T2') && c3.coNames.T2 === 'Mr. Kim', 'join as a co-teacher: ' + JSON.stringify(c3.co));
  let err = ''; try { await T.joinCo('T4', 'OLD234'); } catch (e) { err = e.message; }
  ok(err === 'no-invite', 'an expired invite is refused: ' + err);
  err = ''; try { await T.joinCo('T1', 'JOIN23'); } catch (e) { err = e.message; }
  ok(err === 'own-class', 'the owner cannot co-teach their own class: ' + err);

  /* ---------- push when a teacher sends a task or a note ---------- */
  const pushes = [], mails = [];
  T.send.push = async (uid, m) => { pushes.push([uid, m.title, m.body]); return 1; };
  T.send.mail = async (to, m) => { mails.push([to, m.subject, m.html]); return true; };
  await db.doc('classes/C4').set({ ...cls, co: ['T2'] });
  await db.doc('classes/C4/members/P1_k1').set({ owner: 'P1', name: 'Maya' });
  await db.doc('classes/C4/members/P2_k1').set({ owner: 'P2', name: 'Leo' });
  await db.doc('classes/C4/members/P3_k1').set({ owner: 'P3', name: 'Ava', removed: true });
  await db.doc('classes/C4/members/T1_r1').set({ owner: 'T1', name: 'Sam' });
  await T.onClassChange('C4', { ...cls, tasks: [] }, { ...cls, co: ['T2'], tasks: [{ id: 'a', nm: 'Pie Peak', to: [] }, { id: 'b', nm: 'Clock Cove', to: ['P2_k1'] }] });
  ok(pushes.filter((x) => x[0] === 'P1').length === 1 && pushes.filter((x) => x[0] === 'P2').length === 2 && !pushes.some((x) => x[0] === 'P3' || x[0] === 'T1'), 'task pushes go to the right families: ' + JSON.stringify(pushes));
  pushes.length = 0;
  await T.onClassChange('C4', cls, { ...cls, tasks: [{ id: 'note', kind: 'note', text: 'Field trip Friday', ts: 5 }, { id: 'lesson', kind: 'lesson', isl: ['frac'] }] });
  ok(pushes.length === 2 && pushes.every((x) => x[1] === 'Message from Ms. Lee' && x[2] === 'Field trip Friday'), 'a note goes to every family once; a lesson does not: ' + JSON.stringify(pushes));

  pushes.length = 0;
  await db.doc('users/P8').set({ role: 'parent', lang: 'es' });
  await db.doc('classes/C8').set({ ...cls });
  await db.doc('classes/C8/members/P8_k1').set({ owner: 'P8', name: 'Sofía' });
  await T.onClassChange('C8', { ...cls, tasks: [] }, { ...cls, tasks: [{ id: 'z', nm: 'Pie Peak', to: [] }] });
  ok(pushes.length === 1 && pushes[0][1] === 'Nueva tarea de Ms. Lee' && pushes[0][2].startsWith('Sofía: Pie Peak'), 'a family that chose Spanish gets the push in Spanish: ' + JSON.stringify(pushes));

  /* ---------- class quest total (server function) ---------- */
  const today = new Date().toISOString().slice(0, 10), y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  await db.doc('classes/C7').set({ ...cls, goal: { kind: 'right', need: 50, start: y, end: today, ts: 1 } });
  await db.doc('classes/C7/members/P1_k1').set({ owner: 'P1', name: 'Maya', sum: JSON.stringify({ dd: { [today]: [10, 12, 9], '2020-01-01': [5, 5, 5] } }) });
  await db.doc('classes/C7/members/T1_r1').set({ owner: 'T1', name: 'Sam', sum: JSON.stringify({ dd: { [y]: [4, 6, 6] } }) });
  await db.doc('classes/C7/members/P3_k1').set({ owner: 'P3', name: 'Ava', removed: true, sum: JSON.stringify({ dd: { [today]: [9, 9, 9] } }) });
  const qt = await T.updateQuest('C7');
  ok(qt === 15 && (await db.doc('classes/C7').get()).get('goalHave') === 15, 'the class quest counts every child in the quest days: ' + qt);

  /* ---------- weekly email and reminders ---------- */
  await admin.auth().createUser({ uid: 'P5', email: 'parent5@example.com', emailVerified: true });
  await admin.auth().createUser({ uid: 'P6', email: 'parent6@example.com', emailVerified: false });
  const sunday = new Date('2026-10-19T00:10:00Z'); // Sunday 5:10 pm in Los Angeles
  const dd = { '2026-10-18': [12, 20, 15], '2026-10-16': [8, 10, 6] };
  const kid = (name, last, extra = {}) => ({ data: '{}', name, ts: 1, v: 1, mail: JSON.stringify({ v: 1, name, dd, mast: 3, tot: 141, last, ...extra }) });
  await db.doc('users/P5').set({ role: 'parent', notify: { weekly: true, remind: true, tz: 'America/Los_Angeles', h: 0 } });
  await db.doc('users/P5/kids/k1').set(kid('Alisa', '2026-10-18'));
  await db.doc('users/P5/kids/k2').set(kid('Max', '2026-10-14'));
  await db.doc('users/P5/kids/k3').set({ deleted: true, ts: 1 });
  await db.doc('users/P6').set({ role: 'parent', notify: { weekly: true, remind: false, tz: 'America/Los_Angeles', h: 0 } });
  await db.doc('users/P6/kids/k1').set(kid('Zoe', '2026-10-18'));
  await db.doc('users/P7').set({ role: 'parent', notify: { weekly: true, tz: 'America/Los_Angeles', h: 5 } });
  T.send.push = async (uid, m) => { pushes.push([uid, m.title]); return 0; }; // no devices: reminders go by email
  pushes.length = 0;
  const run = await T.runHour(sunday);
  ok(run.users === 2, 'the hourly run picks the people whose 5 pm it is: ' + JSON.stringify(run));
  const weekly = mails.filter((m) => /week on Pip/.test(m[1]));
  ok(weekly.length === 1 && weekly[0][0] === 'parent5@example.com' && weekly[0][2].includes('Alisa') && weekly[0][2].includes('Max'), 'one weekly email with both children: ' + JSON.stringify(mails.map((m) => [m[0], m[1]])));
  ok(!mails.some((m) => m[0] === 'parent6@example.com'), 'no email to an address that is not verified');
  const rem = mails.filter((m) => /misses Pip/.test(m[1]));
  ok(rem.length === 1 && rem[0][1] === 'Max misses Pip!', 'a reminder email about the child who stopped playing: ' + JSON.stringify(rem.map((m) => m[1])));
  const st = (await db.doc('mailstate/P5').get()).data();
  ok(st.weekly === '2026-10-18' && st.inact.k2 === '2026-10-18' && st.tok, 'what was sent is remembered');
  mails.length = 0;
  await T.runHour(sunday);
  ok(mails.length === 0, 'nothing is sent twice: ' + JSON.stringify(mails.map((m) => m[1])));
  await db.doc('users/T1').set({ role: 'teacher', teacherName: 'Ms. Lee', notify: { weekly: true, tz: 'America/Los_Angeles', h: 0 } });
  await admin.auth().createUser({ uid: 'T1', email: 'lee@school.example', emailVerified: true });
  await db.doc('classes/C4/members/P1_k1').set({ owner: 'P1', name: 'Maya', sum: JSON.stringify({ dd, tasks: {} }) });
  mails.length = 0;
  await T.runUser('T1', (await db.doc('users/T1').get()).data(), sunday);
  ok(mails.length === 1 && mails[0][2].includes('Room 12') && mails[0][2].includes('Maya'), 'the teacher gets the class summary: ' + JSON.stringify(mails.map((m) => m[1])));


  /* ---------- Pip's voice ---------- */
  const store = new Map(); let made = [];
  Object.assign(T.voiceIO, { get: async (k) => store.get(k) || null, put: async (k, b) => { store.set(k, b); }, synth: async (t) => { made.push(t); return Buffer.from('mp3:' + t); } });
  const call = async (q, method = 'GET', ip = '1.2.3.4') => { const r = { code: 200, h: {}, body: null, headersSent: false, set(k, v) { this.h[k] = v; return this; }, status(c) { this.code = c; return this; }, send(b) { this.body = b; this.headersSent = true; return this; } };
    await T.ttsHandle({ method, query: q, ip, headers: {} }, r); return r; };
  let r1 = await call({ t: '  A school bus holds 49 students.  ' });
  ok(r1.code === 200 && r1.h['Content-Type'] === 'audio/mpeg' && String(r1.body) === 'mp3:A school bus holds 49 students.' && /max-age/.test(r1.h['Cache-Control']), 'tts: a new sentence is made: ' + r1.code);
  r1 = await call({ t: 'A school bus holds 49 students.' });
  ok(r1.code === 200 && made.length === 1, 'tts: the same sentence comes from the store, not made again');
  ok((await call({ t: 'x'.repeat(T.TTS.maxLen + 1) })).code === 400 && (await call({ t: '<script>' })).code === 400 && (await call({ t: '' })).code === 400 && (await call({ t: 'see https://evil.example' })).code === 400, 'tts: long, empty, markup and links are refused');
  ok((await call({ t: 'Hi' }, 'POST')).code === 405, 'tts: GET only');
  made = []; let lim = 0;
  for (let i = 0; i < T.TTS.perMin + 3; i++) if ((await call({ t: 'Sentence number ' + i + '.' }, 'GET', '9.9.9.9')).code === 429) lim++;
  ok(lim >= 1 && made.length <= T.TTS.perMin, 'tts: too many new sentences a minute from one address are slowed down: ' + lim);
  ok((await call({ t: 'A school bus holds 49 students.' }, 'GET', '9.9.9.9')).code === 200, 'tts: stored sentences still play while slowed down');
  const day = await db.doc('ops/tts-' + new Date().toISOString().slice(0, 10)).get();
  ok(day.exists && day.get('chars') > 0, 'tts: new characters are counted for the daily cap');
  await db.doc('ops/tts-' + new Date().toISOString().slice(0, 10)).set({ chars: T.TTS.perDay });
  ok((await call({ t: 'One more brand new line.' }, 'GET', '5.5.5.5')).code === 429, 'tts: past the daily cap nothing new is made');
  await check(assertFails(as('P1').doc('ops/tts-x').get()), 'the voice counters are not readable by players');

  await env.cleanup();
  console.log((gh ? (bad ? '::error::' : '::notice::') : '') + (bad ? `FAIL server (${n} checks): ${bad} problem(s)` : `OK   server rules and functions (${n} checks)`));
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.log('FAIL server: ' + (e && e.stack || e)); process.exit(1); });
