/* Pip's Sky Islands: Spanish help for English learners (Ayuda en español).
   In math, science and riddles, a child who reads Spanish better than English can open a Spanish hint, and tap the key
   words of a question to see them in Spanish. Reading, writing, grammar and words stay in English: they are what is
   being learned there. Turned on by a grown-up (Parents' Corner) or by the teacher for a whole class.
   The translations are written once and kept in js/esdata.js (ES_HINT: sentence templates, ES_GLOSS: key words),
   so there is no machine translation at play time and nothing to pay for. es-review.html lists every line for a
   native speaker to check. Numbers, fractions and names are placeholders: an English hint sentence with '#' for each
   number or fraction and '@' for each name finds its Spanish line, and the same numbers go back in, in order
   (or by position, {0} {1}, when Spanish needs another order). */
const ES_NAMES=new Set(['Mia','Leo','Ava','Noah','Zoe','Sam','Ivy','Max','Lily','Ben','Nora','Eli','Jay','Luz','Omar','Maya','Sofia','Marco','Priya','Jada','Ethan','Ana','Cy','Dee']);
const ES_NUM=/<span class="frac"><span>[^<]*<\/span><span>[^<]*<\/span><\/span>|(?<![A-Za-z\d])\d[\d,]*(?:\.\d+)?[¼½¾⅛⅜⅝⅞⅓⅔⅕⅙]?(?![\d])|[¼½¾⅛⅜⅝⅞⅓⅔⅕⅙]/g;
/* one sentence -> its key and the values taken out of it */
function esKeyOf(s){const nums=[],names=[];
  let k=s.replace(ES_NUM,m=>{nums.push(m);return '#'});
  k=k.replace(/\b[A-Z][a-z]+\b/g,w=>ES_NAMES.has(w)?(names.push(w),'@'):w);
  return {k:k.trim(),nums,names}}
/* sentences: split after . ! ? : when the next one starts with a capital, a tag, a quote, a number or a placeholder */
const esSplit=h=>String(h||'').split(/(?<=[.!?:])\s+(?=[A-Z<"#$¿¡\d¼½¾⅛])/).map(x=>x.trim()).filter(Boolean);
/* a sentence with no English words in it (only numbers and signs) needs no translation */
const esNoWords=s=>!/[A-Za-z]{2,}/.test(s.replace(/<[^>]+>/g,'').replace(/&[a-z]+;/g,''));
function esFill(t,o){let i=0,j=0;if(/\{\d+\}/.test(t))t=t.replace(/\{(\d+)\}/g,(m,n)=>o.nums[+n]??m);else t=t.replace(/#/g,()=>o.nums[i++]??'#');return t.replace(/@/g,()=>o.names[j++]??'@')}
/* the whole hint in Spanish, or null when a sentence is not translated yet */
function esText(h,dict){const D=dict||(typeof ES_HINT!=='undefined'?ES_HINT:{});const out=[];
  for(const s of esSplit(h)){if(esNoWords(s)){out.push(s);continue}const o=esKeyOf(s),t=D[o.k];if(t==null)return null;out.push(esFill(t,o))}
  return out.join(' ')}
/* every sentence key of a text that still needs a Spanish line (used by the tests and the review page) */
const esMissing=(h,dict)=>esSplit(h).filter(s=>!esNoWords(s)).map(s=>esKeyOf(s).k).filter(k=>(dict||ES_HINT)[k]==null);

/* ---------- when it is on ---------- */
function esOn(){if(!G)return false;if(G.settings&&G.settings.es)return true;try{const c=G.cls&&typeof classDoc==='function'?classDoc():null;return !!(c&&c.es)}catch(e){return false}}
/* math, science, riddles and the calendar islands get it; questions mixed from them (daily, review) too */
function esFor(q){if(!q||!S||S.mode==='boss'||S.mode==='test')return false;const id=(q.meta&&q.meta.i)||(S.isl&&S.isl.id);const isl=id&&byId(id);
  if(!isl)return false;return isl.group==='math'||isl.group==='time'||isl.id==='science'||isl.id==='riddle'}

/* ---------- key words: a dotted line under them, tap to see the Spanish word ---------- */
let ES_GL_RX=null;
function esGlossRx(){if(ES_GL_RX)return ES_GL_RX;const ks=Object.keys(typeof ES_GLOSS!=='undefined'?ES_GLOSS:{}).sort((a,b)=>b.length-a.length);
  return ES_GL_RX=ks.length?new RegExp('\\b('+ks.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?:s|es)?\\b','gi'):null}
const esGl=w=>{const L=esGl.L||(esGl.L=Object.fromEntries(Object.entries(ES_GLOSS).map(([k,v])=>[k.toLowerCase(),v])));return L[w.toLowerCase()]||null};
function esGloss(root){const rx=esGlossRx();if(!root||!rx)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('button,input,textarea,select,svg,.esw,[draggable=true],.passage,.lpass')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  const L=[];while(w.nextNode())L.push(w.currentNode);
  for(const n of L){const t=n.nodeValue;rx.lastIndex=0;if(!rx.test(t))continue;rx.lastIndex=0;
    const f=document.createDocumentFragment();let last=0,m;
    while((m=rx.exec(t))){const es=esGl(m[1]);if(!es)continue;f.appendChild(document.createTextNode(t.slice(last,m.index)));
      const s=document.createElement('span');s.className='esw';s.tabIndex=0;s.setAttribute('role','button');s.dataset.es=es;s.textContent=m[0];s.setAttribute('aria-label',`${m[0]}: en español, ${es}`);f.appendChild(s);last=m.index+m[0].length}
    if(!last)continue;f.appendChild(document.createTextNode(t.slice(last)));n.parentNode.replaceChild(f,n)}}
function esTip(el){document.querySelectorAll('.estip').forEach(x=>x.remove());const t=document.createElement('span');t.className='estip';t.lang='es';t.textContent=el.dataset.es;el.appendChild(t);
  clearTimeout(esTip.t);esTip.t=setTimeout(()=>t.remove(),3500)}
document.addEventListener('click',e=>{const w=e.target.closest&&e.target.closest('.esw');if(w){e.stopPropagation();esTip(w)}},true);
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('esw')){e.preventDefault();esTip(e.target)}});

/* ---------- in a round ---------- */
function esShowQ(q){const b=document.getElementById('esBtn'),box=document.getElementById('esBox');if(!b||!box)return;box.hidden=true;box.innerHTML='';
  const on=esOn()&&esFor(q);b.hidden=!on||!q.hint||!!q.teach;if(!on)return;
  esGloss(document.getElementById('prompt'))}
function esOpen(){const q=S&&S.qs[S.i];const box=document.getElementById('esBox');if(!q||!box)return;
  if(!box.hidden){box.hidden=true;return}
  const t=esText(q.hint);box.innerHTML=t?`<b lang="es">Pista:</b> <span lang="es">${t}</span>`:`<b lang="es">Pista:</b> <span>${q.hint}</span><small lang="es">Esta pista todavía no está en español. Toca las palabras subrayadas.</small>`;
  if(!t)esGloss(box);box.hidden=false;if(!S.esUsed){S.esUsed=1;if(typeof stat==='function')stat('es')}}
/* after a first miss the English hint shows; with Spanish help on, the Spanish line goes right under it */
function esAfterHint(q){if(!esOn()||!esFor(q))return;const h=document.getElementById('hint');const t=esText(q.hint);if(!h)return;
  if(t)h.insertAdjacentHTML('beforeend',`<span class="eshint" lang="es"><b>En español:</b> ${t}</span>`);else esGloss(h);
  const box=document.getElementById('esBox');if(box)box.hidden=true}
function esAfterExplain(q){if(!esOn()||!esFor(q))return;esGloss(document.getElementById('feedback'))}
