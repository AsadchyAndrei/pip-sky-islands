/* Pip's Sky Islands: teacher demo (pipskyislands.com/?demo=teacher).
   A sample class with 12 students, their progress, groups, tasks and a message to families, all made up and kept in
   memory only: no sign-in, nothing is sent anywhere, nothing is saved. Firebase is not even loaded (cloud.js sees this
   stand-in and steps aside). Leaving the demo removes everything it kept on the device and restores what was there. */
(() => {
  const UID = 'pipdemo', ON = 'pip-demo-on', PREV = 'pip-demo-prev';
  const ls = window.localStorage;
  const purge = () => { try {
    if (!ls.getItem(ON)) return;
    for (const k of Object.keys(ls)) if (k.includes(UID)) ls.removeItem(k);
    const prev = ls.getItem(PREV); if (prev) ls.setItem('pip-last-uid', prev); else ls.removeItem('pip-last-uid');
    ls.removeItem(ON); ls.removeItem(PREV);
  } catch (e) { /* storage blocked */ } };
  const want = /(^|[?&])demo=teacher(&|$)/.test(location.search);
  if (!want) { purge(); return; }
  try { if (!ls.getItem(ON)) { ls.setItem(PREV, ls.getItem('pip-last-uid') || ''); ls.setItem(ON, '1'); } } catch (e) { /* storage blocked */ }
  window.PIP_DEMO = true;
  // the clean-up runs on the next normal page load, before the app starts (the app may still save while this page closes)
  const exitDemo = () => { location.href = location.pathname; };
  window.exitDemo = exitDemo;

  /* ---------- the sample class, made when the app first asks for it ---------- */
  const S = {}; let seeded = false;
  const day = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  let seed = 20261014; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const KIDS = [['Maya R.', .92, 1], ['Leo K.', .86, 1], ['Ava S.', .8, 1], ['Noah P.', .74, 1], ['Mia T.', .68, 1], ['Ethan W.', .6, 1], ['Zoe M.', .5, 1], ['Lucas B.', .38, 1],
    ['Sofia G.', .82, 0], ['Omar D.', .64, 0], ['Lily C.', .45, 0], ['Sam J.', .55, 0]];
  function seedAll() {
    if (seeded) return; seeded = true;
    const pack = 'ca-4', P = CONTENT.packs[pack], now = new Date().toISOString();
    S[`users/${UID}`] = { role: 'teacher', roleAt: now, teacherName: 'Ms. Demo', consentAt: now, consentVersion: 1, teacherAt: now, teacherVersion: 1, pin: '' };
    const cls = { owner: UID, name: 'Room 12 (sample)', teacher: 'Ms. Demo', pack, code: 'DEMO24', ts: Date.now(), now: ['frac', 'mult'], v: 1,
      tasks: [{ id: 'tfrac', isl: ['frac'], nm: 'Pie Peak', due: day(3), note: 'One round a day this week', to: [], ts: Date.now() - 2 * 864e5 },
        { id: 'tregroup', isl: ['addsub'], nm: 'Carry Canyon: Adding with regrouping', due: day(-1), note: 'Practice: Adding with regrouping', to: [], ts: Date.now() - 6 * 864e5 },
        { id: 'note', kind: 'note', text: 'This week we are learning fractions. Ten minutes of Pip at home helps a lot. Thank you!', ts: Date.now() - 864e5 }] };
    S['classes/DEMO1'] = cls; S['codes/DEMO24'] = { cid: 'DEMO1', owner: UID };
    const isl = (P.islands || []).filter((i) => (i.skills || []).length);
    const weakIds = new Set();
    KIDS.forEach(([name, lvl, roster], n) => {
      const kid = 'k' + (n + 1), owner = roster ? UID : 'fam' + n, mid = owner + '_' + kid;
      const sk = {}, is = {};
      for (const i of isl) {
        let d = 0;
        const reach = i.id === 'frac' || i.id === 'mult' || i.id === 'addsub' ? 1 : lvl + .15;
        for (const k of i.skills) {
          if (rnd() > reach) continue;
          const hard = /regroup|borrow|2x2|times_as/.test(k) || i.id === 'frac';
          if (rnd() < lvl * (hard ? .35 : .85) - .15) { const tot = 9 + Math.floor(rnd() * 8); sk[k] = [2, Math.max(8, Math.round(tot * (.82 + rnd() * .16))), tot]; d++; continue; } // mastered
          const tot = 3 + Math.floor(rnd() * 8), acc = Math.min(.95, Math.max(.15, lvl + (rnd() - .5) * .35 - (hard ? .2 : 0))), ok = Math.round(tot * acc);
          sk[k] = [1, ok, tot];
        }
        is[i.id] = [Math.min(3, Math.floor(lvl * 3.4 * (d ? 1 : .5))), d, i.skills.length];
      }
      const dd = {}, idle = n === 7 || n === 10;
      for (let i = 0; i < 14; i++) { if (idle && i < 9) continue; if (rnd() < .35) continue; const q = 6 + Math.floor(rnd() * 22), c = Math.round(q * Math.min(.98, lvl + (rnd() - .5) * .2)); dd[day(-i)] = [5 + Math.floor(rnd() * 20), q, c]; }
      const sumW = (off) => [0, 1, 2].map((j) => [...Array(7)].reduce((s, _, i) => s + ((dd[day(-i - off)] || [0, 0, 0])[j]), 0));
      const wh = [...Array(8)].map((_, w) => w >= 6 ? sumW((7 - w) * 7) : [Math.floor(20 + rnd() * 70), Math.floor(20 + rnd() * 70), 0].map((v, j, a) => j === 2 ? Math.round(a[1] * lvl) : v));
      const tasks = {}; if (lvl > .55) tasks.tfrac = 1; if (lvl > .8) tasks.tregroup = 1;
      if (lvl < .6) weakIds.add(mid);
      const last = Object.keys(dd).sort().pop() || '';
      const wrong = [{ i: 'mult', k: '', p: '48 × 6 = ?', g: '248', a: '288', d: Date.now() - 864e5 }, { i: 'frac', k: '', p: 'Which is bigger: 3/8 or 1/2?', g: '3/8', a: '1/2', d: Date.now() - 2 * 864e5 }].slice(0, lvl < .7 ? 2 : 1);
      const sum = { v: 1, sk, isl: is, a: 80 + Math.floor(rnd() * 300), c: 0, m7: sumW(0)[0], w: sumW(0), wp: sumW(7), wh, dd, day: day(0), last, tasks, wrong };
      sum.c = Math.round(sum.a * lvl);
      S[`classes/DEMO1/members/${mid}`] = { owner, kid, name, pack, ts: Date.now() - Math.floor(rnd() * 864e5), sum: JSON.stringify(sum), ...(roster ? {} : { code: 'DEMO24' }) };
      if (roster) {
        const p = freshProfile(); p.name = name; p.roster = 1; p.pic = [n % 12, (n * 5 + 3) % 12]; if (p.pic[0] === p.pic[1]) p.pic[1] = (p.pic[1] + 1) % 12;
        p.pack = pack; p.packSince = Date.now(); p.cls = { cid: 'DEMO1', code: '', name: cls.name, teacher: cls.teacher };
        p.settings.state = P.state; p.settings.grade = P.grade; p.greeted = '';
        S[`users/${UID}/kids/${kid}`] = { data: JSON.stringify(p), name, ts: Date.now(), v: 1 };
      }
    });
    cls.tasks[1].to = [...weakIds];
  }

  /* ---------- the same calls cloud.js offers, answered from memory ---------- */
  const get = (p) => { seedAll(); return S[p]; };
  const put = (p, v) => { seedAll(); if (v === undefined) delete S[p]; else S[p] = v; };
  const under = (pre) => { seedAll(); return Object.entries(S).filter(([k]) => k.startsWith(pre) && !k.slice(pre.length).includes('/')); };
  const no = (m) => Object.assign(new Error(m || 'demo'), { code: 'functions/failed-precondition', message: m || 'demo' });
  let kidWatch = null;
  const tellKids = () => { if (kidWatch) setTimeout(() => kidWatch(Object.fromEntries(under(`users/${UID}/kids/`).map(([k, v]) => [k.split('/').pop(), { ...v, _pending: false }])), { fromCache: false, pending: false }), 0); };
  let n = 0; const code = () => 'DM' + String(1000 + (n++)).slice(-4);
  const api = {
    configured: true, demo: true, appleOn: false,
    onAuth(cb) { setTimeout(() => cb({ uid: UID, email: 'demo@pipskyislands.com', verified: true, provider: 'password' }), 0); return () => {}; },
    signOut: async () => exitDemo(),
    signInGoogle: async () => exitDemo(), signInEmail: async () => exitDemo(), signUpEmail: async () => exitDemo(), resetPassword: async () => {},
    getUserDoc: async () => get(`users/${UID}`),
    setUserDoc: async (d) => put(`users/${UID}`, { ...get(`users/${UID}`), ...d }),
    watchKids(cb) { kidWatch = cb; tellKids(); return () => { kidWatch = null; }; },
    saveKid: async (id, d) => put(`users/${UID}/kids/${id}`, d),
    saveKidMail: async () => {},
    deleteKid: async (id) => put(`users/${UID}/kids/${id}`, { deleted: true, ts: Date.now() }),
    writeBackup: async () => {}, listBackups: async () => [], pruneBackups: async () => {},
    async myClasses() { return under('classes/').filter(([, v]) => v.owner === UID).map(([k, v]) => ({ cid: k.split('/')[1], ...JSON.parse(JSON.stringify(v)) })); },
    async createClass(d) { const cid = 'DEMO' + (2 + n), c = code(); const cls = { ...d, owner: UID, code: c, ts: Date.now() }; put(`classes/${cid}`, cls); put(`codes/${c}`, { cid, owner: UID }); return { cid, ...cls }; },
    async updateClass(cid, patch) { put(`classes/${cid}`, { ...get(`classes/${cid}`), ...JSON.parse(JSON.stringify(patch)) }); },
    async newClassCode(cid, old) { const k = code(); put(`classes/${cid}`, { ...get(`classes/${cid}`), code: k }); if (old) put(`codes/${old}`); put(`codes/${k}`, { cid, owner: UID }); return k; },
    async deleteClass(cid, c) { for (const [k] of under(`classes/${cid}/members/`)) put(k); if (c) put(`codes/${c}`); put(`classes/${cid}`); },
    async getClass(cid) { const c = get(`classes/${cid}`); return c ? { cid, ...c } : null; },
    async classByCode(c) { const x = get(`codes/${String(c).toUpperCase()}`); return x ? api.getClass(x.cid) : null; },
    async members(cid) { return under(`classes/${cid}/members/`).map(([k, v]) => ({ mid: k.split('/').pop(), ...v })); },
    async getMember(cid, mid) { return get(`classes/${cid}/members/${mid}`) || null; },
    async saveMember(cid, kid, d) { put(`classes/${cid}/members/${UID}_${kid}`, { ...d, owner: UID, kid }); },
    async leaveClass(cid, kid) { put(`classes/${cid}/members/${UID}_${kid}`); },
    async removeMember(cid, mid) { const m = get(`classes/${cid}/members/${mid}`); if (m) put(`classes/${cid}/members/${mid}`, { ...m, removed: true }); },
    async makeCoInvite() { return { code: 'DEMOCO24', exp: Date.now() + 7 * 864e5 }; },
    async joinCoTeacher() { throw no('demo'); },
    async removeCo() {}, async leaveCo() {},
    async call() { throw no('demo'); }, async sendTestEmail() { throw no('demo'); },
    async pushSupported() { return false; }, async enablePush() { return { ok: false, why: 'demo' }; }, async disablePush() {}, pushOn: () => false,
    async classroomToken() { throw no('demo'); },
    async exportAll() { return { demo: true }; },
    async deleteAccount() { exitDemo(); },
  };
  window.PipCloud = api;

  /* ---------- a ribbon that says what this is, with the way out ---------- */
  addEventListener('DOMContentLoaded', () => {
    const b = document.createElement('div'); b.id = 'demoBar'; b.setAttribute('role', 'status');
    b.innerHTML = '<b>Teacher demo</b><span>A sample class with made-up students. Nothing is saved.</span><a class="dmsign" href="./">Sign up free</a><button type="button" id="demoExit">Exit demo</button>';
    document.body.appendChild(b); document.body.classList.add('demo');
    document.getElementById('demoExit').onclick = exitDemo;
    b.querySelector('.dmsign').onclick = (e) => { e.preventDefault(); exitDemo(); };
  });
})();
