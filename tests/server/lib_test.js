/* plain-Node checks of the email and reminder logic (no Firebase needed) */
const L = require('../../functions/lib');
let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('  - ' + m); } };
const today = '2026-10-18'; // a Sunday
ok(L.questTotal({ kind: 'right', start: '2026-10-12', end: '2026-10-18' }, [{ dd: { '2026-10-11': [5, 9, 9], '2026-10-12': [10, 8, 6], '2026-10-18': [20, 15, 12] } }, { dd: { '2026-10-14': [7, 5, 4] } }, null]) === 22, 'quest: right answers in the quest days');
ok(L.questTotal({ kind: 'min', start: '2026-10-12', end: '2026-10-18' }, [{ dd: { '2026-10-12': [10, 8, 6], '2026-10-19': [99, 1, 1] } }]) === 10, 'quest: minutes');
const dd = {}; for (let i = 0; i < 14; i++) dd[L.addDay(today, -i)] = [10 + i, 20, i < 7 ? 15 : 10];
ok(JSON.stringify(L.weekTotals(dd, today)) === JSON.stringify([91, 140, 105]), 'week totals ' + L.weekTotals(dd, today));
ok(L.localParts(new Date('2026-10-19T00:30:00Z'), 'America/Los_Angeles').day === '2026-10-18', 'local day in LA');
ok(L.localParts(new Date('2026-10-19T00:30:00Z'), 'America/Los_Angeles').hour === 17, 'local hour in LA');
ok(L.localParts(new Date('2026-10-19T00:30:00Z'), 'America/Los_Angeles').dow === 0, 'Sunday');
ok(L.localParts(new Date(), 'Not/AZone').day.length === 10, 'bad time zone falls back');
const kid = { v: 1, name: 'Alisa', grade: 'California, 4th grade', dd, mast: 12, tot: 141, alm: 5, need: [['Fractions on a number line', 'Pie Peak', 2, 6]], tips: [['Pie Peak', 'Cut a sandwich into equal parts.']], goal: { t: 'Play 60 minutes', have: 40, need: 60, done: false, end: '2026-10-20', reward: 'Park <trip>' }, cls: { teacher: 'Ms. Lee', note: 'We learn fractions', tasks: [['Pie Peak', '2026-10-17', false, 't1'], ['Digit Cliffs', '2026-10-19', false, 't2'], ['Clock Cove', '', true, 't3']] }, last: '2026-10-18' };
const m = L.parentWeekly([kid], today, 'https://x/unsub');
const mes = L.parentWeekly([{ ...kid, tips: [['Pie Peak', 'Corten un sándwich en partes iguales.']] }], today, 'https://x/unsub', 'es');
ok(mes && mes.subject === "La semana de Alisa en Pip's Sky Islands", 'Spanish subject ' + (mes && mes.subject));
ok(mes.html.includes('lang="es"') && mes.html.includes('correctas al primer intento') && mes.html.includes('Prueba en casa') && mes.html.includes('Corten un sándwich') && mes.html.includes('Desactivar estos correos') && mes.html.includes('4.º grado'), 'Spanish weekly email');
ok(!/minutes played each day|To practice next|Turn off these emails/i.test(mes.html), 'no English left in the Spanish email');
const rs = L.remindersFor('k1', { name: 'Alisa', last: L.addDay(today, -4) }, today, {}, 'es');
ok(rs.length === 1 && rs[0].title === '¡Alisa extraña a Pip!', 'Spanish reminder: ' + (rs[0] && rs[0].title));
ok(m && m.subject === "Alisa's week on Pip's Sky Islands", 'parent subject ' + (m && m.subject));
ok(m.html.includes('Park &lt;trip&gt;') && !m.html.includes('<trip>'), 'text is escaped');
ok(m.html.includes('overdue') && m.html.includes('Fractions on a number line') && m.html.includes('Cut a sandwich'), 'tasks, needs and tips');
ok(m.html.includes('https://x/unsub') && m.text.includes('Alisa'), 'unsubscribe link and plain text');
ok(L.parentWeekly([{ ...kid, last: '2026-08-01' }], today, '') === null, 'no email for a child gone for a month');
const R = L.remindersFor('k1', { ...kid, last: '2026-10-14' }, today, {});
ok(R.some((r) => r.kind === 'inact') && R.some((r) => r.kind === 'due' && r.key === 'k1:t2'), 'inactivity and due-tomorrow reminders ' + JSON.stringify(R.map((r) => r.key)));
ok(L.remindersFor('k1', { ...kid, last: '2026-10-14' }, today, { inact: { k1: '2026-10-17' }, due: { 'k1:t2': '2026-10-17' } }).length === 0, 'no repeat reminders');
ok(L.remindersFor('k1', kid, today, {}).filter((r) => r.kind === 'inact').length === 0, 'no reminder when played today');
const cls = { name: 'Room 12', tasks: [{ id: 't1', nm: 'Pie Peak', due: '2026-10-16', to: [] }, { id: 'note', kind: 'note', text: 'x' }], rows: [
  { mid: 'a', name: 'Maya', sum: { dd, tasks: { t1: 1 } } }, { mid: 'b', name: 'Leo', sum: { w: [5, 10, 4], last: '2026-10-01' } }, { mid: 'c', name: 'Sam', sum: { dd: { [today]: [20, 30, 12] } } }] };
const t = L.teacherWeekly([cls], today, 'u');
ok(t && t.html.includes('Did not play this week:</b> Leo') && t.html.includes('Sam 40%') && t.html.includes('1 of 3</b> done'), 'teacher summary');
const both = L.weeklyEmail([kid], [cls], today, 'https://x/u2');
ok(both && both.html.includes('Room 12') && both.html.includes('Alisa') && both.html.split('https://x/u2').length === 2, 'combined email has both parts and one unsubscribe link');
ok(L.utcSlot('America/Los_Angeles', 17, new Date('2026-10-14T00:00:00Z')).h === 0, 'utc slot');
require('fs').writeFileSync(process.argv[2] || '/tmp/pip_weekly.html', both.html);
console.log(bad ? `FAIL server lib: ${bad} problem(s)` : 'OK   server lib');
process.exit(bad ? 1 : 0);
