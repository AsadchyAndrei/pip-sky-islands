// In-memory stand-in for cloud.js (window.PipCloud) used by the class checks. It keeps the same data layout as
// Firestore and copies the main rules of firestore.rules (who may read or write a class, a code, a member).
// The store lives in localStorage['mock-store'] so two test pages (teacher, parent) can share it.
(() => {
  const user = JSON.parse(localStorage.getItem('mock-user') || 'null');
  const load = () => JSON.parse(localStorage.getItem('mock-store') || '{}');
  const keep = (s) => localStorage.setItem('mock-store', JSON.stringify(s));
  const deny = () => Object.assign(new Error('Missing or insufficient permissions.'), { code: 'permission-denied' });
  const me = () => { if (!user) throw deny(); return user.uid; };
  const get = (p) => load()[p];
  const put = (p, v) => { const s = load(); if (v === undefined) delete s[p]; else s[p] = v; keep(s); };
  const under = (prefix) => Object.entries(load()).filter(([k]) => k.startsWith(prefix) && !k.slice(prefix.length).includes('/'));
  let kidWatch = null;
  const tellKids = () => { if (kidWatch) setTimeout(() => kidWatch(Object.fromEntries(under(`users/${me()}/kids/`).map(([k, v]) => [k.split('/').pop(), { ...v, _pending: false }])), { fromCache: false, pending: false }), 0); };
  const ABC = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let n = 0;
  const code = () => { let s = ''; for (let i = 0; i < 6; i++) s += ABC[(Date.now() + n++ * 7 + i * 13) % ABC.length]; return s; };
  const api = {
    configured: true,
    onAuth(cb) { setTimeout(() => cb(user ? { uid: user.uid, email: user.email, verified: true, provider: 'password' } : null), 0); return () => {}; },
    signOut: async () => {},
    getUserDoc: async () => get(`users/${me()}`) || null,
    setUserDoc: async (d) => put(`users/${me()}`, { ...(get(`users/${me()}`) || {}), ...d }),
    watchKids(cb) { kidWatch = cb; tellKids(); return () => { kidWatch = null; }; },
    saveKid: async (id, d) => { const old = get(`users/${me()}/kids/${id}`); if (old && old.deleted) throw deny(); put(`users/${me()}/kids/${id}`, d); },
    deleteKid: async (id) => { put(`users/${me()}/kids/${id}`, { deleted: true, ts: Date.now() }); },
    writeBackup: async () => {}, listBackups: async () => [], pruneBackups: async () => {},
    async myClasses() { return under('classes/').filter(([, v]) => v.owner === me()).map(([k, v]) => ({ cid: k.split('/')[1], ...v })); },
    async createClass(d) { const cid = 'c' + Date.now().toString(36) + (n++); const c = code(); const cls = { ...d, owner: me(), code: c, ts: Date.now() };
      if (get(`codes/${c}`)) throw deny(); put(`classes/${cid}`, cls); put(`codes/${c}`, { cid, owner: me() }); return { cid, ...cls }; },
    async updateClass(cid, patch) { const c = get(`classes/${cid}`); if (!c || c.owner !== me()) throw deny(); put(`classes/${cid}`, { ...c, ...patch }); },
    async newClassCode(cid, old) { const c = get(`classes/${cid}`); if (!c || c.owner !== me()) throw deny(); const k = code(); put(`classes/${cid}`, { ...c, code: k }); put(`codes/${k}`, { cid, owner: me() }); if (old) put(`codes/${old}`); return k; },
    async deleteClass(cid, c) { const cl = get(`classes/${cid}`); if (!cl || cl.owner !== me()) throw deny(); for (const [k] of under(`classes/${cid}/members/`)) put(k); if (c) put(`codes/${c}`); put(`classes/${cid}`); },
    async getClass(cid) { me(); const c = get(`classes/${cid}`); return c ? { cid, ...c } : null; },
    async classByCode(c) { me(); const x = get(`codes/${String(c).toUpperCase()}`); return x ? api.getClass(x.cid) : null; },
    async members(cid) { const c = get(`classes/${cid}`); if (!c || c.owner !== me()) throw deny(); return under(`classes/${cid}/members/`).map(([k, v]) => ({ mid: k.split('/').pop(), ...v })); },
    async getMember(cid, mid) { const m = get(`classes/${cid}/members/${mid}`); if (!m) return null; const c = get(`classes/${cid}`) || {}; if (m.owner !== me() && c.owner !== me()) throw deny(); return m; },
    async saveMember(cid, kid, d) { const mid = me() + '_' + kid, path = `classes/${cid}/members/${mid}`, old = get(path), c = get(`classes/${cid}`);
      if (!c) throw deny();
      const nd = { ...d, owner: me(), kid };
      if (!old) { if (c.owner !== me() && nd.code !== c.code) throw deny(); }
      else { if (old.owner !== me() || old.removed || (nd.code || '') !== (old.code || '')) throw deny(); }
      if (String(nd.name || '').length > 16 || (nd.sum && nd.sum.length > 60000)) throw deny();
      put(path, nd); },
    async leaveClass(cid, kid) { const path = `classes/${cid}/members/${me()}_${kid}`, m = get(path); if (m && (m.owner !== me() || m.removed)) throw deny(); put(path); },
    async removeMember(cid, mid) { const c = get(`classes/${cid}`); if (!c || c.owner !== me()) throw deny(); const m = get(`classes/${cid}/members/${mid}`); if (m) put(`classes/${cid}/members/${mid}`, { ...m, removed: true }); },
    async exportAll() { return {}; },
  };
  window.PipCloud = api;
  window.mockTellKids = tellKids;
})();
