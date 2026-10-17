"""Math answers agree with themselves: number answers appear in the explanation, 'put in order' answers really are in
order, and no wrong choice has the same value as the answer. Runs every math question type at every difficulty, many seeds."""
from serve import *
c = Check('math answers are consistent')
JS = """(pack)=>{const T=h=>{const d=document.createElement('div');d.innerHTML=String(h??'');d.querySelectorAll('.frac').forEach(f=>{const s=f.querySelectorAll('span');if(s.length>1)f.replaceWith(' '+s[0].textContent+'/'+s[1].textContent+' ')});return d.textContent.replace(/\\s+/g,' ').trim()};
 const val=s=>{s=String(s).replace(/[$,¢]/g,'').trim();let m;if(m=s.match(/^(\\d+) (\\d+)\\/(\\d+)$/))return +m[1]+m[2]/m[3];if(m=s.match(/^(\\d+)\\/(\\d+)$/))return m[1]/m[2];return /^\\d*\\.?\\d+$/.test(s)?+s:NaN};
 const bad=[];const MATH=ISLANDS.filter(i=>i.gen&&i.group==='math');
 for(const isl of MATH)for(let t=0;t<isl.types;t++)for(const d of [1,2,3])for(let s=1;s<=40;s++){let q;try{q=makeQ(isl,t,s*977+t,d)}catch(e){bad.push(`${isl.id}:${t} crash ${e.message}`);continue}if(!q)continue;
   const key=`${isl.id}:${t}:d${d}`;
   if(q.kind==='rank'&&q.order){const v=q.order.map(val);if(v.every(x=>!isNaN(x))){const asc=v.every((x,i)=>!i||x>=v[i-1]),desc=v.every((x,i)=>!i||x<=v[i-1]);const want=(q.lo||'least')==='least';if(want?!asc:!desc)bad.push(`${key} order wrong: ${q.order.join(', ')}`)}}
   if(q.numeric&&q.explain&&typeof q.explain==='string'){const e=T(q.explain).replace(/,/g,''),a=String(q.answer).replace(/,/g,'');if(!new RegExp('(^|[^\\\\d.])'+a.replace('.','\\\\.')+'($|[^\\\\d])').test(e))bad.push(`${key} answer ${q.answer} not in explanation: ${e.slice(0,90)}`)}
   if(Array.isArray(q.choices)&&q.choices.length>1){const v=q.choices.map(x=>val(T(x)));const av=val(T(q.answer));if(!isNaN(av)&&q.choices.filter((x,i)=>!isNaN(v[i])&&Math.abs(v[i]-av)<1e-9).length>1)bad.push(`${key} another choice equals the answer ${q.answer}: ${q.choices.join(' ; ')} | ${T(q.prompt).slice(0,70)}`)}}
 return [...new Set(bad)]}"""
with sync_playwright() as p:
    b = launch(p)
    for pack in ('ca-4', 'ca-3', 'ca-5'):
        ctx, pg, errs = open_page(b, pack=pack)
        bad = pg.evaluate(JS, pack)
        for x in bad[:40]: print('   ', x)
        c.ok(not bad, f'{pack}: {len(bad)} problems')
        ctx.close()
    b.close()
c.done()
