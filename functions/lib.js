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
const niceDay = (day, lang) => new Date(day + 'T12:00:00Z').toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
/* parents' emails and reminders in English or Spanish (the language the family chose in Parents' Corner) */
const DOW_ES = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const esOrd = (g) => ({ K: 'kínder', 1: '1.er grado', 2: '2.º grado', 3: '3.er grado', 4: '4.º grado', 5: '5.º grado' }[g] || g + '.º grado');
const esGrade = (t) => String(t || '').replace(/(\d)(?:st|nd|rd|th) grade/, (m, g) => esOrd(g)).replace(/grade (\d)/, (m, g) => esOrd(g));
const esGoal = (t) => String(t || '').replace(/^Play (\d+) minutes$/, 'Jugar $1 minutos').replace(/^Get (\d+) puzzles right on the first try$/, 'Contestar $1 retos bien al primer intento').replace(/^Master (\d+) new skills$/, 'Dominar $1 habilidades nuevas');

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
function bars(dd, today, lang) {
  const days = [...Array(7)].map((_, i) => addDay(today, i - 6)), mins = days.map((d) => Math.round(((dd || {})[d] || [0])[0] || 0)), mx = Math.max(10, ...mins);
  return `<table role="presentation" cellspacing="4" cellpadding="0" style="border-collapse:separate"><tr style="vertical-align:bottom">${mins.map((m) => `<td style="width:34px;text-align:center;font-size:11px;color:${C.soft}">${m}<div style="background:${C.blue};height:${Math.max(2, Math.round((m / mx) * 60))}px;border-radius:4px 4px 1px 1px;margin-top:2px"></div></td>`).join('')}</tr><tr>${days.map((d) => `<td style="text-align:center;font-size:11px;color:${C.soft}">${(lang === 'es' ? DOW_ES : DOW)[new Date(d + 'T12:00:00Z').getUTCDay()]}</td>`).join('')}</tr></table><div style="font-size:11px;color:${C.soft}">${lang === 'es' ? 'Minutos jugados cada día' : 'Minutes played each day'}</div>`;
}
const trend = (now, before, unit, lang) => {
  if (before == null) return '';
  const d = now - before, es = lang === 'es';
  return d === 0 ? (es ? ' (igual que la semana anterior)' : ' (same as the week before)') : ` (${d > 0 ? '+' : '−'}${Math.abs(d)}${unit} ${es ? 'vs. la semana anterior' : 'vs the week before'})`;
};
function page(title, body, unsubUrl, lang) {
  const es = lang === 'es';
  return `<!doctype html><html lang="${es ? 'es' : 'en'}"><body style="margin:0;background:#f4f9fd;font-family:Arial,Helvetica,sans-serif;color:${C.ink}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#fff;border-radius:18px"><tr><td style="padding:20px 22px">
<div style="font-size:15px;font-weight:700;color:${C.blue}">Pip's Sky Islands</div>
<h1 style="font-size:24px;margin:6px 0 4px;color:${C.ink}">${title}</h1>
${body}
</td></tr></table>
<p style="font-size:12px;color:${C.soft};max-width:560px;line-height:1.45;margin:14px auto">${es ? 'Recibes este correo porque está activado en Padres → Cuenta en' : 'You get this email because it is turned on in Parents → Account on'} <a href="${SITE}" style="color:${C.soft}">pipskyislands.com</a>. ${unsubUrl ? `<a href="${unsubUrl}" style="color:${C.soft}">${es ? 'Desactivar estos correos' : 'Turn off these emails'}</a>.` : ''} ${es ? 'Preguntas' : 'Questions'}: hello@pipskyislands.com</p>
</td></tr></table></body></html>`;
}
const textOf = (html) => html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<(br|\/p|\/h\d|\/li|\/tr|\/div)>/gi, '\n').replace(/<li>/gi, '• ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\n\s*\n\s*\n+/g, '\n\n').trim();

/* ---------- a parent's weekly email: one section per child ---------- */
function kidSection(k, today, lang) {
  const es = lang === 'es', w = weekTotals(k.dd, today), wb = weekTotals(k.dd, today, 7), acc = pct(w[2], w[1]);
  const name = esc(k.name || (es ? 'Tu hijo' : 'Your child')), day = (d) => niceDay(d, lang);
  let s = h2(name) + (k.grade ? p(esc(es ? esGrade(k.grade) : k.grade), `color:${C.soft};margin-top:-4px`) : '');
  if (!w[1]) {
    const away = k.last ? daysBetween(k.last, today) : null, lastTxt = away != null && away > 7 ? (es ? ` (última vez: ${day(k.last)})` : ` (last time: ${day(k.last)})`) : '';
    s += box(es ? `${name} no jugó esta semana${lastTxt}. Incluso 10 minutos al día mantienen frescas las habilidades.` : `${name} did not play this week${lastTxt}. Even 10 minutes a day keeps skills fresh.`, C.sun);
  } else {
    s += tiles([tile(w[0], `${es ? 'minutos' : 'minutes'}${trend(w[0], wb[1] ? wb[0] : null, ' min', lang)}`), tile(w[1], es ? 'retos contestados' : 'puzzles answered'), tile(acc == null ? '–' : acc + '%', es ? 'correctas al primer intento' : 'right on the first try', acc != null && acc < 60 ? C.coral : C.leaf)]);
    s += bars(k.dd, today, lang);
  }
  if (k.tot) s += p(es ? `<b>Habilidades dominadas:</b> ${k.mast || 0} de ${k.tot}${k.alm ? `, y ${k.alm} casi dominadas` : ''}.` : `<b>Skills mastered:</b> ${k.mast || 0} of ${k.tot}${k.alm ? `, and ${k.alm} almost there` : ''}.`);
  if (k.need && k.need.length) s += h3(es ? 'Para practicar ahora' : 'To practice next') + ul(k.need.slice(0, 4).map((n) => `<b>${esc(n[0])}</b> (${esc(n[1])}): ${n[2]} ${es ? 'de' : 'of'} ${n[3]} ${es ? 'bien' : 'right'}`));
  if (k.tips && k.tips.length) s += h3(es ? 'Prueba en casa' : 'Try at home') + ul(k.tips.slice(0, 2).map((t) => `<b>${esc(t[0])}:</b> ${esc(t[1])}`));
  if (k.goal) {
    const g = k.goal, expired = !g.done && g.end && g.end < today, t = esc(es ? esGoal(g.t) : g.t), rw = g.reward ? esc(g.reward) : '';
    s += box(es
      ? (g.done ? `<b>¡Meta familiar lograda!</b> ${t}${rw ? `. Recompensa: <b>${rw}</b>` : ''}` : expired ? `La meta familiar "${t}" terminó en ${g.have} de ${g.need}. Puedes poner una nueva en Padres.` : `<b>Meta familiar:</b> ${t}: ${g.have} de ${g.need} hasta ahora${g.end ? `, hasta el ${day(g.end)}` : ''}${rw ? `. Recompensa: ${rw}` : ''}.`)
      : (g.done ? `<b>Family goal reached!</b> ${t}${rw ? `. Reward: <b>${rw}</b>` : ''}` : expired ? `The family goal "${t}" ended at ${g.have} of ${g.need}. You can set a new one in Parents.` : `<b>Family goal:</b> ${t}: ${g.have} of ${g.need} so far${g.end ? `, until ${day(g.end)}` : ''}${rw ? `. Reward: ${rw}` : ''}.`), g.done ? C.leaf : C.sky);
  }
  if (k.cls) {
    const T = (k.cls.tasks || []).filter((t) => !t[2]), who = esc(k.cls.teacher || (es ? 'el maestro' : 'the teacher'));
    if (k.cls.note) s += box(`<b>${es ? 'De' : 'From'} ${who}:</b> ${esc(k.cls.note)}`, C.sun);
    if (T.length) s += h3(es ? `Tareas de clase de ${who}` : `Class tasks from ${who}`) + ul(T.map((t) => `${esc(t[0])}${t[1] ? ` · ${es ? 'vence' : 'due'} ${day(t[1])}` : ''}${t[1] && t[1] < today ? ` <b style="color:${C.red}">${es ? 'atrasada' : 'overdue'}</b>` : ''}`));
    else if ((k.cls.tasks || []).length) s += p(es ? 'Todas las tareas de clase están hechas. 🎉' : 'All class tasks are done. 🎉');
  }
  return s;
}
const HR = '<hr style="border:0;border-top:1px solid #d3e3f2;margin:20px 0">';
const weekTitle = (today, lang) => lang === 'es' ? `La semana del ${niceDay(addDay(today, -6), lang)} al ${niceDay(today, lang)}` : `The week of ${niceDay(addDay(today, -6))} – ${niceDay(today)}`;
function parentBody(kids, today, lang) {
  const K = kids.filter((k) => k && (k.last ? daysBetween(k.last, today) <= 28 : false));
  if (!K.length) return null;
  const names = K.map((k) => k.name || (lang === 'es' ? 'Tu hijo' : 'Your child'));
  return { names, html: K.map((k) => kidSection(k, today, lang)).join(HR) + button(lang === 'es' ? 'Abrir Pip' : 'Open Pip', SITE) };
}
function parentWeekly(kids, today, unsubUrl, lang) {
  const b = parentBody(kids, today, lang);
  if (!b) return null;
  const html = page(weekTitle(today, lang), b.html, unsubUrl, lang), es = lang === 'es';
  return { subject: b.names.length === 1 ? (es ? `La semana de ${b.names[0]} en Pip's Sky Islands` : `${b.names[0]}'s week on Pip's Sky Islands`) : (es ? `La semana de tus hijos en Pip's Sky Islands` : `Your kids' week on Pip's Sky Islands`), html, text: textOf(html) };
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
function weeklyEmail(kids, classes, today, unsubUrl, lang) {
  const a = teacherBody(classes, today), b = parentBody(kids, today, lang);
  if (!a || !b) return a ? teacherWeekly(classes, today, unsubUrl) : b ? parentWeekly(kids, today, unsubUrl, lang) : null;
  const sec = (t) => `<div style="margin:22px 0 0;padding:6px 12px;border-radius:10px;background:${C.sky};font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${C.soft}">${t}</div>`;
  const html = page(weekTitle(today), sec(a.names.length > 1 ? 'Your classes' : 'Your class') + a.html + sec(b.names.length > 1 ? 'Your kids' : 'Your child') + b.html, unsubUrl);
  return { subject: `Your class and family week on Pip's Sky Islands`, html, text: textOf(html) };
}

/* ---------- reminders: what to tell a family today ---------- */
function remindersFor(kidId, k, today, state, lang) {
  const out = [], st = state || {}, es = lang === 'es', nm = k && k.name ? k.name : (es ? 'Tu hijo' : 'Your child');
  if (!k || !k.last) return out;
  const away = daysBetween(k.last, today), last = (st.inact || {})[kidId];
  if (away >= 3 && away <= 21 && (!last || daysBetween(last, today) >= 3)) {
    out.push({ kind: 'inact', key: kidId, title: es ? `¡${nm} extraña a Pip!` : `${nm} misses Pip!`, body: es ? `Ningún reto en ${away} días. 10 minutos hoy mantienen frescas las habilidades.` : `No puzzles for ${away} days. 10 minutes today keeps the skills fresh.` });
  }
  const tomorrow = addDay(today, 1);
  for (const t of (k.cls && k.cls.tasks) || []) {
    const key = kidId + ':' + (t[3] || t[0]);
    if (!t[2] && t[1] === tomorrow && !(st.due || {})[key]) out.push({ kind: 'due', key, title: es ? 'Una tarea de clase vence mañana' : 'Class task due tomorrow', body: `${nm}: ${t[0]}` });
  }
  return out;
}
function reminderEmail(items, unsubUrl, lang) {
  const es = lang === 'es', body = ul(items.map((i) => `<b>${esc(i.title)}</b> ${esc(i.body)}`)) + button(es ? 'Abrir Pip' : 'Open Pip', SITE);
  const html = page(es ? 'Un recordatorio rápido' : 'A quick reminder', body, unsubUrl, lang);
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

/* the class quest: what the whole class did between the start and the end day (right answers on the first try, or minutes) */
function questTotal(goal, sums) {
  if (!goal || !goal.start || !goal.end) return 0;
  let t = 0;
  for (const s of sums) for (const [day, v] of Object.entries((s && s.dd) || {})) if (day >= goal.start && day <= goal.end && Array.isArray(v)) t += Math.max(0, Math.round(+(goal.kind === 'min' ? v[0] : v[2]) || 0));
  return Math.min(t, 9999999);
}
module.exports = { questTotal, niceDay, SITE, localParts, addDay, daysBetween, weekTotals, memberWeek, parse, esc, parentWeekly, teacherWeekly, weeklyEmail, remindersFor, reminderEmail, utcSlot, textOf };
