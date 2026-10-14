/* Pip's Sky Islands server: plain helpers with no Firebase inside (dates, weekly numbers, email texts).
   Kept separate so they can be tested with plain Node. */
const SITE = 'https://pipskyislands.com/';
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* the local day, hour and weekday of a moment in a time zone (default: Pacific) */
function localParts(date, tz) {
  let f;
  try { f = new Intl.DateTimeFormat('en-US', { timeZone: tz || 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23', weekday: 'short' }); }
  catch (e) { f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23', weekday: 'short' }); }
  const p = Object.fromEntries(f.formatToParts(date).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, hour: +p.hour % 24, dow: DOW.indexOf(p.weekday) };
}
const addDay = (day, n) => { const d = new Date(day + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00:00Z') - new Date(a + 'T12:00:00Z')) / 864e5);
const pct = (a, b) => (b ? Math.round((a / b) * 100) : null);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const niceDay = (day) => new Date(day + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });

/* minutes, puzzles and right-on-first-try answers in the 7 days ending `today` (off = 7: the week before) */
function weekTotals(dd, today, off = 0) {
  let m = 0, q = 0, c = 0;
  for (let i = 0; i < 7; i++) { const v = dd && dd[addDay(today, -i - off)]; if (v) { m += v[0] || 0; q += v[1] || 0; c += v[2] || 0; } }
  return [Math.round(m), q, c];
}
/* a class member's week: exact when the app sent day-by-day numbers, otherwise from its last summary */
function memberWeek(sum, today) {
  if (!sum) return [0, 0, 0];
  if (sum.dd) return weekTotals(sum.dd, today);
  if (sum.last && daysBetween(sum.last, today) >= 7) return [0, 0, 0];
  return sum.w || [sum.m7 || 0, 0, 0];
}
const parse = (s) => { try { return typeof s === 'string' ? JSON.parse(s) : s || null; } catch (e) { return null; } };

/* ---------- email building blocks (tables and inline styles: what email apps understand) ---------- */
const C = { ink: '#1f3557', soft: '#506686', line: '#d3e3f2', sky: '#eaf6ff', sun: '#fff5d6', leaf: '#e3f8ee', coral: '#ffe6e1', blue: '#2f9fe0', green: '#1f8a5f', red: '#c2412d' };
const tile = (big, small, bg = C.sky) => `<td style="background:${bg};border-radius:12px;padding:10px 12px;width:33%;vertical-align:top"><div style="font-size:24px;font-weight:700;color:${C.ink}">${big}</div><div style="font-size:12px;color:${C.soft}">${small}</div></td>`;
const tiles = (list) => `<table role="presentation" width="100%" cellspacing="6" cellpadding="0" style="border-collapse:separate"><tr>${list.join('')}</tr></table>`;
const h2 = (t) => `<h2 style="font-size:20px;margin:22px 0 6px;color:${C.ink}">${t}</h2>`;
const h3 = (t) => `<h3 style="font-size:15px;margin:16px 0 4px;color:${C.ink}">${t}</h3>`;
const p = (t, st = '') => `<p style="margin:6px 0;font-size:14px;line-height:1.45;color:${C.ink};${st}">${t}</p>`;
const ul = (items) => `<ul style="margin:4px 0 8px;padding-left:20px;font-size:14px;line-height:1.45;color:${C.ink}">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const box = (t, bg) => `<div style="background:${bg};border-radius:12px;padding:10px 14px;margin:8px 0;font-size:14px;line-height:1.45;color:${C.ink}">${t}</div>`;
const button = (t, href) => `<p style="margin:18px 0"><a href="${href}" style="background:${C.blue};color:#fff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:999px;display:inline-block">${t}</a></p>`;
function bars(dd, today) {
  const days = [...Array(7)].map((_, i) => addDay(today, i - 6)), mins = days.map((d) => Math.round(((dd || {})[d] || [0])[0] || 0)), mx = Math.max(10, ...mins);
  return `<table role="presentation" cellspacing="4" cellpadding="0" style="border-collapse:separate"><tr style="vertical-align:bottom">${mins.map((m) => `<td style="width:34px;text-align:center;font-size:11px;color:${C.soft}">${m}<div style="background:${C.blue};height:${Math.max(2, Math.round((m / mx) * 60))}px;border-radius:4px 4px 1px 1px;margin-top:2px"></div></td>`).join('')}</tr><tr>${days.map((d) => `<td style="text-align:center;font-size:11px;color:${C.soft}">${DOW[new Date(d + 'T12:00:00Z').getUTCDay()]}</td>`).join('')}</tr></table><div style="font-size:11px;color:${C.soft}">Minutes played each day</div>`;
}
const trend = (now, before, unit) => {
  if (before == null) return '';
  const d = now - before;
  return d === 0 ? ' (same as the week before)' : ` (${d > 0 ? '+' : '−'}${Math.abs(d)}${unit} vs the week before)`;
};
function page(title, body, unsubUrl) {
  return `<!doctype html><html><body style="margin:0;background:#f4f9fd;font-family:Arial,Helvetica,sans-serif;color:${C.ink}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#fff;border-radius:18px"><tr><td style="padding:20px 22px">
<div style="font-size:15px;font-weight:700;color:${C.blue}">Pip's Sky Islands</div>
<h1 style="font-size:24px;margin:6px 0 4px;color:${C.ink}">${title}</h1>
${body}
</td></tr></table>
<p style="font-size:12px;color:${C.soft};max-width:560px;line-height:1.45;margin:14px auto">You get this email because it is turned on in Parents → Account on <a href="${SITE}" style="color:${C.soft}">pipskyislands.com</a>. ${unsubUrl ? `<a href="${unsubUrl}" style="color:${C.soft}">Turn off these emails</a>.` : ''} Questions: hello@pipskyislands.com</p>
</td></tr></table></body></html>`;
}
const textOf = (html) => html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<(br|\/p|\/h\d|\/li|\/tr|\/div)>/gi, '\n').replace(/<li>/gi, '• ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\n\s*\n\s*\n+/g, '\n\n').trim();

/* ---------- a parent's weekly email: one section per child ---------- */
function kidSection(k, today) {
  const w = weekTotals(k.dd, today), wb = weekTotals(k.dd, today, 7), acc = pct(w[2], w[1]);
  const name = esc(k.name || 'Your child');
  let s = h2(name) + (k.grade ? p(esc(k.grade), `color:${C.soft};margin-top:-4px`) : '');
  if (!w[1]) {
    const away = k.last ? daysBetween(k.last, today) : null;
    s += box(`${name} did not play this week${away != null && away > 7 ? ` (last time: ${niceDay(k.last)})` : ''}. Even 10 minutes a day keeps skills fresh.`, C.sun);
  } else {
    s += tiles([tile(w[0], `minutes${trend(w[0], wb[1] ? wb[0] : null, ' min')}`), tile(w[1], 'puzzles answered'), tile(acc == null ? '–' : acc + '%', 'right on the first try', acc != null && acc < 60 ? C.coral : C.leaf)]);
    s += bars(k.dd, today);
  }
  if (k.tot) s += p(`<b>Skills mastered:</b> ${k.mast || 0} of ${k.tot}${k.alm ? `, and ${k.alm} almost there` : ''}.`);
  if (k.need && k.need.length) s += h3('To practice next') + ul(k.need.slice(0, 4).map((n) => `<b>${esc(n[0])}</b> (${esc(n[1])}): ${n[2]} of ${n[3]} right`));
  if (k.tips && k.tips.length) s += h3('Try at home') + ul(k.tips.slice(0, 2).map((t) => `<b>${esc(t[0])}:</b> ${esc(t[1])}`));
  if (k.goal) {
    const g = k.goal, expired = !g.done && g.end && g.end < today;
    s += box(g.done ? `<b>Family goal reached!</b> ${esc(g.t)}${g.reward ? `. Reward: <b>${esc(g.reward)}</b>` : ''}`
      : expired ? `The family goal "${esc(g.t)}" ended at ${g.have} of ${g.need}. You can set a new one in Parents.`
        : `<b>Family goal:</b> ${esc(g.t)}: ${g.have} of ${g.need} so far${g.end ? `, until ${niceDay(g.end)}` : ''}${g.reward ? `. Reward: ${esc(g.reward)}` : ''}.`, g.done ? C.leaf : C.sky);
  }
  if (k.cls) {
    const T = (k.cls.tasks || []).filter((t) => !t[2]);
    if (k.cls.note) s += box(`<b>From ${esc(k.cls.teacher || 'the teacher')}:</b> ${esc(k.cls.note)}`, C.sun);
    if (T.length) s += h3(`Class tasks from ${esc(k.cls.teacher || 'the teacher')}`) + ul(T.map((t) => `${esc(t[0])}${t[1] ? ` · due ${niceDay(t[1])}` : ''}${t[1] && t[1] < today ? ` <b style="color:${C.red}">overdue</b>` : ''}`));
    else if ((k.cls.tasks || []).length) s += p(`All class tasks are done. 🎉`);
  }
  return s;
}
const HR = '<hr style="border:0;border-top:1px solid #d3e3f2;margin:20px 0">';
const weekTitle = (today) => `The week of ${niceDay(addDay(today, -6))} – ${niceDay(today)}`;
function parentBody(kids, today) {
  const K = kids.filter((k) => k && (k.last ? daysBetween(k.last, today) <= 28 : false));
  if (!K.length) return null;
  const names = K.map((k) => k.name || 'Your child');
  return { names, html: K.map((k) => kidSection(k, today)).join(HR) + button('Open Pip', SITE) };
}
function parentWeekly(kids, today, unsubUrl) {
  const b = parentBody(kids, today);
  if (!b) return null;
  const html = page(weekTitle(today), b.html, unsubUrl);
  return { subject: b.names.length === 1 ? `${b.names[0]}'s week on Pip's Sky Islands` : `Your kids' week on Pip's Sky Islands`, html, text: textOf(html) };
}

/* ---------- a teacher's weekly email: one section per class ---------- */
function classSection(c, today) {
  const rows = (c.rows || []).map((r) => ({ mid: r.mid, name: r.name, sum: r.sum, w: memberWeek(r.sum, today) }));
  if (!rows.length) return h2(esc(c.name)) + p('No students yet.');
  const played = rows.filter((r) => r.w[1] > 0), mins = rows.reduce((s, r) => s + r.w[0], 0), q = rows.reduce((s, r) => s + r.w[1], 0), ok = rows.reduce((s, r) => s + r.w[2], 0);
  const idle = rows.filter((r) => !r.w[1]), help = rows.filter((r) => r.w[1] >= 5 && pct(r.w[2], r.w[1]) < 65), star = rows.filter((r) => r.w[1] >= 10 && pct(r.w[2], r.w[1]) >= 85);
  let s = h2(esc(c.name)) + tiles([tile(`${played.length}<span style="font-size:14px;color:${C.soft}"> of ${rows.length}</span>`, 'students played'), tile(mins, 'minutes in all'), tile(q ? pct(ok, q) + '%' : '–', 'right on the first try')]);
  if (idle.length) s += p(`<b>Did not play this week:</b> ${idle.map((r) => esc(r.name)).join(', ')}`);
  if (help.length) s += p(`<b>Needs help</b> (under 65% right): ${help.map((r) => `${esc(r.name)} ${pct(r.w[2], r.w[1])}%`).join(', ')}`);
  if (star.length) s += p(`<b>Doing great</b> (85%+ right): ${star.map((r) => esc(r.name)).join(', ')}`);
  const T = (c.tasks || []).filter((t) => !t.kind);
  if (T.length) {
    s += h3('Tasks') + ul(T.map((t) => {
      const who = !t.to || !t.to.length ? rows : rows.filter((r) => t.to.includes(r.mid));
      const done = who.filter((r) => r.sum && r.sum.tasks && r.sum.tasks[t.id]).length, late = t.due && t.due < today && done < who.length;
      return `${esc(t.nm || 'Task')}${t.due ? ` · due ${niceDay(t.due)}` : ''}: <b>${done} of ${who.length}</b> done${late ? ` <b style="color:${C.red}">overdue</b>` : ''}`;
    }));
  }
  return s;
}
function teacherBody(classes, today) {
  const L = classes.filter((c) => (c.rows || []).length);
  if (!L.length) return null;
  return { names: L.map((c) => c.name), html: L.map((c) => classSection(c, today)).join(HR) + p('Skill-by-skill progress, groups and printable family reports are on the teacher desk.') + button('Open the teacher desk', SITE) };
}
function teacherWeekly(classes, today, unsubUrl) {
  const b = teacherBody(classes, today);
  if (!b) return null;
  const html = page(weekTitle(today), b.html, unsubUrl);
  return { subject: b.names.length === 1 ? `${b.names[0]}: this week on Pip's Sky Islands` : `Your classes this week on Pip's Sky Islands`, html, text: textOf(html) };
}
/* one email for a person who is both a teacher and a parent */
function weeklyEmail(kids, classes, today, unsubUrl) {
  const a = teacherBody(classes, today), b = parentBody(kids, today);
  if (!a || !b) return a ? teacherWeekly(classes, today, unsubUrl) : b ? parentWeekly(kids, today, unsubUrl) : null;
  const sec = (t) => `<div style="margin:22px 0 0;padding:6px 12px;border-radius:10px;background:${C.sky};font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${C.soft}">${t}</div>`;
  const html = page(weekTitle(today), sec(a.names.length > 1 ? 'Your classes' : 'Your class') + a.html + sec(b.names.length > 1 ? 'Your kids' : 'Your child') + b.html, unsubUrl);
  return { subject: `Your class and family week on Pip's Sky Islands`, html, text: textOf(html) };
}

/* ---------- reminders: what to tell a family today ---------- */
function remindersFor(kidId, k, today, state) {
  const out = [], st = state || {};
  if (!k || !k.last) return out;
  const away = daysBetween(k.last, today), last = (st.inact || {})[kidId];
  if (away >= 3 && away <= 21 && (!last || daysBetween(last, today) >= 3)) {
    out.push({ kind: 'inact', key: kidId, title: `${k.name || 'Your child'} misses Pip!`, body: `No puzzles for ${away} days. 10 minutes today keeps the skills fresh.` });
  }
  const tomorrow = addDay(today, 1);
  for (const t of (k.cls && k.cls.tasks) || []) {
    const key = kidId + ':' + (t[3] || t[0]);
    if (!t[2] && t[1] === tomorrow && !(st.due || {})[key]) out.push({ kind: 'due', key, title: `Class task due tomorrow`, body: `${k.name || 'Your child'}: ${t[0]}` });
  }
  return out;
}
function reminderEmail(items, unsubUrl) {
  const body = ul(items.map((i) => `<b>${esc(i.title)}</b> ${esc(i.body)}`)) + button('Open Pip', SITE);
  const html = page('A quick reminder', body, unsubUrl);
  return { subject: items[0].title, html, text: textOf(html) };
}

/* the UTC hour and weekday at which it is `hour` o'clock on a Sunday (dow 0) in a time zone */
function utcSlot(tz, hour = 17, now = new Date()) {
  for (let h = 0; h < 24 * 8; h++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0) + h * 3600e3), lp = localParts(d, tz);
    if (lp.hour === hour && lp.dow === 0) return { h: d.getUTCHours(), dow: d.getUTCDay() };
  }
  return { h: 0, dow: 1 };
}

module.exports = { SITE, localParts, addDay, daysBetween, weekTotals, memberWeek, parse, esc, parentWeekly, teacherWeekly, weeklyEmail, remindersFor, reminderEmail, utcSlot, textOf };
