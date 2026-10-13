// Pip's Sky Islands: sign-in and cloud saving (Firebase Auth + Cloud Firestore).
// The game talks only to window.PipCloud, so this file is the single place that knows about Firebase.
// Data layout (owner-only, see firestore.rules):
//   users/{uid}                          email, consentAt, consentVersion, pin
//   users/{uid}/kids/{kidId}             data (JSON text), name, ts, v   | or {deleted:true} after removal
//   users/{uid}/kids/{kidId}/backups/{id}  daily copies, newest 30 kept
//   classes/{cid}                        a teacher's class: owner, name, teacher, pack, code, now, tasks (no student data)
//   classes/{cid}/members/{uid_kidId}    one child's progress summary for the teacher, written by the child's grown-up
//   codes/{code}                         class code -> class id (read one at a time, never listed)
const VERSION = '12.19.0';
const BASE = `https://www.gstatic.com/firebasejs/${VERSION}/`;
const cfg = window.PIP_FIREBASE_CONFIG;
const api = { configured: false };
const announce = () => { window.PipCloud = api; window.dispatchEvent(new Event('pipcloud')); };
// class codes: 6 letters and digits that are easy to read aloud (no 0/O, 1/I/L)
const CODE_ABC = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const classCode = () => { const a = new Uint32Array(6); crypto.getRandomValues(a); return [...a].map((x) => CODE_ABC[x % CODE_ABC.length]).join(''); };
const wanted = !!(cfg && cfg.apiKey && !/PASTE|YOUR_/i.test(cfg.apiKey));

if (window.PipCloud) {
  // a test harness already provided its own PipCloud
} else if (!wanted) {
  announce();
} else {
  try {
    const [A, AU, FS] = await Promise.all([
      import(BASE + 'firebase-app.js'),
      import(BASE + 'firebase-auth.js'),
      import(BASE + 'firebase-firestore.js'),
    ]);
    const app = A.initializeApp(cfg);
    const auth = AU.getAuth(app);
    let db;
    try {
      db = FS.initializeFirestore(app, { localCache: FS.persistentLocalCache({ tabManager: FS.persistentMultipleTabManager() }) });
    } catch (e) {
      db = FS.getFirestore(app); // private browsing etc.: memory cache only (the game still keeps its own copy)
    }
    const me = () => {
      const u = auth.currentUser;
      if (!u) throw Object.assign(new Error('Not signed in'), { code: 'auth/no-user' });
      return u.uid;
    };
    const userRef = () => FS.doc(db, 'users', me());
    const kidRef = (id) => FS.doc(db, 'users', me(), 'kids', id);
    const kidsCol = () => FS.collection(db, 'users', me(), 'kids');
    const bkCol = (id) => FS.collection(db, 'users', me(), 'kids', id, 'backups');

    Object.assign(api, {
      configured: true,
      onAuth(cb) {
        return AU.onAuthStateChanged(auth, (u) => cb(u ? {
          uid: u.uid, email: u.email || '', verified: u.emailVerified,
          provider: (u.providerData[0] || {}).providerId || '',
        } : null));
      },
      async signInGoogle() {
        const p = new AU.GoogleAuthProvider();
        p.setCustomParameters({ prompt: 'select_account' });
        try { await AU.signInWithPopup(auth, p); }
        catch (e) {
          if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') return AU.signInWithRedirect(auth, p);
          throw e;
        }
      },
      async signUpEmail(email, pass) {
        const c = await AU.createUserWithEmailAndPassword(auth, email, pass);
        try { await AU.sendEmailVerification(c.user); } catch (e) { /* not critical */ }
      },
      signInEmail: (email, pass) => AU.signInWithEmailAndPassword(auth, email, pass),
      resetPassword: (email) => AU.sendPasswordResetEmail(auth, email),
      signOut: () => AU.signOut(auth),
      async getUserDoc() {
        const s = await FS.getDoc(userRef());
        return s.exists() ? s.data() : null;
      },
      setUserDoc: (d) => FS.setDoc(userRef(), d, { merge: true }),
      watchKids(cb, onErr) {
        return FS.onSnapshot(kidsCol(), { includeMetadataChanges: true }, (snap) => {
          const docs = {};
          snap.forEach((d) => { docs[d.id] = { ...d.data(), _pending: d.metadata.hasPendingWrites }; });
          cb(docs, { fromCache: snap.metadata.fromCache, pending: snap.metadata.hasPendingWrites });
        }, onErr);
      },
      saveKid: (id, d) => FS.setDoc(kidRef(id), d),
      async deleteKid(id) {
        await api.pruneBackups(id, 0);
        await FS.setDoc(kidRef(id), { deleted: true, ts: Date.now() });
      },
      writeBackup: (id, bid, d) => FS.setDoc(FS.doc(bkCol(id), bid), d),
      async listBackups(id) {
        const s = await FS.getDocs(bkCol(id));
        const out = [];
        s.forEach((d) => out.push({ id: d.id, ...d.data() }));
        return out.sort((a, b) => (a.id < b.id ? 1 : -1));
      },
      async pruneBackups(id, keep) {
        const list = await api.listBackups(id);
        await Promise.all(list.slice(keep).map((b) => FS.deleteDoc(FS.doc(bkCol(id), b.id))));
      },
      // ---- classes (teachers) ----
      async myClasses() {
        const s = await FS.getDocs(FS.query(FS.collection(db, 'classes'), FS.where('owner', '==', me())));
        return s.docs.map((d) => ({ cid: d.id, ...d.data() }));
      },
      async createClass(d) {
        for (let k = 0; k < 6; k++) {
          const code = classCode(), ref = FS.doc(FS.collection(db, 'classes'));
          const cls = { ...d, owner: me(), code, ts: Date.now() };
          const b = FS.writeBatch(db);
          b.set(ref, cls);
          b.set(FS.doc(db, 'codes', code), { cid: ref.id, owner: me() });
          try { await b.commit(); return { cid: ref.id, ...cls }; }
          catch (e) { if (e.code !== 'permission-denied' || k === 5) throw e; } // code already taken: try another
        }
      },
      updateClass: (cid, patch) => FS.updateDoc(FS.doc(db, 'classes', cid), patch),
      async newClassCode(cid, old) {
        for (let k = 0; k < 6; k++) {
          const code = classCode(), b = FS.writeBatch(db);
          b.update(FS.doc(db, 'classes', cid), { code });
          b.set(FS.doc(db, 'codes', code), { cid, owner: me() });
          if (old) b.delete(FS.doc(db, 'codes', old));
          try { await b.commit(); return code; } catch (e) { if (e.code !== 'permission-denied' || k === 5) throw e; }
        }
      },
      async deleteClass(cid, code) {
        for (const m of (await FS.getDocs(FS.collection(db, 'classes', cid, 'members'))).docs) await FS.deleteDoc(m.ref);
        if (code) await FS.deleteDoc(FS.doc(db, 'codes', code)).catch(() => {});
        await FS.deleteDoc(FS.doc(db, 'classes', cid));
      },
      async getClass(cid) {
        const s = await FS.getDoc(FS.doc(db, 'classes', cid));
        return s.exists() ? { cid, ...s.data() } : null;
      },
      async classByCode(code) {
        const s = await FS.getDoc(FS.doc(db, 'codes', String(code).toUpperCase()));
        if (!s.exists()) return null;
        return api.getClass(s.data().cid);
      },
      async members(cid) {
        const s = await FS.getDocs(FS.collection(db, 'classes', cid, 'members'));
        return s.docs.map((d) => ({ mid: d.id, ...d.data() }));
      },
      async getMember(cid, mid) {
        const s = await FS.getDoc(FS.doc(db, 'classes', cid, 'members', mid));
        return s.exists() ? s.data() : null;
      },
      // a child's own grown-up (or the teacher, for children on the teacher's roster) writes the summary
      saveMember: (cid, kid, d) => FS.setDoc(FS.doc(db, 'classes', cid, 'members', me() + '_' + kid), { ...d, owner: me(), kid }),
      leaveClass: (cid, kid) => FS.deleteDoc(FS.doc(db, 'classes', cid, 'members', me() + '_' + kid)),
      removeMember: (cid, mid) => FS.updateDoc(FS.doc(db, 'classes', cid, 'members', mid), { removed: true }),
      async exportAll() {
        const u = auth.currentUser;
        const user = (await FS.getDoc(userRef())).data() || {};
        const kids = [];
        for (const k of (await FS.getDocs(kidsCol())).docs) {
          const d = k.data();
          if (d.deleted) continue;
          let progress = null;
          try { progress = JSON.parse(d.data); } catch (e) { progress = d.data; }
          const backups = (await api.listBackups(k.id)).map((b) => ({ id: b.id, savedAt: new Date(b.ts).toISOString() }));
          kids.push({ id: k.id, name: d.name, savedAt: new Date(d.ts).toISOString(), progress, backups });
        }
        const classes = [];
        for (const c of await api.myClasses()) classes.push({ ...c, members: await api.members(c.cid) });
        return { exportedAt: new Date().toISOString(), account: { email: u.email, ...user }, players: kids, classes };
      },
      async deleteAccount(password) {
        const u = auth.currentUser;
        // confirm identity first, so we never wipe data and then fail to delete the login
        if (password != null) await AU.reauthenticateWithCredential(u, AU.EmailAuthProvider.credential(u.email, password));
        else await AU.reauthenticateWithPopup(u, new AU.GoogleAuthProvider());
        for (const c of await api.myClasses()) await api.deleteClass(c.cid, c.code);
        for (const k of (await FS.getDocs(kidsCol())).docs) {
          await api.pruneBackups(k.id, 0);
          await FS.deleteDoc(k.ref);
        }
        await FS.deleteDoc(userRef());
        await AU.deleteUser(u);
      },
    });
    announce();
  } catch (e) {
    api.loadError = String((e && e.message) || e);
    announce();
  }
}
