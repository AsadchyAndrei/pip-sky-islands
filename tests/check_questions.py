"""Generates tens of thousands of questions on every island and difficulty and checks them:
the answer is among the choices, no duplicate or empty choices, no two choices equal in value (1/2 and 2/4),
no 'undefined'/'NaN' text, every question type belongs to exactly one skill, every 'tap the sentence' question
matches exactly one sentence. Run: python3 tests/check_questions.py"""
import json
from serve import *
JS = r"""()=>{
const strip=h=>String(h==null?'':h).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const num=s=>{s=strip(s).replace(/[$,¢ ]/g,'');let m;if(m=s.match(/^(-?\d+) (\d+)\/(\d+)$/))return +m[1]+m[2]/m[3];if(m=s.match(/^(\d+)\/(\d+)$/))return m[1]/m[2];if(/^-?\d*\.?\d+$/.test(s))return +s;return null};
const bad=[],cnt={};const add=(k,key,ex)=>{if(bad.length<200)bad.push(k+' '+key+': '+ex)};
for(const isl of ISLANDS.filter(i=>i.gen&&!i.retired)){
  const N=isl.types>20?3:120;
  for(let t=0;t<isl.types;t++)for(let d=1;d<=3;d++)for(let s=0;s<N;s++){
    let q;const key=isl.id+'#'+t;cnt[isl.id]=(cnt[isl.id]||0)+1;
    try{q=makeQ(isl,t,1e5+s*97+t*13+d,d)}catch(e){add('crash',key,String(e).slice(0,120));continue}
    if(!q){add('null',key,'');continue}
    const all=[q.prompt,q.answer,q.visual,q.explain,q.hint].concat(q.choices||[]).map(x=>typeof x==='object'?JSON.stringify(x):String(x==null?'':x)).join(' | ');
    if(/\bundefined\b|\bNaN\b|\[object|Infinity/.test(strip(all)))add('bad text',key,strip(q.prompt).slice(0,90));
    if(!strip(q.prompt))add('no prompt',key,'');
    if(!q.kind&&(q.answer==null||q.answer===''))add('no answer',key,strip(q.prompt).slice(0,80));
    if(Array.isArray(q.choices)&&q.choices.length&&!q.kind){
      const cs=q.choices.map(c=>String(c));
      if(!cs.includes(String(q.answer)))add('answer not in choices',key,strip(q.prompt).slice(0,80)+' ans='+q.answer+' ch='+cs.join(','));
      if(new Set(cs.map(c=>strip(c))).size!==cs.length)add('duplicate choices',key,strip(q.prompt).slice(0,80)+' ch='+cs.join(','));
      if(cs.some(c=>!strip(c)))add('empty choice',key,strip(q.prompt).slice(0,80));
      const av=num(q.answer);if(av!=null){const eq=cs.filter(c=>c!==String(q.answer)&&num(c)!=null&&Math.abs(num(c)-av)<1e-9);if(eq.length)add('equal value choice',key,strip(q.prompt).slice(0,80)+' ans='+q.answer+' also='+eq.join(','))}
    }
    if(q.kind==='multi'&&!(q.correct&&q.correct.length))add('multi without correct',key,'');
    if(q.kind==='sort'&&q.items.some(it=>!q.bins.some(b=>b.id===it.bin)))add('sort item without bin',key,'');
    if(q.kind==='rank'&&q.order.length!==q.items.length)add('rank order mismatch',key,'');
    if(q.kind==='partab'&&(!q.a.choices.includes(q.a.answer)||!q.b.choices.includes(q.b.answer)))add('part A/B answer missing',key,'');
    if(q.kind==='hilite'&&q.hl.length!==1)add('tap-the-sentence matches '+q.hl.length,key,q.sentText);
    if(q.kind==='yesno'&&!q.rows.length)add('yes/no without rows',key,'');
  }
  const L=skillsOf(isl.id),cov={};L.forEach(s=>s.ts.forEach(t=>cov[t]=(cov[t]||0)+1));
  for(let t=0;t<isl.types;t++)if(cov[t]!==1)add('skill coverage',isl.id+'#'+t,'in '+(cov[t]||0)+' skills');
}
return JSON.stringify({total:Object.values(cnt).reduce((a,b)=>a+b,0),bad})}"""
c = Check('questions')
with sync_playwright() as p:
    b = launch(p); ctx, pg, errs = open_page(b, 800, 600)
    r = json.loads(pg.evaluate(JS))
    print(f"     generated {r['total']} questions")
    for x in r['bad']:
        c.ok(False, x)
    c.ok(not errs, f'page errors: {errs[:3]}')
c.done()
