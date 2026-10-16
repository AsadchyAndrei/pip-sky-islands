/* Pip's Sky Islands: 3rd grade math question generators (California / Common Core grade 3).
   Each generator serves one island in the ca-3 pack (content/packs/ca-3.json); question types are listed in GEN (js/islands.js)
   and grouped into skills in content/skills/math.json. Loaded after math.js: uses its helpers (numChoices, pieVis, clockSVG...). */

/* ---------- drawings ---------- */
const G3C=['#ff6b57','#2f9fe0','#38b98a','#e2558f','#ffc23d','#7b6cf0'];
function dotGroups(g,n,shape){const per=Math.min(n,5),rows=Math.ceil(n/per),bw=per*20+16,bh=rows*20+16,cols=Math.min(g,3),W=cols*(bw+12)+6,H=Math.ceil(g/cols)*(bh+12)+6;let s='';
  for(let k=0;k<g;k++){const x=6+(k%cols)*(bw+10),y=6+Math.floor(k/cols)*(bh+10);s+=`<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="${shape==='plate'?bh/2:10}" fill="#fff5d6" stroke="#e09a14" stroke-width="2"/>`;
    for(let i=0;i<n;i++)s+=`<circle cx="${x+18+(i%per)*20}" cy="${y+18+Math.floor(i/per)*20}" r="7.5" fill="${G3C[k%G3C.length]}"/>`}
  return `<svg viewBox="0 0 ${W} ${H}" style="width:${Math.min(420,W*1.15)}px;max-width:100%" role="img" aria-label="${g} groups of ${n}">${s}</svg>`}
function dotArray(r,c){const W=c*24+16,H=r*24+16;let s='';for(let i=0;i<r;i++)for(let j=0;j<c;j++)s+=`<circle cx="${20+j*24}" cy="${20+i*24}" r="8" fill="${G3C[i%G3C.length]}"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:${Math.min(460,W*1.2)}px;max-width:100%" role="img" aria-label="An array with ${r} rows of ${c}">${s}</svg>`}
function gridRect(l,w,cell=26,lab){const W=l*cell+(lab?70:20),H=w*cell+(lab?50:20);let s='';const x0=lab?40:10,y0=lab?34:10;
  for(let i=0;i<w;i++)for(let j=0;j<l;j++)s+=`<rect x="${x0+j*cell}" y="${y0+i*cell}" width="${cell}" height="${cell}" fill="#dff5cf" stroke="#5aa04a" stroke-width="1.5"/>`;
  if(lab)s+=`<text x="${x0+l*cell/2}" y="24" text-anchor="middle" ${FONT} font-size="18" fill="#1f3557">${lab[0]}</text><text x="${x0+l*cell+8}" y="${y0+w*cell/2+6}" ${FONT} font-size="18" fill="#1f3557">${lab[1]}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:${Math.min(480,W)}px;max-width:100%" role="img" aria-label="A rectangle made of unit squares">${s}</svg>`}
/* L-shape: a big rectangle W×H with a corner rectangle cw×ch cut from the top right */
function lShapeSVG(W,H,cw,ch,u=24){const x0=40,y0=30,pts=[[0,0],[W-cw,0],[W-cw,ch],[W,ch],[W,H],[0,H]].map(([x,y])=>`${x0+x*u},${y0+y*u}`).join(' ');
  const t=(x,y,v,a='middle')=>`<text x="${x}" y="${y}" text-anchor="${a}" ${FONT} font-size="17" fill="#1f3557">${v}</text>`;
  return `<svg viewBox="0 0 ${W*u+100} ${H*u+70}" style="width:${Math.min(460,W*u+100)}px;max-width:100%" role="img" aria-label="An L-shaped figure"><polygon points="${pts}" fill="#dff5cf" stroke="#8c5a2c" stroke-width="4" stroke-linejoin="round"/>
    ${t(x0+(W-cw)*u/2,y0-8,(W-cw)+' m')}${t(x0-8,y0+H*u/2+6,H+' m','end')}${t(x0+W*u/2,y0+H*u+24,W+' m')}${t(x0+W*u+8,y0+ch*u+(H-ch)*u/2+6,(H-ch)+' m','start')}</svg>`}
function beakerSVG(v,max,unit='L'){const h=150,y0=20,yv=y0+h-(v/max)*h;let ticks='';for(let k=0;k<=max;k++){const y=y0+h-k/max*h;ticks+=`<line x1="58" y1="${y}" x2="${max>5&&k%2?68:74}" y2="${y}" stroke="#1f3557" stroke-width="2"/>${max>5&&k%2?'':`<text x="80" y="${y+5}" ${FONT} font-size="15" fill="#1f3557">${k} ${unit}</text>`}`}
  return `<svg viewBox="0 0 140 190" style="width:170px" role="img" aria-label="A measuring container filled to ${v} ${unit}"><rect x="20" y="${yv}" width="38" height="${y0+h-yv}" fill="#8fd3f7"/><path d="M20 10 V${y0+h} H58 V10" fill="none" stroke="#1f3557" stroke-width="3"/>${ticks}</svg>`}
/* ruler in inches with quarter marks and a pencil from 0 to len/4 inches */
function rulerSVG(q){const u=54,W=6*u+40;let s=`<rect x="20" y="60" width="${6*u}" height="44" fill="#ffe7a3" stroke="#b07a10" stroke-width="2"/>`;
  for(let k=0;k<=24;k++){const x=20+k*u/4,L=k%4===0?20:k%2===0?14:8;s+=`<line x1="${x}" y1="60" x2="${x}" y2="${60+L}" stroke="#1f3557" stroke-width="${k%4===0?2.5:1.5}"/>`;if(k%4===0)s+=`<text x="${x}" y="98" text-anchor="middle" ${FONT} font-size="14" fill="#1f3557">${k/4}</text>`}
  const x1=20+q*u/4;s+=`<rect x="20" y="22" width="${x1-34}" height="20" rx="4" fill="#ffc23d" stroke="#1f3557" stroke-width="2"/><path d="M${x1-14} 22 L${x1} 32 L${x1-14} 42Z" fill="#f6d7a7" stroke="#1f3557" stroke-width="2"/><path d="M${x1-4} 29 L${x1} 32 L${x1-4} 35Z" fill="#1f3557"/>`;
  return `<svg viewBox="0 0 ${W} 112" style="width:${Math.min(420,W)}px;max-width:100%" role="img" aria-label="A pencil above an inch ruler">${s}</svg>`}
const G3ICON={star:`<svg viewBox="0 0 26 26"><path d="M13 2 L16 10 L24 10 L18 15 L20 23 L13 18 L6 23 L8 15 L2 10 L10 10Z" fill="#ffc23d" stroke="#e09a14" stroke-width="1.2"/></svg>`,
  book:`<svg viewBox="0 0 26 26"><rect x="4" y="4" width="18" height="18" rx="3" fill="#2f9fe0"/><rect x="8" y="7" width="10" height="3" fill="#fff"/></svg>`};
function picGraph(cats,vals,key,icon){return `<div class="picto">${cats.map((c,k)=>`<div><span>${c}</span>${G3ICON[icon].repeat(Math.floor(vals[k]/key))}${vals[k]%key?`<span style="display:inline-block;width:13px;overflow:hidden;vertical-align:middle">${G3ICON[icon]}</span>`:''}</div>`).join('')}<div class="key">Key: ${G3ICON[icon]} = ${key} ${key>1?'books':'book'}</div></div>`}
function barGraphScaled(cats,vals,step,top,what){const H=200,W=90+cats.length*80,y=v=>20+H-v/top*H;let s='';
  for(let v=0;v<=top;v+=step)s+=`<line x1="60" y1="${y(v)}" x2="${W-10}" y2="${y(v)}" stroke="#dfe6ef" stroke-width="1.5"/><text x="52" y="${y(v)+5}" text-anchor="end" ${FONT} font-size="14" fill="#1f3557">${v}</text>`;
  cats.forEach((c,i)=>{const x=78+i*80;s+=`<rect x="${x}" y="${y(vals[i])}" width="44" height="${y(0)-y(vals[i])}" fill="${G3C[i%G3C.length]}" rx="3"/><text x="${x+22}" y="${H+42}" text-anchor="middle" ${FONT} font-size="14" fill="#1f3557">${c}</text>`});
  s+=`<line x1="60" y1="${y(0)}" x2="${W-10}" y2="${y(0)}" stroke="#1f3557" stroke-width="2.5"/><line x1="60" y1="20" x2="60" y2="${y(0)}" stroke="#1f3557" stroke-width="2.5"/>`;
  return `<svg viewBox="0 0 ${W} ${H+56}" style="width:${Math.min(460,W)}px;max-width:100%" role="img" aria-label="Bar graph of ${what}">${s}</svg>`}
/* line plot of lengths in quarter inches: data = array of quarters (e.g. 9 = 2 1/4) */
const qLab=q=>{const w=Math.floor(q/4),r=q%4,f=r===2?'1/2':r?`${r}/4`:'';return w&&f?`${w} ${f}`:w?`${w}`:f};
const qUni=q=>{const w=Math.floor(q/4),r=q%4;return `${w||''}${['','¼','½','¾'][r]}`||'0'};
function linePlotQ(data,lo,hi){const u=200,W=(hi-lo)*u/4+60;const cnt={};data.forEach(q=>cnt[q]=(cnt[q]||0)+1);let s=`<line x1="30" y1="130" x2="${W-30}" y2="130" stroke="#1f3557" stroke-width="2.5"/>`;
  for(let q=lo;q<=hi;q++){const x=30+(q-lo)*u/4;s+=`<line x1="${x}" y1="124" x2="${x}" y2="136" stroke="#1f3557" stroke-width="2"/><text x="${x}" y="156" text-anchor="middle" ${FONT} font-size="15" fill="#1f3557">${qUni(q)}</text>`;
    for(let k=0;k<(cnt[q]||0);k++)s+=`<text x="${x}" y="${116-k*20}" text-anchor="middle" ${FONT} font-size="20" fill="#e2558f">X</text>`}
  return `<svg viewBox="0 0 ${W} 166" style="width:${Math.min(480,W)}px;max-width:100%" role="img" aria-label="Line plot of lengths in inches">${s}</svg>`}
function fracBar(n,d,col='#e2558f',w=260){const u=w/d;let s='';for(let i=0;i<d;i++)s+=`<rect x="${4+i*u}" y="4" width="${u}" height="34" fill="${i<n?col:'#fff'}" stroke="#1f3557" stroke-width="2"/>`;
  return `<svg viewBox="0 0 ${w+8} 42" style="width:${w+8}px;max-width:100%" role="img" aria-label="Bar cut into ${d} equal parts, ${n} shaded">${s}</svg>`}
const QUADS={square:{pts:[[20,20],[80,20],[80,80],[20,80]],name:'square'},rectangle:{pts:[[8,28],[92,28],[92,72],[8,72]],name:'rectangle'},
  rhombus:{pts:[[8,72],[58,72],[92,28],[42,28]],name:'rhombus'},trapezoid:{pts:[[30,25],[70,25],[92,75],[8,75]],name:'trapezoid'},
  parallelogram:{pts:[[28,25],[94,25],[72,75],[6,75]],name:'parallelogram'},kite:{pts:[[50,6],[78,38],[50,94],[22,38]],name:'kite'},
  triangle:{pts:[[50,10],[90,85],[10,85]],name:'triangle'},pentagon:{pts:[[50,6],[92,38],[76,90],[24,90],[8,38]],name:'pentagon'},hexagon:{pts:[[28,10],[72,10],[94,50],[72,90],[28,90],[6,50]],name:'hexagon'}};
const quadSVG=(k,col='#8fd3f7')=>`<svg viewBox="0 0 100 100" style="width:120px" role="img" aria-label="A ${QUADS[k].name}"><polygon points="${QUADS[k].pts.map(p=>p.join(',')).join(' ')}" fill="${col}" stroke="#1f3557" stroke-width="3" stroke-linejoin="round"/></svg>`;

/* ---------- Digit Cliffs: place value, rounding (3.NBT.1) ---------- */
function genPlace3(t){const n=R(Dv(101,120,300),999),d=[...String(n)].map(Number);
  if(t===0){const i=R(0,2),place=['hundreds','tens','ones'][i],val=d[i]*10**(2-i);if(!d[i])return genPlace3(0);
    return {prompt:`What is the <b>value</b> of the <b>${d[i]}</b> in <b>${n}</b>?`,...numChoices(val,[d[i],d[i]*10,d[i]*100,n].filter(x=>x!==val)),hint:`The ${d[i]} is in the ${place} place.`,explain:`In ${n}, the ${d[i]} is in the ${place} place, so it is worth <b>${val}</b>.`}}
  if(t===1){let m;do{m=R(Dv(12,101,310),Dv(98,989,989))}while(m%10===0||m%10===5&&DIFF===1);const down=m-m%10,up=down+10,ans=m%10>=5?up:down;
    return {prompt:`Round <b>${m}</b> to the nearest <b>ten</b>.`,visual:roundLine(m,down,up),...numChoices(ans,[ans===up?down:up,m-m%100,Math.round(m/100)*100,ans+10]),hint:`Is ${m} closer to ${down} or to ${up}? If the ones digit is 5 or more, round up.`,explain:`The ones digit is ${m%10}${m%10>=5?', 5 or more, so round up':', less than 5, so round down'}: <b>${ans}</b>.`}}
  if(t===2){let m;do{m=R(110,980)}while(m%100===0);const down=m-m%100,up=down+100,ans=m%100>=50?up:down;
    return {prompt:`Round <b>${m}</b> to the nearest <b>hundred</b>.`,visual:roundLine(m,down,up),...numChoices(ans,[ans===up?down:up,Math.round(m/10)*10,ans+100].filter(x=>x>0)),hint:`Look at the tens digit. 5 or more? Round up.`,explain:`The tens digit is ${Math.floor(m/10)%10}${m%100>=50?', 5 or more, so round up':', less than 5, so round down'}: <b>${ans}</b>.`}}
  if(t===3){const [h,te,o]=d;if(!te||!o)return genPlace3(3);
    return {prompt:`Which number is <b>${h*100} + ${te*10} + ${o}</b>?`,...numChoices(n,[h*100+o*10+te,o*100+te*10+h,h*100+te+o,te*100+h*10+o].filter(x=>x!==n&&x>99)),hint:`Put each part in its place: hundreds, tens, ones.`,explain:`${h} hundreds, ${te} tens and ${o} ones make <b>${n}</b>.`}}
  if(t===4){let a,b;do{a=R(200,899);b=R(200,899)}while(Math.abs(a-b)<30);const s=a+b,ra=Math.round(a/100)*100,rb=Math.round(b/100)*100,est=ra+rb;
    return {prompt:`Pip adds <b>${a} + ${b}</b>. Round each number to the nearest hundred. About how much is the sum?`,...numChoices(est,[est+100,est-100,s,Math.floor(a/100)*100+Math.floor(b/100)*100].filter(x=>x!==est&&x>0)),hint:`Round ${a} and ${b} first, then add the rounded numbers.`,explain:`${a} rounds to ${ra} and ${b} rounds to ${rb}. ${ra} + ${rb} = <b>${est}</b>. (The exact sum is ${s}, close to ${est}.)`}}
  const a=R(150,899),b=R(150,899);if(a===b)return genPlace3(5);const big=Math.max(a,b);
  return {prompt:`Which number is <b>greater</b>?`,choices:shuffle([String(a),String(b)]),answer:String(big),hint:`Compare the hundreds first. If they match, compare the tens.`,explain:`Compare digit by digit from the left: <b>${big}</b> is greater.`}}

/* ---------- Carry Canyon: add and subtract within 1000 (3.NBT.2), two-step problems (3.OA.8) ---------- */
const NAMES3=['Mia','Leo','Ava','Sam','Nora','Eli','Zoe','Jay','Luz','Omar'];
function genAddSub3(t){
  if(t===0){let a,b;do{a=R(Dv(105,150,250),Dv(499,699,799));b=R(Dv(105,150,150),999-a)}while(b<100||(a%10)+(b%10)<10&&DIFF>1);const s=a+b;
    return {prompt:`${a} + ${b} = ?`,...numChoices(s,[s-10,s+10,s-100,s+1]),hint:`Add the ones, then the tens, then the hundreds. 10 or more in a place? Regroup.`,explain:`${a} + ${b} = <b>${s}</b>.`}}
  if(t===1){let a,b;do{a=R(Dv(300,300,400),Dv(899,999,999));b=R(110,a-50)}while(a%10>=b%10&&DIFF>1);const s=a-b;
    return {prompt:`${a} − ${b} = ?`,...numChoices(s,[s+10,s-10,s+100,Math.abs(a%10-b%10)+Math.floor(a/10)*10-Math.floor(b/10)*10].filter(x=>x!==s)),hint:`Start with the ones. Not enough ones? Borrow 1 ten.`,explain:`${a} − ${b} = <b>${s}</b>. Check: ${s} + ${b} = ${a}.`}}
  if(t===2){const [x,y]=[pick(NAMES3),pick(NAMES3.slice(5))],a=R(120,480),b=R(110,450),sub=coin();
    if(sub){const tot=a+b;return {prompt:`The school library had <b>${tot}</b> books. Students borrowed <b>${b}</b> books. How many books are still on the shelves?`,...numChoices(a,[tot+b,a+10,a-10,b]),hint:`Some books left the shelves. Subtract.`,explain:`${tot} − ${b} = <b>${a}</b> books.`}}
    return {prompt:`${x} collected <b>${a}</b> cans. ${y} collected <b>${b}</b> cans. How many cans did they collect in all?`,...numChoices(a+b,[Math.abs(a-b),a+b+10,a+b-100,a+b+1]),hint:`"In all" means put together. Add.`,explain:`${a} + ${b} = <b>${a+b}</b> cans.`}}
  if(t===3){const a=R(150,600),b=R(100,350),s=a+b;
    return {prompt:`What number goes in the box? <b>${a} + □ = ${s}</b>`,...numChoices(b,[s+a,b+10,b-10,s]),hint:`Think: ${s} − ${a} = ?`,explain:`${s} − ${a} = <b>${b}</b>. Check: ${a} + ${b} = ${s}.`}}
  const p=R(12,40)*5,q=R(4,9),c=R(2,5),tot=p+q*c,story=pick([
    [`A class has <b>$${tot}</b> for a trip. Bus tickets cost <b>$${p}</b>. Then they buy <b>${c}</b> snacks that cost <b>$${q}</b> each. How much money is left?`,tot-p-q*c],
    [`Pip had <b>${tot}</b> stickers. He gave away <b>${p}</b>. Then he put the rest into <b>${c}</b> equal pages. How many stickers on each page?`,null]]);
  if(story[1]===null){const left=q*c;return {prompt:story[0],...numChoices(q,[left,tot-p,q+1,c]),hint:`Step 1: how many are left after giving some away? Step 2: share them equally.`,explain:`${tot} − ${p} = ${left}. Then ${left} ÷ ${c} = <b>${q}</b> stickers on each page.`}}
  return {prompt:story[0],...numChoices(story[1]||tot-p-q*c,[tot-p,tot-q*c,q*c,tot-p-q]),hint:`Step 1: subtract the tickets. Step 2: find the cost of the snacks and subtract it too.`,explain:`$${tot} − $${p} = $${tot-p}. Snacks: ${c} × $${q} = $${q*c}. $${tot-p} − $${q*c} = <b>$${tot-p-q*c}</b>.`}}

/* ---------- Times Meadow: meaning of multiplication, facts, properties (3.OA.1, 3, 4, 5, 7; 3.NBT.3) ---------- */
function genMult3(t){const a=R(2,Dv(5,9,10)),b=R(2,Dv(5,9,10)),p=a*b;
  if(t===0)return {prompt:`How many dots in all?`,visual:dotGroups(a,b),...numChoices(p,[a+b,p+b,p-b,p+1]),hint:`There are ${a} groups with ${b} in each group.`,explain:`${a} groups of ${b}: ${a} × ${b} = <b>${p}</b>.`};
  if(t===1)return {prompt:`Which multiplication matches this array?`,visual:dotArray(a,b),...strChoices(`${a} × ${b}`,[`${a} + ${b}`,`${a} × ${b+1}`,`${a+1} × ${b}`]),hint:`Count the rows, then count how many are in each row.`,explain:`${a} rows with ${b} in each row: <b>${a} × ${b}</b> = ${p}.`};
  if(t===2)return {prompt:`${a} × ${b} = ?`,...numChoices(p,[p+a,p-a,p+b,(a+1)*b,a+b]),hint:`Skip-count by ${b}, ${a} times. Or use a fact you know: ${a} × ${b-1} = ${a*(b-1)}, then add ${a}.`,explain:`${a} × ${b} = <b>${p}</b>.`};
  if(t===3){const k=R(2,9),m=R(2,9)*10,ans=k*m;return {prompt:`${k} × ${m} = ?`,...numChoices(ans,[k*m/10,ans*10,ans+10,k+m]),hint:`${k} × ${m/10} tens = how many tens?`,explain:`${k} × ${m/10} = ${k*m/10}, so ${k} × ${m/10} tens = ${k*m/10} tens = <b>${ans}</b>.`}}
  if(t===4){const box=coin();return {prompt:box?`What number goes in the box? <b>${a} × □ = ${p}</b>`:`What number goes in the box? <b>□ × ${b} = ${p}</b>`,...numChoices(box?b:a,[p-a,(box?b:a)+1,(box?b:a)-1,box?a:b].filter(x=>x>0)),hint:`Think: what times ${box?a:b} makes ${p}? Or divide ${p} by ${box?a:b}.`,explain:`${a} × ${b} = ${p}, so the box is <b>${box?b:a}</b>.`}}
  if(t===5){const k=R(0,2);
    if(k===0)return {prompt:`<b>${a} × ${b} = ${p}</b>. Which fact must also be true?`,...strChoices(`${b} × ${a} = ${p}`,[`${a} + ${b} = ${p}`,`${b} × ${a} = ${p+b}`,`${a} × ${a} = ${p}`].filter(x=>x!==`${a} × ${a} = ${p}`||a!==b)),hint:`You can switch the order of the factors.`,explain:`Switching the order does not change the product: <b>${b} × ${a} = ${p}</b>.`};
    if(k===1){const c=R(2,5);return {prompt:`Which is the same as <b>${a} × ${b} × ${c}</b>?`,...strChoices(`${a} × ${b*c}`,[`${a+b} × ${c}`,`${a} × ${b+c}`,`${a*b} + ${c}`]),hint:`Multiply ${b} × ${c} first. You can group factors in any order.`,explain:`${b} × ${c} = ${b*c}, so ${a} × ${b} × ${c} = <b>${a} × ${b*c}</b> = ${a*b*c}.`}}
    const b1=R(2,5),b2=pick([2,3,4,5].filter(x=>x!==b1)),bb=b1+b2,pp=a*bb;return {prompt:`Pip knows <b>${a} × ${b1} = ${a*b1}</b> and <b>${a} × ${b2} = ${a*b2}</b>. What is <b>${a} × ${bb}</b>?`,...numChoices(pp,[a*b1+b2,pp+a,pp-a,a+bb]),hint:`${bb} = ${b1} + ${b2}. Add the two products.`,explain:`${a} × ${bb} = ${a} × ${b1} + ${a} × ${b2} = ${a*b1} + ${a*b2} = <b>${pp}</b>.`}}
  if(t===6){const [s,u]=pick([[`There are <b>${a}</b> bags with <b>${b}</b> apples in each bag. How many apples in all?`,'apples'],[`A garden has <b>${a}</b> rows of <b>${b}</b> carrots. How many carrots?`,'carrots'],[`Each spider has 8 legs. How many legs do <b>${a}</b> spiders have?`,'legs']]);
    const B=/spider/.test(s)?8:b,P=a*B;return {prompt:s,...numChoices(P,[a+B,P+B,P-a,P+1]),hint:`Equal groups: multiply the number of groups by how many in each group.`,explain:`${a} × ${B} = <b>${P}</b> ${u}.`}}
  return {prompt:`What could <b>${a} × ${b}</b> mean?`,...strChoices(`${a} groups with ${b} in each group`,[`${a} plus ${b} more`,`${a} taken away from ${b}`,`${a*b} groups of ${a}`]),hint:`× means "groups of".`,explain:`${a} × ${b} means <b>${a} equal groups of ${b}</b> (${p} in all).`}}

/* ---------- Sharing Shore: meaning of division, facts, fact families (3.OA.2, 3, 4, 6, 7) ---------- */
function genDiv3(t){const d=R(2,Dv(5,9,10)),q=R(2,Dv(5,9,10)),n=d*q;
  if(t===0)return {prompt:`<b>${n}</b> cookies are shared equally on <b>${d}</b> plates. How many cookies go on each plate?`,visual:dotGroups(d,q,'plate'),...numChoices(q,[n-d,q+1,q-1,d].filter(x=>x!==q)),hint:`Deal the cookies one at a time onto the plates and count one plate.`,explain:`${n} ÷ ${d} = <b>${q}</b> on each plate.`};
  if(t===1)return {prompt:`${n} ÷ ${d} = ?`,...numChoices(q,[q+1,q-1,d,n-d].filter(x=>x!==q)),hint:`Think of multiplication: ${d} × ? = ${n}.`,explain:`${d} × ${q} = ${n}, so ${n} ÷ ${d} = <b>${q}</b>.`};
  if(t===2)return {prompt:`Which multiplication fact helps you solve <b>${n} ÷ ${d}</b>?`,...strChoices(`${d} × ${q} = ${n}`,[`${d} + ${q} = ${d+q}`,`${n} × ${d} = ${n*d}`,`${d} × ${q+1} = ${d*(q+1)}`]),hint:`Division undoes multiplication. Find the fact with ${d} and ${n}.`,explain:`${d} × ${q} = ${n}, so ${n} ÷ ${d} = ${q}. The fact is <b>${d} × ${q} = ${n}</b>.`};
  if(t===3){const box=coin();return {prompt:box?`What number goes in the box? <b>${n} ÷ □ = ${q}</b>`:`What number goes in the box? <b>□ ÷ ${d} = ${q}</b>`,...numChoices(box?d:n,box?[q,d+1,d-1,n-q]:[q+d,n+d,n-d,q*(d+1)]),hint:box?`What times ${q} equals ${n}?`:`Multiply: ${d} × ${q}.`,explain:box?`${n} ÷ ${d} = ${q}, so the box is <b>${d}</b>.`:`${d} × ${q} = ${n}, so <b>${n}</b> ÷ ${d} = ${q}.`}}
  if(t===4){const k=R(0,2),s=([`Ms. Lee has <b>${n}</b> pencils. She puts <b>${d}</b> pencils in each cup. How many cups does she need?`,`<b>${n}</b> students line up in teams of <b>${d}</b>. How many teams are there?`,`A rope is <b>${n}</b> feet long. Pip cuts it into pieces that are <b>${d}</b> feet long. How many pieces?`])[k];
    return {visual:[scenePackInto(n,d,'crayon','in a cup'),scenePackInto(n,d,'student','in a team'),sceneRope(`${n} ft`,`${d} ft`)][k],prompt:s,...numChoices(q,[n-d,q+1,q-1,d*2].filter(x=>x!==q)),hint:`How many groups of ${d} fit in ${n}?`,explain:`${n} ÷ ${d} = <b>${q}</b>, because ${q} × ${d} = ${n}.`}}
  if(t===5)return {prompt:`What could <b>${n} ÷ ${d}</b> mean?`,...strChoices(`${n} things shared into ${d} equal groups`,[`${n} things and ${d} more`,`${d} groups of ${n}`,`${n} take away ${d}`]),hint:`÷ means sharing equally.`,explain:`${n} ÷ ${d} means <b>${n} shared into ${d} equal groups</b> (${q} in each).`};
  return {prompt:`These facts go together: <b>${d} × ${q} = ${n}</b>, <b>${q} × ${d} = ${n}</b>, <b>${n} ÷ ${d} = ${q}</b>. Which fact is <b>missing</b> from the family?`,...strChoices(`${n} ÷ ${q} = ${d}`,[`${n} − ${q} = ${n-q}`,`${d} ÷ ${q} = ${n}`,`${n} × ${q} = ${d}`]),hint:`A fact family uses the same three numbers: ${d}, ${q} and ${n}.`,explain:`The last fact divides by the other factor: <b>${n} ÷ ${q} = ${d}</b>.`}}

/* ---------- Pie Peak: unit fractions, number lines, equivalence, comparing (3.NF.1-3, 3.G.2) ---------- */
function genFrac3(t){const den=pick(Dv([2,3,4],[2,3,4,6,8],[3,4,6,8])),num=R(1,den-1);
  if(t===0){const bar=coin();return {prompt:`What fraction of the ${bar?'bar':'circle'} is shaded?`,visual:bar?fracBar(num,den):pieVis(num,den),...strChoices(`${num}/${den}`,[`${den-num}/${den}`,`${num}/${den+1}`,`${den}/${num}`,`1/${num}`].filter(x=>{const [p,q]=x.split('/').map(Number);return p*den!==q*num})),render:fracText,hint:`Bottom number: how many equal parts. Top number: how many are shaded.`,explain:`${den} equal parts, ${num} shaded: ${frac(num,den)}.`}}
  if(t===1)return {kind:'numline',max:1,den,target:num,answer:`${num}/${den}`,prompt:`Put Pip's flag at <b>${fracText(`${num}/${den}`)}</b> on the number line.`,hint:`The space from 0 to 1 is cut into ${den} equal jumps. Count ${num} jump${num>1?'s':''} from 0.`,explain:`Each jump is ${frac(1,den)}. ${num} jumps from 0 is ${frac(num,den)}.`};
  if(t===2){const [a,b]=pick([[1,2],[1,3],[2,3],[1,4],[3,4]]),k=b===2?pick([2,3,4]):2,eq=`${a*k}/${b*k}`;
    return {prompt:`The two bars are the same size. Which fraction is <b>equal</b> to ${frac(a,b)}?`,visual:`<div>${fracBar(a,b)}</div><div>${fracBar(a*k,b*k,'#2f9fe0')}</div>`,...strChoices(eq,[`${a}/${b*k}`,`${a*k}/${b}`.replace(/^(\d+)\/\1$/,'1/1'),`${a+1}/${b*k}`,`${a*k+1}/${b*k}`].filter(x=>x!==eq)),render:fracText,hint:`Look at how much of each bar is shaded. Same amount means equal.`,explain:`Both bars are shaded the same amount, so ${frac(a,b)} = ${frac(a*k,b*k)}.`}}
  if(t===3){const k=R(0,2);
    if(k===0){const d=pick([2,3,4,6,8]);return {prompt:`Which fraction is equal to <b>1 whole</b>?`,...strChoices(`${d}/${d}`,[`1/${d}`,`${d}/1`,`${d-1}/${d}`]),render:fracText,hint:`One whole means all the parts are shaded.`,explain:`${frac(d,d)} means ${d} parts out of ${d}: the whole thing. <b>${frac(d,d)} = 1</b>.`}}
    if(k===1){const w=R(2,6);return {prompt:`${frac(w,1)} = ?`,...numChoices(w,[1,w+1,w*2].filter(x=>x!==w)),hint:`${frac(w,1)} means ${w} wholes, each cut into 1 piece.`,explain:`${frac(w,1)} = <b>${w}</b>. A number over 1 is just that many wholes.`}}
    const d=pick([2,3,4]),w=R(2,3);return {prompt:`Which fraction is equal to <b>${w}</b>?`,...strChoices(`${w*d}/${d}`,[`${w}/${d}`,`${d}/${w*d}`,`${w*d}/${w*d}`]),render:fracText,hint:`${w} wholes, each cut into ${d} parts. How many parts in all?`,explain:`${w} wholes × ${d} parts = ${w*d} parts, so <b>${frac(w*d,d)} = ${w}</b>.`}}
  if(t===4){const d=pick([4,6,8]);let a,b;do{a=R(1,d-1);b=R(1,d-1)}while(a===b);const big=Math.max(a,b);
    return {prompt:`Which fraction is <b>greater</b>?`,visual:`<div>${fracBar(a,d)}</div><div>${fracBar(b,d,'#2f9fe0')}</div>`,choices:shuffle([`${a}/${d}`,`${b}/${d}`]),answer:`${big}/${d}`,render:fracText,hint:`The parts are the same size. Which has more parts?`,explain:`Same size parts (${frac(1,d)}): ${big} parts is more, so <b>${frac(big,d)}</b> is greater.`}}
  if(t===5){const n=pick([1,1,2,3]);let d1,d2;do{d1=pick([2,3,4,6,8]);d2=pick([2,3,4,6,8])}while(d1===d2||n>=Math.min(d1,d2));const big=d1<d2?d1:d2;
    return {prompt:`Which fraction is <b>greater</b>?`,visual:`<div>${fracBar(n,d1)}</div><div>${fracBar(n,d2,'#2f9fe0')}</div>`,choices:shuffle([`${n}/${d1}`,`${n}/${d2}`]),answer:`${n}/${big}`,render:fracText,hint:`Same number of parts. Fewer parts in the whole means each part is bigger.`,explain:`Both have ${n} part${n>1?'s':''}. Cutting into ${big} parts makes bigger parts than cutting into ${big===d1?d2:d1}, so <b>${frac(n,big)}</b> is greater.`}}
  if(t===6)return {kind:'shade',parts:den,need:num,answer:`${num}/${den}`,prompt:`Tap the bar to shade <b>${frac(num,den)}</b> of it.`,hint:`The bar has ${den} equal parts. Shade ${num}.`,explain:`${frac(num,den)} means ${num} of the ${den} equal parts.`};
  const d=pick([2,3,4,6,8]);return {prompt:`A rectangle is cut into <b>${d} equal parts</b>. What fraction of the whole is <b>each part</b>?`,visual:fracBar(1,d,'#ffc23d'),...strChoices(`1/${d}`,[`${d}/1`,`1/${d+1}`,`${d-1}/${d}`].filter(x=>x!==`1/${d}`)),render:fracText,hint:`Each of the ${d} equal parts is one out of ${d}.`,explain:`Each part is <b>${frac(1,d)}</b> of the whole area.`}}

/* ---------- Fence Farm: area and perimeter (3.MD.5-8) ---------- */
function genArea3(t){const w=R(2,Dv(4,6,7)),l=R(w+1,Dv(6,8,10)),A=l*w,P=2*(l+w);
  if(t===0)return {prompt:`Each square is 1 square unit. What is the <b>area</b> of the rectangle?`,visual:gridRect(l,w),unit:'square units',...numChoices(A,[P,l+w,A+l,A-w]),hint:`Count the squares, or count rows: ${w} rows of ${l}.`,explain:`${w} rows of ${l} squares: ${w} × ${l} = <b>${A} square units</b>.`};
  if(t===1)return {prompt:`What is the <b>area</b> of the rug?`,visual:rectVis(l,w,`${l} ft`,`${w} ft`),unit:'sq ft',...numChoices(A,[P,l+w,A+l]),hint:`Area = length × width.`,explain:`${l} × ${w} = <b>${A} square feet</b>.`};
  if(t===2){const W=R(5,8),H=R(4,7),cw=R(2,W-2),ch=R(2,H-2),ans=W*H-cw*ch;
    return {prompt:`What is the <b>area</b> of this garden? (Split it into two rectangles.)`,visual:lShapeSVG(W,H,cw,ch),unit:'sq m',...numChoices(ans,[W*H,2*(W+H),ans+cw,ans-ch]),hint:`Split it into two rectangles, find each area, then add.`,explain:`Left part: ${W-cw} × ${H} = ${(W-cw)*H}. Right part: ${cw} × ${H-ch} = ${cw*(H-ch)}. Total: <b>${ans} square meters</b>.`}}
  if(t===3){const b1=R(3,6),b2=R(2,5),h=R(3,7);
    return {prompt:`A rectangle is <b>${h}</b> by <b>${b1+b2}</b>. Pip splits the long side into <b>${b1} + ${b2}</b>. Which shows the area?`,...strChoices(`${h} × ${b1} + ${h} × ${b2}`,[`${h} × ${b1} + ${b2}`,`${h} + ${b1} + ${b2}`,`${h} × ${b1} × ${b2}`]),hint:`Two smaller rectangles: ${h} × ${b1} and ${h} × ${b2}. Add them.`,explain:`${h} × ${b1+b2} = <b>${h} × ${b1} + ${h} × ${b2}</b> = ${h*b1} + ${h*b2} = ${h*(b1+b2)}.`}}
  if(t===4){const sides=coin()?[l,w,l,w]:[R(3,9),R(3,9),R(3,9),R(3,9),R(3,9)],ans=sides.reduce((a,b)=>a+b,0);
    return {prompt:sides.length===4?`What is the <b>perimeter</b> of the rug?`:`A garden has 5 sides: <b>${sides.join(' m, ')} m</b>. What is its <b>perimeter</b>?`,visual:sides.length===4?rectVis(l,w,`${l} ft`,`${w} ft`):'',unit:sides.length===4?'ft':'m',...numChoices(ans,sides.length===4?[A,l+w,ans+2]:[ans+3,ans-2,ans+10]),hint:`Perimeter is the distance around: add every side.`,explain:`${sides.join(' + ')} = <b>${ans}</b>.`}}
  if(t===5)return {visual:sceneRect(l,w,'cm',{qw:1,label:`perimeter ${P} cm`,fill:'#dff3ff'}),prompt:`A rectangle has a perimeter of <b>${P} cm</b>. One side is <b>${w} cm</b>. How long is the other side?`,unit:'cm',...numChoices(l,[P-w,P/2,l+1,P-2*w]),hint:`The two ${w} cm sides use ${2*w} cm. Split the rest between the other two sides.`,explain:`${P} − ${w} − ${w} = ${P-2*w}. ${P-2*w} ÷ 2 = <b>${l} cm</b>.`};
  const opts=[[1,12],[2,6],[3,4]],pick2=pick(opts),[x,y]=pick2,ans=`${x} by ${y}`;
  return {prompt:`Each rectangle has an area of 12 square units. Which one has a perimeter of <b>${2*(x+y)} units</b>?`,...strChoices(ans,opts.filter(o=>o!==pick2).map(o=>`${o[0]} by ${o[1]}`).concat(['4 by 4'])),hint:`Perimeter = 2 × (length + width). Try each one.`,explain:`${x} by ${y}: 2 × (${x} + ${y}) = <b>${2*(x+y)}</b>. Same area, different perimeters!`}}

/* ---------- Clock Cove: time to the minute and elapsed time (3.MD.1) ---------- */
function genTime3(t){let h=R(1,12),m=R(0,59);
  if(t===0){if(m%5===0)m=(m+R(1,4))%60;const near=[tf(h,(m+5)%60),tf(wrapH(h+1),m),tf(h,(m+55)%60),tf(m===0?12:Math.max(1,Math.round(m/5))||12,(h*5)%60)];
    return {prompt:`What time does the clock show?`,visual:clockSVG(h,m,250),...strChoices(tf(h,m),near.filter(x=>x!==tf(h,m))),hint:`Count by 5s to the last number the long hand passed, then count on by 1s.`,explain:`The long hand is ${m%5} small mark${m%5>1?'s':''} past the ${Math.floor(m/5)||12}: ${Math.floor(m/5)*5} + ${m%5} = ${m} minutes. Time: <b>${tf(h,m)}</b>.`}}
  if(t===1){m=R(0,11)*5;while(h===12&&m===0){h=R(1,11)}return {kind:'setclock',target:{h,m},prompt:`Set the clock to <span class="lcd sm">${tf(h,m)}</span>.`,hint:`Set the hour first, then press +5 until the long hand points at the ${m===0?12:m/5}.`,explain:`For ${tf(h,m)}, the long hand points at the ${m===0?12:m/5}.`}}
  const d=R(Dv(5,10,15),Dv(30,45,55));m=R(0,11)*5;
  if(t===2){const end=addMin(h,m,d);return {visual:sceneClocks(tf(h,m),end,d,'mins'),prompt:`Recess starts at <b>${tf(h,m)}</b> and ends at <b>${end}</b>. How many minutes long is recess?`,...numChoices(d,[d+5,d-5,d+10,60-d].filter(x=>x>0&&x!==d)),unit:'minutes',hint:`Count on from ${tf(h,m)} to ${end}, by 5s then 1s.`,explain:`From ${tf(h,m)} to ${end} is <b>${d} minutes</b>.`}}
  if(t===3){const end=addMin(h,m,d);return {prompt:`Pip starts painting at <b>${tf(h,m)}</b>. He paints for <b>${d} minutes</b>. What time does he finish?`,visual:clockSVG(h,m,200),...strChoices(end,[addMin(h,m,d+10),addMin(h,m,d-5),addMin(h,m,d+60),tf(h,(m+d)%60)].filter(x=>x!==end)),hint:`Add the minutes. Past 60? That's the next hour.`,explain:`${tf(h,m)} + ${d} minutes = <b>${end}</b>.`}}
  if(t===4){const end=addMin(h,m,d),start=tf(h,m);return {visual:sceneClocks(start,end,d,'start'),prompt:`The movie ended at <b>${end}</b>. It lasted <b>${d} minutes</b>. When did it start?`,...strChoices(start,[addMin(h,m,2*d),addMin(h,m,10),addMin(h,m,-10)].filter(x=>x!==start&&x!==end)),hint:`Count back ${d} minutes from ${end}.`,explain:`${end} minus ${d} minutes is <b>${start}</b>.`}}
  const a=R(5,25),b=R(5,30),tot=a+b;return {prompt:`Leo reads for <b>${a} minutes</b> before dinner and <b>${b} minutes</b> after dinner. How many minutes does he read in all?`,...numChoices(tot,[Math.abs(a-b),tot+5,tot-5,tot+10]),unit:'minutes',hint:`Join the two times: add.`,explain:`${a} + ${b} = <b>${tot} minutes</b>.`}}

/* ---------- Measure Mine: liquid volume, mass, length to 1/4 inch (3.MD.2, 3.MD.4) ---------- */
const MASS3=[['an apple','150 grams','150 kilograms'],['a bike','12 kilograms','12 grams'],['a paper clip','1 gram','1 kilogram'],['a dog','20 kilograms','20 grams'],['a pencil','5 grams','5 kilograms'],['a watermelon','5 kilograms','5 grams']];
const VOL3=[['a bathtub','150 liters','150 milliliters'],['a spoon','5 milliliters','5 liters'],['a juice box','200 milliliters','200 liters'],['a fish tank','40 liters','40 milliliters'],['a water bottle','1 liter','1 milliliter']];
function genMeasure3(t){
  if(t===0){const max=pick([5,10]),v=R(1,max-1);return {prompt:`How much water is in the container?`,visual:beakerSVG(v,max),unit:'liters',...numChoices(v,[v+1,v-1,max,max-v].filter(x=>x>0&&x!==v)),hint:`Look at the top of the water. Which mark is it on?`,explain:`The water reaches the ${v} L mark: <b>${v} liters</b>.`}}
  if(t===1){const vol=coin(),[thing,good,bad]=pick(vol?VOL3:MASS3);return {prompt:vol?`About how much liquid does <b>${thing}</b> hold?`:`About how much does <b>${thing}</b> weigh?`,choices:shuffle([good,bad]),answer:good,hint:vol?`A milliliter is a few drops. A liter fills a big water bottle.`:`A gram is about a paper clip. A kilogram is about a big book.`,explain:`${thing[0].toUpperCase()+thing.slice(1)}: about <b>${good}</b>.`}}
  if(t===2){if(coin()){const a=R(120,600),b=R(80,400);return {prompt:`A bag of rice weighs <b>${a+b} grams</b>. Pip cooks <b>${b} grams</b>. How much rice is left?`,unit:'grams',...numChoices(a,[a+b+b,a+10,b,a-10]),hint:`Subtract what was cooked.`,explain:`${a+b} − ${b} = <b>${a} grams</b>.`}}
    const x=R(3,25),y=R(3,25);return {prompt:`One box of books weighs <b>${x} kilograms</b>. Another box weighs <b>${y} kilograms</b>. How much do they weigh together?`,unit:'kilograms',...numChoices(x+y,[Math.abs(x-y)||x+y+2,x+y+1,x+y-1,x*y]),hint:`Together means add.`,explain:`${x} + ${y} = <b>${x+y} kilograms</b>.`}}
  if(t===3){const c=R(2,9),k=R(2,8),mul=coin();
    return mul?{prompt:`One pitcher holds <b>${c} liters</b>. How many liters do <b>${k}</b> pitchers hold?`,unit:'liters',...numChoices(c*k,[c+k,c*k+c,c*k-k]),hint:`Equal groups: multiply.`,explain:`${k} × ${c} = <b>${c*k} liters</b>.`}
      :{visual:scenePour(c*k,k,'drop','liters','bucket'),prompt:`Pip pours <b>${c*k} liters</b> of water equally into <b>${k}</b> buckets. How many liters in each bucket?`,unit:'liters',...numChoices(c,[c*k-k,c+1,k].filter(x=>x!==c)),hint:`Share equally: divide.`,explain:`${c*k} ÷ ${k} = <b>${c} liters</b>.`}}
  if(t===4){const q=R(5,22),lab=qLab(q),wrong=[qLab(q+1),qLab(q-1),qLab(q+2),qLab(Math.max(1,q-4))].filter(x=>x!==lab);
    return {prompt:`How long is the pencil, to the nearest <b>quarter inch</b>?`,visual:rulerSVG(q),...strChoices(lab+' in',wrong.map(x=>x+' in')),render:c=>fracText(c),hint:`Each inch is split into 4 quarters. Count the whole inches, then the quarters.`,explain:`The tip is at <b>${fracText(lab)} inches</b>.`}}
  const g=pick([600,800,900,1200,1500,2000]),kg=g>1000?1:2,heavier=g>kg*1000?`${fmt(g)} grams`:`${kg} kilogram${kg>1?'s':''}`;
  return {prompt:`Which is <b>heavier</b>: <b>${kg} kilogram${kg>1?'s':''}</b> or <b>${fmt(g)} grams</b>?`,choices:shuffle([`${kg} kilogram${kg>1?'s':''}`,`${fmt(g)} grams`]),answer:heavier,hint:`1 kilogram = 1,000 grams.`,explain:`${kg} kilogram${kg>1?'s':''} = ${fmt(kg*1000)} grams. So <b>${heavier}</b> is heavier.`}}

/* ---------- Graph Garden: scaled picture and bar graphs, line plots (3.MD.3, 3.MD.4) ---------- */
const GCATS3=[['Mon','Tue','Wed','Thu','books read'],['Cats','Dogs','Fish','Birds','votes for favorite pet'],['Red','Blue','Green','Pink','votes for favorite color']];
function genGraph3(t){
  if(t<=1){const key=pick([2,5]),vals=shuffle([1,2,3,4,5,6]).slice(0,4).map(v=>v*key),cats=['Ana','Ben','Cy','Dee'],i=R(0,3);let j;do{j=R(0,3)}while(j===i);
    const vis=picGraph(cats,vals,key,'book');
    if(t===0)return {prompt:`The picture graph shows books each friend read. How many books did <b>${cats[i]}</b> read?`,visual:vis,...numChoices(vals[i],[vals[i]/key,vals[i]+key,vals[i]-key].filter(x=>x>0&&x!==vals[i])),hint:`Check the key! Each book picture stands for ${key} books.`,explain:`${cats[i]} has ${vals[i]/key} ${vals[i]/key===1?'picture':'pictures'}. ${vals[i]/key} × ${key} = <b>${vals[i]}</b> books.`};
    const a=Math.max(vals[i],vals[j]),b=Math.min(vals[i],vals[j]),A=cats[vals.indexOf(a)],B=cats[vals.indexOf(b)];
    return {prompt:`How many <b>more</b> books did <b>${A}</b> read than <b>${B}</b>?`,visual:vis,...numChoices(a-b,[(a-b)/key,a,a+b,a-b+key].filter(x=>x>0&&x!==a-b)),hint:`Find each total using the key, then subtract.`,explain:`${A}: ${a}. ${B}: ${b}. ${a} − ${b} = <b>${a-b}</b>.`}}
  if(t<=3){const set=pick(GCATS3),step=pick([2,5,10]),vals=[0,1,2,3].map(()=>R(1,8)*step),top=Math.max(...vals)+step,vis=barGraphScaled(set.slice(0,4),vals,step,top,set[4]),i=R(0,3);
    if(t===2)return {prompt:`The bar graph shows ${set[4]}. What is the value for <b>${set[i]}</b>? (Look at the numbers on the side: they count by ${step}s.)`,visual:vis,...numChoices(vals[i],[vals[i]/step,vals[i]+step,vals[i]-step].filter(x=>x>0&&x!==vals[i])),hint:`Follow the top of the bar across to the number scale.`,explain:`The ${set[i]} bar reaches <b>${vals[i]}</b>.`};
    let j;do{j=R(0,3)}while(j===i);const tot=vals[i]+vals[j];return {prompt:`How many ${set[4]} for <b>${set[i]}</b> and <b>${set[j]}</b> together?`,visual:vis,...numChoices(tot,[Math.abs(vals[i]-vals[j])||step,tot+step,tot-step]),hint:`Read both bars, then add.`,explain:`${vals[i]} + ${vals[j]} = <b>${tot}</b>.`}}
  const lo=R(4,8),data=[];for(let k=0;k<R(8,11);k++)data.push(R(lo,lo+6));const vis=linePlotQ(data,lo,lo+6),target=pick(data),cnt=data.filter(x=>x===target).length;
  if(t===4)return {prompt:`The line plot shows the lengths of some leaves, in inches. How many leaves are <b>${fracText(qLab(target))} inches</b> long?`,visual:vis,...numChoices(cnt,[cnt+1,cnt+2,data.length].filter(x=>x!==cnt)),hint:`Each X is one leaf. Count the X's above ${fracText(qLab(target))}.`,explain:`There ${cnt>1?'are':'is'} <b>${cnt}</b> X${cnt>1?"'s":''} above ${fracText(qLab(target))}.`};
  const cut=lo+3,longer=data.filter(x=>x>cut).length;if(!longer)return genGraph3(4);
  return {prompt:`How many leaves are <b>longer than ${fracText(qLab(cut))} inches</b>?`,visual:vis,...numChoices(longer,[data.length-longer,longer+1,data.filter(x=>x>=cut).length].filter(x=>x>0&&x!==longer)),hint:`Count the X's to the right of ${fracText(qLab(cut))}. Don't count ${fracText(qLab(cut))} itself.`,explain:`To the right of ${fracText(qLab(cut))} there are <b>${longer}</b> X's.`}}

/* ---------- Shape Shipyard: quadrilaterals and their categories (3.G.1) ---------- */
function genShape3(t){
  if(t===0){const k=pick(['square','rectangle','rhombus','trapezoid','parallelogram']);return {prompt:`What is the best name for this shape?`,visual:quadSVG(k),...strChoices(QUADS[k].name,['square','rectangle','rhombus','trapezoid','parallelogram','pentagon'].filter(x=>x!==k)),hint:`Look at the sides: are they all equal? Are there square corners? Which sides are parallel?`,explain:`${({square:'4 equal sides and 4 square corners',rectangle:'4 square corners, but the sides are not all equal',rhombus:'4 equal sides, but no square corners',trapezoid:'only one pair of parallel sides',parallelogram:'two pairs of parallel sides, no square corners and not all sides equal'})[k]}: a <b>${k}</b>.`.replace(/^./,c=>c.toUpperCase())}}
  if(t===1){const not=pick(['triangle','pentagon','hexagon']),qs=shuffle(['square','rectangle','rhombus','trapezoid','kite']).slice(0,3);
    return {prompt:`Which shape is <b>not</b> a quadrilateral?`,visual:`<div class="shrow">${shuffle([not,...qs]).map(k=>quadSVG(k,'#ffd56b')).join('')}</div>`,...strChoices(QUADS[not].name,qs.map(k=>QUADS[k].name)),hint:`A quadrilateral has exactly 4 sides.`,explain:`A ${not} has ${({triangle:3,pentagon:5,hexagon:6})[not]} sides, so it is <b>not</b> a quadrilateral.`}}
  if(t===2){const q=pick([['A square is always a ___.','rectangle',['triangle','pentagon','trapezoid'],'A square has 4 square corners, just like every rectangle.'],['A square is always a ___.','rhombus',['triangle','hexagon','trapezoid'],'A square has 4 equal sides, just like every rhombus.'],['Every rectangle is a ___.','quadrilateral',['square','rhombus','triangle'],'A rectangle has 4 sides, so it is a quadrilateral. Not every rectangle is a square!']]);
    return {prompt:q[0].replace('___','<b>___</b>'),...strChoices(q[1],q[2]),hint:`Think about what the shapes must have.`,explain:q[3].replace(q[1],`<b>${q[1]}</b>`)}}
  if(t===3){const q=pick([['I have 4 sides that are all the same length and 4 square corners.','square'],['I have 4 square corners, but my sides are not all the same length.','rectangle'],['I have 4 equal sides, but my corners are not square.','rhombus'],['I have exactly one pair of parallel sides.','trapezoid']]);
    return {prompt:`Guess the shape: <i>"${q[0]}"</i>`,...strChoices(q[1],['square','rectangle','rhombus','trapezoid'].filter(x=>x!==q[1])),hint:`Check each clue one at a time.`,explain:`That describes a <b>${q[1]}</b>.`}}
  const k=pick(['square','rectangle','rhombus']),yes={square:['4 equal sides','4 square corners'],rectangle:['4 square corners','2 pairs of parallel sides'],rhombus:['4 equal sides','2 pairs of parallel sides']}[k],no=pick({square:['only 3 sides','exactly 1 pair of parallel sides'],rectangle:['5 corners','only 1 square corner'],rhombus:['3 equal sides','only 1 pair of parallel sides']}[k]);
  return {prompt:`Which is <b>not</b> true about every <b>${k}</b>?`,visual:quadSVG(k),...strChoices(`It has ${no}.`,yes.map(y=>`It has ${y}.`).concat(['It is a quadrilateral.'])),hint:`Check each statement against the shape.`,explain:`Every ${k} is a quadrilateral with ${yes.join(' and ')}. It does <b>not</b> have ${no}.`}}

/* ---------- Pattern Pass: arithmetic patterns, odd and even (3.OA.9) ---------- */
function genPattern3(t){
  if(t===0){const q=pick([['odd + odd','even'],['even + even','even'],['odd + even','odd'],['odd × odd','odd'],['even × any number','even']]);
    return {prompt:`<b>${q[0]}</b> is always...`,choices:['odd','even'],answer:q[1],hint:`Try a few examples, like 3 + 5 or 2 × 7.`,explain:`Try examples: the answer is always <b>${q[1]}</b>.`}}
  if(t===1){const s=R(2,9),st=R(2,9),seq=[0,1,2,3].map(k=>s+k*st),ans=s+4*st;return {prompt:`What comes next? <b>${seq.join(', ')}, ___</b>`,...numChoices(ans,[ans+1,ans-1,ans+st,seq[3]+1].filter(x=>x!==ans)),hint:`How much does the pattern grow each time?`,explain:`The rule is "add ${st}". ${seq[3]} + ${st} = <b>${ans}</b>.`}}
  if(t===2){const k=R(2,9),ins=shuffle([1,2,3,4,5,6,7,8]).slice(0,4).sort((a,b)=>a-b),x=R(6,10);
    return {prompt:`What is the rule? Then find the missing number.`,visual:`<table class="iotab"><tr><th>In</th>${ins.map(i=>`<td>${i}</td>`).join('')}<td>${x}</td></tr><tr><th>Out</th>${ins.map(i=>`<td>${i*k}</td>`).join('')}<td>?</td></tr></table>`,...numChoices(x*k,[x+k,x*k+k,x*(k+1)]),hint:`What do you do to each In number to get the Out number?`,explain:`The rule is "multiply by ${k}". ${x} × ${k} = <b>${x*k}</b>.`}}
  if(t===3){const k=pick([4,6,8,2]);return {prompt:`Pip says: "Every product of <b>${k}</b> times a number is <b>even</b>." Why is that true?`,...strChoices(`${k} is two equal groups of ${k/2}, so ${k} × any number can be split into two equal groups.`,[`Because ${k} is a big number.`,`Because every number is even.`,`Because ${k} + 1 is odd.`]),hint:`Even numbers can be split into two equal groups.`,explain:`${k} = ${k/2} + ${k/2}, so ${k} × n = ${k/2} × n + ${k/2} × n: <b>two equal groups</b>. That is always even.`}}
  const o1=pick([3,5,7,9]),o2=pick([3,5,7,9]),e=pick([2,4,6,8]),ans=`${o1} × ${o2}`;return {prompt:`Which product is <b>odd</b>?`,...strChoices(ans,[`${o1} × ${e}`,`${e} × ${o2}`,`${e} × ${pick([2,4,6,8])}`]),hint:`A product is odd only if both numbers are odd.`,explain:`Odd × odd = odd: <b>${ans} = ${o1*o2}</b>. Any product with an even number is even.`}}

/* ---------- Riddle Reef: two-step problems, letters for unknowns, checking answers (3.OA.8, MP.1, MP.3) ---------- */
function genRiddle3(t){const a=R(3,9),b=R(3,9),c=R(5,30);
  if(t===0){const ans=a*b+c;return {prompt:`Pip buys <b>${a}</b> packs of stickers. Each pack has <b>${b}</b> stickers. A friend gives him <b>${c}</b> more. How many stickers does Pip have now?`,...numChoices(ans,[a*b,a+b+c,a*b-c,ans+b]),hint:`Step 1: multiply to find the stickers in the packs. Step 2: add the gift.`,explain:`${a} × ${b} = ${a*b}. ${a*b} + ${c} = <b>${ans}</b>.`}}
  if(t===1){const tot=a*b+c;return {prompt:`There are <b>${tot}</b> chairs. <b>${c}</b> chairs are in the hall. The rest are in <b>${a}</b> equal rows. How many chairs in each row?`,...numChoices(b,[tot-c,b+1,a,b-1].filter(x=>x>0&&x!==b)),hint:`Step 1: take away the chairs in the hall. Step 2: share the rest into ${a} rows.`,explain:`${tot} − ${c} = ${a*b}. ${a*b} ÷ ${a} = <b>${b}</b> chairs in each row.`}}
  if(t===2){const n=a*b;return {prompt:`Which equation matches the story? <i>"Some kids share ${n} crayons equally. Each kid gets ${b} crayons."</i> Let <b>k</b> be the number of kids.`,...strChoices(`${n} ÷ k = ${b}`,[`${n} + k = ${b}`,`k − ${b} = ${n}`,`${b} ÷ k = ${n}`]),hint:`Sharing equally means dividing. The total is ${n}.`,explain:`${n} crayons shared by k kids gives ${b} each: <b>${n} ÷ k = ${b}</b>. So k = ${a}.`}}
  if(t===3){const x=R(120,380),y=R(110,390),s=x+y,wrong=s+pick([300,400]);return {prompt:`Leo added <b>${x} + ${y}</b> and got <b>${fmt(wrong)}</b>. Use rounding to check. Is his answer reasonable?`,...strChoices(`No. About ${Math.round(x/100)*100} + ${Math.round(y/100)*100} = ${Math.round(x/100)*100+Math.round(y/100)*100}, so ${fmt(wrong)} is too far off.`,[`Yes, because both numbers are big.`,`Yes, because ${fmt(wrong)} is a 3-digit number.`,`No, because you cannot add those numbers.`]),hint:`Round each number to the nearest hundred and add.`,explain:`The estimate is ${Math.round(x/100)*100+Math.round(y/100)*100}. The real sum is ${s}. Leo's answer is <b>not reasonable</b>.`}}
  const p=a*b,mist=p+pick([b,-b]);return {prompt:`Ava says <b>${a} × ${b} = ${mist}</b>. She explains: "I skip-counted by ${b}." What went wrong?`,...strChoices(`She counted ${mist>p?'one group too many':'one group too few'}. ${a} groups of ${b} is ${p}.`,[`Nothing. ${mist} is correct.`,`She should have added ${a} + ${b}.`,`You cannot skip-count to multiply.`]),hint:`Skip-count by ${b} exactly ${a} times.`,explain:`${a} × ${b} = ${p}. Ava got ${mist}, so she <b>${mist>p?'counted an extra group':'missed a group'}</b>.`}}

/* ---------- "Learn the trick" lessons for the grade 3 islands (added to LESSONS in progress.js) ---------- */
const LESSONS3=[
 {id:'g3_place_round',gen:'place3',isl:'place',types:[1,2],title:'Rounding with a number line',
  build(){const m=R(21,89)*10+R(1,9),down=m-m%10,up=down+10,ans=m%10>=5?up:down;return [
   teachCard('Which ten is closer?',`<p>To round <b>47</b> to the nearest ten, find the two tens it sits between: <b>40</b> and <b>50</b>.</p><div class="lrow">${roundLine(47,40,50)}</div><p>47 is past the halfway point (45), so it rounds <b>up to 50</b>.</p><p>The trick: look at the <b>ones digit</b>. 5 or more: round up. 4 or less: round down.</p>`,'Let\'s try one!'),
   Object.assign(guided(`${m} is between which two tens?`,strChoices(`${down} and ${up}`,[`${down-10} and ${down}`,`${up} and ${up+10}`]),`Look at the tens digit.`,`${m} is between <b>${down} and ${up}</b>.`),{visual:roundLine(m,down,up)}),
   guided(`The ones digit is ${m%10}. Round ${m} to the nearest ten.`,numChoices(ans,[ans===up?down:up]),`${m%10>=5?'5 or more: round up.':'4 or less: round down.'}`,`${m} rounds to <b>${ans}</b>.`)]},
  practice:[1,1,2]},
 {id:'g3_addsub_regroup',gen:'addsub3',isl:'addsub',types:[0,1],title:'Regrouping, place by place',
  build(){const a=R(2,6)*100+R(1,4)*10+R(6,9),b=R(1,2)*100+R(2,5)*10+R(5,9),s=a+b;return [
   teachCard('Add one place at a time',`<p>Line up the places: ones under ones, tens under tens.</p><p class="lc lbig">358 + 274</p><p><b>Ones:</b> 8 + 4 = 12. Write 2, carry 1 ten.</p><p><b>Tens:</b> 1 + 5 + 7 = 13. Write 3, carry 1 hundred.</p><p><b>Hundreds:</b> 1 + 3 + 2 = 6.</p><p class="lc lbig">358 + 274 = 632</p>`,'Let\'s try one!'),
   guided(`${a} + ${b}: first the <b>ones</b>. ${a%10} + ${b%10} = ?`,numChoices(a%10+b%10,[a%10+b%10-10,a%10+b%10+1]),`Just the ones digits.`,`${a%10} + ${b%10} = <b>${a%10+b%10}</b>. Write ${(a%10+b%10)%10}, carry 1.`),
   guided(`Now finish it: ${a} + ${b} = ?`,numChoices(s,[s-10,s+10,s-100]),`Don't forget the 1 you carried.`,`${a} + ${b} = <b>${s}</b>.`)]},
  practice:[0,1,0]},
 {id:'g3_mult_groups',gen:'mult3',isl:'mult',types:[0,1,2,7],title:'Multiplying means equal groups',
  build(){const a=R(3,5),b=R(3,6);return [
   teachCard('Groups of the same size',`<p><b>4 × 3</b> means <b>4 groups of 3</b>.</p><div class="lrow">${dotGroups(4,3)}</div><p>3 + 3 + 3 + 3 = 12, so 4 × 3 = 12.</p><p>An <b>array</b> is groups in rows: 4 rows of 3 is also 4 × 3.</p><div class="lrow">${dotArray(4,3)}</div>`,'Let\'s try one!'),
   Object.assign(guided(`How many groups? How many in each group?`,strChoices(`${a} groups of ${b}`,[`${b} groups of ${a+1}`,`${a+b} groups of 1`]),`Count the boxes, then the dots in one box.`,`<b>${a} groups of ${b}</b>.`),{visual:dotGroups(a,b)}),
   Object.assign(guided(`So ${a} × ${b} = ?`,numChoices(a*b,[a+b,a*b+b]),`Skip-count by ${b}, ${a} times.`,`${a} × ${b} = <b>${a*b}</b>.`),{visual:dotGroups(a,b)})]},
  practice:[0,1,2]},
 {id:'g3_div_share',gen:'div3',isl:'div',types:[0,1,2],title:'Dividing is sharing fairly',
  build(){const d=R(3,5),q=R(3,6),n=d*q;return [
   teachCard('Share it out',`<p><b>12 ÷ 3</b> means: share 12 into 3 equal groups.</p><div class="lrow">${dotGroups(3,4,'plate')}</div><p>Each plate gets <b>4</b>. So 12 ÷ 3 = 4.</p><p>Trick: think of multiplication. <b>3 × 4 = 12</b>, so 12 ÷ 3 = 4.</p>`,'Let\'s try one!'),
   guided(`Which multiplication helps with <b>${n} ÷ ${d}</b>?`,strChoices(`${d} × ${q} = ${n}`,[`${d} + ${q} = ${d+q}`,`${n} × ${d}`]),`Find the fact with ${d} and ${n}.`,`<b>${d} × ${q} = ${n}</b>.`),
   Object.assign(guided(`So ${n} ÷ ${d} = ?`,numChoices(q,[q+1,d]),`${d} × ? = ${n}`,`${n} ÷ ${d} = <b>${q}</b>.`),{visual:dotGroups(d,q,'plate')})]},
  practice:[0,1,1]},
 {id:'g3_frac_parts',gen:'frac3',isl:'frac',types:[0,1,6,7],title:'Top number, bottom number',
  build(){const d=pick([3,4,6,8]),n=R(1,d-1);return [
   teachCard('What a fraction tells you',`<p>The <b>bottom</b> number tells how many <b>equal parts</b> the whole is cut into.</p><p>The <b>top</b> number tells how many parts we are talking about.</p><div class="lrow">${fracBar(3,4)}</div><p class="lc lbig">3 of 4 equal parts = 3/4</p>`,'Let\'s try one!'),
   Object.assign(guided(`How many equal parts is the bar cut into?`,numChoices(d,[d+1,n]),`Count all the parts, shaded or not.`,`<b>${d}</b> equal parts: the bottom number.`),{visual:fracBar(n,d)}),
   Object.assign(guided(`What fraction is shaded?`,strChoices(`${n}/${d}`,[`${d}/${n}`,`${d-n}/${d}`]),`Shaded parts on top, all parts on the bottom.`,`${n} shaded of ${d}: <b>${n}/${d}</b>.`),{visual:fracBar(n,d),render:fracText})]},
  practice:[0,6,1]},
 {id:'g3_area_squares',gen:'area3',isl:'area',types:[0,1,2],title:'Area: count the squares',
  build(){const l=R(3,6),w=R(2,4);return [
   teachCard('Rows of squares',`<p><b>Area</b> is how many unit squares cover a shape.</p><div class="lrow">${gridRect(5,3)}</div><p>3 rows of 5 squares: <b>3 × 5 = 15</b> square units. No need to count one by one!</p><p><b>Perimeter</b> is different: the distance <b>around</b> the outside.</p>`,'Let\'s try one!'),
   Object.assign(guided(`How many rows? How many squares in each row?`,strChoices(`${w} rows of ${l}`,[`${l} rows of ${l}`,`${w+1} rows of ${l}`]),`Count across, then down.`,`<b>${w} rows of ${l}</b>.`),{visual:gridRect(l,w)}),
   Object.assign(guided(`So the area is...`,numChoices(l*w,[2*(l+w),l+w]),`${w} × ${l}`,`${w} × ${l} = <b>${l*w} square units</b>.`),{visual:gridRect(l,w)})]},
  practice:[0,1,0]},
 {id:'g3_time_minute',gen:'time3',isl:'time',types:[0,2,3],title:'Time to the minute',
  build(){const h=R(1,11),m=R(1,11)*5+R(1,4);return [
   teachCard('Count by 5s, then by 1s',`<p>The long hand moves 1 small mark each minute. Each <b>number</b> is 5 more minutes.</p><div class="lrow">${clockSVG(3,27,180)}</div><p>The long hand passed the <b>5</b> (25 minutes) and 2 more marks: <b>27</b>. The time is <b>3:27</b>.</p>`,'Let\'s try one!'),
   Object.assign(guided(`Which number did the long hand pass last?`,numChoices(Math.floor(m/5),[Math.floor(m/5)+1]),`Look just behind the long hand.`,`It passed the <b>${Math.floor(m/5)}</b>: ${Math.floor(m/5)*5} minutes.`),{visual:clockSVG(h,m,200)}),
   Object.assign(guided(`Count on the small marks. What time is it?`,strChoices(tf(h,m),[tf(h,Math.floor(m/5)*5),tf(h,m+1)]),`${Math.floor(m/5)*5} and ${m%5} more.`,`<b>${tf(h,m)}</b>.`),{visual:clockSVG(h,m,200)})]},
  practice:[0,0,3]},
 {id:'g3_measure_units',gen:'measure3',isl:'measure',types:[0,1,5],title:'Grams, kilograms and liters',
  build(){return [
   teachCard('How heavy? How much?',`<p><b>Mass</b> is how heavy something is.</p><p>1 <b>gram</b>: about a paper clip. 1 <b>kilogram</b> = 1,000 grams: about a big book.</p><p><b>Liquid volume</b> is how much a container holds.</p><p>1 <b>liter</b>: a big water bottle. 1 milliliter: a few drops.</p>`,'Let\'s try one!'),
   guided(`Which is a better guess for a cat?`,strChoices('4 kilograms',['4 grams']),`Is a cat heavier than a paper clip or more like a few big books?`,`A cat is about <b>4 kilograms</b>.`),
   Object.assign(guided(`How many liters of water?`,numChoices(3,[4,2]),`Read the mark at the top of the water.`,`It reaches <b>3 liters</b>.`),{visual:beakerSVG(3,5)})]},
  practice:[0,1,5]},
 {id:'g3_graph_key',gen:'graph3',isl:'graph',types:[0,1,2],title:'Read the key and the scale',
  build(){return [
   teachCard('Not every picture is 1',`<p>In a <b>scaled</b> picture graph, one picture can stand for more than one thing. Always read the <b>key</b>!</p>${picGraph(['Ana','Ben'],[6,10],2,'book')}<p>Each book = 2. Ana: 3 books × 2 = <b>6</b>. Ben: 5 × 2 = <b>10</b>.</p>`,'Let\'s try one!'),
   Object.assign(guided(`Each book stands for 5. How many did Cy read?`,numChoices(15,[3,10]),`Count the pictures, then multiply by 5.`,`3 pictures × 5 = <b>15</b>.`),{visual:picGraph(['Cy'],[15],5,'book')})]},
  practice:[0,2,1]},
 {id:'g3_shape_quads',gen:'shape3',isl:'shape',types:[0,1,2],title:'Families of quadrilaterals',
  build(){return [
   teachCard('All have 4 sides',`<p>A <b>quadrilateral</b> is any shape with 4 sides.</p><div class="shrow">${['square','rectangle','rhombus','trapezoid'].map(k=>quadSVG(k)).join('')}</div><p><b>Rectangle</b>: 4 square corners. <b>Rhombus</b>: 4 equal sides. A <b>square</b> has both, so a square is a rectangle <i>and</i> a rhombus!</p>`,'Let\'s try one!'),
   guided(`A shape has 4 equal sides and 4 square corners. What is it?`,strChoices('square',['trapezoid','triangle']),`Equal sides AND square corners.`,`That is a <b>square</b>.`),
   guided(`Is a triangle a quadrilateral?`,strChoices('No',['Yes'],2),`Count the sides.`,`A triangle has 3 sides, so <b>no</b>.`)]},
  practice:[0,1,2]},
 {id:'g3_pattern_oddeven',gen:'pattern3',isl:'pattern',types:[0,1],title:'Odd and even patterns',
  build(){return [
   teachCard('Pairs or one left over',`<p><b>Even</b> numbers split into pairs with none left over: 2, 4, 6, 8...</p><p><b>Odd</b> numbers have one left over: 1, 3, 5, 7...</p><p>odd + odd = <b>even</b> (the two leftovers make a pair). even + even = even. odd + even = odd.</p>`,'Let\'s try one!'),
   guided(`Is 7 + 9 odd or even?`,strChoices('even',['odd'],2),`Both are odd: the two leftovers pair up.`,`7 + 9 = 16: <b>even</b>.`),
   guided(`What comes next? 5, 10, 15, 20, ___`,numChoices(25,[21,30]),`What is added each time?`,`Add 5: <b>25</b>.`)]},
  practice:[0,1,1]},
 {id:'g3_riddle_steps',gen:'riddle3',isl:'riddle',types:[0,1,2],title:'Two steps, one at a time',
  build(){const a=R(3,6),b=R(4,8),c=R(5,15);return [
   teachCard('Solve it in two steps',`<p><i>"Pip has 3 bags with 5 shells each. He finds 4 more. How many shells?"</i></p><p><b>Step 1</b> (what you can find first): 3 × 5 = 15 shells in the bags.</p><p><b>Step 2</b>: 15 + 4 = <b>19</b> shells.</p><p>Then check: does 19 make sense? Yes, a bit more than 15.</p>`,'Let\'s try one!'),
   guided(`Mia has <b>${a}</b> boxes of <b>${b}</b> crayons and buys <b>${c}</b> more. Step 1: how many crayons are in the boxes?`,numChoices(a*b,[a+b,a*b+c]),`Equal groups: multiply.`,`${a} × ${b} = <b>${a*b}</b>.`),
   guided(`Step 2: how many crayons in all?`,numChoices(a*b+c,[a*b,a+b+c]),`Add the new crayons.`,`${a*b} + ${c} = <b>${a*b+c}</b>.`)]},
  practice:[0,1,2]}
];
