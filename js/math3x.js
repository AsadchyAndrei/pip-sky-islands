/* Pip's Sky Islands: more 3rd grade math question types (depth for the ca-3 pack).
   Each island's generator keeps its own types first; these come after them (see extGen in js/islands.js).
   Every entry names its skill (sk) from content/skills/math.json; a skill id that does not exist yet is
   written as 'id|Name|standard codes' and tools/build_content.py does not create it: tools/sync_ext_skills.py does. */
const extGen=(base,n,ext)=>t=>t<n?base(t):ext[(t-n)%ext.length].f();
const X3={};
/* a number line from 0 to max wholes, cut into den parts, with point A at pos (in parts) */
function fracLineSVG(den,max,pos,lab='A'){const W=420,x0=30,x1=W-30,u=(x1-x0)/(den*max);let s=`<line x1="${x0}" y1="60" x2="${x1}" y2="60" stroke="#1f3557" stroke-width="3"/>`;
  for(let k=0;k<=den*max;k++){const x=x0+k*u,whole=k%den===0;s+=`<line x1="${x}" y1="${whole?48:52}" x2="${x}" y2="${whole?72:68}" stroke="#1f3557" stroke-width="${whole?3:2}"/>`;if(whole)s+=`<text x="${x}" y="94" text-anchor="middle" ${FONT} font-size="17" fill="#1f3557">${k/den}</text>`}
  if(pos!=null)s+=`<circle cx="${x0+pos*u}" cy="60" r="8" fill="#e2558f" stroke="#fff" stroke-width="2"/><text x="${x0+pos*u}" y="36" text-anchor="middle" ${FONT} font-size="18" font-weight="700" fill="#e2558f">${lab}</text>`;
  return `<svg viewBox="0 0 ${W} 104" style="width:${W}px;max-width:100%" role="img" aria-label="A number line from 0 to ${max} cut into ${den} equal parts between whole numbers">${s}</svg>`}
const NUMW3=['zero','one','two','three','four','five','six','seven','eight','nine'],TEENS3=['ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],TENSW3=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function words3(n){const h=Math.floor(n/100),r=n%100,parts=[];if(h)parts.push(NUMW3[h]+' hundred');if(r>=20)parts.push(TENSW3[Math.floor(r/10)]+(r%10?'-'+NUMW3[r%10]:''));else if(r>=10)parts.push(TEENS3[r-10]);else if(r)parts.push(NUMW3[r]);return parts.join(' ')||'zero'}

/* Digit Cliffs */
X3.place3=[
 {sk:'math.place3.rounding-to-the-nearest-ten',f(){let n;do{n=R(212,889)}while(n%10===0||n%10===5);const r=Math.round(n/10)*10,thing=pick(['students at the school','people at the game','books in the library','birds in the park']);
  return {prompt:`There are <b>${n}</b> ${thing}. Rounded to the nearest ten, about how many is that?`,...numChoices(r,[r===n-n%10?r+10:r-10,Math.round(n/100)*100,n-n%10-10]),hint:`Look at the ones digit: ${n%10}. 5 or more rounds up.`,explain:`${n} is between ${n-n%10} and ${n-n%10+10}. It is closer to <b>${r}</b>.`}}},
 {sk:'math.place3.rounding-to-the-nearest-hundred',f(){const h=R(2,8)*100,ok=h+R(-50,49),w=[h-51-R(0,40),h+50+R(0,40),h+R(-9,9)+100];
  return {prompt:`Which number rounds to <b>${h}</b> when you round to the nearest hundred?`,...numChoices(ok,w),hint:`Look at the tens digit of each number: 5 or more rounds up, less than 5 rounds down.`,explain:`<b>${ok}</b> is closer to ${h} than to ${h-100} or ${h+100}.`}}},
 {sk:'math.place3.number-names|Number names|2.NBT.3',f(){let n;do{n=R(101,989)}while(n%100<10&&n%100!==0&&coin());const d=[...String(n)];
  const w=[Number(d[0]+d[2]+d[1]),Number(d[0]+'0'+d[1]+d[2])>999?Number(d[1]+d[0]+d[2]):Number(d[0]+'0'+d[1]+d[2]),Number(d[2]+d[1]+d[0])].filter(x=>x!==n&&x>99);
  return coin()?{prompt:`Which number is <b>${words3(n)}</b>?`,...numChoices(n,w),hint:`Write the hundreds digit first, then the tens, then the ones. A missing place gets a 0.`,explain:`${words3(n)} = <b>${n}</b>.`}
   :{prompt:`How do you say <b>${n}</b> in words?`,...strChoices(words3(n),w.map(words3)),hint:`Start with the hundreds: ${d[0]} hundred...`,explain:`${n} is <b>${words3(n)}</b>.`}}},
 {sk:'math.place3.comparing-numbers',f(){let a;do{a=[R(305,699)];a.push(Math.floor(a[0]/100)*100+R(0,99),R(305,699))}while(new Set(a).size<3);const s=a.slice().sort((x,y)=>x-y),ans=s.join(', ');
  return {prompt:`Put the numbers in order from <b>least</b> to <b>greatest</b>: <b>${a.join(', ')}</b>`,...strChoices(ans,[s.slice().reverse().join(', '),[s[1],s[0],s[2]].join(', '),[s[0],s[2],s[1]].join(', ')]),hint:`Compare the hundreds first. Same hundreds? Compare the tens.`,explain:`From least to greatest: <b>${ans}</b>.`}}},
 {sk:'math.place3.value-of-a-digit',f(){const t=R(12,98),n=t*10,k=coin();
  return k?{prompt:`How many <b>tens</b> are in <b>${n}</b>?`,...numChoices(t,[t%10,Math.floor(t/10),n]),hint:`10 tens make 100. So ${Math.floor(n/100)} hundreds is ${Math.floor(n/100)*10} tens.`,explain:`${n} = ${t} tens, because ${t} × 10 = ${n}. <b>${t} tens</b>.`}
   :{prompt:`<b>${t} tens</b> is the same as what number?`,...numChoices(n,[t,t*100,t+10]),hint:`Each ten is 10. Multiply by 10.`,explain:`${t} × 10 = <b>${n}</b>.`}}}];

/* Carry Canyon */
X3.addsub3=[
 {sk:'math.addsub3.adding-within-1000',f(){const a=R(105,320),b=R(105,300),c=R(25,999-a-b>25?Math.min(299,999-a-b):30),s=a+b+c;
  return {prompt:`${a} + ${b} + ${c} = ?`,...numChoices(s,[s-10,s+10,s-100,a+b]),hint:`Add two numbers first, then add the third.`,explain:`${a} + ${b} = ${a+b}. ${a+b} + ${c} = <b>${s}</b>.`}}},
 {sk:'math.addsub3.subtracting-within-1000',f(){const a=R(3,9)*100+(coin()?0:R(0,1)*0),b=R(111,a-12),d=a-b;
  return {prompt:`${a} − ${b} = ?`,...numChoices(d,[d+10,d+100,b-(a-b)>0?Math.abs(1000-a-b):d-10,d-1]),hint:`There are zeros to borrow across. ${a} = ${a/100-1} hundreds, 9 tens and 10 ones.`,explain:`${a} − ${b} = <b>${d}</b>. Check: ${d} + ${b} = ${a}.`}}},
 {sk:'math.addsub3.add-and-subtract-word-problems',f(){const a=R(250,780),b=R(110,a-60),[x,y]=[pick(NAMES3.slice(0,5)),pick(NAMES3.slice(5))];
  return {prompt:`${x}'s class read <b>${a}</b> pages this month. ${y}'s class read <b>${b}</b> pages. How many <b>more</b> pages did ${x}'s class read?`,...numChoices(a-b,[a+b,a-b+10,a-b-10]),hint:`"How many more" means find the difference: subtract.`,explain:`${a} − ${b} = <b>${a-b}</b> more pages.`}}},
 {sk:'math.addsub3.missing-numbers',f(){const b=R(110,380),d=R(120,500),a=b+d;
  return {prompt:`What number goes in the box? <b>□ − ${b} = ${d}</b>`,...numChoices(a,[d-b>0?d-b:a+10,a-10,a+100]),hint:`The box is the starting number. Add back what was taken away: ${d} + ${b}.`,explain:`${d} + ${b} = <b>${a}</b>. Check: ${a} − ${b} = ${d}.`}}},
 {sk:'math.addsub3.two-step-problems',f(){const s=R(400,800),a=R(110,s-200),b=R(50,s-a-30),left=s-a-b;
  return {prompt:`A farm stand had <b>${s}</b> apples. It sold <b>${a}</b> in the morning and <b>${b}</b> in the afternoon. How many apples are left?`,...numChoices(left,[s-a,s-b,a+b,left+10]),hint:`Step 1: subtract the morning. Step 2: subtract the afternoon. (Or add the sales first.)`,explain:`${a} + ${b} = ${a+b} sold. ${s} − ${a+b} = <b>${left}</b> apples left.`}}}];

/* Times Meadow */
X3.mult3=[
 {sk:'math.mult3.multiplication-facts',f(){const n=R(2,10),k=R(0,2),[q,a,e]=[[`${n} × 0`,0,`Zero groups of anything is <b>0</b>.`],[`1 × ${n}`,n,`One group of ${n} is <b>${n}</b>.`],[`${n} × 10`,n*10,`${n} tens is <b>${n*10}</b>.`]][k];
  return {prompt:`${q} = ?`,...(a===0?strChoices('0',[String(n),'1',String(n*10)]):numChoices(a,[n+1,n+10,n*100,1].filter(x=>x!==a))),hint:k===0?`How many do you have if you have ${n} groups of nothing?`:k===1?`One group of ${n}.`:`Multiplying by 10 puts a 0 at the end.`,explain:e}}},
 {sk:'math.mult3.multiplying-by-tens',f(){const k=R(3,9),t=R(2,9),ans=`${k*t} tens`;
  return {prompt:`<b>${k} × ${t*10}</b> is the same as...`,...strChoices(ans,[`${k+t} tens`,`${k*t} ones`,`${k*t} hundreds`]),hint:`${t*10} is ${t} tens. ${k} groups of ${t} tens = ? tens.`,explain:`${k} × ${t} tens = <b>${ans}</b> = ${k*t*10}.`}}},
 {sk:'math.mult3.properties-of-multiplication',f(){const a=R(6,9),b=R(6,9),b1=5,b2=b-5;
  return {prompt:`Pip breaks apart a fact: <b>${a} × ${b} = ${a} × 5 + ${a} × □</b>. What goes in the box?`,...numChoices(b2,[b,5,a,b+5].filter(x=>x!==b2)),hint:`${b} = 5 + ?`,explain:`${b} = 5 + ${b2}, so ${a} × ${b} = ${a} × 5 + ${a} × <b>${b2}</b> = ${a*5} + ${a*b2} = ${a*b}.`}}},
 {sk:'math.mult3.multiplication-word-problems',f(){const c=R(3,9),n=R(3,9),[s,u]=pick([[`Tickets to the aquarium cost <b>$${c}</b> each. How much do <b>${n}</b> tickets cost?`,'$'],[`A table seats <b>${c}</b> kids. How many kids can sit at <b>${n}</b> tables?`,' kids'],[`Each box holds <b>${c}</b> markers. How many markers are in <b>${n}</b> boxes?`,' markers']]);
  const p=c*n,f=u==='$'?`$${p}`:`${p}${u}`;return {prompt:s,...numChoices(p,[c+n,p+c,p-n]),hint:`Equal groups: ${n} groups of ${c}.`,explain:`${n} × ${c} = <b>${f}</b>.`}}},
 {sk:'math.mult3.equal-groups',f(){const a=R(3,6),b=R(2,9),add=Array(a).fill(b).join(' + ');
  return {prompt:`Which multiplication means the same as <b>${add}</b>?`,...strChoices(`${a} × ${b}`,[`${a} + ${b}`,`${b} × ${b}`,`${a+1} × ${b}`]),hint:`Count how many times ${b} is added.`,explain:`${b} is added ${a} times: <b>${a} × ${b}</b> = ${a*b}.`}}}];

/* Sharing Shore */
X3.div3=[
 {sk:'math.div3.division-facts',f(){const n=R(2,10),k=R(0,2),[q,a,e]=[[`${n} ÷ 1`,n,`Sharing ${n} into 1 group leaves all <b>${n}</b> in it.`],[`${n} ÷ ${n}`,1,`${n} shared into ${n} groups is <b>1</b> each.`],[`0 ÷ ${n}`,0,`Nothing shared is still <b>0</b>.`]][k];
  return {prompt:`${q} = ?`,...(a===0?strChoices('0',[String(n),'1']):a===1?strChoices('1',[String(n),'0',String(n*n)]):numChoices(a,[1,n+1,n*n].filter(x=>x!==a))),hint:k===0?`One group gets everything.`:k===1?`Same number shared into that many groups.`:`Zero things to share.`,explain:e}}},
 {sk:'math.div3.what-division-means',f(){const d=R(2,8),q=R(3,8),n=d*q;
  return {prompt:`<b>${n} ÷ ${d}</b> can also mean...`,...strChoices(`How many groups of ${d} are in ${n}?`,[`How many is ${n} and ${d} more?`,`What is ${d} groups of ${n}?`,`How many is ${n} take away ${d}?`]),hint:`Division can mean sharing, or making groups of a size.`,explain:`${n} ÷ ${d} also asks <b>how many groups of ${d} fit in ${n}</b>: ${q} groups.`}}},
 {sk:'math.div3.division-word-problems',f(){const r=R(3,8),c=R(3,9),n=r*c;
  return {prompt:`<b>${n}</b> chairs are set up in <b>${r}</b> equal rows. How many chairs are in each row?`,visual:dotArray(r,c),...numChoices(c,[n-r,c+1,r].filter(x=>x!==c)),hint:`Share ${n} into ${r} equal rows.`,explain:`${n} ÷ ${r} = <b>${c}</b> chairs in each row.`}}},
 {sk:'math.div3.fact-families',f(){const a=R(3,9),b=R(3,9),p=a*b;
  return {prompt:`The same number goes in both boxes: <b>□ × ${b} = ${p}</b> and <b>${p} ÷ □ = ${b}</b>. What is it?`,...numChoices(a,[p-b,b,a+1,a-1].filter(x=>x!==a)),hint:`Which number times ${b} makes ${p}?`,explain:`${a} × ${b} = ${p} and ${p} ÷ ${a} = ${b}. The number is <b>${a}</b>.`}}},
 {sk:'math.div3.missing-numbers-in-division',f(){const d=R(2,9),q=R(2,9),n=d*q;
  return {prompt:`What number goes in the box? <b>${n} ÷ □ = ${d}</b>`,...numChoices(q,[n-d,d,q+1].filter(x=>x!==q)),hint:`${d} × ? = ${n}`,explain:`${d} × ${q} = ${n}, so ${n} ÷ <b>${q}</b> = ${d}.`}}}];

/* Pie Peak */
X3.frac3=[
 {sk:'math.frac3.comparing-fractions',f(){const d=pick([3,4,6,8]);let a,b;do{a=R(1,d);b=R(1,d)}while(coin()&&a===b);const sign=a>b?'>':a<b?'<':'=';
  return {prompt:`Which sign makes it true? <b>${frac(a,d)} ☐ ${frac(b,d)}</b>`,choices:['<','>','='],answer:sign,hint:`Same size parts. Compare how many parts.`,explain:`${a} ${a===1?'part':'parts'} ${sign==='>'?'is more than':sign==='<'?'is less than':'is the same as'} ${b} ${b===1?'part':'parts'}: <b>${frac(a,d)} ${sign==='<'?'&lt;':sign==='>'?'&gt;':'='} ${frac(b,d)}</b>.`}}},
 {sk:'math.frac3.fractions-on-a-number-line',f(){const den=pick([2,3,4,6,8]),max=den>4?1:2,pos=R(1,den*max-1),ans=`${pos}/${den}`;
  return {prompt:`What fraction is at point <b>A</b>?`,visual:fracLineSVG(den,max,pos),...strChoices(ans,[`${pos}/${den*max}`,`${pos+1}/${den}`,`${den}/${pos}`,`1/${pos}`].filter(x=>{const [p,q]=x.split('/').map(Number);return p*den!==q*pos})),render:fracText,hint:`Each whole is cut into ${den} equal jumps. Count the jumps from 0 to A.`,explain:`Each jump is ${frac(1,den)}. A is ${pos} jumps from 0: <b>${frac(pos,den)}</b>.`}}},
 {sk:'math.frac3.equivalent-fractions',f(){const [a,b,k]=pick([[1,2,2],[1,2,3],[1,2,4],[1,3,2],[2,3,2],[1,4,2],[3,4,2]]),q=coin(),eq=`${a*k}/${b*k}`;
  return q?{prompt:`On a number line, which fraction is at the <b>same point</b> as ${frac(a,b)}?`,visual:`<div>${fracLineSVG(b,1,a)}</div><div>${fracLineSVG(b*k,1,null)}</div>`,...strChoices(eq,[`${a}/${b*k}`,`${a*k+1}/${b*k}`,`${b}/${a}`].filter(x=>x!==eq)),render:fracText,hint:`The second line has ${k} times as many parts. Count to the same spot.`,explain:`${frac(a,b)} and ${frac(a*k,b*k)} are at the same point, so they are <b>equal</b>.`}
   :{prompt:`${frac(a*k,b*k)} = ${frac('?',b)}`,...numChoices(a,[a*k,b,a+1].filter(x=>x!==a)),hint:`Bigger parts, fewer of them: divide both numbers by ${k}.`,explain:`${frac(a*k,b*k)} = <b>${frac(a,b)}</b>.`}}},
 {sk:'math.frac3.whole-numbers-as-fractions',f(){const d=pick([2,3,4,6,8]),w=R(1,3);
  return {prompt:`Point <b>A</b> is at a whole number. Which fraction names it?`,visual:fracLineSVG(d,3,d*w),...strChoices(`${d*w}/${d}`,[`${w}/${d}`,`${d}/${d*w}`,`${d*w+1}/${d}`]),render:fracText,hint:`Count the jumps from 0 to A. Each jump is ${frac(1,d)}.`,explain:`A is ${d*w} jumps of ${frac(1,d)}: <b>${frac(d*w,d)} = ${w}</b>.`}}},
 {sk:'math.frac3.naming-fractions',f(){const d=pick([4,6,8]),n=R(1,d-1),[thing,part]=pick([['pizza','slices'],['chocolate bar','pieces'],['garden','rows']]);
  return {prompt:`A ${thing} is cut into <b>${d}</b> equal ${part}. Pip ${thing==='garden'?'plants':'eats'} <b>${n}</b> ${n===1?part.replace(/s$/,''):part}. What fraction of the ${thing} is that?`,...strChoices(`${n}/${d}`,[`${d}/${n}`,`${d-n}/${d}`,`${n}/${d+n}`].filter(x=>x!==`${n}/${d}`&&!(d-n===n&&x===`${d-n}/${d}`))),render:fracText,hint:`All the equal parts go on the bottom.`,explain:`${n} of ${d} equal ${part}: <b>${frac(n,d)}</b>.`}}}];

/* Fence Farm */
X3.area3=[
 {sk:'math.area3.area-by-multiplying',f(){const l=R(4,9),w=R(2,7);return {visual:sceneRect(l,w,'m',{label:'garden'}),prompt:`A garden is <b>${l} meters</b> long and <b>${w} meters</b> wide. What is its <b>area</b>?`,unit:'sq m',...numChoices(l*w,[2*(l+w),l+w,l*w+l]),hint:`Area = length × width.`,explain:`${l} × ${w} = <b>${l*w} square meters</b>.`}}},
 {sk:'math.area3.perimeter',f(){const s=R(3,12);return {visual:sceneRect(s,s,'cm',{fill:'#dff3ff',label:'tile'}),prompt:`A square tile has sides that are <b>${s} cm</b> long. What is its <b>perimeter</b>?`,unit:'cm',...numChoices(4*s,[s*s,2*s,s+4]),hint:`A square has 4 equal sides. Add them all.`,explain:`${s} + ${s} + ${s} + ${s} = <b>${4*s} cm</b>.`}}},
 {sk:'math.area3.area-by-multiplying',f(){const w=R(3,8),l=R(3,9),A=l*w;return {visual:sceneRect(l,w,'ft',{qw:1,label:`${A} sq ft`}),prompt:`A rectangle has an area of <b>${A} square feet</b>. One side is <b>${w} feet</b>. How long is the other side?`,unit:'ft',...numChoices(l,[A-w,A/w+w,w].filter(x=>x!==l)),hint:`${w} × ? = ${A}`,explain:`${w} × ${l} = ${A}, so the other side is <b>${l} feet</b>.`}}},
 {sk:'math.area3.same-area-different-perimeter',f(){const [a,b]=pick([[[2,6],[3,4]],[[2,8],[4,4]],[[3,6],[2,9]],[[4,6],[3,8]]]);const A=a[0]*a[1],pa=2*(a[0]+a[1]),pb=2*(b[0]+b[1]);
  return {prompt:`Rectangle A is <b>${a[0]} by ${a[1]}</b>. Rectangle B is <b>${b[0]} by ${b[1]}</b>. Which is true?`,...strChoices(`Same area, different perimeters`,[`Same perimeter, different areas`,`Same area and same perimeter`,`Different areas and different perimeters`]),hint:`Find each area (multiply) and each perimeter (add all four sides).`,explain:`Both areas are ${A} square units. Perimeters: ${pa} and ${pb}. <b>Same area, different perimeters.</b>`}}},
 {sk:'math.area3.counting-square-units',f(){const l=R(3,7),w=R(2,4),miss=R(1,Math.min(3,l-1));
  return {prompt:`Pip covers a shape with 1 cm squares. The bottom row is missing <b>${miss}</b> square${miss>1?'s':''}. What is the area of the shape that is covered?`,visual:gridRect(l,w),unit:'sq cm',...numChoices(l*w-miss,[l*w,l*w+miss,2*(l+w)]),hint:`Count all the squares in the picture, then take away the missing ones.`,explain:`${w} × ${l} = ${l*w} squares, minus ${miss}: <b>${l*w-miss} square cm</b>.`}}}];

/* Clock Cove */
X3.time3=[
 {sk:'math.time3.telling-time-to-the-minute',f(){const h=R(1,11),k=R(0,2),[m,w,ws]=[[15,`quarter past ${h}`,[`quarter to ${h}`,`half past ${h}`,`quarter to ${h+1}`]],[30,`half past ${h}`,[`quarter past ${h}`,`half past ${h+1}`,`quarter to ${h}`]],[45,`quarter to ${h+1}`,[`quarter past ${h}`,`quarter to ${h}`,`half past ${h}`]]][k];
  return {prompt:`What is another way to say <span class="lcd sm">${tf(h,m)}</span>?`,visual:clockSVG(h,m,200),...strChoices(w,ws),hint:`Quarter = 15 minutes. Half = 30 minutes. "To" means before the next hour.`,explain:`${tf(h,m)} is <b>${w}</b>.`}}},
 {sk:'math.time3.elapsed-time',f(){const h=R(1,10),m=R(0,11)*5,dh=1,dm=R(1,11)*5,end=addMin(h,m,60+dm);
  return {prompt:`A soccer game starts at <b>${tf(h,m)}</b>. It lasts <b>1 hour ${dm} minutes</b>. When does it end?`,...strChoices(end,[addMin(h,m,dm),addMin(h,m,120+dm),addMin(h,m,60+dm+10)]),hint:`Add the hour first, then the minutes.`,explain:`${tf(h,m)} + 1 hour = ${addMin(h,m,60)}. Then + ${dm} minutes = <b>${end}</b>.`}}},
 {sk:'math.time3.elapsed-time',f(){const h=R(1,10),m=R(7,11)*5,d=R((65-m)/5,11)*5,end=addMin(h,m,d);
  return {visual:sceneClocks(tf(h,m),end,d,'mins'),prompt:`How many minutes is it from <b>${tf(h,m)}</b> to <b>${end}</b>?`,unit:'minutes',...numChoices(d,[d+10,60-d,d+40].filter(x=>x!==d)),hint:`Count up to the next hour first: ${tf(h,m)} to ${addMin(h,m,60-m)} is ${60-m} minutes. Then count the rest.`,explain:`${60-m} minutes to ${addMin(h,m,60-m)}, then ${d-(60-m)} more: <b>${d} minutes</b>.`}}},
 {sk:'math.time3.elapsed-time',f(){const hr=R(1,2),m=R(1,11)*5,tot=hr*60+m;
  return {prompt:`How many minutes are in <b>${hr} hour${hr>1?'s':''} and ${m} minutes</b>?`,unit:'minutes',...numChoices(tot,[hr*100+m,hr+m,tot+10]),hint:`1 hour = 60 minutes.`,explain:`${hr} × 60 = ${hr*60}. ${hr*60} + ${m} = <b>${tot} minutes</b>.`}}}];

/* Measure Mine */
X3.measure3=[
 {sk:'math.measure3.liquid-volume',f(){const a=R(12,45),b=R(5,30),add=coin();
  return add?{prompt:`A fish tank has <b>${a} liters</b> of water. Pip adds <b>${b} liters</b>. How much water is in the tank now?`,unit:'liters',...numChoices(a+b,[Math.abs(a-b)||1,a+b+10,a+b-1]),hint:`Adding water: add.`,explain:`${a} + ${b} = <b>${a+b} liters</b>.`}
   :{prompt:`A cooler holds <b>${a+b} liters</b> of lemonade. The class drinks <b>${b} liters</b>. How much is left?`,unit:'liters',...numChoices(a,[a+b+b,a+1,b].filter(x=>x!==a)),hint:`Some was drunk: subtract.`,explain:`${a+b} − ${b} = <b>${a} liters</b>.`}}},
 {sk:'math.measure3.grams-kilograms-and-liters',f(){const [thing,u]=pick([['a truck','kilograms'],['a grape','grams'],['a horse','kilograms'],['a coin','grams'],['a backpack full of books','kilograms'],['a feather','grams']]);
  return {prompt:`Which unit would you use to measure the mass of <b>${thing}</b>?`,choices:['grams','kilograms'],answer:u,hint:`Light things: grams. Heavy things: kilograms.`,explain:`${thing[0].toUpperCase()+thing.slice(1)} is ${u==='grams'?'very light':'heavy'}: use <b>${u}</b>.`}}},
 {sk:'math.measure3.mass-word-problems',f(){const m=R(2,9),n=R(3,8);return {prompt:`One bag of flour has a mass of <b>${m} kilograms</b>. What is the mass of <b>${n}</b> bags?`,unit:'kilograms',...numChoices(m*n,[m+n,m*n+m,m*n-n]),hint:`Equal groups: multiply.`,explain:`${n} × ${m} = <b>${m*n} kilograms</b>.`}}},
 {sk:'math.measure3.measuring-to-a-quarter-inch',f(){const q=R(3,11)*2,lab=qLab(q);
  return {prompt:`How long is the pencil, to the nearest <b>half inch</b>?`,visual:rulerSVG(q),...strChoices(lab+' in',[qLab(q+2),qLab(q-2),qLab(q+4)].filter(x=>x&&x!==lab).map(x=>x+' in')),render:c=>fracText(c),hint:`The half-inch marks are halfway between the numbers.`,explain:`The tip is at <b>${fracText(lab)} inches</b>.`}}}];

/* Graph Garden */
X3.graph3=[
 {sk:'math.graph3.scaled-bar-graphs',f(){const set=pick(GCATS3),step=pick([2,5,10]);let vals;do{vals=[0,1,2,3].map(()=>R(1,8)*step)}while(new Set(vals).size<4);const most=coin(),v=most?Math.max(...vals):Math.min(...vals),top=Math.max(...vals)+step;
  return {prompt:`Which got the <b>${most?'most':'fewest'}</b> ${set[4]}?`,visual:barGraphScaled(set.slice(0,4),vals,step,top,set[4]),...strChoices(set[vals.indexOf(v)],set.slice(0,4)),hint:`Find the ${most?'tallest':'shortest'} bar.`,explain:`The ${most?'tallest':'shortest'} bar is <b>${set[vals.indexOf(v)]}</b> with ${v}.`}}},
 {sk:'math.graph3.scaled-bar-graphs',f(){const set=pick(GCATS3),step=pick([5,10]);let vals;do{vals=[0,1,2,3].map(()=>R(1,9)*step)}while(new Set(vals).size<4);const top=Math.max(...vals)+step,i=vals.indexOf(Math.max(...vals)),j=vals.indexOf(Math.min(...vals)),d=vals[i]-vals[j];
  return {prompt:`How many <b>fewer</b> ${set[4]} did <b>${set[j]}</b> get than <b>${set[i]}</b>?`,visual:barGraphScaled(set.slice(0,4),vals,step,top,set[4]),...numChoices(d,[d/step,vals[i]+vals[j],d+step].filter(x=>x!==d)),hint:`Read both bars on the scale, then subtract.`,explain:`${vals[i]} − ${vals[j]} = <b>${d}</b>.`}}},
 {sk:'math.graph3.scaled-picture-graphs',f(){const key=pick([2,5,10]),n=R(2,8),v=n*key;
  return {prompt:`In a picture graph, each <span style="display:inline-block;width:24px;vertical-align:-5px">${G3ICON.star}</span> stands for <b>${key}</b> votes. How many stars should Pip draw for <b>${v}</b> votes?`,...numChoices(n,[v,v-key,n+1].filter(x=>x!==n)),hint:`How many groups of ${key} make ${v}?`,explain:`${v} ÷ ${key} = <b>${n}</b> ${n===1?'picture':'pictures'}.`}}},
 {sk:'math.graph3.line-plots',f(){const lo=R(4,8);let data,mode;do{data=[];for(let k=0;k<R(9,12);k++)data.push(R(lo,lo+6));const cnt={};data.forEach(x=>cnt[x]=(cnt[x]||0)+1);const mx=Math.max(...Object.values(cnt)),ks=Object.keys(cnt).filter(k=>cnt[k]===mx);mode=ks.length===1?+ks[0]:null}while(mode==null);
  return {prompt:`The line plot shows lengths of pencils, in inches. Which length is the <b>most common</b>?`,visual:linePlotQ(data,lo,lo+6),...strChoices(qLab(mode)+' in',[...new Set(data)].filter(x=>x!==mode).slice(0,3).map(x=>qLab(x)+' in')),render:c=>fracText(c),hint:`Find the tallest stack of X's.`,explain:`The tallest stack is at <b>${fracText(qLab(mode))} inches</b>.`}}},
 {sk:'math.graph3.line-plots',f(){const lo=R(4,8),n=R(7,12),data=[];for(let k=0;k<n;k++)data.push(R(lo,lo+6));
  return {prompt:`Each X stands for one shell Pip measured. How many shells did he measure in all?`,visual:linePlotQ(data,lo,lo+6),...numChoices(n,[n+1,n-1,7].filter(x=>x!==n)),hint:`Count every X.`,explain:`There are <b>${n}</b> X's, so ${n} shells.`}}}];

/* Shape Shipyard */
X3.shape3=[
 {sk:'math.shape3.naming-quadrilaterals',f(){const [k,d,oth]=pick([['trapezoid','exactly one pair of parallel sides',['kite','rectangle','rhombus']],['kite','two pairs of equal sides next to each other, but not all 4 sides equal',['trapezoid','rectangle','parallelogram']],['rhombus','four equal sides',['trapezoid','kite','rectangle']]]),all=shuffle([k,...oth]);
  return {prompt:`Which shape has <b>${d}</b>?`,visual:`<div class="shrow">${all.map(x=>quadSVG(x,'#ffd56b')).join('')}</div>`,...strChoices(k,oth),hint:`Check the sides one shape at a time.`,explain:`A <b>${k}</b> has ${d}.`}}},
 {sk:'math.shape3.shape-categories',f(){return {prompt:`Which shape is a <b>rhombus</b> but <b>not</b> a square?`,visual:`<div class="shrow">${shuffle(['square','rhombus','rectangle','trapezoid']).map(x=>quadSVG(x)).join('')}</div>`,...strChoices('a rhombus with no square corners',['a square','a rectangle','a trapezoid']),hint:`A rhombus has 4 equal sides. A square also needs square corners.`,explain:`A square is a special rhombus. The one that is <b>only</b> a rhombus has 4 equal sides but no square corners.`}}},
 {sk:'math.shape3.what-is-a-quadrilateral',f(){const k=pick(['triangle','pentagon','hexagon','square','trapezoid']),n={triangle:3,pentagon:5,hexagon:6,square:4,trapezoid:4}[k];
  return {prompt:`How many <b>sides</b> and <b>corners</b> does this shape have? Is it a quadrilateral?`,visual:quadSVG(k,'#c9b8ff'),...strChoices(`${n} sides, ${n} corners: ${n===4?'yes':'no'}`,[`${n+1} sides, ${n+1} corners: ${n+1===4?'yes':'no'}`,`${n} sides, ${n} corners: ${n===4?'no':'yes'}`,`${n-1} sides, ${n-1} corners: ${n-1===4?'yes':'no'}`]),hint:`A quadrilateral has exactly 4 sides and 4 corners.`,explain:`It has ${n} sides and ${n} corners, so it is ${n===4?'':'<b>not</b> '}a quadrilateral.`}}},
 {sk:'math.shape3.shape-categories',f(){return {prompt:`Pip wants a quadrilateral that is <b>not</b> a rectangle, <b>not</b> a rhombus and <b>not</b> a square. Which one can he draw?`,...strChoices(pick(['a trapezoid','a kite']),['a square','a rectangle','a rhombus']),hint:`Think of 4-sided shapes without square corners or 4 equal sides.`,explain:`Trapezoids and kites are quadrilaterals that are not rectangles, rhombuses or squares.`}}}];

/* Pattern Pass */
X3.pattern3=[
 {sk:'math.pattern3.number-patterns',f(){const st=R(3,9),s=R(2,20),seq=[0,1,2,3,4].map(k=>s+k*st),i=R(1,3),ans=seq[i];
  return {prompt:`What number is missing? <b>${seq.map((v,k)=>k===i?'___':v).join(', ')}</b>`,...numChoices(ans,[ans+1,ans-1,ans+st].filter(x=>x!==ans)),hint:`How much does the pattern grow from one number to the next?`,explain:`The rule is "add ${st}". The missing number is <b>${ans}</b>.`}}},
 {sk:'math.pattern3.number-patterns',f(){const st=R(3,9),s=R(5,9)*st+R(0,5),seq=[0,1,2,3].map(k=>s-k*st),ans=s-4*st;if(ans<0)return X3.pattern3[1].f();
  return {prompt:`What comes next? <b>${seq.join(', ')}, ___</b>`,...numChoices(ans,[ans+st,ans-1,seq[3]+st].filter(x=>x!==ans)),hint:`The numbers get smaller. By how much each time?`,explain:`The rule is "subtract ${st}". ${seq[3]} − ${st} = <b>${ans}</b>.`}}},
 {sk:'math.pattern3.input-and-output-rules',f(){const k=R(5,30),ins=shuffle([3,7,10,12,15,20,25]).slice(0,4).sort((a,b)=>a-b),x=R(30,60);
  return {prompt:`What is the rule? Then find the missing number.`,visual:`<table class="iotab"><tr><th>In</th>${ins.map(i=>`<td>${i}</td>`).join('')}<td>${x}</td></tr><tr><th>Out</th>${ins.map(i=>`<td>${i+k}</td>`).join('')}<td>?</td></tr></table>`,...numChoices(x+k,[x*2,x+k+10,x-k]),hint:`Compare each In with its Out. What was added?`,explain:`The rule is "add ${k}". ${x} + ${k} = <b>${x+k}</b>.`}}},
 {sk:'math.pattern3.odd-and-even',f(){const n=R(101,999),ev=n%2===0;
  return {prompt:`Is <b>${n}</b> odd or even?`,choices:['odd','even'],answer:ev?'even':'odd',hint:`Only the ones digit matters.`,explain:`The ones digit is ${n%10}, which is ${ev?'even':'odd'}, so ${n} is <b>${ev?'even':'odd'}</b>.`}}},
 {sk:'math.pattern3.odd-and-even',f(){const k=pick([5,10]);return {prompt:`Pip lists numbers you get when you multiply by <b>${k}</b>: ${[1,2,3,4,5,6].map(x=>x*k).join(', ')}... What do you notice?`,...strChoices(k===5?'They always end in 0 or 5.':'They always end in 0.',[k===5?'They are all odd.':'They are all odd.','They always end in 2.','They get smaller.']),hint:`Look at the ones digits.`,explain:k===5?`Multiples of 5 <b>always end in 0 or 5</b>: odd × 5 ends in 5, even × 5 ends in 0.`:`Multiples of 10 <b>always end in 0</b>.`}}}];

/* Riddle Reef */
X3.riddle3=[
 {sk:'math.riddle3.two-step-word-problems',f(){const n=R(2,5),c=R(4,9),have=n*c+R(5,30)*1;
  return {prompt:`Pip has <b>$${have}</b>. He buys <b>${n}</b> books that cost <b>$${c}</b> each. How much money does he have left?`,...numChoices(have-n*c,[n*c,have-c,have-n-c]),hint:`Step 1: cost of the books (multiply). Step 2: subtract from what he has.`,explain:`${n} × $${c} = $${n*c}. $${have} − $${n*c} = <b>$${have-n*c}</b>.`}}},
 {sk:'math.riddle3.letters-for-unknown-numbers',f(){const a=R(3,9),n=R(3,9),p=a*n;
  return {prompt:`<b>${a} × n = ${p}</b>. What number is <b>n</b>?`,...numChoices(n,[p-a,a,n+1].filter(x=>x!==n)),hint:`${a} times what makes ${p}? Or ${p} ÷ ${a}.`,explain:`${a} × <b>${n}</b> = ${p}, so n = ${n}.`}}},
 {sk:'math.riddle3.checking-answers-by-estimating',f(){const a=R(210,480),b=R(210,480),est=Math.round(a/100)*100+Math.round(b/100)*100;
  return {prompt:`Which is the <b>best estimate</b> for <b>${a} + ${b}</b>?`,...numChoices(est,[est+200,est-200,est+1000].filter(x=>x>0)),hint:`Round each number to the nearest hundred, then add.`,explain:`${a} → ${Math.round(a/100)*100}, ${b} → ${Math.round(b/100)*100}. About <b>${est}</b>.`}}},
 {sk:'math.riddle3.find-the-mistake',f(){let a,b;do{a=R(4,9)*100+R(0,3)*10+R(0,4);b=R(1,3)*100+R(5,9)*10+R(5,9)}while(a<=b);const right=a-b;
  const da=[...String(a)].map(Number),db=[...String(b)].map(Number),wrong=Number(da.map((x,i)=>Math.abs(x-db[i])).join(''));if(wrong===right)return X3.riddle3[3].f();
  return {prompt:`Sam subtracted <b>${a} − ${b}</b> and got <b>${wrong}</b>. What did he do wrong?`,...strChoices(`He subtracted the smaller digit from the bigger one in each place instead of regrouping. The answer is ${right}.`,[`Nothing. ${wrong} is right.`,`He should have added.`,`He forgot to write the hundreds.`]),hint:`Look at the ones: ${da[2]} − ${db[2]}. Can you take ${db[2]} from ${da[2]}?`,explain:`${da[2]} is less than ${db[2]}, so you must regroup. ${a} − ${b} = <b>${right}</b>.`}}},
 {sk:'math.riddle3.two-step-word-problems',f(){const per=R(3,6),full=R(3,7),extra=R(1,per-1),kids=per*full+extra;
  return {visual:scenePackInto(kids,per,'student','at a table'),prompt:`<b>${kids}</b> kids sit at tables. <b>${per}</b> kids fit at each table. How many tables do they need so everyone has a seat?`,...numChoices(full+1,[full,kids-per,per].filter(x=>x!==full+1)),hint:`${per} × ${full} = ${per*full}. Are there kids left over?`,explain:`${per} × ${full} = ${per*full}, and ${extra} kid${extra>1?'s':''} still need${extra>1?'':'s'} a seat. They need <b>${full+1}</b> tables.`}}}];

/* ---------- more "Learn the trick" lessons, grade 3 (math here; English, science and social studies in js/english3x.js) ---------- */
const X3N={place3:6,addsub3:5,mult3:8,div3:7,frac3:8,area3:7,time3:6,measure3:6,graph3:6,shape3:5,pattern3:5,riddle3:5};
const tagIdx=(bank,tag,n=3)=>BANK3[bank].map((it,i)=>it[0]===tag?i:-1).filter(i=>i>=0).slice(0,n);
const LESSONS3X=[
 {id:'g3_frac_line',gen:'frac3',isl:'frac',types:[1,X3N.frac3+1],title:'Fractions live on the number line',
  build(){const d=pick([3,4,6]),n=R(1,d-1);return [
   teachCard('Jumps from 0 to 1',`<p>Cut the space from <b>0 to 1</b> into equal jumps. The bottom number tells how many jumps.</p><div class="lrow">${fracLineSVG(4,1,3)}</div><p>Point A is <b>3 jumps</b> of ${frac(1,4)}: it is at <b>${frac(3,4)}</b>.</p><p>Past 1? Keep counting: 5 jumps of ${frac(1,4)} is ${frac(5,4)}.</p>`,'Let\'s try one!'),
   Object.assign(guided(`How many equal jumps from 0 to 1?`,numChoices(d,[d+1,n]),`Count the spaces, not the marks.`,`<b>${d}</b> jumps, so each is ${frac(1,d)}.`),{visual:fracLineSVG(d,1,n)}),
   Object.assign(guided(`What fraction is at A?`,strChoices(`${n}/${d}`,[`${d}/${n}`,`${n}/${d+1}`]),`Count the jumps from 0 to A.`,`${n} jumps of ${frac(1,d)}: <b>${frac(n,d)}</b>.`),{visual:fracLineSVG(d,1,n),render:fracText})]},
  get practice(){return [1,X3N.frac3+1,X3N.frac3+3]}},
 {id:'g3_time_hour',gen:'time3',isl:'time',types:[2,X3N.time3+2],title:'Elapsed time across the hour',
  build(){return [
   teachCard('Jump to the hour first',`<p>How long from <b>9:40</b> to <b>10:15</b>?</p><p><b>Step 1:</b> jump to the next hour: 9:40 → 10:00 is <b>20 minutes</b>.</p><p><b>Step 2:</b> jump the rest: 10:00 → 10:15 is <b>15 minutes</b>.</p><p>Add the jumps: 20 + 15 = <b>35 minutes</b>.</p>`,'Let\'s try one!'),
   guided(`From <b>2:50</b> to <b>3:00</b> is how many minutes?`,numChoices(10,[50,15]),`Count up to the hour.`,`<b>10 minutes</b> to 3:00.`),
   guided(`So from <b>2:50</b> to <b>3:25</b> is...`,numChoices(35,[25,75]),`10 minutes to 3:00, then 25 more.`,`10 + 25 = <b>35 minutes</b>.`)]},
  get practice(){return [2,X3N.time3+2,X3N.time3+1]}},
 {id:'g3_area_perim',gen:'area3',isl:'area',types:[4,5,6],title:'Area or perimeter?',
  build(){const l=R(4,7),w=R(2,4);return [
   teachCard('Inside or around?',`<p><b>Area</b> covers the <b>inside</b>: count square units, or multiply length × width.</p><p><b>Perimeter</b> goes <b>around</b> the outside: add all the sides.</p><div class="lrow">${gridRect(5,3)}</div><p>Area: 5 × 3 = <b>15 square units</b>. Perimeter: 5 + 3 + 5 + 3 = <b>16 units</b>.</p>`,'Let\'s try one!'),
   Object.assign(guided(`What is the <b>perimeter</b>?`,numChoices(2*(l+w),[l*w,l+w]),`Add all four sides.`,`${l} + ${w} + ${l} + ${w} = <b>${2*(l+w)}</b>.`),{visual:gridRect(l,w)}),
   guided(`A fence goes around a garden. Is that area or perimeter?`,strChoices('perimeter',['area'],2),`A fence goes around the edge.`,`Around the edge is <b>perimeter</b>.`)]},
  get practice(){return [4,X3N.area3+1,6]}},
 {id:'g3_graph_scale',gen:'graph3',isl:'graph',types:[2,3],title:'Reading a bar graph scale',
  build(){return [
   teachCard('Count by the scale',`<p>The numbers on the side of a bar graph may count by <b>2s, 5s or 10s</b>.</p>${barGraphScaled(['Cats','Dogs'],[15,25],5,30,'votes')}<p>The scale counts by 5s. Cats: <b>15</b>. Dogs: <b>25</b>. Dogs got 25 − 15 = <b>10 more</b>.</p>`,'Let\'s try one!'),
   Object.assign(guided(`The scale counts by 10s. How many votes for Fish?`,numChoices(40,[4,30]),`Follow the top of the bar across.`,`The Fish bar reaches <b>40</b>.`),{visual:barGraphScaled(['Fish','Birds'],[40,20],10,50,'votes')})]},
  get practice(){return [2,3,X3N.graph3+1]}},
 {id:'g3_mult_break',gen:'mult3',isl:'mult',types:[5,X3N.mult3+2],title:'Break apart a hard fact',
  build(){return [
   teachCard('Use facts you know',`<p>Don't know <b>7 × 8</b>? Break the 8 into <b>5 + 3</b>.</p><p>7 × 5 = 35 and 7 × 3 = 21.</p><p>35 + 21 = <b>56</b>, so 7 × 8 = 56.</p><p>This is the <b>distributive property</b>.</p>`,'Let\'s try one!'),
   guided(`6 × 7 = 6 × 5 + 6 × ?`,numChoices(2,[7,5]),`7 = 5 + ?`,`7 = 5 + <b>2</b>.`),
   guided(`6 × 5 = 30 and 6 × 2 = 12. So 6 × 7 = ?`,numChoices(42,[36,48]),`Add the two parts.`,`30 + 12 = <b>42</b>.`)]},
  get practice(){return [5,X3N.mult3+2,2]}},
 {id:'g3_place_words',gen:'place3',isl:'place',types:[X3N.place3+2],title:'Writing numbers in words',
  build(){return [
   teachCard('Say it, write it',`<p><b>604</b> is <b>six hundred four</b>. The 0 tens is silent!</p><p><b>350</b> is <b>three hundred fifty</b>.</p><p><b>918</b> is <b>nine hundred eighteen</b>.</p><p>Read the hundreds first, then the rest.</p>`,'Let\'s try one!'),
   guided(`Which number is <b>four hundred seven</b>?`,numChoices(407,[470,4007,47]),`4 hundreds, 0 tens, 7 ones.`,`<b>407</b>.`),
   guided(`How do you say <b>530</b>?`,strChoices('five hundred thirty',['five hundred three','fifty-three']),`5 hundreds and 3 tens.`,`<b>Five hundred thirty</b>.`)]},
  get practice(){return [X3N.place3+2,X3N.place3+2,3]}}
];
