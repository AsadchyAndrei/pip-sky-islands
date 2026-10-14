/* Pip's Sky Islands: server functions (Firebase Cloud Functions, 2nd gen).
   - hourly:          at 5 pm local time: the weekly email on Sundays, reminders (push or email) on any day
   - classChanged:    a teacher sent a new task or a note → a push notification to the families in the class
   - joinCoTeacher:   a teacher joins a colleague's class with an invite code
   - sendTestEmail:   "Send me this week's email now" in Grown-ups → Account
   - unsub:           one-click "turn off these emails" link
   Data the apps never write: mailstate/{uid} (what was sent and when, and the unsubscribe token). */
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https');
const { setGlobalOptions, logger } = require('firebase-functions/v2');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const crypto = require('crypto');
const L = require('./lib');

admin.initializeApp();
const db = admin.firestore();
setGlobalOptions({ region: 'us-central1', maxInstances: 3, memory: '256MiB' });
const RESEND = defineSecret('RESEND_API_KEY');
const FROM = "Pip's Sky Islands <pip@pipskyislands.com>";
const REPLY_TO = 'hello@pipskyislands.com';
const FN_URL = 'https://us-central1-pip-sky-islands.cloudfunctions.net/';

/* ---------- sending (swappable in tests) ---------- */
const send = {
  async mail(to, m, unsubUrl) {
    let raw = '';
    try { raw = RESEND.value() || ''; } catch (e) { raw = ''; }
    const key = (String(raw).match(/re_[A-Za-z0-9_-]{8,}/) || [''])[0];
    if (!key) {
      const why = !raw ? 'empty' : raw.trim() === 'none' ? 'placeholder (no key was pasted in setup)' : `not a Resend key (length ${raw.length})`;
      logger.warn('No Resend API key: email not sent', { why, to: to.replace(/^(.).*@/, '$1***@') });
      return false;
    }
    const headers = unsubUrl ? { 'List-Unsubscribe': `<${unsubUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } : {};
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY_TO, subject: m.subject, html: m.html, text: m.text, headers }),
    });
    if (!r.ok) { logger.error('Resend error', { status: r.status, body: (await r.text()).slice(0, 300) }); return false; }
    return true;
  },
  async push(uid, msg) {
    const snap = await db.collection('users').doc(uid).collection('push').get();
    if (snap.empty) return 0;
    const docs = snap.docs, tokens = docs.map((d) => d.get('t'));
    const res = await admin.messaging().sendEachForMulticast({
      tokens,
      webpush: { headers: { TTL: String(msg.ttl || 86400), Urgency: 'normal' }, data: { title: msg.title, body: msg.body, link: msg.link || L.SITE, tag: msg.tag || 'pip' } },
    });
    let ok = 0;
    await Promise.all(res.responses.map((x, i) => {
      if (x.success) { ok++; return null; }
      const code = (x.error && x.error.code) || '';
      if (/registration-token-not-registered|invalid-registration-token|invalid-argument/.test(code)) return docs[i].ref.delete();
      return null;
    }));
    return ok;
  },
};

/* ---------- who the person is ---------- */
async function emailOf(uid) {
  try {
    const u = await admin.auth().getUser(uid);
    const google = (u.providerData || []).some((p) => p.providerId === 'google.com');
    return u.email && (u.emailVerified || google) ? u.email : '';
  } catch (e) { return ''; }
}
async function stateOf(uid) {
  const ref = db.collection('mailstate').doc(uid), s = await ref.get(), st = s.exists ? s.data() : {};
  if (!st.tok) st.tok = crypto.randomBytes(16).toString('hex');
  return { ref, st };
}
const unsubUrl = (uid, tok) => `${FN_URL}unsub?u=${encodeURIComponent(uid)}&t=${tok}`;
async function kidsOf(uid) {
  const s = await db.collection('users').doc(uid).collection('kids').get();
  return s.docs.filter((d) => !d.get('deleted') && d.get('mail')).map((d) => ({ id: d.id, ...L.parse(d.get('mail')) })).filter((k) => k.v);
}
async function classesOf(uid) {
  const [a, b] = await Promise.all([
    db.collection('classes').where('owner', '==', uid).get(),
    db.collection('classes').where('co', 'array-contains', uid).get(),
  ]);
  const out = [], seen = new Set();
  for (const d of [...a.docs, ...b.docs]) {
    if (seen.has(d.id)) continue; seen.add(d.id);
    const c = d.data(), m = await d.ref.collection('members').get();
    const rows = m.docs.filter((x) => !x.get('removed')).map((x) => ({ mid: x.id, name: x.get('name') || 'Student', sum: L.parse(x.get('sum')) }));
    out.push({ cid: d.id, name: c.name || 'My class', tasks: c.tasks || [], rows: rows.sort((x, y) => x.name.localeCompare(y.name)) });
  }
  return out;
}

/* ---------- the hourly run ---------- */
async function runUser(uid, u, now, opts = {}) {
  const n = u.notify || {}, lp = L.localParts(now, n.tz);
  if (!opts.force && (lp.hour < 16 || lp.hour > 18)) return { skipped: 'hour' };
  const { ref, st } = await stateOf(uid), today = lp.day, done = [];
  const kids = await kidsOf(uid);
  const email = (n.weekly || n.remind || opts.force) ? await emailOf(uid) : '';
  const un = unsubUrl(uid, st.tok);
  // the weekly email: Sunday evening, once
  if ((n.weekly && lp.dow === 0 && st.weekly !== today) || opts.force) {
    const classes = u.role === 'teacher' ? await classesOf(uid) : [];
    const m = L.weeklyEmail(kids, classes, today, un);
    if (m && email && await send.mail(email, m, un)) { done.push('weekly'); if (!opts.force) st.weekly = today; }
    else if (opts.force) return { skipped: !email ? 'no-email' : !m ? 'nothing' : 'not-sent' };
  }
  // reminders: a push to this family's devices, or an email if there is no device (at most one email a week)
  if (n.remind && !opts.force) {
    st.inact = st.inact || {}; st.due = st.due || {};
    const items = kids.flatMap((k) => L.remindersFor(k.id, k, today, st));
    if (items.length) {
      let pushed = 0;
      for (const i of items) pushed += await send.push(uid, { title: i.title, body: i.body, tag: i.kind + ':' + i.key });
      if (pushed) done.push('push');
      else if (email && (!st.remindMail || L.daysBetween(st.remindMail, today) >= 7)) {
        if (await send.mail(email, L.reminderEmail(items, un), un)) { done.push('remind-mail'); st.remindMail = today; }
      }
      for (const i of items) { if (i.kind === 'inact') st.inact[i.key] = today; else st.due[i.key] = today; }
      for (const k of Object.keys(st.due)) if (L.daysBetween(st.due[k], today) > 30) delete st.due[k];
    }
  }
  await ref.set(st);
  return { done };
}
async function runHour(now = new Date()) {
  const snap = await db.collection('users').where('notify.h', '==', now.getUTCHours()).get();
  let n = 0;
  for (const d of snap.docs) {
    try { const r = await runUser(d.id, d.data(), now); if (r.done && r.done.length) n++; }
    catch (e) { logger.error('notify failed', { uid: d.id, err: String(e) }); }
  }
  return { users: snap.size, sent: n };
}
exports.hourly = onSchedule({ schedule: '5 * * * *', timeZone: 'UTC', secrets: [RESEND], timeoutSeconds: 540 }, async () => {
  const r = await runHour(new Date());
  logger.info('hourly', r);
});

/* ---------- a teacher's new task or note → push to the families ---------- */
const realTasks = (c) => ((c && c.tasks) || []).filter((t) => !t.kind);
const noteOf = (c) => ((c && c.tasks) || []).find((t) => t.kind === 'note' && t.text) || null;
async function onClassChange(cid, before, after) {
  const was = new Set(realTasks(before).map((t) => t.id)), fresh = realTasks(after).filter((t) => !was.has(t.id));
  const n0 = noteOf(before), n1 = noteOf(after), note = n1 && (!n0 || n0.ts !== n1.ts || n0.text !== n1.text) ? n1 : null;
  if (!fresh.length && !note) return 0;
  const teachers = new Set([after.owner, ...(after.co || [])]), who = after.teacher || 'your teacher';
  const mem = await db.collection('classes').doc(cid).collection('members').get();
  const list = mem.docs.filter((d) => !d.get('removed') && !teachers.has(d.get('owner'))).map((d) => ({ mid: d.id, owner: d.get('owner'), name: d.get('name') || '' }));
  const per = new Map();
  for (const t of fresh) for (const m of list) {
    if (t.to && t.to.length && !t.to.includes(m.mid)) continue;
    if (!per.has(m.owner)) per.set(m.owner, []);
    per.get(m.owner).push({ title: `New task from ${who}`, body: `${m.name ? m.name + ': ' : ''}${t.nm || 'Open Pip to see it.'}${t.due ? ` (due ${new Date(t.due + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })})` : ''}`, tag: 'task:' + t.id });
  }
  if (note) for (const m of list) {
    if (!per.has(m.owner)) per.set(m.owner, []);
    if (!per.get(m.owner).some((x) => x.tag === 'note')) per.get(m.owner).push({ title: `Message from ${who}`, body: note.text.slice(0, 140), tag: 'note' });
  }
  let sent = 0;
  for (const [uid, msgs] of per) {
    const u = (await db.collection('users').doc(uid).get()).data() || {};
    if ((u.notify || {}).classPush === false) continue;
    const seen = new Set();
    for (const m of msgs.slice(0, 3)) { if (seen.has(m.tag)) continue; seen.add(m.tag); sent += await send.push(uid, m); }
  }
  return sent;
}
exports.classChanged = onDocumentUpdated('classes/{cid}', async (e) => {
  if (!e.data) return;
  try { await onClassChange(e.params.cid, e.data.before.data() || {}, e.data.after.data() || {}); }
  catch (err) { logger.error('class push failed', { cid: e.params.cid, err: String(err) }); }
});

/* ---------- co-teachers ---------- */
async function joinCo(uid, code) {
  code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length < 6 || code.length > 10) throw new HttpsError('invalid-argument', 'bad-code');
  const inv = await db.collection('tinv').doc(code).get();
  if (!inv.exists || (inv.get('exp') || 0) < Date.now()) throw new HttpsError('not-found', 'no-invite');
  const cid = inv.get('cid'), ref = db.collection('classes').doc(cid);
  const u = (await db.collection('users').doc(uid).get()).data() || {};
  let name = u.teacherName || '';
  if (!name) { try { const a = await admin.auth().getUser(uid); name = a.displayName || (a.email || '').split('@')[0]; } catch (e) { name = 'Co-teacher'; } }
  return db.runTransaction(async (tx) => {
    const s = await tx.get(ref);
    if (!s.exists) throw new HttpsError('not-found', 'no-class');
    const c = s.data(), co = c.co || [];
    if (c.owner === uid) throw new HttpsError('failed-precondition', 'own-class');
    if (!co.includes(uid) && co.length >= 6) throw new HttpsError('resource-exhausted', 'full');
    tx.update(ref, { co: admin.firestore.FieldValue.arrayUnion(uid), [`coNames.${uid}`]: String(name).slice(0, 40) });
    return { cid, name: c.name || '' };
  });
}
exports.joinCoTeacher = onCall({ maxInstances: 2 }, async (req) => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'sign-in');
  return joinCo(req.auth.uid, (req.data || {}).code);
});

/* ---------- "send me this week's email now" ---------- */
exports.sendTestEmail = onCall({ secrets: [RESEND], maxInstances: 2 }, async (req) => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'sign-in');
  const uid = req.auth.uid, { ref, st } = await stateOf(uid);
  if (st.test && Date.now() - st.test < 5 * 60e3) throw new HttpsError('resource-exhausted', 'wait');
  st.test = Date.now(); await ref.set(st);
  const u = (await db.collection('users').doc(uid).get()).data() || {};
  const r = await runUser(uid, u, new Date(), { force: true });
  if (r.skipped) throw new HttpsError('failed-precondition', r.skipped);
  return { ok: true };
});

/* ---------- one-click unsubscribe (works without signing in) ---------- */
const unsubPage = (t, b) => `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pip's Sky Islands emails</title><body style="font-family:Arial,sans-serif;max-width:520px;margin:40px auto;padding:0 16px;color:#1f3557"><h1 style="font-size:22px">${t}</h1>${b}</body>`;
exports.unsub = onRequest({ maxInstances: 2 }, async (req, res) => {
  const uid = String(req.query.u || ''), tok = String(req.query.t || '');
  const s = uid ? await db.collection('mailstate').doc(uid).get() : null;
  if (!s || !s.exists || !tok || s.get('tok') !== tok) { res.status(400).send(unsubPage('This link does not work', '<p>You can turn emails off in Grown-ups → Account on pipskyislands.com.</p>')); return; }
  if (req.method === 'POST') {
    await db.collection('users').doc(uid).set({ notify: { weekly: false, remind: false } }, { merge: true });
    res.send(unsubPage('Emails are off', '<p>You will not get weekly emails or reminders any more. You can turn them on again in Grown-ups → Account.</p>'));
    return;
  }
  res.send(unsubPage('Turn off emails from Pip?', `<p>Weekly emails and reminders will stop.</p><form method="post"><button style="font-size:16px;padding:10px 18px;border-radius:999px;border:0;background:#2f9fe0;color:#fff">Turn off emails</button></form>`));
});

exports._test = { runHour, runUser, onClassChange, joinCo, send };
