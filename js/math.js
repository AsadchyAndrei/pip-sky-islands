/* Pip's Sky Islands: Math question generators, "Show me how" and clocks. Loaded in order by index.html; all files share one global scope. */
/* ================= "Show me how": the method on a different example, never the answer ================= */
const HR=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const HPICK=a=>a[Math.floor(Math.random()*a.length)];
const hParts=a=>{const s=String(a);return [...s].map((c,i)=>+c*10**(s.length-1-i)).filter(x=>x>0)};
const BLANK='<span class="hblank">?</span>';
function hDiff(f,bad){let v,g=0;do{v=f()}while(g++<40&&bad(v));return v}
function jumpLine(step,k,total){const W=Math.min(520,60+k*56),u=(W-40)/total;let s=`<line x1="20" y1="60" x2="${W-20}" y2="60" stroke="#1f3557" stroke-width="3"/>`;
  for(let i=0;i<=k;i++){const x=20+i*step*u;s+=`<line x1="${x}" y1="54" x2="${x}" y2="66" stroke="#1f3557" stroke-width="3"/><text x="${x}" y="86" text-anchor="middle" ${FONT} font-size="15" fill="#1f3557">${i*step}</text>`;
    if(i<k)s+=`<path class="fadein" style="animation-delay:${i*.35}s" d="M${x} 52 Q${x+step*u/2} ${18} ${x+step*u} 52" fill="none" stroke="#ff6b57" stroke-width="3"/><text class="fadein" style="animation-delay:${i*.35}s" x="${x+step*u/2}" y="28" text-anchor="middle" ${FONT} font-size="13" fill="#ff6b57">${i+1}</text>`}
  return `<svg viewBox="0 0 ${W} 96" style="width:${W}px" role="img" aria-label="Number line with jumps">${s}</svg>`}
function boxesPic(n,d){const full=Math.floor(n/d),r=n%d,boxes=full+(r?1:0),bw=Math.max(14*d+10,46);let s='';
  for(let b=0;b<boxes;b++){const x=6+b*(bw+8),inBox=b<full?d:r;s+=`<rect x="${x}" y="10" width="${bw}" height="40" rx="8" fill="${b<full?'#fff5d6':'#ffe4ee'}" stroke="${b<full?'#e09a14':'#e2558f'}" stroke-width="2" ${b<full?'':'stroke-dasharray="5 4"'}/>`;
    for(let k=0;k<inBox;k++)s+=`<circle class="dropin" style="animation-delay:${(b*d+k)*.06}s" cx="${x+12+k*14}" cy="30" r="5.5" fill="#ff6b57"/>`;
    s+=`<text x="${x+bw/2}" y="68" text-anchor="middle" ${FONT} font-size="12" fill="${b<full?'#a86b00':'#c9473a'}">${b<full?'full':'not full'}</text>`}
  const W=6+boxes*(bw+8);return `<svg viewBox="0 0 ${W} 76" style="width:${Math.min(560,W)}px" role="img" aria-label="Boxes">${s}</svg>`}
function tilesPic(a,c,z){const lab=fmt(z),w=z>=1000?46:z>=100?38:30;let s='';
  for(let i=0;i<a;i++)for(let j=0;j<c;j++)s+=`<g class="fadein" style="animation-delay:${(i*c+j)*.12}s"><rect x="${6+j*(w+6)}" y="${6+i*30}" width="${w}" height="24" rx="5" fill="${['#ffd56b','#8fd3f7','#9be0bd','#ffb3c7'][i%4]}" stroke="#1f3557" stroke-width="1.5"/><text x="${6+j*(w+6)+w/2}" y="${23+i*30}" text-anchor="middle" ${FONT} font-size="12" fill="#1f3557">${lab}</text></g>`;
  const W=12+c*(w+6);return `<svg viewBox="0 0 ${W} ${12+a*30}" style="width:${W}px" role="img" aria-label="${a} rows of ${c} tiles">${s}</svg>`}
function roundLine(n,down,up){const W=420,x=v=>30+(v-down)/(up-down)*(W-60),mid=(down+up)/2;
  return `<svg viewBox="0 0 ${W} 90" style="width:${W}px" role="img" aria-label="Number line"><line x1="30" y1="50" x2="${W-30}" y2="50" stroke="#1f3557" stroke-width="3"/>
  ${[down,mid,up].map((v,i)=>`<line x1="${x(v)}" y1="${i===1?42:38}" x2="${x(v)}" y2="${i===1?58:62}" stroke="${i===1?'#8a99ad':'#1f3557'}" stroke-width="3"/><text x="${x(v)}" y="82" text-anchor="middle" ${FONT} font-size="${i===1?12:15}" fill="${i===1?'#8a99ad':'#1f3557'}">${i===1?'halfway':fmt(v)}</text>`).join('')}
  <circle class="dropin" cx="${x(n)}" cy="50" r="8" fill="#ff6b57"/><text x="${x(n)}" y="28" text-anchor="middle" ${FONT} font-size="15" fill="#ff6b57">${fmt(n)}</text>
  <path class="fadein" style="animation-delay:.6s" d="M${x(n)} 20 Q${(x(n)+x(n-down>=(up-down)/2?up:down))/2} 2 ${x(n-down>=(up-down)/2?up:down)} 34" fill="none" stroke="#38b98a" stroke-width="3" marker-end="url(#harr)"/>
  <defs><marker id="harr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#38b98a"/></marker></defs></svg>`}
function digitTable(nums){const L=Math.max(...nums.map(n=>String(n).length));let first=-1;
  for(let i=0;i<L&&first<0;i++){const ds=nums.map(n=>String(n).padStart(L,' ')[i]);if(new Set(ds).size>1)first=i}
  return `<div class="dtable">${nums.map(n=>`<div>${[...String(n).padStart(L,' ')].map((c,i)=>`<span class="${i<first?'same':i===first?'diff':''}">${c.trim()||'&nbsp;'}</span>`).join('')}</div>`).join('')}</div>`}
const HOW={
  mult0:(a,b)=>{const a2=hDiff(()=>HR(String(a).length>=4?1100:String(a).length===3?110:12,String(a).length>=4?3999:String(a).length===3?399:49),v=>v===a||v%10===0),b2=hDiff(()=>HR(2,5),v=>v===b),p=hParts(a2);
    return {rule:'Break the big number into place-value parts. Multiply each part. Then add.',
      ex:`${fmt(a2)} × ${b2}`,steps:[`Break ${fmt(a2)} into ${p.map(fmt).join(' + ')}.`,p.map(x=>`${fmt(x)} × ${b2} = ${fmt(x*b2)}`).join(', ')+'.',`Add them: ${p.map(x=>fmt(x*b2)).join(' + ')} = <b>${fmt(a2*b2)}</b>.`],anim:multAnim(a2,p,b2),
      mine:[`Break <b>${fmt(a)}</b> into ${hParts(a).map(fmt).join(' + ')}.`,hParts(a).map(x=>`${fmt(x)} × ${b} = ${BLANK}`).join(' &nbsp; '),`Add your answers together.`]}},
  mult1:(a,b)=>{const a2=hDiff(()=>HR(12,19),v=>v===a),b2=hDiff(()=>HR(12,19),v=>v===b||v%10===0||v===a2),t=b2-b2%10,o=b2%10;
    return {rule:'Split one number into tens and ones. Multiply both parts. Then add.',
      ex:`${a2} × ${b2}`,steps:[`Split ${b2} into ${t} + ${o}.`,`${a2} × ${t} = ${fmt(a2*t)} and ${a2} × ${o} = ${a2*o}.`,`Add: ${fmt(a2*t)} + ${a2*o} = <b>${fmt(a2*b2)}</b>.`],anim:multAnim(b2,[t,o],a2),
      mine:[`Split <b>${b}</b> into ${b-b%10} + ${b%10}.`,`${a} × ${b-b%10} = ${BLANK} &nbsp; ${a} × ${b%10} = ${BLANK}`,`Add your two answers.`]}},
  mult2:(a,b)=>{const a2=hDiff(()=>HR(12,25),v=>v===a),b2=hDiff(()=>HR(3,4),v=>v===b),p=hParts(a2);
    return {rule:'Equal groups means multiply: (number of groups) × (how many in each group).',
      ex:`${b2} bags with ${a2} marbles in each bag. How many marbles?`,steps:[`There are <b>${b2} groups</b> (bags) with <b>${a2} in each</b>.`,`So multiply: ${a2} × ${b2}.`,`${p.map(x=>`${x} × ${b2} = ${x*b2}`).join(', ')}. Add: <b>${a2*b2}</b> marbles.`],anim:multAnim(a2,p,b2),
      mine:[`Find the number of <b>groups</b> and how many are in <b>each</b> group.`,`Write it as ${BLANK} × ${BLANK}, then break the big number apart like in the example.`]}},
  mult3:(a,c,z)=>{const a2=hDiff(()=>HR(2,4),v=>v===a),c2=hDiff(()=>HR(2,4),v=>v===c),zs=String(z).length-1,name={10:'tens',100:'hundreds',1000:'thousands'}[z];
    return {rule:'Multiply the small numbers first. Then put the zeros back on.',
      ex:`${a2} × ${fmt(c2*z)}`,steps:[`${fmt(c2*z)} is ${c2} ${name}.`,`${a2} × ${c2} = ${a2*c2}, so it's ${a2*c2} ${name}.`,`Write ${zs} zero${zs>1?'s':''} after ${a2*c2}: <b>${fmt(a2*c2*z)}</b>.`],anim:tilesPic(a2,c2,z),
      mine:[`First: ${a} × ${c} = ${BLANK}`,`Then write <b>${zs}</b> zero${zs>1?'s':''} at the end.`]}},
  div0:(n,d)=>{const d2=hDiff(()=>HR(2,5),v=>v===d),q2=HR(11,Math.floor(60/d2)),n2=q2*d2,t=Math.floor(n2/(d2*10))*d2*10,rest=n2-t;
    const parts=[];let r=n;for(const p of [1000,100,10]){const m=Math.floor(r/(d*p))*d*p;if(m>0&&r-m>=0){parts.push(m);r-=m}}if(r>0)parts.push(r);
    return {rule:'Split the number into friendly parts that are easy to share. Share each part. Then add.',
      ex:`${n2} ÷ ${d2}`,steps:[`Split ${n2} into ${t} + ${rest}. ${d2} shares both easily.`,`${t} ÷ ${d2} = ${t/d2} and ${rest} ÷ ${d2} = ${rest/d2}.`,`Add: ${t/d2} + ${rest/d2} = <b>${q2}</b>. Check: ${d2} × ${q2} = ${n2}.`],anim:divAnim(n2,d2),
      mine:parts.length>1?[`Try splitting <b>${fmt(n)}</b> into ${parts.map(fmt).join(' + ')}.`,parts.map(x=>`${fmt(x)} ÷ ${d} = ${BLANK}`).join(' &nbsp; '),`Add your answers. Check by multiplying by ${d}.`]:[`Ask: ${d} × ${BLANK} = ${fmt(n)}?`]}},
  div1:(n,d)=>{const d2=hDiff(()=>HR(3,5),v=>v===d),q2=HR(2,4),r2=HR(1,d2-1),n2=q2*d2+r2;
    return {rule:'Count by the number of friends until the next jump would be too big. The jumps are how many each friend gets. What is left is the leftover (R).',
      ex:`${n2} stickers shared by ${d2} friends`,steps:[`Count by ${d2}s: ${Array.from({length:q2+1},(_,i)=>(i+1)*d2).map((v,i)=>i<q2?v:`<s>${v}</s> (too many!)`).join(', ')}.`,`${q2} jumps reach ${q2*d2}. So each friend gets <b>${q2}</b>.`,`${n2} − ${q2*d2} = <b>${r2}</b> left over. Answer: ${q2} R ${r2}.`],anim:divAnim(n2,d2),
      mine:[`Count by <b>${d}s</b>: ${d}, ${2*d}, ${3*d}, … Stop before you go past <b>${n}</b>.`,`How many jumps? That's how many each friend gets.`,`${n} minus the last number you said is the leftover (R).`]}},
  div2:(P,b)=>{const b2=hDiff(()=>HR(3,5),v=>v===b),k=HR(4,7);
    return {rule:'A missing factor is a division puzzle. Count by the number you know until you reach the total. Count the jumps.',
      ex:`${BLANK} × ${b2} = ${k*b2}`,steps:[`Count by ${b2}s: ${Array.from({length:k},(_,i)=>(i+1)*b2).join(', ')}.`,`That took <b>${k}</b> jumps, so ${k} × ${b2} = ${k*b2}.`,`Same as ${k*b2} ÷ ${b2} = <b>${k}</b>.`],anim:jumpLine(b2,k,k*b2),
      mine:[`Count by <b>${b}s</b> until you reach <b>${P}</b>.`,`Count your jumps. That number goes in the box.`]}},
  div3:(n,d)=>{const d2=hDiff(()=>HR(3,4),v=>v===d),q2=HR(2,4),r2=HR(1,d2-1),n2=q2*d2+r2;
    return {rule:'Divide and find the leftover. Then read the question: does it ask for FULL boxes, or boxes for ALL of them?',
      ex:`${n2} cupcakes, boxes hold ${d2}`,steps:[`${n2} ÷ ${d2} = ${q2} R ${r2}: ${q2} full boxes and ${r2} cupcake${r2>1?'s':''} left.`,`"How many boxes are filled <b>all the way</b>?" Only the full ones: <b>${q2}</b>.`,`"How many boxes for <b>all</b> the cupcakes?" The leftovers need a box too: ${q2} + 1 = <b>${q2+1}</b>.`],anim:boxesPic(n2,d2),
      mine:[`Find ${n} ÷ ${d}. How many full boxes? Any left over?`,`Read the question again: <b>full boxes</b>, or boxes for <b>all</b>?`]}},
  place0:(n,pos)=>{const L=String(n).length,n2=hDiff(()=>HR(10**(L-1),10**L-1),v=>v===n),p2=hDiff(()=>HR(0,L-2),v=>v===pos||String(n2)[v]==='0'),dg=+String(n2)[p2],pl=L-1-p2;
    return {rule:'Find which place the digit sits in. Its value is the digit × that place.',
      ex:`The ${dg} in ${fmt(n2)}`,steps:[`Name the places from the right: ones, tens, hundreds, thousands…`,`The ${dg} is in the <b>${PLACE[pl]}</b> place.`,`So it's worth ${dg} × ${fmt(10**pl)} = <b>${fmt(dg*10**pl)}</b>.`],anim:placeAnim(n2,p2),
      mine:[`Start at the right: ones, tens, hundreds… Which place is the yellow digit in?`,`Then multiply: digit × that place.`]}},
  place1:(n,p)=>{const name={10:'ten',100:'hundred',1000:'thousand',10000:'ten thousand'}[p],n2=hDiff(()=>HR(p*10,p*100-1),v=>v===n||v%p===0),down=Math.floor(n2/p)*p,up=down+p,ans=n2-down>=p/2?up:down;
    return {rule:`Find the two ${name}s your number is between. Is it past halfway? 5 or more rounds up.`,
      ex:`Round ${fmt(n2)} to the nearest ${name}`,steps:[`${fmt(n2)} is between <b>${fmt(down)}</b> and <b>${fmt(up)}</b>.`,`Look at the digit right after the ${name}s place. It decides: 5 or more goes up, 4 or less goes down.`,`${fmt(n2)} is ${ans===up?'halfway or more':'less than halfway'}, so it rounds to <b>${fmt(ans)}</b>.`],anim:roundLine(n2,down,up),
      mine:[`Between which two ${name}s is <b>${fmt(n)}</b>? ${BLANK} and ${BLANK}`,`Look at the digit to the right of the ${name}s place. 5 or more: round up.`]}},
  place2:()=>{const n2=HPICK([3045,6208,40371,7059]),t=hParts(n2);
    return {rule:'Each part gives one digit. A place with nothing in it gets a 0.',
      ex:t.map(fmt).join(' + '),steps:[`Make a place chart and put each part in its place.`,`No part for a place? Write <b>0</b> there.`,`Read the digits: <b>${fmt(n2)}</b>.`],anim:placeAnim(n2,-1),
      mine:[`Write one digit for each place, from the biggest place to the ones.`,`Don't forget the zeros for the empty places!`]}},
  place3:()=>{const base=HPICK([4521,63842,7305]),s=[...String(base)],a=[...s];[a[1],a[2]]=[a[2],a[1]];const b=[...s];[b[2],b[3]]=[b[3],b[2]];const nums=[base,+a.join(''),+b.join('')].filter((v,i,arr)=>arr.indexOf(v)===i);
    return {rule:'Line the numbers up. Compare digits from the left. The first place where they are different decides.',
      ex:`Which is greatest: ${nums.map(fmt).join(', ')}?`,steps:[`Line them up so the places match.`,`Gray digits are the same. The <b>first</b> place that is different (yellow) decides.`,`The biggest digit there wins: <b>${fmt(Math.max(...nums))}</b>.`],anim:digitTable(nums),
      mine:[`Line up the numbers. Go from left to right.`,`Stop at the first place where the digits are different. Biggest digit wins.`]}},
  frac0:()=>{const den=HPICK([5,6,8]),num=HR(1,den-1);
    return {rule:'Bottom number: how many equal parts in all. Top number: how many are shaded.',
      ex:'What fraction is shaded?',steps:[`Count all the equal parts: <b>${den}</b>. That's the bottom number.`,`Count the shaded parts: <b>${num}</b>. That's the top number.`,`So it's ${frac(num,den)}.`],anim:`<svg viewBox="0 0 160 160" style="width:130px">${pieSVG(80,80,70,num,den)}</svg>`,
      mine:[`Count <b>all</b> the parts of the circle. That's the bottom.`,`Count the <b>pink</b> parts. That's the top.`]}},
  frac1:(a,b)=>{const [a2,b2]=hDiff(()=>HPICK([[1,2],[1,3],[1,4],[2,3]]),v=>v[0]===a&&v[1]===b),k=2;
    return {rule:'Multiply the top AND the bottom by the same number. The amount stays the same.',
      ex:`${a2}/${b2} = ?`,steps:[`Pick a number, like ${k}.`,`Top: ${a2} × ${k} = ${a2*k}. Bottom: ${b2} × ${k} = ${b2*k}.`,`So ${frac(a2,b2)} = ${frac(a2*k,b2*k)}. Same amount, smaller pieces.`],anim:fracEquivAnim(a2,b2,k),
      mine:[`Look at each choice: did the top and the bottom get multiplied by the <b>same</b> number?`]}},
  frac2:()=>({rule:'Give both fractions the same bottom number. Then the bigger top wins. Or compare each one to one half.',
      ex:`${frac(1,2)} or ${frac(3,8)}?`,steps:[`Make the bottoms the same: ${frac(1,2)} = ${frac(4,8)}.`,`Now compare ${frac(4,8)} and ${frac(3,8)}: same size pieces, 4 is more than 3.`,`So ${frac(1,2)} is bigger.`],anim:`<svg viewBox="0 0 160 160" style="width:120px">${pieSVG(80,80,70,4,8)}</svg><svg viewBox="0 0 160 160" style="width:120px">${pieSVG(80,80,70,3,8,'var(--ocean)','#e0f1fc')}</svg>`,
      mine:[`Find a bottom number both fractions can use, and change both.`,`Or ask: is each fraction more or less than one half?`]}),
  frac3:(a,b,den)=>{const den2=hDiff(()=>HPICK([5,6,8]),v=>v===den),a2=1,b2=2;
    return {rule:'When the bottom numbers match, add the top numbers. The bottom stays the same.',
      ex:`${a2}/${den2} + ${b2}/${den2}`,steps:[`The pieces are the same size (${den2}ths).`,`${a2} piece + ${b2} pieces = ${a2+b2} pieces.`,`Answer: ${frac(a2+b2,den2)}. The bottom does not change!`],anim:fracAddAnim(a2,b2,den2),
      mine:[`Add only the top numbers: ${a} + ${b} = ${BLANK}`,`Keep the bottom number: ${den}.`]}},
  area0:(l,w)=>{const w2=hDiff(()=>HR(2,4),v=>v===w),l2=hDiff(()=>HR(w2+1,6),v=>v===l);
    return {rule:'Area is how many squares cover the shape: length × width.',
      ex:`A ${l2} by ${w2} rectangle`,steps:[`Each row has ${l2} squares.`,`There are ${w2} rows.`,`${l2} × ${w2} = <b>${l2*w2}</b> square units.`],anim:areaAnim(l2,w2),
      mine:[`Length × width: ${l} × ${w} = ${BLANK} square feet.`]}},
  area1:(l,w)=>{const w2=hDiff(()=>HR(2,4),v=>v===w),l2=hDiff(()=>HR(w2+1,7),v=>v===l);
    return {rule:'Perimeter is the distance all the way around. Add all four sides.',
      ex:`A ${l2} by ${w2} rectangle`,steps:[`A rectangle has 2 long sides and 2 short sides.`,`${l2} + ${w2} + ${l2} + ${w2} = <b>${2*(l2+w2)}</b>.`],anim:periAnim(l2,w2),
      mine:[`Add all four sides: ${l} + ${w} + ${l} + ${w} = ${BLANK}`]}},
  area2:(A,w)=>{const w2=hDiff(()=>HR(3,5),v=>v===w),l2=HR(w2+1,8);
    return {rule:'Area = length × width. If you know the area and one side, ask: what times that side makes the area?',
      ex:`Area ${l2*w2}, one side ${w2}`,steps:[`${BLANK} × ${w2} = ${l2*w2}`,`Count by ${w2}s: ${Array.from({length:l2},(_,i)=>(i+1)*w2).join(', ')}. That's ${l2} jumps.`,`The other side is <b>${l2}</b>. (Same as ${l2*w2} ÷ ${w2}.)`],anim:areaAnim(l2,w2),
      mine:[`Ask: ${BLANK} × ${w} = ${A}`,`Or divide: ${A} ÷ ${w}.`]}},
  area3:(P,w)=>{const w2=hDiff(()=>HR(2,4),v=>v===w),l2=HR(w2+2,8),P2=2*(l2+w2);
    return {rule:'Take away the two short sides. The rest is the two long sides together, so split it in half.',
      ex:`Fence ${P2}, short side ${w2}`,steps:[`Two short sides: ${w2} + ${w2} = ${2*w2}.`,`${P2} − ${2*w2} = ${P2-2*w2} for both long sides.`,`Split in half: ${P2-2*w2} ÷ 2 = <b>${l2}</b>.`],anim:periAnim(l2,w2),
      mine:[`${P} − ${w} − ${w} = ${BLANK}`,`Then split that in half.`]}}
};
function openHow(){
  const q=S&&S.qs[S.i];if(!q||S.locked||S.mode==='boss')return;
  let h=null;try{h=q.how&&HOW[q.how[0]]?HOW[q.how[0]](...q.how.slice(1)):null}catch(e){h=null}
  if(!h&&!q.hint)return;
  S.howUsed=(S.howUsed||0)+1;clearTimeout(S.nudge);tone([523,659,784],.05);
  const body=h?`<p class="hrule">${h.rule}</p>
    <div class="hex"><div class="htag">Example</div><p class="hexq">${h.ex}</p><div class="steps">${h.steps.map((s,i)=>`<span class="step" style="animation-delay:${.3+i*.9}s">${s}</span>`).join('')}</div>${h.anim?`<div class="anim">${h.anim}</div>`:''}</div>
    <div class="hmine"><div class="htag">Now your puzzle</div>${h.mine.map(m=>`<p>${m}</p>`).join('')}</div>`
    :`<div class="hmine"><div class="htag">Here's the trick</div><p>${q.hint}</p></div>`;
  overlay(`<div class="howbox"><div class="howhead"><div class="pipbob" data-fox></div><div><div class="eyebrow">Show me how</div><h3>Let's learn the trick!</h3></div>
    <button class="speak" id="howSpeak" type="button" aria-label="Read aloud"><svg viewBox="0 0 24 24"><path d="M3 9h4l5-4v14l-5-4H3z" fill="#2f9fe0"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#2f9fe0" stroke-width="2" stroke-linecap="round"/></svg></button></div>
    ${body}<button class="go" type="button" id="howOk" style="align-self:center">Got it! Let me try</button></div>`,()=>{
    $('#ocard').classList.add('wide');foxClass('talking',1600);
    $('#howSpeak').onclick=()=>speak(h?[h.rule,...h.mine].join(' ').replace(/<span class="hblank">\?<\/span>/g,'blank'):q.hint,{user:true,pip:true});
    $('#howOk').onclick=()=>{stopSpeak();$('#ocard').classList.remove('wide');closeOverlay();armNudge();say($('#say'),pick(['You can do it!','Now try it your way!','Use the trick. I believe in you!']))}});
}

/* ================= Carry Canyon: adding & subtracting big numbers (4.NBT.4) ================= */
LANDMARKS.canyon=`<path d="M40 66 L50 30 L70 26 L74 66Z" fill="#c98a4b" stroke="#8c5a2c" stroke-width="2"/><path d="M86 66 L90 24 L110 30 L120 66Z" fill="#c98a4b" stroke="#8c5a2c" stroke-width="2"/><path d="M70 34 Q80 42 90 34" fill="none" stroke="#8c5a2c" stroke-width="3"/><circle cx="58" cy="18" r="10" fill="#ff6b57"/><text x="58" y="23" font-size="15" ${TW}>+</text><circle cx="102" cy="14" r="10" fill="#2f9fe0"/><text x="102" y="19" font-size="15" ${TW}>−</text>`;
function colSVG(a,b,op,mode='anim'){
  const add=op==='+',res=add?a+b:a-b,L=Math.max(String(a).length,String(b).length)+(add?1:0),cw=26,W=44+L*cw;
  const x=i=>34+(L-1-i)*cw+cw/2,dig=n=>[...String(n)].reverse().map(Number);
  const A=dig(a),B=dig(b),R=dig(res),T=`${FONT} text-anchor="middle"`;let s='';
  A.forEach((d,i)=>s+=`<text x="${x(i)}" y="58" ${T} font-size="24" fill="#1f3557" class="cd${i}">${d}</text>`);
  B.forEach((d,i)=>s+=`<text x="${x(i)}" y="88" ${T} font-size="24" fill="#1f3557">${d}</text>`);
  s+=`<text x="${x(L-1)-cw+4}" y="88" ${T} font-size="24" fill="#ff6b57">${add?'+':'−'}</text><line x1="${x(L-1)-cw}" y1="98" x2="${x(0)+cw/2}" y2="98" stroke="#1f3557" stroke-width="3" stroke-linecap="round"/>`;
  if(mode!=='anim')return `<svg viewBox="0 0 ${W} 108" style="width:${W}px;max-width:100%" role="img" aria-label="${fmt(a)} ${add?'plus':'minus'} ${fmt(b)}">${s}</svg>`;
  const step=.75,dl=i=>`style="animation-delay:${(.3+i*step).toFixed(2)}s"`;
  if(add){let c=0;for(let i=0;i<R.length;i++){const sum=(A[i]||0)+(B[i]||0)+c;
      if(i<Math.max(A.length,B.length)&&sum>=10)s+=`<text class="fadein" ${dl(i)} x="${x(i+1)}" y="26" ${T} font-size="15" fill="#ff6b57">1</text>`;
      s+=`<text class="fadein" ${dl(i)} x="${x(i)}" y="128" ${T} font-size="24" fill="#2b8a62">${R[i]}</text>`;c=sum>=10?1:0}}
  else{const top=A.slice(),first={};const mark=(k,i)=>{if(!(k in first))first[k]=i};
    for(let i=0;i<A.length;i++){
      if(top[i]<(B[i]||0)){let j=i+1;while(top[j]===0)j++;
        for(let k=i+1;k<=j;k++){top[k]=k===j?top[j]-1:9;mark(k,i)}
        top[i]+=10;mark(i,i)}
      if(i<R.length)s+=`<text class="fadein" ${dl(i)} x="${x(i)}" y="128" ${T} font-size="24" fill="#2b8a62">${R[i]}</text>`}
    for(const k in first)s+=`<g class="fadein" ${dl(first[k])}><line x1="${x(+k)-8}" y1="50" x2="${x(+k)+8}" y2="40" stroke="#ff6b57" stroke-width="2"/><text x="${x(+k)}" y="26" ${T} font-size="${top[k]>9?13:15}" fill="#ff6b57">${top[k]}</text></g>`}
  return `<svg viewBox="0 0 ${W} 138" style="width:${W}px;max-width:100%" role="img" aria-label="Column method">${s}</svg>`;
}
const noCarrySum=(a,b)=>{const A=[...String(a)].reverse(),B=[...String(b)].reverse();let out='';for(let i=0;i<Math.max(A.length,B.length);i++)out=((+(A[i]||0)+ +(B[i]||0))%10)+out;return +out};
const swapSub=(a,b)=>{const A=[...String(a)].reverse(),B=[...String(b)].reverse();let out='';for(let i=0;i<A.length;i++)out=Math.abs(+A[i]-+(B[i]||0))+out;return +out};
const carries=(a,b)=>{let c=0,n=0;const A=[...String(a)].reverse(),B=[...String(b)].reverse();for(let i=0;i<Math.max(A.length,B.length);i++){c=(+(A[i]||0)+ +(B[i]||0)+c)>=10?1:0;n+=c}return n};
const borrows=(a,b)=>{const A=[...String(a)].reverse(),B=[...String(b)].reverse();let n=0,br=0;for(let i=0;i<A.length;i++){const d=+A[i]-br-+(B[i]||0);br=d<0?1:0;n+=br}return n};
function addPair(len,needC){let a,b,g=0;do{a=R(10**(len-1),10**len-1);b=R(10**(len-2),10**len-1)}while(g++<60&&carries(a,b)<needC);return [a,b]}
function subPair(len,needB,zeros){let a,b,g=0;do{a=R(10**(len-1)*2,10**len-1);if(zeros&&coin()){const s=[...String(a)];for(let i=1;i<s.length-1;i++)if(coin())s[i]='0';a=+s.join('')}b=R(10**(len-2),a-1)}while(g++<80&&borrows(a,b)<needB);return [a,b]}
const ADD_STORIES=[
  [(a,b)=>`The school library has <b>${fmt(a)}</b> books. It gets <b>${fmt(b)}</b> new books. How many books does it have now?`,'+'],
  [(a,b)=>`Pip flew <b>${fmt(a)}</b> miles in spring and <b>${fmt(b)}</b> miles in summer. How many miles did Pip fly <b>in all</b>?`,'+'],
  [(a,b)=>`A farm picked <b>${fmt(a)}</b> apples on Monday and <b>${fmt(b)}</b> on Tuesday. How many apples <b>altogether</b>?`,'+'],
  [(a,b)=>`A stadium has <b>${fmt(a)}</b> seats. <b>${fmt(b)}</b> seats are filled. How many seats are <b>empty</b>?`,'-'],
  [(a,b)=>`A mountain is <b>${fmt(a)}</b> feet tall. A hill is <b>${fmt(b)}</b> feet tall. <b>How much taller</b> is the mountain?`,'-'],
  [(a,b)=>`A balloon festival sold <b>${fmt(a)}</b> tickets. <b>${fmt(b)}</b> were sold online. How many were <b>not</b> sold online?`,'-'],
  [(a,b)=>`Pip has saved <b>${fmt(a)}</b> coins. He spends <b>${fmt(b)}</b> coins on a castle. How many coins are <b>left</b>?`,'-']
];
function genAddSub(t){
  if(t>=5)return genAddSubX(t);
  const len=Dv(3,4,R(5,6));
  if(t===0){const [a,b]=addPair(len,Dv(1,2,2)),ans=a+b;
    return {how:['addsub0',a,b],prompt:`${fmt(a)} + ${fmt(b)} = ?`,visual:colSVG(a,b,'+','problem'),...numChoices(ans,[noCarrySum(a,b),ans+10,ans-100,ans+1000,ans-10]),anim:colSVG(a,b,'+'),
      hint:`Start with the ones. If a column adds to 10 or more, carry 1 to the next column.`,explain:`Add column by column from the right and carry when you get 10 or more. ${fmt(a)} + ${fmt(b)} = <b>${fmt(ans)}</b>.`}}
  if(t===1){const [a,b]=subPair(len,Dv(1,2,2),DIFF>1),ans=a-b;
    return {how:['addsub1',a,b],prompt:`${fmt(a)} − ${fmt(b)} = ?`,visual:colSVG(a,b,'-','problem'),...numChoices(ans,[swapSub(a,b),ans+10,ans+100,ans-1000,ans+1000]),anim:colSVG(a,b,'-'),
      hint:`Start with the ones. If the top digit is smaller, borrow 1 from the next place.`,explain:`Subtract column by column from the right, borrowing when the top digit is smaller. ${fmt(a)} − ${fmt(b)} = <b>${fmt(ans)}</b>. Check: ${fmt(ans)} + ${fmt(b)} = ${fmt(a)}.`}}
  if(t===2){const [f,op]=pick(ADD_STORIES),L5=Math.min(len,5);let a,b;if(op==='+')[a,b]=addPair(L5,1);else [a,b]=subPair(L5,1,false);const ans=op==='+'?a+b:a-b;
    return {how:['addsub2',op],prompt:f(a,b),...numChoices(ans,[op==='+'?a-b:a+b,op==='+'?noCarrySum(a,b):swapSub(a,b),ans+100,ans-10]),anim:colSVG(a,b,op),
      hint:op==='+'?`Putting groups together means add.`:`Finding what is left or how much more means subtract.`,explain:`${op==='+'?'Put the amounts together: add.':'Take away or compare: subtract.'} ${fmt(a)} ${op==='+'?'+':'−'} ${fmt(b)} = <b>${fmt(ans)}</b>.`}}
  if(t===3){const [a,b]=addPair(Math.min(len,5),1),c=a+b;
    if(coin())return {how:['addsub3','+',b,c],prompt:`What number goes in the box? <b>□ + ${fmt(b)} = ${fmt(c)}</b>`,...numChoices(a,[c+b,a+10,a-100,noCarrySum(c,b)]),anim:colSVG(c,b,'-'),
      hint:`The box is a missing part. Take the part you know away from the total.`,explain:`□ = ${fmt(c)} − ${fmt(b)} = <b>${fmt(a)}</b>. Check: ${fmt(a)} + ${fmt(b)} = ${fmt(c)}.`};
    return {how:['addsub3','-',c,a],prompt:`What number goes in the box? <b>${fmt(c)} − □ = ${fmt(a)}</b>`,...numChoices(b,[c+a,b+10,b-100,b+1000]),anim:colSVG(c,a,'-'),
      hint:`The box is how much was taken away. Subtract: total minus what is left.`,explain:`□ = ${fmt(c)} − ${fmt(a)} = <b>${fmt(b)}</b>. Check: ${fmt(c)} − ${fmt(b)} = ${fmt(a)}.`}}
  const p=Dv(100,1000,pick([1000,10000])),pname={100:'hundred',1000:'thousand',10000:'ten thousand'}[p];
  let a,b;do{a=R(p*2,p*Dv(9,9,90));b=R(p,a-p)}while(Math.round(a/p)===Math.round(b/p)||a%p===0||b%p===0);
  const op=coin()?'+':'-',ra=Math.round(a/p)*p,rb=Math.round(b/p)*p,ans=op==='+'?ra+rb:ra-rb;
  return {how:['addsub4',op,a,b,p],prompt:`<b>Estimate</b> by rounding each number to the nearest ${pname}: <b>${fmt(a)} ${op==='+'?'+':'−'} ${fmt(b)}</b>`,...numChoices(ans,[ans+p,ans-p,op==='+'?a+b:a-b,ans+2*p]),
    hint:`Round ${fmt(a)} and ${fmt(b)} to the nearest ${pname} first.`,explain:`${fmt(a)} rounds to ${fmt(ra)}. ${fmt(b)} rounds to ${fmt(rb)}. ${fmt(ra)} ${op==='+'?'+':'−'} ${fmt(rb)} = <b>${fmt(ans)}</b>.`};
}
Object.assign(HOW,{
  addsub0:(a,b)=>{const L=String(a).length;const [a2,b2]=hDiff(()=>{let x,y,g=0;do{x=HR(10**(L-1),10**L-1);y=HR(10**(L-2),10**L-1)}while(g++<60&&carries(x,y)<2);return [x,y]},v=>v[0]===a);const A=[...String(a)].reverse(),B=[...String(b)].reverse();
    return {rule:'Line up the places: ones under ones. Add from the right. A column adds to 10 or more? Write the ones digit and carry the 1 to the next column.',
      ex:`${fmt(a2)} + ${fmt(b2)}`,steps:[`Write ${fmt(a2)} on top of ${fmt(b2)}, ones under ones.`,`Ones: ${String(a2).slice(-1)} + ${String(b2).slice(-1)} = ${+String(a2).slice(-1)+ +String(b2).slice(-1)}. ${+String(a2).slice(-1)+ +String(b2).slice(-1)>=10?'That is 10 or more, so write the ones digit and carry 1.':'Write it down.'}`,`Keep going left, adding the carried 1 too. Answer: <b>${fmt(a2+b2)}</b>.`],anim:colSVG(a2,b2,'+'),
      mine:[`Ones column: ${A[0]} + ${B[0]} = ${BLANK}`,`Tens column: ${A[1]} + ${B[1]||0} + (carry?) = ${BLANK}`,`Keep going to the left. Don't forget the carries!`]}},
  addsub1:(a,b)=>{const L=String(a).length;const [a2,b2]=hDiff(()=>{let x,y,g=0;do{x=HR(10**(L-1)*2,10**L-1);y=HR(10**(L-2),x-1)}while(g++<80&&borrows(x,y)<1);return [x,y]},v=>v[0]===a);const A=[...String(a)].reverse(),B=[...String(b)].reverse();
    return {rule:'Subtract from the right. Is the top digit smaller than the bottom one? Borrow 1 from the next place: the next digit goes down by 1 and your digit gets 10 more.',
      ex:`${fmt(a2)} − ${fmt(b2)}`,steps:[`Write ${fmt(a2)} on top, ${fmt(b2)} under it, ones under ones.`,`When the top digit is too small, borrow from the left (the red numbers show the new digits).`,`Answer: <b>${fmt(a2-b2)}</b>. Check by adding: ${fmt(a2-b2)} + ${fmt(b2)} = ${fmt(a2)}.`],anim:colSVG(a2,b2,'-'),
      mine:[`Ones column: top ${A[0]}, bottom ${B[0]}. ${+A[0]<+B[0]?'The top is smaller, so borrow first!':'You can subtract right away.'}`,`Then go left, one column at a time.`,`Check: your answer + ${fmt(b)} should equal ${fmt(a)}.`]}},
  addsub2:(op)=>{const add=op==='+',a2=HR(120,480),b2=HR(110,390),bb=add?b2:Math.min(b2,a2-20);
    return {rule:'Find the clue words. In all, total, altogether, now has more → add. Left, how many more, how much taller, difference, not → subtract.',
      ex:add?`Mia has ${a2} stickers. She gets ${b2} more. How many in all?`:`A bus has ${a2} seats. ${bb} are taken. How many are left?`,
      steps:[add?`"Gets more" and "in all" mean the groups go <b>together</b>: add.`:`"How many are left" means some are <b>taken away</b>: subtract.`,`${a2} ${add?'+':'−'} ${bb}`,`= <b>${add?a2+bb:a2-bb}</b>`],anim:colSVG(a2,bb,op),
      mine:[`Find the clue words in your story. Add or subtract?`,`Then line up the numbers and solve column by column.`]}},
  addsub3:(op,x,c)=>{const p1=HR(20,60),p2=HR(20,60);
    return {rule:'A missing number? Use the opposite operation. □ + part = total → total − part. total − □ = left → total − left.',
      ex:`□ + ${p2} = ${p1+p2}`,steps:[`The whole is ${p1+p2}. One part is ${p2}.`,`Missing part = whole − part: ${p1+p2} − ${p2} = <b>${p1}</b>.`,`Check: ${p1} + ${p2} = ${p1+p2}.`],
      anim:`<svg viewBox="0 0 300 70" style="width:300px;max-width:100%"><rect x="10" y="10" width="280" height="22" rx="4" fill="#ffd56b" stroke="#1f3557" stroke-width="1.5"/><text x="150" y="26" text-anchor="middle" ${FONT} font-size="14" fill="#1f3557">whole: ${p1+p2}</text><rect class="grow" x="10" y="38" width="${280*p1/(p1+p2)}" height="22" rx="4" fill="#9be0bd" stroke="#1f3557" stroke-width="1.5"/><text x="${10+140*p1/(p1+p2)}" y="54" text-anchor="middle" ${FONT} font-size="14" fill="#1f3557">□</text><rect x="${10+280*p1/(p1+p2)}" y="38" width="${280*p2/(p1+p2)}" height="22" rx="4" fill="#8fd3f7" stroke="#1f3557" stroke-width="1.5"/><text x="${10+280*p1/(p1+p2)+140*p2/(p1+p2)}" y="54" text-anchor="middle" ${FONT} font-size="14" fill="#1f3557">${p2}</text></svg>`,
      mine:op==='+'?[`Whole: <b>${fmt(c)}</b>. Known part: <b>${fmt(x)}</b>.`,`Missing part = ${fmt(c)} − ${fmt(x)} = ${BLANK}`]:[`Whole: <b>${fmt(x)}</b>. What is left: <b>${fmt(c)}</b>.`,`Taken away = ${fmt(x)} − ${fmt(c)} = ${BLANK}`]}},
  addsub4:(op,a,b,p)=>{const pname={100:'hundred',1000:'thousand',10000:'ten thousand'}[p],a2=HR(3,8)*100+HR(10,90),b2=HR(1,4)*100+HR(10,90),ra=Math.round(a2/100)*100,rb=Math.round(b2/100)*100;
    return {rule:'Estimating means rounding first, then doing easy math with the round numbers.',
      ex:`Estimate ${a2} + ${b2} (nearest hundred)`,steps:[`${a2} rounds to ${ra}. ${b2} rounds to ${rb}.`,`${ra} + ${rb} = <b>${ra+rb}</b>.`,`So the real answer is about ${ra+rb}.`],
      mine:[`Round <b>${fmt(a)}</b> to the nearest ${pname}: ${BLANK}`,`Round <b>${fmt(b)}</b> to the nearest ${pname}: ${BLANK}`,`Then ${op==='+'?'add':'subtract'} the rounded numbers.`]}}
});

/* ================= More 4th grade standards: place value x10, number words, compare signs, letter equations,
   fraction & measurement word problems, remainders, composite numbers, rays & segments, triangles, angle addition, area model ================= */
const W_ONES=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],
  W_TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function words3(n){const s=[],h=Math.floor(n/100),r=n%100;if(h)s.push(W_ONES[h]+' hundred');if(r)s.push(r<20?W_ONES[r]:W_TENS[Math.floor(r/10)]+(r%10?'-'+W_ONES[r%10]:''));return s.join(' ')}
function numWords(n){if(!n)return 'zero';const th=Math.floor(n/1000),r=n%1000,p=[];if(th)p.push(words3(th)+' thousand');if(r)p.push(words3(r));return p.join(', ')}
const expanded=n=>{const s=String(n);return [...s].map((c,i)=>+c*10**(s.length-1-i)).filter(x=>x>0)};
function genPlaceX(t){
  if(t===4){
    if(coin()){const L=Dv(4,5,6),gaps=Dv([1],[1,1,2],[1,2,3]);let a,d,p1,p2,g=0;
      do{const gap=pick(gaps);d=R(1,9);p1=R(gap,L-1);p2=p1-gap;a=Array.from({length:L},()=>R(0,9));a[L-1-p1]=d;a[L-1-p2]=d}while((a[0]===0||a.filter(x=>x===d).length!==2)&&g++<200);
      const n=+a.join(''),gap=p1-p2,ans=10**gap,str=String(n);
      let vis='<div class="bignum">';for(let i=0;i<L;i++){vis+=(i===L-1-p1||i===L-1-p2)?`<span class="hl">${str[i]}</span>`:str[i];if((L-1-i)%3===0&&i<L-1)vis+=','}vis+='</div>';
      return {prompt:`The ${d} in the <b>${PLACE[p1]}</b> place is worth how many times as much as the ${d} in the <b>${PLACE[p2]}</b> place?`,visual:vis,...numChoices(ans,[10,100,1000,2,10000].filter(x=>x!==ans)),
        hint:`Find what each ${d} is worth. Each move one place to the left makes a digit worth 10 times more.`,
        explain:`The first ${d} is worth ${fmt(d*10**p1)}. The second ${d} is worth ${fmt(d*10**p2)}. ${fmt(d*10**p1)} ÷ ${fmt(d*10**p2)} = <b>${fmt(ans)}</b>.${gap>1?` (${Array(gap).fill('10').join(' × ')} = ${fmt(ans)}.)`:''}`}}
    const x=R(Dv(2,11,101),Dv(99,999,9999));
    if(coin())return {prompt:`What is <b>10 times</b> ${fmt(x)}?`,...numChoices(x*10,[x*100,x+10,x*10+10,x*10-10]),
      hint:`10 times a number moves every digit one place to the left. Add a 0 at the end.`,explain:`Each digit moves one place left: ${fmt(x)} × 10 = <b>${fmt(x*10)}</b>.`};
    return {prompt:`<b>${fmt(x*10)}</b> is 10 times what number?`,...numChoices(x,[x*100,x*10+10,x+10,x*10-10]),
      hint:`Think backwards: what number times 10 makes ${fmt(x*10)}? Each digit moves one place to the right.`,explain:`${fmt(x)} × 10 = ${fmt(x*10)}. So the answer is <b>${fmt(x)}</b>.`};
  }
  if(t===5){const L=Dv(4,5,6);let n,zi,g=0;
    do{const s=[...String(R(10**(L-1),10**L-1))];zi=R(1,L-1);s[zi]='0';n=+s.join('')}while((n%1000===0||n%100===0)&&g++<50);
    const s=[...String(n)];const sw=[...s];const j=zi<L-1?zi+1:zi-1;[sw[zi],sw[j]]=[sw[j],sw[zi]];
    const drop=+s.filter((_,i)=>i!==zi).join(''),plus=n+10**(L-1-zi)*R(1,4),swap=+sw.join('');
    if(coin())return {prompt:`Which number is <b>${numWords(n)}</b>?`,...numChoices(n,[swap,drop,plus,n*10]),
      hint:`Write the thousands part first, then the rest. A place with no number gets a 0.`,explain:`${numWords(n)[0].toUpperCase()+numWords(n).slice(1)} = <b>${fmt(n)}</b>.`};
    return {prompt:`How do you write <b>${fmt(n)}</b> in words?`,...strChoices(numWords(n),[swap,drop,plus,n+10**(L-1-zi)*R(5,9),n<1e5?n*10:Math.floor(n/10)].filter(v=>v!==n&&v>=1000&&v<1e6).map(numWords)),long:true,
      hint:`Read the part before the comma, say "thousand", then read the rest.`,explain:`${fmt(n)} = <b>${numWords(n)}</b>.`};
  }
  const L=Dv(4,5,6),a=R(10**(L-1),10**L-1),k=R(0,3);let b=a;
  if(k>0){const s=[...String(a)];const i=R(k===1?0:1,L-1);let nd;do{nd=R(0,9)}while(nd===+s[i]||(i===0&&nd===0));s[i]=nd;b=+s.join('')}
  const exp=k===0||coin(),A=exp?expanded(a).map(fmt).join(' + '):fmt(a),sign=a>b?'>':a<b?'<':'=';
  const sa=String(a),sb=String(b);let i=0;while(i<sa.length&&sa[i]===sb[i])i++;
  return {prompt:`Which sign makes this true?`,visual:`<div class="seq cmpseq"><span>${A}</span><span class="q">?</span><span>${fmt(b)}</span></div>`,choices:['<','=','>'],answer:sign,render:esc,
    hint:`${exp?'Add up the parts first to get one number. Then c':'C'}ompare digits from left to right. &gt; means greater than, &lt; means less than.`,
    explain:`${exp?`${A} = ${fmt(a)}. `:''}${sign==='='?`They are the same number, so <b>=</b>.`:`Look at the ${PLACE[sa.length-1-i]} place: ${sa[i]} ${esc(sign)} ${sb[i]}. So ${fmt(a)} <b>${esc(sign)}</b> ${fmt(b)}.`} (The open side of &lt; or &gt; faces the bigger number.)`};
}
function genAddSubX(t){
  if(t===5){const k=R(0,Dv(2,3,4)),L=pick(['n','m','p','x','y']);
    if(k===0){const b=R(Dv(12,120,1200),Dv(99,900,9000)),a=R(Dv(12,120,1200),Dv(99,900,9000)),c=a+b;
      return {prompt:`What is <b>${L}</b>? <b>${L} + ${fmt(b)} = ${fmt(c)}</b>`,...numChoices(a,[c+b,a+10,a-10,a+100]),hint:`${L} is a missing part. Total − known part.`,explain:`${L} = ${fmt(c)} − ${fmt(b)} = <b>${fmt(a)}</b>. Check: ${fmt(a)} + ${fmt(b)} = ${fmt(c)}.`}}
    if(k===1){const b=R(Dv(12,120,1200),Dv(99,900,9000)),a=R(Dv(12,120,1200),Dv(99,900,9000)),c=a+b;
      return {prompt:`What is <b>${L}</b>? <b>${L} − ${fmt(b)} = ${fmt(a)}</b>`,...numChoices(c,[a>b?a-b:b-a,c+10,c-100,c+100]),hint:`${L} is the starting number. Undo the subtraction: add ${fmt(b)} back.`,explain:`${L} = ${fmt(a)} + ${fmt(b)} = <b>${fmt(c)}</b>. Check: ${fmt(c)} − ${fmt(b)} = ${fmt(a)}.`}}
    if(k===2){const b=R(3,9),a=R(Dv(3,6,12),Dv(9,12,40));
      return {prompt:`What is <b>${L}</b>? <b>${b} × ${L} = ${b*a}</b>`,...numChoices(a,[b*a-b,a+1,a-1,b*a+b]),hint:`What number times ${b} makes ${b*a}? Divide: ${b*a} ÷ ${b}.`,explain:`${b*a} ÷ ${b} = <b>${a}</b>. Check: ${b} × ${a} = ${b*a}.`}}
    const b=R(3,9),a=R(Dv(3,6,8),Dv(9,12,25));
    return {prompt:`What is <b>${L}</b>? <b>${L} ÷ ${b} = ${a}</b>`,...numChoices(a*b,[a+b,a*b+b,a*b-b,a]),hint:`${L} was split into ${b} equal groups of ${a}. Multiply to undo it.`,explain:`${L} = ${a} × ${b} = <b>${a*b}</b>. Check: ${a*b} ÷ ${b} = ${a}.`};
  }
  const k=R(0,2);
  if(k===0){const g=R(3,8),c=R(Dv(6,12,24),Dv(12,24,48)),e=R(2,9),tot=g*c+e;
    return {prompt:`Mia has <b>${g} boxes</b> of <b>${c} crayons</b> and <b>${e}</b> loose crayons. Which equation finds <b>t</b>, the total number of crayons?`,
      ...strChoices(`t = ${g} × ${c} + ${e}`,[`t = ${g} + ${c} + ${e}`,`t = ${g} × (${c} + ${e})`,`t = ${c} × ${e} + ${g}`]),long:true,
      hint:`First find how many crayons are in the boxes (equal groups). Then add the loose ones.`,explain:`Boxes: ${g} × ${c} = ${g*c}. Plus ${e} loose: <b>t = ${g} × ${c} + ${e}</b> = ${tot} crayons.`}}
  if(k===1){const n=R(2,6),p=R(Dv(5,12,25),Dv(12,30,60)),a=n*p+R(Dv(10,20,50),Dv(50,150,400));
    return {prompt:`Pip has <b>${a} coins</b>. He buys <b>${n} toys</b> that cost <b>${p} coins</b> each. Which equation finds <b>m</b>, the coins he has left?`,
      ...strChoices(`m = ${a} − ${n} × ${p}`,[`m = ${a} − ${n} − ${p}`,`m = ${a} + ${n} × ${p}`,`m = (${a} − ${n}) × ${p}`]),long:true,
      hint:`First find the cost of all the toys (equal groups). Then take that away from what Pip has.`,explain:`Toys cost ${n} × ${p} = ${n*p}. Left: <b>m = ${a} − ${n} × ${p}</b> = ${a-n*p} coins.`}}
  const kk=R(3,8),tot=kk*R(Dv(6,10,20),Dv(12,30,60)),a=R(Math.floor(tot*.3),Math.floor(tot*.7)),b=tot-a;
  return {prompt:`The class picked <b>${a}</b> apples on Monday and <b>${b}</b> on Tuesday. They put them in bags of <b>${kk}</b>. Which equation finds <b>g</b>, the number of bags?`,
    ...strChoices(`g = (${a} + ${b}) ÷ ${kk}`,[`g = ${a} + ${b} ÷ ${kk}`,`g = (${a} + ${b}) × ${kk}`,`g = ${a} × ${b} ÷ ${kk}`]),long:true,
    hint:`First find all the apples together. Then share them into bags. The ( ) show what to do first.`,explain:`All apples: ${a} + ${b} = ${tot}. Bags: ${tot} ÷ ${kk} = ${tot/kk}. So <b>g = (${a} + ${b}) ÷ ${kk}</b>.`};
}
function areaModelSVG(cols,rows,vals,miss){
  const W=300,H=Dv(150,150,170),cw=cols.map(c=>c),ch=rows.map(r=>r),sx=cw.reduce((a,b)=>a+b,0),sy=ch.reduce((a,b)=>a+b,0);
  const ws=cw.map(c=>Math.max(64,c/sx*W)),tw=ws.reduce((a,b)=>a+b,0),hs=ch.map(r=>Math.max(56,r/sy*H)),th=hs.reduce((a,b)=>a+b,0);
  const fills=['#ffd56b','#9be0bd','#8fd3f7','#ffb3c7'];let s='',y=30;
  rows.forEach((r,ri)=>{let x=44;cols.forEach((c,ci)=>{const k=ri*cols.length+ci;s+=`<rect x="${x}" y="${y}" width="${ws[ci]}" height="${hs[ri]}" fill="${fills[k%4]}" stroke="#1f3557" stroke-width="2.5"/><text x="${x+ws[ci]/2}" y="${y+hs[ri]/2+7}" text-anchor="middle" ${FONT} font-size="${k===miss?24:19}" fill="#1f3557">${k===miss?'?':fmt(vals[k])}</text>`;
    if(ri===0)s+=`<text x="${x+ws[ci]/2}" y="20" text-anchor="middle" ${FONT} font-size="18" fill="#1f3557">${fmt(c)}</text>`;x+=ws[ci]});
    s+=`<text x="34" y="${y+hs[ri]/2+6}" text-anchor="end" ${FONT} font-size="18" fill="#1f3557">${fmt(r)}</text>`;y+=hs[ri]});
  return `<svg viewBox="0 0 ${tw+60} ${th+40}" style="width:${Math.min(380,tw+60)}px;max-width:100%" role="img" aria-label="Area model">${s}</svg>`;
}
function genMultX(t){
  const two=DIFF===3&&coin(),a=R(Dv(12,13,21),Dv(29,89,89)),b=two?R(12,39):R(3,9);
  const ap=[a-a%10,a%10].filter(x=>x>0),bp=two?[b-b%10,b%10].filter(x=>x>0):[b],vals=[];bp.forEach(r=>ap.forEach(c=>vals.push(r*c)));const ans=a*b;
  if(coin()&&vals.length>1){const miss=R(0,vals.length-1),mv=vals[miss],mr=bp[Math.floor(miss/ap.length)],mc=ap[miss%ap.length];
    return {prompt:`This area model shows <b>${a} × ${b}</b>. What number goes in the <b>?</b> box?`,visual:areaModelSVG(ap,bp,vals,miss),...numChoices(mv,[mv*10,mv+mc,mr+mc,mv/10,mv+10].filter(Number.isInteger)),
      hint:`Each box is a small rectangle: its side across the top times its side on the left.`,explain:`The ? box is ${fmt(mc)} by ${fmt(mr)}: ${fmt(mc)} × ${fmt(mr)} = <b>${fmt(mv)}</b>.`}}
  return {prompt:`Use the area model. What is <b>${a} × ${b}</b>?`,visual:areaModelSVG(ap,bp,vals,-1),...numChoices(ans,[vals.reduce((x,y)=>x+y,0)+10,ans-vals[vals.length-1],ap.reduce((x,y)=>x+y,0)+bp.reduce((x,y)=>x+y,0),ans+100,ans-10]),
    hint:`Find the area of each small box, then add them all up.`,explain:`${vals.map(fmt).join(' + ')} = <b>${fmt(ans)}</b>. So ${a} × ${b} = ${fmt(ans)}.`};
}
function genDivX(t){
  const d=R(3,9),q=R(Dv(3,5,12),Dv(9,15,60)),r=R(1,d-1),n=q*d+r;
  if(coin()){const it=pick([['crayons','kids'],['marbles','bags'],['stickers','friends'],['seeds','pots'],['cards','players']]);
    return {prompt:`<b>${n}</b> ${it[0]} are shared equally among <b>${d}</b> ${it[1]}. How many ${it[0]} are <b>left over</b>?`,...numChoices(r,[q,d-r,r+1,q+1]),
      hint:`Divide ${n} by ${d}. This time the question asks for the leftover (the remainder), not the answer of the division.`,explain:`${n} ÷ ${d} = ${q} R ${r}. Each gets ${q}, and <b>${r}</b> ${r===1?'is':'are'} left over.`}}
  return {prompt:`What number goes in the box? <b>□ ÷ ${d} = ${q} R ${r}</b>`,...numChoices(n,[q*d,n+d,q*(d+r),q+d+r]),
    hint:`Work backwards: multiply ${q} × ${d}, then add the leftover ${r}.`,explain:`${q} × ${d} = ${q*d}. Add the remainder: ${q*d} + ${r} = <b>${n}</b>. Check: ${n} ÷ ${d} = ${q} R ${r}.`};
}
function genFracX(t){
  const den=pick(Dv([4,5,6,8],[6,8,10,12],[8,10,12]));
  if(t===10){const sub=coin();let a,b;do{a=R(1,den-1);b=R(1,den-1)}while(a===b||(sub&&a<b)||(!sub&&DIFF===1&&a+b>den));if(sub&&a<b)[a,b]=[b,a];
    const n=sub?a-b:a+b,show=n===den?'1':n>den?mixedStr(n,den):`${n}/${den}`;
    const S=sub?pick([[`A ribbon is ${frac(a,den)} yard long. Pip cuts off ${frac(b,den)} yard. How much ribbon is left?`,'yard'],[`The jug had ${frac(a,den)} gallon of juice. The kids drank ${frac(b,den)} gallon. How much juice is left?`,'gallon'],[`Mia's plant is ${frac(a,den)} foot tall. Leo's plant is ${frac(b,den)} foot tall. How much taller is Mia's plant?`,'foot']])
      :pick([[`Pip hiked ${frac(a,den)} mile in the morning and ${frac(b,den)} mile after lunch. How far did he hike in all?`,'miles'],[`Mia drank ${frac(a,den)} liter of water before soccer and ${frac(b,den)} liter after. How much did she drink in all?`,'liters'],[`A recipe uses ${frac(a,den)} cup of sugar and ${frac(b,den)} cup of honey. How many cups is that together?`,'cups']]);
    return {prompt:S[0],...strChoices(show,[`${n}/${den*2}`,`${sub?a+b:Math.abs(a-b)}/${den}`,`${n+1}/${den}`,n>1?`${n-1}/${den}`:`${n}/${den+1}`]),render:fracText,
      hint:`${sub?'Taking away, or how much more':'Putting together'} means ${sub?'subtract':'add'}. The bottom number stays ${den}: only the top numbers change.`,
      explain:`${frac(a,den)} ${sub?'−':'+'} ${frac(b,den)} = ${frac(n,den)}${show!==`${n}/${den}`?` = ${fracText(show)}`:''} ${S[1]}. The pieces are the same size (${den}ths), so ${sub?'subtract':'add'} only the tops.`}}
  let a,n,g=0;do{a=R(2,den-1);n=R(2,Dv(4,6,8))}while((n*a)%den===0&&g++<40);const tot=n*a,lo=Math.floor(tot/den);
  const S=pick([[`Each pizza needs ${frac(a,den)} cup of cheese. Pip makes <b>${n} pizzas</b>.`,'cups of cheese','How much cheese is that? It'],[`Each lap around the pond is ${frac(a,den)} mile. Mia walks <b>${n} laps</b>.`,'miles','How far does she walk? It'],[`Pip feeds his puppy ${frac(a,den)} pound of food each day. He does this for <b>${n} days</b>.`,'pounds of food','How much food is that? It']]);
  return {prompt:`${S[0]} ${S[2]} is between which two whole numbers?`,...strChoices(`${lo} and ${lo+1}`,[`${lo+1} and ${lo+2}`,lo>0?`${lo-1} and ${lo}`:`${lo+2} and ${lo+3}`,`${n} and ${n+1}`,`${lo+2} and ${lo+3}`,`${a} and ${a+1}`]),
    hint:`Multiply first: ${n} × ${frac(a,den)}. Then see how many wholes (${den}/${den}) fit inside.`,
    explain:`${n} × ${frac(a,den)} = ${frac(tot,den)} = ${fracText(mixedStr(tot,den))}. That is more than ${lo} but less than ${lo+1}: between <b>${lo} and ${lo+1}</b> ${S[1]}.`};
}
function genDecX(t){
  if(coin()){const a=R(1,8),b=R(11,Math.min(99-a*10,89));if(b%10===0)return genDecX(t);const sum=a*10+b,ans=dec(sum);
    const S=pick([[`Pip runs <b>${(a/10).toFixed(1)} km</b>, rests, then runs <b>${dec(b)} km</b> more. How far does he run in all?`,'km'],[`A cup holds <b>${(a/10).toFixed(1)} liter</b> of milk. Mia adds <b>${dec(b)} liter</b> more. How much milk is there now?`,'liter']]);
    return {prompt:S[0],...strChoices(ans,[dec(a+b),((a+Math.floor(b/10))/10).toFixed(1),(sum/10).toFixed(1),dec(Math.abs(b-a*10))]),
      hint:`Line up the decimal points. ${(a/10).toFixed(1)} is the same as ${(a/10).toFixed(1)}0.`,explain:`${(a/10).toFixed(1)} = ${dec(a*10)}. Then ${dec(a*10)} + ${dec(b)} = <b>${ans}</b> ${S[1]}.`}}
  const [p,q]=shuffle([...NAMES]).slice(0,2),x=R(2,8);let y;do{y=(x-1)*10+R(1,9)+(coin()?10:0)}while(y===x*10);const B=dec(y),win=x*10>y?p:q;
  return {prompt:`${p} jumps <b>${(x/10).toFixed(1)} meter</b>. ${q} jumps <b>${B} meter</b>. Who jumps <b>farther</b>?`,choices:shuffle([p,q]),answer:win,
    hint:`Give both numbers two places: ${(x/10).toFixed(1)} = ${dec(x*10)}. Then compare.`,explain:`${(x/10).toFixed(1)} = ${dec(x*10)}. ${dec(x*10)} ${x*10>y?'&gt;':'&lt;'} ${B}, so <b>${win}</b> jumps farther.`};
}
function genMeasureX(t){
  if(t===5){const k=R(0,2);
    if(k===0){const L=R(1,3),g=pick([150,200,250,300]),n=R(2,Math.min(5,Math.floor(L*1000/g)-1)),ans=L*1000-n*g;
      return {prompt:`A jug holds <b>${L} liter${L>1?'s':''}</b> of juice. Pip pours <b>${n} glasses</b> of <b>${g} mL</b> each. How many milliliters are left in the jug?`,unit:'mL',...numChoices(ans,[L*1000+n*g,L*1000-g,n*g,L*100-n*g>0?L*100-n*g:ans+100]),
        hint:`1 liter = 1,000 mL. Change the liters first. Then find how much was poured: ${n} × ${g}.`,explain:`${L} L = ${fmt(L*1000)} mL. Poured: ${n} × ${g} = ${fmt(n*g)} mL. Left: ${fmt(L*1000)} − ${fmt(n*g)} = <b>${fmt(ans)} mL</b>.`}}
    if(k===1){const K=R(2,4),u1=R(2,6)*50,u2=R(2,6)*50,ans=K*1000-u1-u2;
      return {prompt:`A bag of flour weighs <b>${K} kg</b>. Pip uses <b>${u1} g</b> for bread and <b>${u2} g</b> for muffins. How many grams are left?`,unit:'g',...numChoices(ans,[K*1000-u1,K*100-u1-u2>0?K*100-u1-u2:ans+50,u1+u2,ans+100]),
        hint:`1 kg = 1,000 g. Change kilograms to grams, then subtract both amounts.`,explain:`${K} kg = ${fmt(K*1000)} g. ${fmt(K*1000)} − ${u1} − ${u2} = <b>${fmt(ans)} g</b>.`}}
    const M=R(2,6),pc=pick([20,25,50]),ans=M*100/pc;
    return {prompt:`A rope is <b>${M} meters</b> long. Pip cuts it into pieces that are <b>${pc} cm</b> long. How many pieces does he get?`,...numChoices(ans,[M*pc,ans/2,ans+M,M*10/pc>0&&Number.isInteger(M*10/pc)?M*10/pc:ans-1]),
      hint:`1 meter = 100 cm. Change ${M} meters into centimeters, then divide by ${pc}.`,explain:`${M} m = ${M*100} cm. ${M*100} ÷ ${pc} = <b>${ans} pieces</b>.`}}
  const w=R(1,Dv(3,5,9)),c=pick([['hours','minutes',60,1,2],['hours','minutes',60,1,4],['hours','minutes',60,3,4],['feet','inches',12,1,2],['feet','inches',12,1,4],['pounds','ounces',16,1,2],['pounds','ounces',16,1,4],['gallons','quarts',4,1,2],['yards','feet',3,1,3],['yards','feet',3,2,3]]);
  const [big,small,f,nu,de]=c,part=f*nu/de,ans=w*f+part;
  return {prompt:`How many <b>${small}</b> are in <b>${mixedHTML(w,nu,de)} ${big}</b>?`,unit:small,...numChoices(ans,[w*f,w*f+f,w*10+part,w*f+nu,ans+part]),
    hint:`1 ${big.replace(/s$/,'').replace(/feet/,'foot')} = ${f} ${small}. Change the ${w} whole ${big} first, then find ${frac(nu,de)} of ${f}.`,
    explain:`${w} × ${f} = ${w*f} ${small}. ${frac(nu,de)} of ${f} is ${f} ÷ ${de}${nu>1?` × ${nu}`:''} = ${part}. Together: ${w*f} + ${part} = <b>${ans} ${small}</b>.`};
}
function genPatternX(t){
  if(t===6){if(coin()){const n=pick(rand()<.08?[1]:coin()?PRIMES.slice(0,12):COMPS),ans=n===1?'Neither':PRIMES.includes(n)?'Prime':'Composite';const fs=[];for(let f=1;f<=n;f++)if(n%f===0)fs.push(f);
      return {prompt:`Is <b>${n}</b> prime or composite?`,choices:['Prime','Composite','Neither'],answer:ans,
        hint:`List the factors of ${n}. Exactly two factors (1 and itself) = prime. More than two = composite.`,
        explain:n===1?`1 has only one factor, so it is <b>neither</b> prime nor composite.`:`The factors of ${n} are ${fs.join(', ')}. That is ${fs.length===2?'exactly two':fs.length+' factors'}, so ${n} is <b>${ans.toLowerCase()}</b>.`}}
    const c=pick(COMPS),ps=shuffle(PRIMES.slice(0,12)).slice(0,3);let f=2;while(c%f)f++;
    return {prompt:`Which number is <b>composite</b>?`,...numChoices(c,ps),hint:`A composite number has more than two factors. Try dividing by 2, 3 or 5.`,explain:`<b>${c}</b> = ${f} × ${c/f}, so it has more than two factors. The others are prime.`}}
  const n=pick([12,16,18,20,24,28,30,36,40,42,48]),pairs=[];for(let f=1;f*f<=n;f++)if(n%f===0)pairs.push([f,n/f]);
  if(coin()){const cnt=pairs.length;return {prompt:`How many <b>factor pairs</b> does <b>${n}</b> have? (Count 1 × ${n} too.)`,...numChoices(cnt,[cnt+1,cnt-1,cnt*2,cnt+2]),
    hint:`Start with 1 × ${n}, then try 2, 3, 4... Stop when the pairs start to repeat.`,explain:`${pairs.map(p=>`${p[0]} × ${p[1]}`).join(', ')}: <b>${cnt}</b> pairs.`}}
  const pr=pick(pairs),wrong=[];for(const [x,y] of shuffle(pairs.slice()))for(const d of [1,-1,2]){const w=`${x} × ${y+d}`;if(x*(y+d)!==n&&y+d>1&&!wrong.includes(w))wrong.push(w)}
  return {prompt:`Which is a <b>factor pair</b> of <b>${n}</b>?`,...strChoices(`${pr[0]} × ${pr[1]}`,shuffle(wrong)),
    hint:`A factor pair is two numbers that multiply to make exactly ${n}.`,explain:`${pr[0]} × ${pr[1]} = ${n}. All the factor pairs of ${n}: ${pairs.map(p=>`${p[0]} × ${p[1]}`).join(', ')}.`};
}
function lineFigSVG(k){const dot=(x)=>`<circle cx="${x}" cy="50" r="7" fill="#1f3557"/>`,arr=(x,dir)=>`<path d="M${x} 50 l${-dir*16} -11 M${x} 50 l${-dir*16} 11" stroke="#1f3557" stroke-width="5" stroke-linecap="round" fill="none"/>`,lab=(x,L)=>`<text x="${x}" y="88" text-anchor="middle" ${FONT} font-size="20" fill="#1f3557">${L}</text>`;
  const ln=(x1,x2)=>`<line x1="${x1}" y1="50" x2="${x2}" y2="50" stroke="#1f3557" stroke-width="5" stroke-linecap="round"/>`;
  const g={Point:dot(150)+lab(150,'A'),Line:ln(20,280)+arr(280,1)+arr(20,-1)+dot(100)+dot(200)+lab(100,'A')+lab(200,'B'),Ray:ln(70,280)+arr(280,1)+dot(70)+dot(190)+lab(70,'A')+lab(190,'B'),'Line segment':ln(70,230)+dot(70)+dot(230)+lab(70,'A')+lab(230,'B')}[k];
  return `<svg viewBox="0 0 300 100" style="width:330px;max-width:100%" role="img" aria-label="A figure to name">${g}</svg>`}
function triSVG(A,B,label){const r=Math.PI/180,C=180-A-B,c=1,b=Math.sin(B*r)/Math.sin(C*r)*c;const P=[[0,0],[c,0],[b*Math.cos(A*r),b*Math.sin(A*r)]];
  const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),mnx=Math.min(...xs),mxx=Math.max(...xs),mxy=Math.max(...ys),sc=Math.min(240/(mxx-mnx),150/mxy);
  const Q=P.map(([x,y])=>[30+(x-mnx)*sc,175-y*sc]),angs=[A,B,C];let marks='';
  Q.forEach((p,i)=>{const ang=angs[i];if(ang===90){const u=Q[(i+1)%3],v=Q[(i+2)%3],n=q=>{const dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy);return [dx/l*16,dy/l*16]},a1=n(u),a2=n(v);
      marks+=`<path d="M${p[0]+a1[0]} ${p[1]+a1[1]} L${p[0]+a1[0]+a2[0]} ${p[1]+a1[1]+a2[1]} L${p[0]+a2[0]} ${p[1]+a2[1]}" fill="none" stroke="#ff6b57" stroke-width="3"/>`}
    if(label){const cx=(Q[0][0]+Q[1][0]+Q[2][0])/3,cy=(Q[0][1]+Q[1][1]+Q[2][1])/3,dx=cx-p[0],dy=cy-p[1],l=Math.hypot(dx,dy),dd=Math.min(34,l*.55);marks+=`<text x="${(p[0]+dx/l*dd).toFixed(1)}" y="${(p[1]+dy/l*dd+5).toFixed(1)}" text-anchor="middle" ${FONT} font-size="14" fill="#1f3557">${ang}°</text>`}});
  return `<svg viewBox="0 0 300 190" style="width:320px;max-width:100%" role="img" aria-label="A triangle"><polygon points="${Q.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="${pick(SHAPE_COLS)}" stroke="#1f3557" stroke-width="3" stroke-linejoin="round"/>${marks}</svg>`}
function genShapeX(t){
  if(t===5){const k=pick(['Point','Line','Ray','Line segment']);
    return {prompt:`What is this called?`,visual:turnBox(lineFigSVG(k)),choices:shuffle(['Point','Line','Ray','Line segment']),answer:k,
      hint:`Look at the ends. An arrow means it keeps going forever. A dot means it stops there.`,
      explain:{Point:`Just one dot, an exact spot: a <b>point</b> (point A).`,Line:`Arrows on both ends: it goes on forever both ways. That is a <b>line</b> (line AB).`,Ray:`It starts at a point (A) and goes on forever one way: a <b>ray</b> (ray AB).`,'Line segment':`It has two endpoints and stops at both: a <b>line segment</b> (segment AB).`}[k]}}
  const ty=pick(['Right','Acute','Obtuse']);let A,B;
  if(ty==='Right'){const o=R(3,6)*10;[A,B]=shuffle([90,o])}else if(ty==='Acute'){do{A=R(10,15)*5;B=R(10,15)*5}while(180-A-B>75||180-A-B<50)}else{const big=R(22,27)*5,s=R(5,Math.max(5,(180-big)/5-4))*5;[A,B]=coin()?[big,s]:[s,big]}
  const ans=`${ty} triangle`;
  return {prompt:`What kind of triangle is this?`,visual:triSVG(A,B,DIFF===1||ty!=='Right'&&DIFF===2),choices:['Right triangle','Acute triangle','Obtuse triangle'],answer:ans,
    hint:`Look at the biggest angle. A square corner (90°) = right. Wider than a square corner = obtuse. All smaller = acute.`,
    explain:{Right:`It has a square corner (90°): a <b>right triangle</b>.`,Acute:`All three angles are smaller than a square corner: an <b>acute triangle</b>.`,Obtuse:`One angle is wider than a square corner (more than 90°): an <b>obtuse triangle</b>.`}[ty]};
}
function adjAngSVG(parts,miss){const cx=150,cy=150,r=110,cols=['#ff6b57','#2f9fe0','#38b98a'];let s='',a0=0;const full=parts.reduce((x,y)=>x+y,0)>=360;
  const pt=(a,rr)=>[(cx+rr*Math.cos(a*Math.PI/180)).toFixed(1),(cy-rr*Math.sin(a*Math.PI/180)).toFixed(1)];
  parts.forEach((p,i)=>{const a1=a0+p,rr=34+i*10,[x0,y0]=pt(a0,rr),[x1,y1]=pt(a1,rr),[tx,ty]=pt(a0+p/2,rr+30);
    s+=`<path d="M${x0} ${y0} A${rr} ${rr} 0 ${p>180?1:0} 0 ${x1} ${y1}" fill="none" stroke="${cols[i]}" stroke-width="4"/><text x="${tx}" y="${+ty+6}" text-anchor="middle" ${FONT} font-size="17" fill="${cols[i]}">${i===miss?'?':p+'°'}</text>`;a0=a1});
  let rays='',a=0;for(let i=0;i<=parts.length;i++){if(i===parts.length&&full)break;const [x,y]=pt(a,r);rays+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#1f3557" stroke-width="4" stroke-linecap="round"/>`;a+=parts[i]||0}
  return `<svg viewBox="0 0 300 300" style="width:300px;max-width:100%" role="img" aria-label="Angles that share a point">${rays}${s}<circle cx="${cx}" cy="${cy}" r="5" fill="#ffc23d" stroke="#1f3557" stroke-width="2"/></svg>`}
function genAngleX(t){
  if(coin()){const a=R(Dv(8,10,10),Dv(17,22,26))*5,b=R(Dv(8,10,10),Dv(14,20,25))*5;if(a+b>320||a+b<=180&&DIFF>1)return genAngleX(t);const ans=a+b;
    return {prompt:`Two angles share a side. What is the angle <b>all together</b>?`,visual:adjAngSVG([a,b],-1),unit:'°',...numChoices(ans,[ans-10,ans+10,Math.abs(a-b),360-ans]),
      hint:`Angles that sit side by side add up. ${a} + ${b}.`,explain:`${a}° + ${b}° = <b>${ans}°</b>.${ans>180?' That is more than a straight angle (180°)!':''}`}}
  const a=R(14,30)*5,b=R(12,Math.min(30,(360-a)/5-10))*5,c=360-a-b,miss=R(0,2),parts=[a,b,c],ans=parts[miss],known=parts.filter((_,i)=>i!==miss);
  return {prompt:`These angles go <b>all the way around</b> the point (a full turn). What is the missing angle?`,visual:adjAngSVG(parts,miss),unit:'°',...numChoices(ans,[180-known[0]>0?180-known[0]:ans+20,ans+10,ans-10,known[0]+known[1]]),
    hint:`A full turn is 360°. Subtract the angles you know.`,explain:`360 − ${known[0]} − ${known[1]} = <b>${ans}°</b>.`};
}

/* ================= Pie Peak, part 2: subtract, mixed numbers, decompose, fraction x whole (4.NF.3-4) ================= */
const fracText=c=>esc(c).replace(/(\d+) (\d+)\/(\d+)/g,(m,w,n,d)=>`${w}${frac(n,d)}`).replace(/(^|[^\d>])(\d+)\/(\d+)/g,(m,p,n,d)=>p+frac(n,d));
const mixedStr=(n,d)=>{const w=Math.floor(n/d),r=n%d;return w?(r?`${w} ${r}/${d}`:`${w}`):`${r}/${d}`};
const mixedHTML=(w,n,d)=>`${w}${frac(n,d)}`;
function piesRow(fill,den,o={}){const per=den,whole=Math.ceil(Math.max(fill,o.total||0)/per)||1;let s='',k=0;
  for(let p=0;p<whole;p++){const on=[];for(let i=0;i<per;i++,k++){if(k<fill)on[i]=(o.cross&&k>=fill-o.cross)?'#c7cfd9':(o.color2&&k>=o.split?'var(--ocean)':'var(--berry)')}on.delays=on.map((_,i)=>(p*per+i)*.12);
    s+=`<svg viewBox="0 0 160 160" style="width:${o.size||96}px">${pieSVG(80,80,70,0,per,on,'#eef2f7')}${o.cross?Array.from({length:per},(_,i)=>{const kk=p*per+i;if(kk<fill-o.cross||kk>=fill)return '';const a=(i+.5)/per*2*Math.PI-Math.PI/2;return `<path class="fadein" style="animation-delay:${.6+i*.15}s" d="M${80+40*Math.cos(a)-9} ${80+40*Math.sin(a)-9} l18 18 m0 -18 l-18 18" stroke="#1f3557" stroke-width="4" stroke-linecap="round"/>`}).join(''):''}</svg>`}
  return s}
function barsRow(n,a,d){let s='';const W=Math.min(46,260/d);for(let g=0;g<n;g++){s+=`<svg viewBox="0 0 ${d*W+4} 34" style="width:${d*W+4}px;max-width:100%">`;for(let i=0;i<d;i++)s+=`<rect x="${2+i*W}" y="4" width="${W-2}" height="26" rx="3" fill="${i<a?['#ffd56b','#8fd3f7','#9be0bd','#ffb3c7','#c7b6ff'][g%5]:'#eef2f7'}" stroke="#1f3557" stroke-width="1.5" class="fadein" style="animation-delay:${g*.4}s"/>`;s+=`</svg>`}return `<div style="display:flex;flex-direction:column;gap:4px;align-items:center">${s}</div>`}
function genFrac(t){
  if(t===15)return genYesNoFrac();
  if(t>=12)return dragFrac(t);
  if(t>=10)return genFracX(t);
  if(t<4)return genFracBase(t);
  if(t===4){const den=pick(Dv([4,5,6],[5,6,8,10],[8,10,12])),a=R(3,den),b=R(1,a-1);
    return {how:['frac4',a,b,den],prompt:`${frac(a,den)} − ${frac(b,den)} = ?`,visual:`<svg class="vis-pie" viewBox="0 0 160 160" role="img" aria-label="${a} of ${den} parts shaded">${pieSVG(80,80,72,a,den)}</svg>`,
      ...strChoices(`${a-b}/${den}`,[`${a+b}/${den}`,`${a-b}/${den*2}`,`${a-b+1}/${den}`,`${b}/${den}`]),anim:piesRow(a,den,{cross:b,size:130}),
      hint:`The pieces are the same size. Take away the top numbers. The bottom stays the same.`,explain:`${a} pieces take away ${b} pieces leaves ${a-b} pieces of ${den}. ${frac(a,den)} − ${frac(b,den)} = ${frac(a-b,den)}.`}}
  if(t===5){const den=pick(Dv([3,4],[3,4,5,6,8],[4,6,8,10,12]));let w1=R(1,Dv(3,5,8)),w2=R(1,Dv(2,4,6)),n1=R(1,den-1),n2=R(1,den-1);
    const sub=coin();if(DIFF<3){if(sub){if(n1<n2)[n1,n2]=[n2,n1];if(w1<w2)[w1,w2]=[w2,w1];if(w1===w2&&n1===n2)n1=Math.min(den-1,n1+1)}else while(n1+n2>=den){n2=R(1,den-1);n1=R(1,den-1)}}
    let A=w1*den+n1,B=w2*den+n2;if(sub&&A<=B){[A,B]=[B,A];[w1,w2]=[w2,w1];[n1,n2]=[n2,n1]}
    if(sub&&A===B){w1++;A+=den}
    const ans=sub?A-B:A+B,show=mixedStr(ans,den);
    const wrong=[sub?`${Math.abs(w1-w2)} ${Math.abs(n1-n2)||1}/${den}`:`${w1+w2} ${(n1+n2)%den||1}/${den}`,mixedStr(ans+den,den),mixedStr(Math.max(1,ans-1),den),`${sub?w1-w2:w1+w2} ${sub?Math.abs(n1-n2)||1:n1+n2}/${den*2}`,mixedStr(ans+1,den)].filter(x=>x!==show&&!/^0 /.test(x));
    return {how:['frac5',sub?'-':'+',den],prompt:`${mixedHTML(w1,n1,den)} ${sub?'−':'+'} ${mixedHTML(w2,n2,den)} = ?`,...strChoices(show,wrong),render:fracText,anim:piesRow(ans,den,{size:70}),
      hint:sub?`Subtract the fractions, then the whole numbers. Not enough pieces? Trade 1 whole for ${den}/${den}.`:`Add the fractions, then the whole numbers. ${den}/${den} or more? That makes 1 more whole.`,
      explain:`Change to ${den}ths: ${A}/${den} ${sub?'−':'+'} ${B}/${den} = ${ans}/${den}. ${ans>=den?`${ans}/${den} = <b>${fracText(show)}</b>.`:''}`}}
  if(t===6){const den=pick(Dv([3,4,5],[4,5,6,8],[6,8,10,12]));
    if(coin()){const n=R(2,Math.min(den-1,4)),ans=Array(n).fill(`1/${den}`).join(' + ');
      return {how:['frac6a',n,den],prompt:`Which is the same as ${frac(n,den)}?`,visual:pieVis(n,den),...strChoices(ans,[Array(n).fill(`1/${n}`).join(' + '),`1/${den} + ${n}/${den}`,`${n}/${den} + ${n}/${den}`,Array(n+1).fill(`1/${den}`).join(' + ')]),render:fracText,
        hint:`${frac(n,den)} is ${n} pieces. Each piece is ${frac(1,den)}.`,explain:`${frac(n,den)} means ${n} pieces of size ${frac(1,den)}: ${fracText(ans)}.`}}
    const w=R(1,Dv(2,3,4)),r=R(1,den-1),n=w*den+r,show=`${w} ${r}/${den}`;
    return {how:['frac6b',n,den],prompt:`Write ${frac(n,den)} as a <b>mixed number</b>.`,...strChoices(show,[`${w+1} ${r}/${den}`,`${w} ${den-r}/${den}`,`${r} ${w}/${den}`,`${w} ${r}/${n}`]),render:fracText,anim:piesRow(n,den,{size:70}),
      hint:`Every ${den} pieces make 1 whole. How many wholes? How many pieces are left?`,explain:`${n} ÷ ${den} = ${w} R ${r}. That is ${w} wholes and ${r} pieces left: <b>${fracText(show)}</b>.`}}
  if(t===8){const den=pick(Dv([2,4],[3,4,6,8],[4,5,6,8,10])),max=Dv(1,1,2);let n;do{n=R(1,max*den-1)}while(n%den===0);const lab=n>den&&DIFF===3?mixedStr(n,den):`${n}/${den}`;
    return {kind:'numline',max,den,target:n,answer:lab,prompt:`Put Pip's flag at <b>${fracText(lab)}</b> on the number line.`,
      hint:`Each whole is split into ${den} equal jumps. Count ${n} jump${n>1?'s':''} from 0.`,explain:`Each jump is ${frac(1,den)}. ${n} jumps from 0 lands on <b>${fracText(lab)}</b>.`}}
  if(t===9){if(DIFF===1||coin()){const parts=pick(Dv([4,5,6],[6,8,10],[8,10,12])),need=R(1,parts-1);
      return {kind:'shade',parts,need,answer:`${need}/${parts}`,prompt:`Tap the bar to shade <b>${frac(need,parts)}</b> of it.`,hint:`The bar has ${parts} equal parts. Shade ${need} of them.`,explain:`${frac(need,parts)} means ${need} out of ${parts} equal parts.`}}
    const b=pick([2,3,4,5,6]),k=pick(b>4?[2]:[2,3]),a=R(1,b-1);
    return {kind:'shade',parts:b*k,need:a*k,answer:`${a*k}/${b*k}`,prompt:`Shade the bar to show a fraction <b>equal to ${frac(a,b)}</b>.`,
      hint:`The bar has ${b*k} parts. Each ${frac(1,b)} is ${k} parts. So ${frac(a,b)} is ${a} groups of ${k}.`,explain:`${frac(a,b)} = ${frac(a*k,b*k)}: multiply the top and bottom by ${k}. Shade <b>${a*k}</b> of the ${b*k} parts.`}}
  const den=pick(Dv([2,3,4],[3,4,5,6,8],[5,6,8,10,12])),a=R(1,den-1),n=R(2,Dv(4,6,9)),tot=n*a,show=tot>den&&tot%den&&DIFF===3?mixedStr(tot,den):`${tot}/${den}`;
  const story=coin()?null:pick([[`Pip uses ${frac(a,den)} cup of flour for one batch of cookies. How much flour for <b>${n} batches</b>?`,'cups'],[`Each lap of the park is ${frac(a,den)} mile. Mia runs <b>${n} laps</b>. How far does she run?`,'miles'],[`A plant grows ${frac(a,den)} inch each week. How much does it grow in <b>${n} weeks</b>?`,'inches']]);
  return {how:['frac7',n,a,den],prompt:story?story[0]:`${n} × ${frac(a,den)} = ?`,...strChoices(show,[`${tot}/${den*n}`,`${n+a}/${den}`,`${a}/${den*n}`,`${tot+1}/${den}`,`${a*n}/${den+n}`]),render:fracText,anim:barsRow(n,a,den),
    hint:`Multiplying a fraction by ${n} means adding it ${n} times. Multiply the top number. The bottom stays the same.`,explain:`${n} × ${frac(a,den)} = ${Array(n).fill(frac(a,den)).join(' + ')} = ${frac(tot,den)}${show!==`${tot}/${den}`?` = ${fracText(show)}`:''}.`};
}
Object.assign(HOW,{
  frac4:(a,b,den)=>{const d2=hDiff(()=>HPICK([5,6,8]),v=>v===den),a2=HR(3,d2-1),b2=HR(1,a2-1);
    return {rule:'Same bottom numbers? Subtract the top numbers. The bottom number stays the same, because the pieces are still the same size.',
      ex:`${a2}/${d2} − ${b2}/${d2}`,steps:[`Start with ${a2} pieces of ${d2}.`,`Take away ${b2} piece${b2>1?'s':''} (crossed out).`,`${a2-b2} pieces are left: <b>${frac(a2-b2,d2)}</b>.`],anim:piesRow(a2,d2,{cross:b2,size:120}),
      mine:[`Top numbers: ${a} − ${b} = ${BLANK}`,`Bottom number stays: ${den}.`]}},
  frac5:(op,den)=>{const d2=hDiff(()=>HPICK([3,4,5]),v=>v===den),sub=op==='-',w1=HR(2,3),n1=sub?HR(2,d2-1):HR(1,d2-1),w2=1,n2=sub?HR(1,n1-1):HR(1,d2-1),A=w1*d2+n1,B=w2*d2+n2,ans=sub?A-B:A+B;
    return {rule:op==='+'?'Add the fraction parts, then the whole numbers. If the fractions make a whole or more, trade it for 1 whole.':'Subtract the fraction parts, then the whole numbers. Not enough pieces? Trade 1 whole for pieces first.',
      ex:`${w1} ${n1}/${d2} ${sub?'−':'+'} ${w2} ${n2}/${d2}`.replace(/(\d+) (\d+)\/(\d+)/g,(m,w,n,d)=>`${w}${frac(n,d)}`),
      steps:sub?[`Fractions: ${frac(n1,d2)} − ${frac(n2,d2)} = ${frac(n1-n2,d2)}.`,`Wholes: ${w1} − ${w2} = ${w1-w2}.`,`Answer: <b>${fracText(mixedStr(ans,d2))}</b>.`]
        :[`Fractions: ${frac(n1,d2)} + ${frac(n2,d2)} = ${frac(n1+n2,d2)}${n1+n2>=d2?` = 1${n1+n2-d2?frac(n1+n2-d2,d2):''}`:''}.`,`Wholes: ${w1} + ${w2}${n1+n2>=d2?' + 1 (traded)':''} = ${w1+w2+(n1+n2>=d2?1:0)}.`,`Answer: <b>${fracText(mixedStr(ans,d2))}</b>.`],
      anim:piesRow(ans,d2,{size:64}),
      mine:[`Do the fraction parts first (bottom number ${den}).`,`Then the whole numbers.`,op==='+'?`Did the fractions make a whole? Add 1 more whole.`:`Top fraction too small? Trade 1 whole for ${den}/${den}.`]}},
  frac6a:(n,den)=>{const d2=hDiff(()=>HPICK([4,5,6]),v=>v===den),n2=HR(2,d2-1);
    return {rule:'A fraction is made of unit fractions. 3/5 means three pieces of 1/5: 1/5 + 1/5 + 1/5.',
      ex:`${n2}/${d2}`,steps:[`${frac(n2,d2)} is ${n2} pieces.`,`Each piece is ${frac(1,d2)}.`,`So ${frac(n2,d2)} = ${fracText(Array(n2).fill(`1/${d2}`).join(' + '))}.`],anim:piesRow(n2,d2,{size:110}),
      mine:[`How many pieces is ${frac(n,den)}? ${BLANK}`,`Each piece is ${frac(1,den)}. Find the choice that adds that many pieces.`]}},
  frac6b:(n,den)=>{const d2=hDiff(()=>HPICK([3,4,5]),v=>v===den),w=HR(1,2),r=HR(1,d2-1),n2=w*d2+r;
    return {rule:'Every time the top number has a full set of bottom-number pieces, that makes 1 whole. Divide: top ÷ bottom = wholes, remainder = pieces left.',
      ex:`${n2}/${d2}`,steps:[`${n2} ÷ ${d2} = ${w} R ${r}.`,`${w} whole pie${w>1?'s':''} and ${r} piece${r>1?'s':''} left.`,`${frac(n2,d2)} = <b>${fracText(`${w} ${r}/${d2}`)}</b>.`],anim:piesRow(n2,d2,{size:80}),
      mine:[`${n} ÷ ${den} = ${BLANK} R ${BLANK}`,`Wholes come first, then the leftover pieces over ${den}.`]}},
  frac7:(n,a,den)=>{const d2=hDiff(()=>HPICK([3,4,5]),v=>v===den),a2=HR(1,d2-1),n2=hDiff(()=>HR(2,4),v=>v===n);
    return {rule:'Whole number × fraction = add the fraction that many times. Multiply the top number; keep the bottom number.',
      ex:`${n2} × ${a2}/${d2}`,steps:[`${n2} groups of ${frac(a2,d2)}: ${Array(n2).fill(frac(a2,d2)).join(' + ')}.`,`Top: ${n2} × ${a2} = ${n2*a2}. Bottom stays ${d2}.`,`Answer: <b>${frac(n2*a2,d2)}</b>.`],anim:barsRow(n2,a2,d2),
      mine:[`Top: ${n} × ${a} = ${BLANK}`,`Bottom stays ${den}.`]}}
});

function placeAnim(n,pos){
  const str=String(n),L=str.length,names=['Ones','Tens','Hundreds','Thousands','Ten thousands','Hundred thousands'];let h='',d='';
  for(let i=0;i<L;i++){h+=`<b>${names[L-1-i]}</b>`;d+=`<span class="dropin${i===pos?' hl':''}" style="animation-delay:${i*.18}s">${str[i]}</span>`}
  return `<div class="placechart" style="grid-template-columns:repeat(${L},minmax(44px,64px))">${h}${d}</div>`;
}
function divAnim(n,d){
  if(n>60||d>9)return '';const q=Math.floor(n/d),r=n%d,cols=Math.min(d,5),pw=96,ph=72;let s='';
  for(let p=0;p<d;p++){const x=10+(p%cols)*(pw+8),y=10+Math.floor(p/cols)*(ph+8);s+=`<rect x="${x}" y="${y}" width="${pw}" height="${ph}" rx="14" fill="#fff5d6" stroke="#e09a14" stroke-width="2"/>`;
    for(let k=0;k<q;k++){const cx=x+12+(k%7)*12,cy=y+14+Math.floor(k/7)*13;s+=`<circle class="dropin" style="animation-delay:${(k*d+p)*0.04}s" cx="${cx}" cy="${cy}" r="5" fill="#ff6b57"/>`}}
  const rows=Math.ceil(d/cols),yy=10+rows*(ph+8);
  for(let k=0;k<r;k++)s+=`<circle class="dropin" style="animation-delay:${(q*d+k)*0.04+.2}s" cx="${20+k*14}" cy="${yy+14}" r="5" fill="#2f9fe0"/>`;
  if(r)s+=`<text x="${30+r*14}" y="${yy+19}" ${FONT} font-size="14" fill="#2f9fe0">left over</text>`;
  return `<svg viewBox="0 0 ${10+cols*(pw+8)} ${yy+(r?30:4)}" style="width:${Math.min(560,10+cols*(pw+8))}px" role="img" aria-label="Sharing into groups">${s}</svg>`;
}
function fracEquivAnim(a,b,k){
  return `<svg viewBox="0 0 160 160" style="width:130px">${pieSVG(80,80,70,a,b)}</svg><span style="font-family:var(--display);font-size:26px;color:#ff6b57">× ${k}</span>
    <svg viewBox="0 0 160 160" style="width:130px"><g style="opacity:0;animation:fadeIn .5s .6s forwards">${pieSVG(80,80,70,a*k,b*k)}</g></svg>`;
}
function fracAddAnim(a,b,den){const on=[];for(let i=0;i<a;i++)on[i]='var(--berry)';for(let i=a;i<a+b;i++)on[i]='var(--ocean)';on.delays=on.map((_,i)=>i*.25);
  return `<svg viewBox="0 0 160 160" style="width:160px">${pieSVG(80,80,72,0,den,on,'#eef2f7')}</svg>`}
function areaAnim(l,w){if(l*w>180)return '';const c=Math.min(22,280/l);let s='';
  for(let y=0;y<w;y++)for(let x=0;x<l;x++)s+=`<rect class="fadein" style="animation-delay:${(y*l+x)*0.02}s" x="${4+x*c}" y="${4+y*c}" width="${c-2}" height="${c-2}" rx="3" fill="#8fd16a"/>`;
  return `<svg viewBox="0 0 ${8+l*c} ${8+w*c}" style="width:${8+l*c}px" role="img" aria-label="Square units">${s}</svg>`}
function periAnim(l,w){const s=Math.min(220/l,120/w),W=l*s,H=w*s;
  return `<svg viewBox="0 0 ${W+100} ${H+60}" style="width:${W+100}px"><rect x="40" y="30" width="${W}" height="${H}" fill="#dff5cf"/><rect class="drawline" x="40" y="30" width="${W}" height="${H}" fill="none" stroke="#ff6b57" stroke-width="6" pathLength="1000"/>
    <text x="${40+W/2}" y="22" text-anchor="middle" ${FONT} font-size="17" fill="#1f3557">${l}</text><text x="${48+W}" y="${34+H/2}" ${FONT} font-size="17" fill="#1f3557">${w}</text>
    <text x="${40+W/2}" y="${H+52}" text-anchor="middle" ${FONT} font-size="17" fill="#1f3557">${l}</text><text x="18" y="${34+H/2}" ${FONT} font-size="17" fill="#1f3557">${w}</text></svg>`}
function coinsAnim(c){return `<div class="coins">${greedy(c).map((v,i)=>`<span class="dropin" style="animation-delay:${i*.25}s">${coinSVG(v,58)}</span>`).join('')}</div>`}

/* ================= question generators: math ================= */
const PLACE=['ones','tens','hundreds','thousands','ten thousands','hundred thousands'];
function genPlace(t){
  if(t===7)return dragPlace();
  if(t>=4)return genPlaceX(t);
  if(t===0){
    const lo=Dv(1000,10000,100000),hi=Dv(9999,99999,999999);
    let n,str,pos,d;do{n=R(lo,hi);str=String(n);pos=R(0,str.length-1);d=+str[pos]}while(d===0);
    const L=str.length,place=L-1-pos,ans=d*10**place;
    let vis='<div class="bignum">';for(let i=0;i<L;i++){vis+=i===pos?`<span class="hl">${str[i]}</span>`:str[i];if((L-1-i)%3===0&&i<L-1)vis+=','}vis+='</div>';
    return {how:['place0',n,pos],prompt:`What is the value of the yellow digit?`,visual:vis,...numChoices(ans,[d*10**(place+1),place>0?d*10**(place-1):d*1000,d*10**(place+2),d+1]),
      hint:`Name the places from the right: ones, tens, hundreds, thousands...`,anim:placeAnim(n,pos),
      explain:`The ${d} is in the <b>${PLACE[place]}</b> place. So it's worth ${d} × ${fmt(10**place)} = <b>${fmt(ans)}</b>.`};
  }
  if(t===1){
    const p=pick(Dv([10,100],[10,100,1000],[1000,10000,100000])),name={10:'ten',100:'hundred',1000:'thousand',10000:'ten thousand',100000:'hundred thousand'}[p];
    let n;do{n=R(Dv(100,1000,10000),Dv(9999,9999,999999))}while(n%p===0||n<p);
    const down=Math.floor(n/p)*p,up=down+p,ans=n-down>=p/2?up:down;
    return {how:['place1',n,p],prompt:`Round <b>${fmt(n)}</b> to the nearest ${name}.`,...numChoices(ans,[ans===up?down:up,Math.round(n/(p*10))*p*10,p>10?Math.round(n/(p/10))*(p/10):n+10,up+p]),
      hint:`Look at the digit just to the right of the ${name}s place. 5 or more rounds up.`,
      explain:`${fmt(n)} is between ${fmt(down)} and ${fmt(up)}. It is ${n-down>=p/2?'halfway or more, so it rounds up':'less than halfway, so it rounds down'} to <b>${fmt(ans)}</b>.`};
  }
  if(t===2){
    const L=Dv(4,5,6),d=[R(1,9),...Array.from({length:L-1},()=>R(0,9))];d[R(1,L-2)]=0;
    const n=+d.join(''),terms=d.map((x,i)=>x*10**(L-1-i)).filter(x=>x>0);
    const s=[...String(n)];const sw=[...s];const i=R(1,L-2);[sw[i],sw[i+1]]=[sw[i+1],sw[i]];
    return {how:['place2'],prompt:`Which number is <b>${terms.map(fmt).join(' + ')}</b>?`,...numChoices(n,[+sw.join(''),+String(n).replace(/0/g,''),+(s.slice(0,L-1).join('')),n+10**(L-1)>=10**L?n-10**(L-1):n+10**(L-1)]),
      hint:`Each part tells you one digit. A place with nothing in it gets a 0.`,explain:`Put each digit in its place: ${terms.map(fmt).join(' + ')} = <b>${fmt(n)}</b>.`};
  }
  const L=Dv(4,5,6),base=String(R(10**(L-1),10**L-1));const set=new Set([+base]);let g=0;
  while(set.size<4&&g++<60){const a=[...base];const i=R(1,L-1),j=R(1,L-1);[a[i],a[j]]=[a[j],a[i]];set.add(+a.join(''))}
  while(set.size<4)set.add(+base+R(1,999));
  const nums=[...set],ans=Math.max(...nums);
  return {how:['place3'],prompt:`Which number is the <b>greatest</b>?`,choices:shuffle(nums.map(fmt)),answer:fmt(ans),
    hint:`Compare digits from left to right. The first place where they are different decides.`,
    explain:`Read from the left. <b>${fmt(ans)}</b> has the biggest digit at the first place where the numbers are different.`};
}
function genMult(t){
  if(t===8)return genCmpEq();
  if(t===7)return genYesNoMult();
  if(t>=6)return genMultX(t);
  if(t>=4)return genMultCmp(t);
  if(t===0){const a=R(Dv(12,120,1000),Dv(99,899,4999)),b=R(3,9),ans=a*b;const s=String(a),parts=[...s].map((c,i)=>+c*10**(s.length-1-i)).filter(x=>x>0);
    return {how:['mult0',a,b],prompt:`${fmt(a)} × ${b} = ?`,...numChoices(ans,[ans+10,ans-10,a*(b-1),ans+100,a*(b+1)]),anim:multAnim(a,parts,b),
      hint:`Break ${fmt(a)} into ${parts.map(fmt).join(' + ')} and multiply each part by ${b}.`,explain:`${parts.map(p=>`${fmt(p)} × ${b} = ${fmt(p*b)}`).join('. ')}. Add them up: <b>${fmt(ans)}</b>.`};}
  if(t===1){const a=R(Dv(11,12,40),Dv(19,49,99));let b;do{b=R(Dv(11,11,40),Dv(19,39,99))}while(b%10===0);const tens=b-b%10,ones=b%10,ans=a*b;
    return {how:['mult1',a,b],prompt:`${a} × ${b} = ?`,...numChoices(ans,[a*ones+a*(tens/10),ans+10,ans-a,ans+b]),anim:multAnim(b,[tens,ones],a),
      hint:`Split ${b} into ${tens} + ${ones}. Find ${a} × ${tens} and ${a} × ${ones}.`,explain:`${a} × ${tens} = ${fmt(a*tens)}. ${a} × ${ones} = ${a*ones}. ${fmt(a*tens)} + ${a*ones} = <b>${fmt(ans)}</b>.`};}
  if(t===2){const a=R(Dv(11,13,105),Dv(30,68,350)),b=R(3,9),ans=a*b;
    const k=R(0,3),story=[`A school bus holds ${a} students. How many students ride in ${b} full buses?`,`Each box has ${a} crayons. How many crayons are in ${b} boxes?`,`A garden has ${b} rows with ${a} tulips in each row. How many tulips in all?`,`Pip flies ${a} miles every day. How far does Pip fly in ${b} days?`][k];
    const visual=k===0?sceneGroups('bus',b,a,'student'):k===1?sceneGroups('box',b,a,'crayon'):k===2?sceneGroups('row',b,a):undefined;
    const s=String(a),parts=[...s].map((c,i)=>+c*10**(s.length-1-i)).filter(x=>x>0);
    return {how:['mult2',a,b],prompt:story,visual,...numChoices(ans,[a+b,ans+10,ans-b,a*(b+1)]),anim:multAnim(a,parts,b),hint:`Equal groups means multiply: ${b} groups of ${a}.`,explain:`${b} groups of ${a}: ${a} × ${b} = <b>${fmt(ans)}</b>.`};}
  const a=R(2,9),z=pick(Dv([10],[10,100,1000],[100,1000])),c=R(2,9),b=c*z,ans=a*b,zeros=String(z).length-1;
  return {how:['mult3',a,c,z],prompt:`${a} × ${fmt(b)} = ?`,...numChoices(ans,[ans*10,ans/10,a*c,ans+b]),hint:`Do ${a} × ${c} first, then think about the zeros.`,explain:`${a} × ${c} = ${a*c}. Then add ${zeros} zero${zeros>1?'s':''}: <b>${fmt(ans)}</b>.`};
}
function genDiv(t){
  if(t>=4)return genDivX(t);
  if(t===0){const d=R(Dv(2,3,4),Dv(6,9,9)),q=R(Dv(4,12,100),Dv(12,99,450)),n=q*d;
    return {how:['div0',n,d],prompt:`${fmt(n)} ÷ ${d} = ?`,...numChoices(q,[q+1,q-1,q+10,q-10]),anim:divAnim(n,d),hint:`Ask yourself: ${d} times what number equals ${fmt(n)}?`,explain:`${d} × ${fmt(q)} = ${fmt(n)}. So ${fmt(n)} ÷ ${d} = <b>${fmt(q)}</b>.`};}
  if(t===1){const d=R(3,Dv(5,8,9)),q=R(Dv(3,4,15),Dv(9,15,60)),r=R(1,d-1),n=q*d+r;
    return {how:['div1',n,d],prompt:`${n} stickers are shared equally by ${d} friends. How many does each friend get, and how many are left over?`,visual:sceneShare('sticker',n,d),
      ...strChoices(`${q} R ${r}`,[`${q+1} R ${r}`,`${q-1} R ${r+d}`,`${q} R 0`,`${q+1} R 0`]),anim:divAnim(n,d),
      hint:`Find the biggest number that times ${d} stays under ${n}. The leftover is the R.`,explain:`${d} × ${q} = ${q*d}. ${n} − ${q*d} = ${r} left over. Answer: <b>${q} R ${r}</b>.`};}
  if(t===2){const a=R(Dv(2,3,6),Dv(9,12,15)),b=R(Dv(2,3,6),Dv(9,12,15));
    return {how:['div2',a*b,b],prompt:`What number goes in the box? <b>□ × ${b} = ${a*b}</b>`,...numChoices(a,[a+1,a-1,b,a+2]),hint:`Divide: ${a*b} ÷ ${b}.`,explain:`${a*b} ÷ ${b} = ${a}. And ${a} × ${b} = ${a*b}. The box is <b>${a}</b>.`};}
  const d=R(4,9),q=R(5,Dv(8,12,25)),r=R(1,d-1),n=q*d+r,needAll=coin(),ans=needAll?q+1:q;
  return {how:['div3',n,d],visual:scenePack(n,d),prompt:`Pip packs ${n} cupcakes into boxes that hold ${d} each. ${needAll?'How many boxes does Pip need for <b>all</b> the cupcakes?':'How many boxes can Pip fill <b>all the way</b>?'}`,
    ...numChoices(ans,[needAll?q:q+1,r,q-1,q+2]),anim:divAnim(n,d),hint:`${n} ÷ ${d} has a leftover. Think about what to do with the leftover cupcakes.`,
    explain:`${n} ÷ ${d} = ${q} R ${r}. ${needAll?`The ${r} leftover cupcakes need one more box, so <b>${ans}</b> boxes.`:`Only ${q} boxes are full. The ${r} leftovers don't fill a box. Answer: <b>${ans}</b>.`}`};
}
function genFracBase(t){
  if(t===0){const den=pick(Dv([2,3,4,6,8],[3,4,5,6,8,10,12],[6,8,10,12])),num=R(1,den-1);
    return {how:['frac0'],prompt:`What fraction of the circle is shaded pink?`,visual:pieVis(num,den),...strChoices(`${num}/${den}`,[`${den-num}/${den}`,`${num}/${den-num}`,`${den}/${num}`,`${num}/${den+1}`]),
      hint:`Bottom number: all the equal parts. Top number: the shaded parts.`,explain:`There are ${den} equal parts and ${num} are shaded. So it's ${frac(num,den)}.`};}
  if(t===1){const [a,b]=pick([[1,2],[1,3],[2,3],[1,4],[3,4],[2,5],[1,5],[3,5]]),k=R(2,Dv(2,4,6));
    return {how:['frac1',a,b],prompt:`Which fraction is equal to ${frac(a,b)}?`,visual:pieVis(a,b),...strChoices(`${a*k}/${b*k}`,[`${a+k}/${b+k}`,`${a}/${b*k}`,`${a*k}/${b}`,`${a*k+1}/${b*k}`]),anim:fracEquivAnim(a,b,k),
      hint:`Multiply the top AND the bottom by the same number.`,explain:`Multiply the top and bottom by ${k}. ${a} × ${k} = ${a*k} and ${b} × ${k} = ${b*k}. So ${frac(a,b)} = ${frac(a*k,b*k)}.`};}
  if(t===2){let a,b,c,d;do{b=pick([2,3,4,5,6,8,10,12]);a=R(1,b-1);d=pick([2,3,4,5,6,8,10,12]);c=R(1,d-1)}while(b===d||a*d===c*b);
    const L=b*d/gcd(b,d),big=a*d>c*b?`${a}/${b}`:`${c}/${d}`;
    return {how:['frac2'],prompt:`Which fraction is <b>bigger</b>?`,visual:`<div class="cmp"><svg viewBox="0 0 160 160">${pieSVG(80,80,72,a,b)}</svg>${frac(a,b)}</div><div class="cmp"><svg viewBox="0 0 160 160">${pieSVG(80,80,72,c,d,'var(--ocean)','#e0f1fc')}</svg>${frac(c,d)}</div>`,
      choices:shuffle([`${a}/${b}`,`${c}/${d}`,'They are equal']),answer:big,hint:`Give them the same bottom number, or compare each one to one half.`,
      explain:`Use ${L} as the bottom number. ${frac(a,b)} = ${frac(a*L/b,L)} and ${frac(c,d)} = ${frac(c*L/d,L)}. So ${frac(...big.split('/'))} is bigger.`};}
  const den=pick(Dv([4,5,6],[5,6,8,10,12],[8,10,12])),a=R(1,den-2),b=R(1,den-1-a);
  return {how:['frac3',a,b,den],prompt:`${frac(a,den)} + ${frac(b,den)} = ?`,...strChoices(`${a+b}/${den}`,[`${a+b}/${den*2}`,`${a+b+1}/${den}`,`${Math.abs(a-b)||1}/${den}`,`${a*b}/${den}`]),anim:fracAddAnim(a,b,den),
    hint:`The bottom numbers match, so only the top numbers change.`,explain:`Same size pieces: ${a} + ${b} = ${a+b} pieces of ${den}. Answer: ${frac(a+b,den)}.`};
}
function genArea(t){
  const w=R(Dv(2,3,8),Dv(6,9,15)),l=R(w+1,Dv(10,15,25)),A=l*w,P=2*(l+w);
  if(t===0)return {how:['area0',l,w],prompt:`Pip is planting a carrot patch. What is its <b>area</b>?`,visual:rectVis(l,w,`${l} ft`,`${w} ft`),unit:'sq ft',...numChoices(A,[P,l+w,A+l,A-w]),anim:areaAnim(l,w),hint:`Area means how many 1-foot squares cover the patch: length × width.`,explain:`Count the squares, or multiply: ${l} × ${w} = <b>${A} square feet</b>.`};
  if(t===1)return {how:['area1',l,w],prompt:`How much fence does Pip need to go all the way <b>around</b> the patch?`,visual:rectVis(l,w,`${l} ft`,`${w} ft`),unit:'ft',...numChoices(P,[A,l+w,2*l+w,P+2]),anim:periAnim(l,w),hint:`Perimeter means the distance around. Add all four sides.`,explain:`${l} + ${w} + ${l} + ${w} = <b>${P} feet</b>.`};
  if(t===2)return {how:['area2',A,w],prompt:`The patch has an area of <b>${A} square feet</b>. One side is ${w} feet. How long is the other side?`,visual:rectVis(l,w,`? ft`,`${w} ft`),unit:'ft',...numChoices(l,[A-w,l+1,l-1,A/w+2]),hint:`Area = length × width. What times ${w} equals ${A}?`,explain:`${A} ÷ ${w} = <b>${l} feet</b>, because ${l} × ${w} = ${A}.`};
  return {how:['area3',P,w],prompt:`The fence around the patch is <b>${P} feet</b> long. The short side is ${w} feet. How long is the long side?`,visual:rectVis(l,w,`? ft`,`${w} ft`),unit:'ft',...numChoices(l,[P-w,P/2,l+2,P-2*w]),anim:periAnim(l,w),hint:`Two short sides use ${2*w} feet. The rest is split between the two long sides.`,explain:`${P} − ${w} − ${w} = ${P-2*w}. Split in half: ${P-2*w} ÷ 2 = <b>${l} feet</b>.`};
}
function genFlash(){const g3=typeof PACK!=='undefined'&&PACK.grade<=3,a=R(2,g3?Dv(5,9,10):Dv(9,12,15)),b=R(2,g3?Dv(5,9,10):Dv(9,12,12));if(rand()<.7)return {prompt:`${a} × ${b}`,...numChoices(a*b,[a*b+a,a*b-b,a*b+b,(a+1)*(b+1)])};return {prompt:`${a*b} ÷ ${b}`,...numChoices(a,[a+1,a-1,b===a?a+2:b,a+2])}}

/* angles */
function angleSVG(d){
  const cx=110,cy=118,r=92,a=d*Math.PI/180,x=cx+r*Math.cos(a),y=cy-r*Math.sin(a),ar=28;
  const mark=d===90?`<path d="M${cx+20} ${cy} V${cy-20} H${cx}" fill="none" stroke="#ff6b57" stroke-width="3"/>`
    :`<path d="M${cx+ar} ${cy} A${ar} ${ar} 0 ${d>180?1:0} 0 ${(cx+ar*Math.cos(a)).toFixed(1)} ${(cy-ar*Math.sin(a)).toFixed(1)}" fill="none" stroke="#ff6b57" stroke-width="3"/>`;
  return `<svg viewBox="0 0 220 132" style="width:340px" role="img" aria-label="An angle">${mark}<line x1="${cx}" y1="${cy}" x2="${cx+r}" y2="${cy}" stroke="#1f3557" stroke-width="5" stroke-linecap="round"/><line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#1f3557" stroke-width="5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="5" fill="#ffc23d" stroke="#1f3557" stroke-width="2"/></svg>`;
}
function protractorSVG(id,d){
  const cx=130,cy=140,r=112;let s='';
  for(let a=0;a<=180;a+=5){const rad=a*Math.PI/180,len=a%30===0?14:a%10===0?9:5;
    s+=`<line x1="${(cx+r*Math.cos(rad)).toFixed(1)}" y1="${(cy-r*Math.sin(rad)).toFixed(1)}" x2="${(cx+(r-len)*Math.cos(rad)).toFixed(1)}" y2="${(cy-(r-len)*Math.sin(rad)).toFixed(1)}" stroke="#1f3557" stroke-width="${a%10===0?2:1}"/>`;
    if(a%30===0){s+=`<text x="${(cx+(r-26)*Math.cos(rad)).toFixed(1)}" y="${(cy-(r-26)*Math.sin(rad)+5).toFixed(1)}" text-anchor="middle" ${FONT} font-size="17" fill="#1f3557">${a}</text>`;
      s+=`<text x="${(cx+(r-46)*Math.cos(rad)).toFixed(1)}" y="${(cy-(r-46)*Math.sin(rad)+4).toFixed(1)}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="700" font-size="13" fill="#ff6b57">${180-a}</text>`}}
  return `<svg class="protractor" ${id?`id="${id}"`:''} viewBox="0 0 260 156" role="img" aria-label="Protractor">
    <path d="M${cx-r} ${cy} A${r} ${r} 0 0 1 ${cx+r} ${cy}Z" fill="#eaf6ff" stroke="#2f9fe0" stroke-width="3"/>${s}
    <line x1="${cx}" y1="${cy}" x2="${cx+r+6}" y2="${cy}" stroke="#1f3557" stroke-width="4" stroke-linecap="round"/>
    <g class="ray"${id?` id="${id}ray"`:''} style="transform:rotate(${-d}deg)"><line x1="${cx}" y1="${cy}" x2="${cx+r+6}" y2="${cy}" stroke="#ff6b57" stroke-width="5" stroke-linecap="round"/><circle cx="${cx+r+6}" cy="${cy}" r="7" fill="#ff6b57"/></g>
    <circle cx="${cx}" cy="${cy}" r="5" fill="#ffc23d" stroke="#1f3557" stroke-width="2"/></svg>`;
}
const angleType=d=>d===90?'Right':d===180?'Straight':d<90?'Acute':'Obtuse';
function genAngle(t){
  if(t===6)return dragAngle();
  if(t>=5)return genAngleX(t);
  if(t===0){const d=pick([R(2,8)*10,90,R(10,17)*10,180,R(3,8)*10,R(11,16)*10]),ans=angleType(d);
    return {prompt:`What kind of angle is this?`,visual:angleSVG(d),choices:shuffle(['Acute','Right','Obtuse','Straight']),answer:ans,
      hint:`Compare it to a square corner (90°). Smaller = acute. Exactly = right. Bigger = obtuse. A flat line = straight.`,
      explain:{Acute:`It's smaller than a square corner (less than 90°). So it's <b>acute</b>.`,Right:`It makes a perfect square corner, exactly 90°. That's a <b>right</b> angle.`,Obtuse:`It's wider than a square corner (more than 90°), but not flat. So it's <b>obtuse</b>.`,Straight:`The two rays make a flat line: 180°. That's a <b>straight</b> angle.`}[ans]};}
  if(t===1){let d;const st=Dv(30,10,5);do{d=R(1,Math.floor(175/st))*st}while(d===90||d>=180);
    return {prompt:`The angle starts at 0 on the right. How many degrees is the red angle?`,visual:protractorSVG('',d),unit:'°',...numChoices(d,[180-d,d+10,d-10,d+5]),
      hint:`The black ray sits on 0 on the right side. So use the big dark numbers that start at 0 on the right.`,
      explain:`Start at 0 on the right. Follow the dark numbers up to the red ray: <b>${d}°</b>. (The small red numbers would give ${180-d}°. That's the other scale.)`};}
  if(t===2){const st=Dv(10,5,5),d=R(Math.ceil(10/st),Math.floor(170/st))*st;return {kind:'angle',target:d,prompt:`Drag the red ray (or tap the buttons) to make an angle of <b>${d}°</b>.`,
      hint:`Start at 0 on the right. The dark numbers count by 30s. Each long tick is 10°, each short tick is 5°.`,explain:`Counting from 0 on the right, the ray should point at <b>${d}°</b>.`};}
  if(t===3){const whole=coin()?90:180,a=whole===90?R(2,16)*5:R(3,33)*5,ans=whole-a;
    return {prompt:`Two angles together make a <b>${whole===90?'right angle (90°)':'straight line (180°)'}</b>. One angle is <b>${a}°</b>. How big is the other?`,
      visual:angleSVG(whole),unit:'°',...numChoices(ans,[a,whole+a,ans+10,ans-10]),hint:`The two parts add up to ${whole}°. Subtract: ${whole} − ${a}.`,explain:`${whole} − ${a} = <b>${ans}°</b>.`};}
  const T=[[1,'a quarter turn',90],[2,'a half turn',180],[3,'three quarter turns',270],[4,'a full turn',360]],k=pick(T),v=R(0,3);
  if(v===1)return {prompt:`Pip's balloon turned <b>${k[2]}°</b>. How much of a full turn is that?`,...strChoices(k[1],T.map(x=>x[1])),
    hint:`A full turn is 360°. Each quarter turn is 90°.`,explain:`${k[2]} ÷ 90 = ${k[0]} quarter turn${k[0]>1?'s':''}, so ${k[2]}° is <b>${k[1]}</b>.`};
  if(v===2){const h=pick([[3,90],[6,180],[9,270]]);return {prompt:`The minute hand moves from the <b>12</b> to the <b>${h[0]}</b>. How many degrees does it turn?`,visual:clockSVG(0,h[0]*5),unit:'°',...numChoices(h[1],[90,180,270,360,45]),
    hint:`From 12 to 3 is a quarter of the clock, so it is a quarter turn.`,explain:`12 to ${h[0]} is ${h[1]/90} quarter turn${h[1]>90?'s':''}: <b>${h[1]}°</b>.`}}
  if(v===3){const n=R(2,4),a=pick([30,45,60,90]);if(n*a>360)return genAngle(4);return {prompt:`Pip turns <b>${a}°</b>, then ${n===2?'again':n-1+' more times'} by ${a}° each time. How many degrees did he turn in all?`,unit:'°',...numChoices(n*a,[a,n*a+a,n*a-a,360-n*a||180]),
    hint:`Turns add up: ${Array(n).fill(a).join(' + ')}.`,explain:`${Array(n).fill(a).join(' + ')} = <b>${n*a}°</b>.`}}
  return {prompt:`Pip spins in his balloon. How many degrees is <b>${k[1]}</b>?`,unit:'°',...numChoices(k[2],[90,180,270,360,45]),
    hint:`A full circle is 360°. Split it into 4 quarters.`,explain:`A full turn is 360°, so each quarter is 90°. ${k[1][0].toUpperCase()+k[1].slice(1)} = <b>${k[2]}°</b>.`};
}

/* shapes */
function regPoly(n,r=40){return Array.from({length:n},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [50+r*Math.cos(a),52+r*Math.sin(a)]})}
const SHAPES={
  square:{name:'square',pts:[[20,20],[80,20],[80,80],[20,80]],right:1,par:1,sym:4},
  rectangle:{name:'rectangle',pts:[[8,30],[92,30],[92,72],[8,72]],right:1,par:1,sym:2},
  rhombus:{name:'rhombus',pts:[[50,8],[84,50],[50,92],[16,50]],right:0,par:1,sym:2},
  parallelogram:{name:'parallelogram',pts:[[28,26],[92,26],[72,74],[8,74]],right:0,par:1,sym:0},
  trapezoid:{name:'trapezoid',pts:[[30,26],[70,26],[92,74],[8,74]],right:0,par:1,sym:1},
  rightTrap:{name:'right trapezoid',pts:[[16,22],[58,22],[88,78],[16,78]],right:1,par:1,sym:0},
  rightTri:{name:'right triangle',pts:[[18,16],[18,82],[88,82]],right:1,par:0,sym:0},
  equiTri:{name:'equilateral triangle',pts:[[50,14],[90,83],[10,83]],right:0,par:0,sym:3},
  isoTri:{name:'isosceles triangle',pts:[[50,8],[76,88],[24,88]],right:0,par:0,sym:1},
  pentagon:{name:'pentagon',pts:regPoly(5),right:0,par:0,sym:5},
  hexagon:{name:'hexagon',pts:regPoly(6),right:0,par:1,sym:6},
  kite:{name:'kite',pts:[[50,8],[80,38],[50,92],[20,38]],right:0,par:0,sym:1}
};
const SHAPE_COLS=['#ffc23d','#8fd16a','#7fd0f5','#ff9fb7','#ffb07a','#c7b6ff'];
function shapeSVG(k,col,extra=''){return `<svg viewBox="0 0 100 100" role="img" aria-label="shape"><polygon points="${SHAPES[k].pts.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="${col||pick(SHAPE_COLS)}" stroke="#1f3557" stroke-width="3" stroke-linejoin="round"/>${extra}</svg>`}
function genShape(t){
  if(t===7)return dragShape();
  if(t>=5)return genShapeX(t);
  if(t===0){const v=coin()?'right':'par';let keys;
    do{keys=shuffle(Object.keys(SHAPES)).slice(0,6)}while(!keys.some(k=>SHAPES[k][v])||keys.every(k=>SHAPES[k][v]));
    const correct=keys.filter(k=>SHAPES[k][v]);
    return {kind:'multi',items:keys.map((k,i)=>({id:k,html:shapeSVG(k,SHAPE_COLS[i])})),correct,
      prompt:v==='right'?`Tap <b>every</b> shape that has at least one <b>right angle</b> (a square corner). Then press Check.`:`Tap <b>every</b> shape that has at least one pair of <b>parallel sides</b>. Then press Check.`,
      hint:v==='right'?`A right angle looks like the corner of a book. Check each corner!`:`Parallel sides go the same direction and never meet, like train tracks.`,
      explain:`Shapes with ${v==='right'?'a right angle':'parallel sides'}: <b>${correct.map(k=>SHAPES[k].name).join(', ')}</b>.`};}
  if(t===1){const k=pick(['square','rectangle','equiTri','isoTri','hexagon','pentagon','kite','parallelogram','rightTri']),n=SHAPES[k].sym;
    return {prompt:`How many <b>lines of symmetry</b> does this shape have?`,visual:`<div style="width:230px;max-width:100%">${shapeSVG(k)}</div>`,...strChoices(String(n),shuffle(['0','1','2','3','4','5','6'])),
      hint:`A line of symmetry folds the shape into two matching halves. Try folding it in your mind in every direction.`,
      explain:`A ${SHAPES[k].name} has <b>${n}</b> line${n===1?'':'s'} of symmetry.${k==='rectangle'?' Careful: the diagonals of a rectangle are NOT lines of symmetry!':''}${k==='parallelogram'?' No fold makes the halves match.':''}`};}
  if(t===2){const k=pick(['parallel','perpendicular','intersecting']);
    const g={parallel:`<line x1="20" y1="40" x2="180" y2="20" /><line x1="20" y1="90" x2="180" y2="70"/>`,intersecting:`<line x1="20" y1="90" x2="180" y2="30"/><line x1="60" y1="10" x2="130" y2="110"/>`,
      perpendicular:`<line x1="30" y1="60" x2="170" y2="60"/><line x1="100" y1="10" x2="100" y2="110"/><path d="M100 60 h12 v-12 h-12" fill="none" stroke-width="2.5"/>`}[k];
    return {prompt:`What kind of lines are these?`,visual:turnBox(`<svg viewBox="0 0 200 120" style="width:320px;max-width:100%" stroke="#1f3557" stroke-width="5" stroke-linecap="round">${g}</svg>`),
      choices:shuffle(['Parallel','Perpendicular','Intersecting']),answer:k[0].toUpperCase()+k.slice(1),
      hint:`Parallel lines never meet. Perpendicular lines meet at a square corner. Intersecting lines cross at any other angle.`,
      explain:{parallel:`They go the same direction and never meet: <b>parallel</b>.`,perpendicular:`They cross and make square corners (90°): <b>perpendicular</b>.`,intersecting:`They cross, but not at a square corner: <b>intersecting</b>.`}[k]};}
  if(t===3){const k=pick(['square','rectangle','rhombus','trapezoid','parallelogram']);
    const avoid={square:['Trapezoid','Kite','Pentagon'],rectangle:['Square','Trapezoid','Kite','Rhombus'],rhombus:['Square','Rectangle','Trapezoid','Kite'],trapezoid:['Square','Rectangle','Parallelogram','Rhombus'],parallelogram:['Square','Trapezoid','Kite','Pentagon']}[k];
    const ans=k[0].toUpperCase()+k.slice(1);
    return {prompt:`What is the <b>best name</b> for this shape?`,visual:`<div style="width:230px;max-width:100%">${shapeSVG(k)}</div>`,...strChoices(ans,shuffle(avoid)),
      hint:`Check: Are all sides equal? Are there square corners? How many pairs of parallel sides?`,
      explain:{square:`4 equal sides and 4 right angles: a <b>square</b>.`,rectangle:`4 right angles, but the sides are not all equal: a <b>rectangle</b>.`,rhombus:`4 equal sides, but no right angles: a <b>rhombus</b>.`,trapezoid:`Exactly one pair of parallel sides: a <b>trapezoid</b>.`,parallelogram:`2 pairs of parallel sides, no right angles, sides not all equal: a <b>parallelogram</b>.`}[k]};}
  const it=pick([['rectangle',[50,22,50,80],1],['rectangle',[8,30,92,72],0],['square',[20,20,80,80],1],['isoTri',[50,4,50,92],1],['isoTri',[10,48,90,48],0],['parallelogram',[50,20,50,80],0],['hexagon',[50,6,50,98],1],['trapezoid',[50,20,50,80],1],['kite',[20,38,80,38],0],['equiTri',[50,8,50,90],1]]);
  const [k,[x1,y1,x2,y2],yes]=it;
  return {prompt:`Is the dashed line a <b>line of symmetry</b>?`,visual:`<div style="width:230px;max-width:100%">${shapeSVG(k,'#7fd0f5',`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ff6b57" stroke-width="3" stroke-dasharray="6 5"/>`)}</div>`,
    choices:['Yes','No'],answer:yes?'Yes':'No',hint:`Imagine folding the shape on the dashed line. Would both halves match perfectly?`,
    explain:yes?`<b>Yes!</b> Folding on that line makes two matching halves.`:`<b>No.</b> If you fold on that line, the two halves don't match.${k==='rectangle'?' A rectangle\'s diagonal is a sneaky trick!':''}`};
}

/* money */
const fmtM=c=>`$${(c/100).toFixed(2)}`;
function coinSVG(v,h=44){
  if(v===100)return `<svg viewBox="0 0 64 34" style="height:${h*0.95}px;width:auto" aria-label="one dollar bill"><rect x="1" y="1" width="62" height="32" rx="4" fill="#a8dca2" stroke="#2b8a62" stroke-width="2"/><rect x="6" y="6" width="52" height="22" rx="3" fill="none" stroke="#2b8a62" stroke-width="1.5"/><circle cx="32" cy="17" r="8" fill="#d7f1d3" stroke="#2b8a62" stroke-width="1.2"/><text x="32" y="22" ${FONT} font-size="13" text-anchor="middle" fill="#1f5e3a">$1</text></svg>`;
  const [r,f,s,name]={25:[21,'#dfe4ec','#6f7c8f','quarter'],10:[17,'#e6eaf1','#6f7c8f','dime'],5:[19,'#cfd5de','#5f6a7c','nickel'],1:[18,'#eaa56b','#a85a2a','penny']}[v];
  const sz=h*r/20;
  return `<svg viewBox="-22 -22 44 44" style="width:${sz}px;height:${sz}px" aria-label="${name}"><circle r="${r}" fill="${f}" stroke="${s}" stroke-width="3"/><circle r="${r-4}" fill="none" stroke="${s}" stroke-width="1" stroke-dasharray="2 2"/><text y="5" ${FONT} font-size="${r>18?14:12.5}" text-anchor="middle" fill="#1f3557">${v}¢</text></svg>`;
}
const greedy=c=>{const out=[];for(const v of [100,25,10,5,1])while(c>=v){out.push(v);c-=v}return out};
const ITEMS=['a kite','a yo-yo','a comic book','a smoothie','a pack of stickers','a toy boat','a bag of popcorn','a jump rope','a notebook','a lemonade'];
function genMoney(t){
  if(t===0){const p=R(Dv(10,26,150),Dv(99,185,499));return {kind:'money',target:p,prompt:`Pip wants ${pick(ITEMS)}. Tap the coins and bills to pay <b>exactly</b> the price.`,anim:coinsAnim(p),
    hint:`Start with the biggest money first: dollars, then quarters, dimes, nickels, and pennies last.`,explain:`One way to pay ${fmtM(p)}: ${greedy(p).map(v=>v===100?'$1':v+'¢').join(' + ')}.`};}
  if(t===1){let set;do{set=[...Array(R(0,Dv(0,1,3))).fill(100),...Array(R(0,3)).fill(25),...Array(R(0,4)).fill(10),...Array(R(0,2)).fill(5),...Array(R(0,4)).fill(1)]}while(set.length<3);
    const tot=set.reduce((a,b)=>a+b,0);
    return {prompt:`How much money is this?`,visual:`<div class="coins">${set.map(v=>coinSVG(v,72)).join('')}</div>`,...strChoices(fmtM(tot),[fmtM(tot+5),fmtM(tot+10),fmtM(Math.max(1,tot-10)),fmtM(tot+25),fmtM(tot+1)]),
      hint:`Count the biggest coins first, then keep counting on: 25, 50, 75... then 10s, 5s, and 1s.`,explain:`${set.map(v=>v===100?'$1':v+'¢').join(' + ')} = <b>${fmtM(tot)}</b>.`};}
  if(t===2){const pay=pick(Dv([100,500],[500,1000],[1000,2000])),p=R(Math.floor(pay*.21),Math.floor(pay*.95)),ch=pay-p;
    const it=pick(ITEMS);return {visual:sceneShop([[it.replace(/^an? /,''),fmtM(p)]],fmtM(pay)),prompt:`Pip buys ${it} for <b>${fmtM(p)}</b>. He pays with <b>${fmtM(pay)}</b>. How much change does he get?`,...strChoices(fmtM(ch),[fmtM(ch+10),fmtM(ch-10>0?ch-10:ch+5),fmtM(ch+100),fmtM(p)]),
      hint:`Change = money paid − price. Or count up from ${fmtM(p)} to ${fmtM(pay)}.`,explain:`${fmtM(pay)} − ${fmtM(p)} = <b>${fmtM(ch)}</b>.`};}
  if(t===3){const a=R(35,Dv(150,350,950)),b=R(25,Dv(150,299,899)),s=a+b;const i1=pick(ITEMS);let i2;do{i2=pick(ITEMS)}while(i2===i1);
    return {visual:sceneShop([[i1.replace(/^an? /,''),fmtM(a)],[i2.replace(/^an? /,''),fmtM(b)]]),prompt:`Pip buys ${i1} for <b>${fmtM(a)}</b> and ${i2} for <b>${fmtM(b)}</b>. How much does he spend in all?`,...strChoices(fmtM(s),[fmtM(s+100),fmtM(s-10),fmtM(s+10),fmtM(Math.abs(a-b))]),
      hint:`Add the dollars and the cents. Remember: 100¢ makes $1.`,explain:`${fmtM(a)} + ${fmtM(b)} = <b>${fmtM(s)}</b>.`};}
  const p=R(3,19)*5,n=R(2,Dv(4,6,9)),s=p*n;
  return {prompt:`One sticker costs <b>${p}¢</b>. How much do <b>${n} stickers</b> cost?`,...strChoices(fmtM(s),[fmtM(s+p),fmtM(s-p),fmtM(p+n),fmtM(s+10)]),
    hint:`Multiply: ${p} × ${n}. Then write the cents as dollars.`,explain:`${p}¢ × ${n} = ${s}¢ = <b>${fmtM(s)}</b>.`};
}

/* decimals */
function gridVis(n){let s='';for(let i=0;i<100;i++){const x=(i%10)*14,y=Math.floor(i/10)*14;s+=`<rect x="${x+1}" y="${y+1}" width="12" height="12" rx="2" fill="${i<n?'#e2558f':'#eef5fb'}"/>`}
  return `<svg viewBox="0 0 141 141" style="width:250px" role="img" aria-label="Hundred grid">${s}</svg>`}
const dec=n=>(n/100).toFixed(2);
function genDec(t){
  if(t===7)return dragDec();
  if(t>=6)return genDecX(t);
  if(t===0){if(DIFF===1||coin()){const n=R(1,9);return {prompt:`Write ${frac(n,10)} as a decimal.`,...strChoices(`0.${n}`,[`0.0${n}`,`${n}.0`,`0.${n}${n}`,`${n}.10`]),hint:`Tenths go in the first place right after the decimal point.`,explain:`${n} tenths = <b>0.${n}</b>.`}}
    let n;do{n=R(11,99)}while(n%10===0);const rev=+String(n).split('').reverse().join('');
    return {prompt:`Write ${frac(n,100)} as a decimal.`,...strChoices(dec(n),[(n/10).toFixed(1),String(n),dec(rev),`0.0${n}`]),hint:`Hundredths need two places after the decimal point.`,explain:`${n} hundredths = <b>${dec(n)}</b>.`};}
  if(t===1){let n;do{n=R(11,99)}while(n%10===0);
    return {prompt:`Which fraction is the same as <b>${dec(n)}</b>?`,...strChoices(`${n}/100`,[`${n}/10`,`${n}/1000`,`1/${n}`,`${n%10}/${Math.floor(n/10)}`]),hint:`Two places after the point means hundredths.`,explain:`${dec(n)} is ${n} hundredths: ${frac(n,100)}.`};}
  if(t===2){const x=R(2,8);const b=coin()?(x-1)*10+R(1,9):x*10+R(1,9);const a=`0.${x}`,bs=dec(b),ans=x*10>b?a:bs;
    return {prompt:`Which decimal is <b>greater</b>?`,visual:`<div class="seq"><span>${a}</span><span>${bs}</span></div>`,choices:shuffle([a,bs,'They are equal']),answer:ans,
      hint:`Give them the same number of places: ${a} is the same as ${a}0.`,explain:`${a} = ${a}0, and ${a}0 ${x*10>b?'>':'<'} ${bs}. So <b>${ans}</b> is greater.`};}
  if(t===3){const n=R(5,95);return {prompt:`What decimal names the shaded part of the grid?`,visual:gridVis(n),...strChoices(dec(n),[dec(100-n),(n/10).toFixed(1),`${n}.0`,(n/1000).toFixed(3)]),
    hint:`The grid has 100 squares. Count the pink ones: that's how many hundredths.`,explain:`${n} out of 100 squares are pink: ${frac(n,100)} = <b>${dec(n)}</b>.`};}
  if(t===5){const max=Dv(1,1,2);let n;do{n=R(1,max*10-1)}while(n%10===0);const lab=(n/10).toFixed(1);
    return {kind:'numline',max,den:10,target:n,dec:true,answer:lab,prompt:`Put Pip's flag at <b>${lab}</b> on the number line.`,hint:`Each whole is split into 10 jumps. Each jump is one tenth: 0.1.`,explain:`${lab} is ${n} tenths: ${n} jumps of 0.1 from 0.`}}
  const a=R(1,8),b=R(1,9),ans=`${a*10+b}/100`;
  return {prompt:`${frac(a,10)} + ${frac(b,100)} = ?`,...strChoices(ans,[`${a+b}/110`,`${a+b}/100`,`${a+b}/10`,`${a*10+b}/10`]),
    hint:`Change the tenths into hundredths first: ${frac(a,10)} = ${frac(a*10,100)}.`,explain:`${frac(a,10)} = ${frac(a*10,100)}. Then ${a*10} + ${b} = ${a*10+b}. The sum is ${frac(a*10+b,100)}.`};
}

/* measurement */
const CONV=[{big:'foot',bigs:'feet',small:'inches',f:12},{big:'yard',bigs:'yards',small:'feet',f:3},{big:'hour',bigs:'hours',small:'minutes',f:60},{big:'minute',bigs:'minutes',small:'seconds',f:60},
  {big:'pound',bigs:'pounds',small:'ounces',f:16},{big:'gallon',bigs:'gallons',small:'quarts',f:4},{big:'meter',bigs:'meters',small:'centimeters',f:100},{big:'kilogram',bigs:'kilograms',small:'grams',f:1000},
  {big:'liter',bigs:'liters',small:'milliliters',f:1000},{big:'day',bigs:'days',small:'hours',f:24},{big:'week',bigs:'weeks',small:'days',f:7}];
const UNITGROUPS={length:['inches','feet','yards','miles'],weight:['ounces','pounds','tons'],capacity:['cups','quarts','gallons'],time:['seconds','minutes','hours','days']};
const UNITQ=[['the length of a pencil','inches','length'],['the distance between two cities','miles','length'],['the height of a door','feet','length'],['the length of a soccer field','yards','length'],
  ['the weight of an apple','ounces','weight'],['the weight of a dog','pounds','weight'],['the weight of a school bus','tons','weight'],['the milk in a glass','cups','capacity'],['the water in a bathtub','gallons','capacity'],
  ['the time to brush your teeth','minutes','time'],['the time to blink','seconds','time'],['the time of a long road trip','hours','time'],['the time of summer vacation','days','time']];
function genMeasure(t){
  if(t===7)return genMeasLine();
  if(t>=5)return genMeasureX(t);
  const c=pick(DIFF===1?CONV.filter(x=>x.f<=24):CONV);
  if(t===0){const n=R(2,Dv(5,9,15)),ans=n*c.f;return {prompt:`1 ${c.big} = ${fmt(c.f)} ${c.small}. How many ${c.small} are in <b>${n} ${c.bigs}</b>?`,...numChoices(ans,[ans+c.f,ans-c.f,n+c.f,n*10]),
    hint:`Each ${c.big} is ${fmt(c.f)} ${c.small}. Multiply ${n} × ${fmt(c.f)}.`,explain:`${n} × ${fmt(c.f)} = <b>${fmt(ans)} ${c.small}</b>.`};}
  if(t===1){const n=R(2,5),eq=rand()<.2,small=eq?n*c.f:n*c.f+(coin()?1:-1)*R(1,Math.max(1,Math.floor(c.f/2)));
    const A=`${n} ${c.bigs}`,B=`${fmt(small)} ${c.small}`,ans=eq?'They are the same':(small>n*c.f?B:A);
    return {prompt:`Which is <b>more</b>?`,visual:`<div class="seq"><span>${A}</span><span>${B}</span></div>`,choices:shuffle([A,B,'They are the same']),answer:ans,
      hint:`Change ${A} into ${c.small} first: ${n} × ${fmt(c.f)}.`,explain:`${A} = ${fmt(n*c.f)} ${c.small}. Compare with ${B}: ${eq?'they are <b>the same</b>':`<b>${ans}</b> is more`}.`};}
  if(t===2){const n=R(3,Dv(5,8,12)),cut=R(5,n*12-5),ans=n*12-cut;
    return {visual:sceneRope(`${n} ft`,`${cut} in`,'cut'),prompt:`Pip's rope is <b>${n} feet</b> long. He cuts off <b>${cut} inches</b>. How many inches of rope are left?`,unit:'in',...numChoices(ans,[n*12+cut,Math.abs(n*10-cut),ans+12,ans-12]),
      hint:`First change ${n} feet into inches: ${n} × 12.`,explain:`${n} feet = ${n*12} inches. ${n*12} − ${cut} = <b>${ans} inches</b>.`};}
  if(t===3){const [what,u,g]=pick(UNITQ);
    return {prompt:`Which unit is best to measure <b>${what}</b>?`,...strChoices(u,shuffle(UNITGROUPS[g].filter(x=>x!==u)).concat(shuffle(Object.values(UNITGROUPS).flat()))),
      hint:`Think about how big it is. Small things use small units, big things use big units.`,explain:`For ${what}, <b>${u}</b> make the most sense.`};}
  const h=R(1,Dv(2,4,9)),m=R(1,11)*5,ans=h*60+m;
  return {prompt:`Pip practiced piano for <b>${h} hour${h>1?'s':''} and ${m} minutes</b>. How many minutes is that?`,unit:'min',...numChoices(ans,[h*100+m,h*60,h+m,ans+60]),
    hint:`1 hour = 60 minutes. Change the hours first, then add the extra minutes.`,explain:`${h} × 60 = ${h*60} minutes. Plus ${m} = <b>${ans} minutes</b>.`};
}

/* patterns */
const PRIMES=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47],COMPS=[4,6,8,9,10,12,14,15,16,18,20,21,22,25,26,27,28,33,35,39];
const SHAPE_ICON={circle:['#ff6b57','<circle cx="20" cy="20" r="15"/>'],triangle:['#2f9fe0','<path d="M20 4 L37 35 H3Z"/>'],square:['#38b98a','<rect x="5" y="5" width="30" height="30" rx="3"/>'],
  star:['#ffc23d','<path d="M20 3l5 10.5 11.5 1.6-8.3 8 2 11.4L20 29l-10.2 5.5 2-11.4-8.3-8 11.5-1.6z"/>'],heart:['#e2558f','<path d="M20 35s-15-9-15-19a7.5 7.5 0 0 1 15-3 7.5 7.5 0 0 1 15 3c0 10-15 19-15 19z"/>']};
const shapeIcon=(n,s=40)=>`<svg viewBox="0 0 40 40" style="width:${s}px;height:${s}px" fill="${SHAPE_ICON[n][0]}" stroke="#1f3557" stroke-width="2" aria-label="${n}">${SHAPE_ICON[n][1]}</svg>`;
function genPattern(t){
  if(t===10)return genPatFeat();
  if(t>=8)return dragPattern(t);
  if(t>=6)return genPatternX(t);
  if(t===0){if(DIFF===1||coin()){const a=R(1,30),s=R(Dv(2,3,7),Dv(5,12,25)),seq=[0,1,2,3].map(k=>a+k*s),ans=a+4*s;
      return {prompt:`What number comes next?`,visual:`<div class="seq">${seq.map(x=>`<span>${x}</span>`).join('')}<span class="q">?</span></div>`,...numChoices(ans,[ans+1,ans-1,ans+s,a+3*s+s-1]),
        hint:`How much does it grow each time? Look at the jump between neighbors.`,explain:`Each number is <b>${s} more</b> than the one before. ${a+3*s} + ${s} = <b>${ans}</b>.`}}
    const a=R(1,5),m=pick([2,3]),seq=[0,1,2,3].map(k=>a*m**k),ans=a*m**4;
    return {prompt:`What number comes next?`,visual:`<div class="seq">${seq.map(x=>`<span>${x}</span>`).join('')}<span class="q">?</span></div>`,...numChoices(ans,[seq[3]+(seq[3]-seq[2]),ans+m,ans-1,seq[3]*m+m]),
      hint:`The jumps keep getting bigger. Try multiplying!`,explain:`Each number is <b>${m} times</b> the one before. ${seq[3]} × ${m} = <b>${ans}</b>.`};}
  if(t===1){const a=R(1,20),s=R(2,Dv(5,9,19)),seq=[0,1,2,3].map(k=>a+k*s);
    return {prompt:`What is the <b>rule</b> for this pattern?`,visual:`<div class="seq">${seq.map(x=>`<span>${x}</span>`).join('')}</div>`,...strChoices(`Add ${s}`,[`Add ${s+1}`,`Add ${s-1}`,'Multiply by 2',`Subtract ${s}`]),
      hint:`Subtract two neighbors: ${seq[1]} − ${seq[0]}.`,explain:`${seq[1]} − ${seq[0]} = ${s}, and it's the same jump every time. The rule is <b>Add ${s}</b>.`};}
  if(t===2){const n=pick([12,16,18,20,24,28,30,36,40,42,48]),facs=[];for(let f=2;f<n;f++)if(n%f===0&&f<=12)facs.push(f);const f=pick(facs);
    const non=shuffle([2,3,4,5,6,7,8,9,10,11,12].filter(x=>n%x!==0));
    return {prompt:`Which number is a <b>factor</b> of ${n}?`,...numChoices(f,non),hint:`A factor divides ${n} evenly, with nothing left over.`,explain:`${n} ÷ ${f} = ${n/f} with nothing left over. So <b>${f}</b> is a factor of ${n}.`};}
  if(t===3){const p=pick(PRIMES),cs=shuffle([...COMPS]).slice(0,3);
    const ex=(()=>{for(let f=2;f<cs[0];f++)if(cs[0]%f===0)return `${f} × ${cs[0]/f}`})();
    return {prompt:`Which number is <b>prime</b>?`,...numChoices(p,cs),hint:`A prime number has only two factors: 1 and itself. Try dividing each by 2, 3 or 5.`,
      explain:`<b>${p}</b> can only be divided evenly by 1 and ${p}. The others have more factors (like ${cs[0]} = ${ex}).`};}
  if(t===4){const k=R(3,9),m=R(2,Dv(5,9,15)),ans=k*m;
    return {prompt:`Which number is a <b>multiple</b> of ${k}?`,...numChoices(ans,[ans+1,ans-1,ans+2,ans+k-1].filter(x=>x%k!==0)),hint:`Multiples of ${k} are in the ${k} times table.`,explain:`${k} × ${m} = <b>${ans}</b>. So it's a multiple of ${k}.`};}
  const names=shuffle(Object.keys(SHAPE_ICON)),unit=pick([[0,1],[0,1,2],[0,0,1],[0,1,1]]).map(i=>names[i]);
  const seq=Array.from({length:7},(_,i)=>unit[i%unit.length]),ans=unit[7%unit.length];
  return {prompt:`Which shape comes next in the pattern?`,visual:`<div class="seq" style="align-items:center">${seq.map(s=>shapeIcon(s,56)).join('')}<span class="q">?</span></div>`,
    ...strChoices(ans,[...new Set(unit)].concat(names)),render:c=>shapeIcon(c,66),hint:`Find the part that repeats. Say it out loud!`,
    explain:`The repeating part is ${unit.join(', ')}. So next comes the <b>${ans}</b>.`};
}

/* graphs */
const GSETS=[['Apples','Pears','Plums','Figs','trees Pip planted'],['Soccer','Tag','Chess','Kites','votes for favorite game'],['Red','Blue','Green','Yellow','votes for favorite color'],['Cats','Dogs','Fish','Birds','pets in Pip\'s class']];
function barChart(cats,vals){
  const n=cats.length,top=Math.max(2,Math.ceil(Math.max(...vals)/2)*2),x0=40,x1=300,y0=168,y1=16,H=y0-y1,bw=(x1-x0)/n,cols=['#ff6b57','#2f9fe0','#38b98a','#ffc23d'];let s='';
  for(let v=0;v<=top;v++){const y=y0-v/top*H;s+=`<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#d3e3f2" stroke-width="${v%2?0.8:1.4}"/>`;if(v%2===0)s+=`<text x="${x0-8}" y="${y+5}" text-anchor="end" font-size="15" font-weight="700" fill="#506686">${v}</text>`}
  cats.forEach((c,i)=>{const h=vals[i]/top*H,x=x0+i*bw+bw*.18;s+=`<rect x="${x}" y="${y0-h}" width="${bw*.64}" height="${h}" rx="4" fill="${cols[i]}"/><text x="${x+bw*.32}" y="${y0+20}" text-anchor="middle" font-size="16" font-weight="800" fill="#1f3557">${c}</text>`});
  return `<svg viewBox="0 0 310 196" class="chart" role="img" aria-label="Bar graph">${s}<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="#1f3557" stroke-width="2"/><line x1="${x0}" y1="${y1}" x2="${x0}" y2="${y0}" stroke="#1f3557" stroke-width="2"/></svg>`;
}
const FLOWER=`<svg viewBox="0 0 26 26"><g fill="#e2558f"><circle cx="13" cy="6" r="5"/><circle cx="20" cy="13" r="5"/><circle cx="13" cy="20" r="5"/><circle cx="6" cy="13" r="5"/></g><circle cx="13" cy="13" r="4" fill="#ffc23d"/></svg>`;
function genGraph(t){
  if(t===5)return genGraphFrac();
  const set=pick(GSETS),cats=set.slice(0,4),what=set[4];
  if(t<3){const vals=shuffle([1,2,3,4,5,6,7,8,9,10,11,12]).slice(0,4),vis=barChart(cats,vals);
    if(t===0){let i,j;do{i=R(0,3);j=R(0,3)}while(i===j||vals[i]<=vals[j]);const ans=vals[i]-vals[j];
      return {prompt:`The graph shows ${what}. How many more <b>${cats[i]}</b> than <b>${cats[j]}</b>?`,visual:vis,...numChoices(ans,[vals[i],vals[j],vals[i]+vals[j],ans+1]),
        hint:`Read the top of each bar on the number side, then subtract.`,explain:`${cats[i]}: ${vals[i]}. ${cats[j]}: ${vals[j]}. ${vals[i]} − ${vals[j]} = <b>${ans}</b>.`};}
    if(t===1){const most=coin(),v=most?Math.max(...vals):Math.min(...vals),ans=cats[vals.indexOf(v)];
      return {prompt:`The graph shows ${what}. Which has the <b>${most?'most':'fewest'}</b>?`,visual:vis,choices:shuffle([...cats]),answer:ans,
        hint:`Look for the ${most?'tallest':'shortest'} bar.`,explain:`The ${most?'tallest':'shortest'} bar is <b>${ans}</b> with ${v}.`};}
    let i,j;do{i=R(0,3);j=R(0,3)}while(i===j);const ans=vals[i]+vals[j];
    return {prompt:`The graph shows ${what}. How many <b>${cats[i]}</b> and <b>${cats[j]}</b> together?`,visual:vis,...numChoices(ans,[Math.abs(vals[i]-vals[j]),ans+2,ans-1,vals[i]*2]),
      hint:`Read both bars, then add.`,explain:`${vals[i]} + ${vals[j]} = <b>${ans}</b>.`};}
  if(t===3){const vals=cats.map(()=>R(1,6)*2),i=R(0,3);
    const vis=`<div class="picto">${cats.map((c,k)=>`<div><span>${c}</span>${FLOWER.repeat(vals[k]/2)}</div>`).join('')}<div class="key">Key: ${FLOWER} = 2 votes</div></div>`;
    return {prompt:`This picture graph shows ${what}. How many votes did <b>${cats[i]}</b> get?`,visual:vis,...numChoices(vals[i],[vals[i]/2,vals[i]+2,vals[i]-1,vals[i]+1]),
      hint:`Look at the key! Each flower is worth 2, not 1.`,explain:`${cats[i]} has ${vals[i]/2} flowers. ${vals[i]/2} × 2 = <b>${vals[i]}</b> votes.`};}
  let cnt;do{cnt=[1,2,3,4,5].map(()=>R(0,4))}while(cnt.reduce((a,b)=>a+b,0)<4||cnt.filter(c=>c===Math.max(...cnt)).length>1);
  let s='';cnt.forEach((c,i)=>{const x=40+i*55;s+=`<line x1="${x}" y1="128" x2="${x}" y2="136" stroke="#1f3557" stroke-width="2"/><text x="${x}" y="154" text-anchor="middle" font-size="15" font-weight="800" fill="#1f3557">${i+1}</text>`;
    for(let k=0;k<c;k++)s+=`<text x="${x}" y="${118-k*22}" text-anchor="middle" ${FONT} font-size="22" fill="#e2558f">X</text>`});
  const vis=`<svg viewBox="0 0 300 166" class="chart" role="img" aria-label="Line plot"><line x1="20" y1="132" x2="280" y2="132" stroke="#1f3557" stroke-width="2.5"/>${s}<text x="150" y="166" text-anchor="middle" font-size="12" fill="#506686" font-weight="700">worm length (inches)</text></svg>`;
  const k=R(0,2);
  if(k===0){const tot=cnt.reduce((a,b)=>a+b,0);return {prompt:`Each X is one worm Pip measured. How many worms did he measure in all?`,visual:vis,...numChoices(tot,[tot+1,tot-1,5,tot+2]),hint:`Count every X on the line plot.`,explain:`${cnt.join(' + ')} = <b>${tot}</b> worms.`};}
  if(k===1){const L=R(1,4),ans=cnt.slice(L).reduce((a,b)=>a+b,0);return {prompt:`Each X is one worm. How many worms are <b>longer than ${L} inches</b>?`,visual:vis,...numChoices(ans,[ans+cnt[L-1],ans+1,cnt[L],ans+2,ans+3]),
    hint:`Only count the X's to the right of ${L}. Don't count ${L} itself!`,explain:`Longer than ${L}: ${cnt.slice(L).join(' + ')} = <b>${ans}</b>.`};}
  const mx=Math.max(...cnt),ans=String(cnt.indexOf(mx)+1);
  return {prompt:`Which worm length is the <b>most common</b>?`,visual:vis,unit:'in',choices:shuffle(['1','2','3','4','5']).filter(x=>x!==ans).slice(0,3).concat(ans).sort(),answer:ans,
    hint:`Find the tallest stack of X's.`,explain:`The tallest stack has ${mx} X's, at <b>${ans} inches</b>.`};
}

/* ================= "times as many" (4.OA.1-2) and line plots with fractions (4.MD.4) ================= */
function tapeSVG(rows){/* rows: [{label, n, val, color}] each box shows val */
  const bw=Math.min(52,300/Math.max(...rows.map(r=>r.n))),W=90+bw*Math.max(...rows.map(r=>r.n));let s='';
  rows.forEach((r,k)=>{const y=8+k*40;s+=`<text x="4" y="${y+22}" ${FONT} font-size="14" fill="#1f3557">${esc(r.label)}</text>`;
    for(let i=0;i<r.n;i++)s+=`<g class="fadein" style="animation-delay:${(k*.4+i*.25).toFixed(2)}s"><rect x="${86+i*bw}" y="${y}" width="${bw-3}" height="28" rx="4" fill="${r.color||'#ffd56b'}" stroke="#1f3557" stroke-width="1.5"/><text x="${86+i*bw+(bw-3)/2}" y="${y+19}" text-anchor="middle" ${FONT} font-size="13" fill="#1f3557">${r.val}</text></g>`});
  return `<svg viewBox="0 0 ${W} ${12+rows.length*40}" style="width:${W}px;max-width:100%" role="img" aria-label="Tape diagram">${s}</svg>`}
const CMP_THINGS=[['stickers','has','does','have'],['shells','found','did','find'],['books','read','did','read'],['marbles','has','does','have'],['points','scored','did','score'],['stamps','collected','did','collect']];
function genMultCmp(t){
  const [a,b]=shuffle([...NAMES]).slice(0,2),[thing,verb,aux,base]=pick(CMP_THINGS),n=R(Dv(2,3,3),Dv(5,8,9));let small,g=0;do{small=R(Dv(2,4,12),Dv(9,12,40))}while(small===n&&g++<20);const big=small*n;
  if(t===4){
    if(coin())return {how:['mult4',n,small],visual:sceneTimes(thing,a,small,b,big,n,true),prompt:`${a} ${verb} <b>${small}</b> ${thing}. ${b} ${verb} <b>${n} times as many</b>. How many ${thing} ${aux} ${b} ${base}?`,
      ...numChoices(big,[small+n,big+small,big-small,small*(n+1)]),anim:tapeSVG([{label:a,n:1,val:small},{label:b,n,val:small,color:'#8fd3f7'}]),
      hint:`"${n} times as many" means ${n} groups of ${small}. Multiply!`,explain:`${b} has ${n} groups of ${small}: ${n} × ${small} = <b>${big}</b>. (Not ${small} + ${n}: "times as many" means multiply.)`};
    const eq=`${n} × ${small} = ${big}`;
    return {how:['mult4e'],prompt:`Which equation shows: "<b>${big}</b> is <b>${n} times as many</b> as <b>${small}</b>"?`,
      ...strChoices(eq,[`${n} + ${small} = ${n+small}`,`${big} + ${n} = ${big+n}`,`${big} − ${small} = ${big-small}`,`${small} + ${small} = ${small*2}`]),
      hint:`"Times as many" is multiplying. Which choice multiplies?`,explain:`"${big} is ${n} times as many as ${small}" means ${n} groups of ${small}: <b>${eq}</b>.`};}
  if(coin())return {how:['mult5',n,big],visual:sceneTimes(thing,a,small,b,big,n,false),prompt:`${b} ${verb} <b>${big}</b> ${thing}. That is <b>${n} times as many</b> as ${a}. How many ${thing} ${aux} ${a} ${base}?`,
    ...numChoices(small,[big-n,big+n,big*n,small+1]),anim:tapeSVG([{label:b,n,val:small,color:'#8fd3f7'},{label:a,n:1,val:'?'}]),
    hint:`${b}'s ${big} is ${n} equal groups. ${a} has one group. Divide!`,explain:`${big} ÷ ${n} = <b>${small}</b>. Check: ${n} × ${small} = ${big}.`};
  return {how:['mult5',n,big],prompt:`A big boat is <b>${big} feet</b> long. That is <b>${n} times as long</b> as a small boat. How long is the small boat?`,
    ...numChoices(small,[big-n,big+n,big*n,small+2]),anim:tapeSVG([{label:'big',n,val:small,color:'#8fd3f7'},{label:'small',n:1,val:'?'}]),
    hint:`The long one is ${n} equal parts. One part is the short one. Divide!`,explain:`${big} ÷ ${n} = <b>${small}</b> feet. Check: ${n} × ${small} = ${big}.`};
}
const UFRAC={'1/2':'½','1/4':'¼','3/4':'¾','1/8':'⅛','3/8':'⅜','5/8':'⅝','7/8':'⅞'};
const redFrac=(n,d)=>{const g=gcd(n,d)||1;return [n/g,d/g]};
const fracLabel=(n,d)=>{const w=Math.floor(n/d),r=n%d;if(!r)return String(w);const [a,b]=redFrac(r,d);return (w||'')+(UFRAC[a+'/'+b]||` ${a}/${b}`)};
const fracAns=(n,d)=>{const [a,b]=redFrac(n,d);return mixedStr(a,b)};
const LP_SETS=[['ribbon','ribbons'],['leaf','leaves'],['pencil','pencils'],['worm','worms'],['shell','shells']];
function genGraphFrac(){
  const den=pick(Dv([2,4],[4,8],[8])),w=R(1,Dv(2,3,4)),ticks=den+1,[one,many]=pick(LP_SETS);
  let cnt;do{cnt=Array.from({length:ticks},()=>R(0,Dv(3,4,4)))}while(cnt.reduce((a,b)=>a+b,0)<5||cnt.filter(c=>c>0).length<3);
  const posN=i=>w*den+i,label=i=>fracLabel(posN(i),den),gap=Math.min(56,250/(ticks-1));let s='';
  cnt.forEach((c,i)=>{const x=24+i*gap;s+=`<line x1="${x}" y1="128" x2="${x}" y2="136" stroke="#1f3557" stroke-width="2"/><text x="${x}" y="154" text-anchor="middle" font-size="${ticks>6?11:14}" font-weight="800" fill="#1f3557">${label(i)}</text>`;
    for(let k=0;k<c;k++)s+=`<text x="${x}" y="${118-k*21}" text-anchor="middle" ${FONT} font-size="20" fill="#e2558f">X</text>`});
  const W=48+gap*(ticks-1);
  const vis=`<svg viewBox="0 0 ${W} 170" class="chart" style="max-width:${Math.max(300,W)}px" role="img" aria-label="Line plot"><line x1="12" y1="132" x2="${W-12}" y2="132" stroke="#1f3557" stroke-width="2.5"/>${s}<text x="${W/2}" y="168" text-anchor="middle" font-size="12" fill="#506686" font-weight="700">${one} length (inches)</text></svg>`;
  const used=cnt.map((c,i)=>c?i:-1).filter(i=>i>=0),lo=used[0],hi=used[used.length-1];
  const k=DIFF===1?R(0,1):R(0,3);
  if(k===0){const i=pick(used.slice(0,-1)),ans=cnt.slice(i+1).reduce((a,b)=>a+b,0);
    return {how:['graph5','longer'],prompt:`Each X is one ${one}. How many ${many} are <b>longer than ${label(i)} inches</b>?`,visual:vis,...numChoices(ans,[ans+cnt[i],ans+1,Math.max(1,ans-1),ans+2]),
      hint:`Count only the X's to the right of ${label(i)}. Don't count ${label(i)} itself!`,explain:`Longer than ${label(i)}: ${cnt.slice(i+1).join(' + ')} = <b>${ans}</b>.`};}
  if(k===1){const tot=cnt.reduce((a,b)=>a+b,0);
    return {how:['graph5','total'],prompt:`Each X is one ${one} that Pip measured. How many ${many} did he measure in all?`,visual:vis,...numChoices(tot,[tot+1,tot-1,ticks,tot+2]),
      hint:`Count every X on the line plot.`,explain:`${cnt.join(' + ')} = <b>${tot}</b> ${many}.`};}
  if(k===2){const d=hi-lo,ans=fracAns(d,den);
    const wrong=[fracAns(d+1,den),fracAns(Math.max(1,d-1),den),fracAns(posN(hi),den),fracAns(d+den,den),fracAns(d*2,den)].filter(x=>x!==ans);
    return {how:['graph5','diff'],prompt:`What is the difference between the <b>longest</b> and the <b>shortest</b> ${one}?`,visual:vis,unit:'in',...strChoices(ans,wrong),render:fracText,
      hint:`Find the X farthest right and the X farthest left. Subtract their lengths.`,explain:`Longest: ${label(hi)}. Shortest: ${label(lo)}. ${label(hi)} − ${label(lo)} = <b>${fracText(ans)}</b> inch${d===den?'':'es'}.`};}
  const i=pick(used.filter(j=>cnt[j]>=2).concat(used)),c=cnt[i],tot=c*posN(i),ans=fracAns(tot,den);
  const wrong=[fracAns(tot+den,den),fracAns(posN(i)+c*den,den),fracAns(Math.max(1,tot-1),den),fracAns(tot+1,den),fracAns(posN(i),den)].filter(x=>x!==ans);
  return {how:['graph5','line'],prompt:`Pip puts all the ${many} that are <b>${label(i)} inches</b> long end to end. How long is the line?`,visual:vis,unit:'in',...strChoices(ans,wrong),render:fracText,
    hint:`How many X's are at ${label(i)}? Add ${label(i)} that many times.`,explain:`There ${c===1?'is 1':`are ${c}`} at ${label(i)}. ${c} × ${label(i)} = <b>${fracText(ans)}</b> inches.`};
}
Object.assign(HOW,{
  mult4:(n,small)=>{const s2=hDiff(()=>HR(3,8),v=>v===small),n2=hDiff(()=>HR(2,4),v=>v===n);
    return {rule:'"Times as many" means multiply. Draw one box for the smaller amount, then the same box again and again for the bigger one.',
      ex:`Sam has ${s2} cards. Ava has ${n2} times as many.`,steps:[`Sam: 1 box of ${s2}.`,`Ava: ${n2} boxes of ${s2}.`,`${n2} × ${s2} = <b>${n2*s2}</b>. (Not ${n2} + ${s2}!)`],anim:tapeSVG([{label:'Sam',n:1,val:s2},{label:'Ava',n:n2,val:s2,color:'#8fd3f7'}]),
      mine:[`Smaller amount: <b>${small}</b>. How many boxes? <b>${n}</b>.`,`${n} × ${small} = ${BLANK}`]}},
  mult4e:()=>{const s2=HR(3,8),n2=HR(2,4);
    return {rule:'"Times as many" is a multiplication sentence: (how many times) × (smaller amount) = (bigger amount).',
      ex:`"${n2*s2} is ${n2} times as many as ${s2}"`,steps:[`"${n2} times as many as ${s2}" means ${n2} groups of ${s2}.`,`So the sentence is <b>${n2} × ${s2} = ${n2*s2}</b>.`,`It is NOT ${n2} + ${s2}: adding is "more than", not "times as many".`],anim:tapeSVG([{label:'small',n:1,val:s2},{label:'big',n:n2,val:s2,color:'#8fd3f7'}]),
      mine:[`Look for the choice that <b>multiplies</b>.`,`Check that it uses the "times" number and the smaller amount.`]}},
  mult5:(n,big)=>{const s2=HR(3,8),n2=hDiff(()=>HR(2,4),v=>v===n),b2=s2*n2;
    return {rule:'If the bigger amount is "N times as many", it is N equal boxes. Divide to find one box (the smaller amount).',
      ex:`Ava has ${b2} cards. That is ${n2} times as many as Sam.`,steps:[`Ava's ${b2} is ${n2} equal boxes.`,`One box: ${b2} ÷ ${n2} = <b>${s2}</b>.`,`Sam has ${s2}. Check: ${n2} × ${s2} = ${b2}.`],anim:tapeSVG([{label:'Ava',n:n2,val:s2,color:'#8fd3f7'},{label:'Sam',n:1,val:s2}]),
      mine:[`The bigger amount <b>${big}</b> is <b>${n}</b> equal boxes.`,`One box: ${big} ÷ ${n} = ${BLANK}`]}},
  graph5:(kind)=>({rule:'On a line plot each X is one thing. The number under the X is its length. Read the labels carefully: they can be fractions!',
      ex:'Ribbons: 1¼ (XX), 1½ (X), 1¾ (XXX)',steps:[`Total: 2 + 1 + 3 = 6 ribbons.`,`Longer than 1¼: only count 1½ and 1¾ → 1 + 3 = 4.`,`Longest − shortest: 1¾ − 1¼ = 2/4 = ½ inch.`],
      mine:kind==='longer'?[`Find the number in the question on the line.`,`Count only the X's to the <b>right</b> of it.`]:kind==='total'?[`Count every X, column by column, and add.`]:kind==='diff'?[`Find the X farthest right (longest) and farthest left (shortest).`,`Subtract: longest − shortest. Same bottom numbers? Subtract the tops.`]:[`How many X's are at that length?`,`Add that length that many times (or multiply).`]})
});

/* ================= time & calendar ================= */
const tf=(h,m)=>`${h}:${String(m).padStart(2,'0')}`;
const wrapH=h=>((h-1)%12+12)%12+1;
function addMin(h,m,d){let t=((h%12)*60+m+d)%720;t=(t+720)%720;const H=Math.floor(t/60);return tf(H===0?12:H,t%60)}
const ord=n=>n+((n%100>10&&n%100<14)?'th':n%10===1?'st':n%10===2?'nd':n%10===3?'rd':'th');
function clockSVG(h,m,size=190,id='',spin){
  const ha=((h%12)+m/60)*30,ma=m*6;let s='';
  for(let k=0;k<60;k++){const a=k*6*Math.PI/180,big=k%5===0,r1=big?79:84;s+=`<line x1="${(100+r1*Math.sin(a)).toFixed(1)}" y1="${(100-r1*Math.cos(a)).toFixed(1)}" x2="${(100+88*Math.sin(a)).toFixed(1)}" y2="${(100-88*Math.cos(a)).toFixed(1)}" stroke="#1f3557" stroke-width="${big?3:1.2}" stroke-linecap="round"/>`}
  for(let k=1;k<=12;k++){const a=k*30*Math.PI/180;s+=`<text x="${(100+65*Math.sin(a)).toFixed(1)}" y="${(100-65*Math.cos(a)+7).toFixed(1)}" text-anchor="middle" ${FONT} font-size="20" fill="#1f3557">${k}</text>`}
  const hs=spin?` class="hand handspin" style="--a0:${ha}deg;--a1:${ha+spin/2}deg;transform:rotate(${ha}deg)"`:` class="hand"${id?` id="${id}h"`:''} style="transform:rotate(${ha}deg)"`;
  const ms=spin?` class="hand handspin" style="--a0:${ma}deg;--a1:${ma+spin*6}deg;transform:rotate(${ma}deg)"`:` class="hand"${id?` id="${id}m"`:''} style="transform:rotate(${ma}deg)"`;
  return `<svg class="clock" viewBox="0 0 200 200" style="width:${size}px" role="img" aria-label="Clock"><circle cx="100" cy="100" r="97" fill="#2f9fe0"/><circle cx="100" cy="100" r="91" fill="#fffdf5"/>${s}
    <g${hs}><rect x="95.5" y="54" width="9" height="52" rx="4.5" fill="#1f3557"/></g>
    <g${ms}><rect x="97.5" y="24" width="5" height="82" rx="2.5" fill="#ff6b57"/></g>
    <circle cx="100" cy="100" r="7" fill="#ffc23d" stroke="#1f3557" stroke-width="2"/></svg>`;
}
function readWrong(h,m){return [tf(wrapH(h+1),m),tf(m===0?12:m/5,(h*5)%60),(m>0&&m/5<10)?tf(h,m/5):tf(h,(m+30)%60),tf(h,(m+30)%60),tf(wrapH(h-1),m),tf(h,(m+5)%60)]}
const CLOCK_HINT=`The short dark hand shows the hour. The long red hand shows minutes: each number is 5 minutes.`;
function readExplain(h,m){if(m===0)return `The long hand is on the 12 and the short hand points right at the ${h}. So it's ${h} o'clock: <b>${tf(h,0)}</b>.`;
  return `The short hand has passed the ${h} (heading to the ${wrapH(h+1)}), so the hour is ${h}. The long hand points at the ${m/5}: ${m/5} × 5 = ${m} minutes. Time: <b>${tf(h,m)}</b>.`}
function genTime(t){
  let h=R(1,12),m=DIFF===1?R(0,3)*15:R(0,11)*5;
  if(t===0)return {prompt:`What time does the clock show?`,visual:clockSVG(h,m,250),...strChoices(tf(h,m),readWrong(h,m)),hint:CLOCK_HINT,explain:readExplain(h,m)};
  if(t===1){while(h===12&&m===0){h=R(1,12);m=R(0,11)*5}
    return {kind:'setclock',target:{h,m},prompt:`Use the buttons to set Pip's clock to this time.`,hint:`Move the short hand with Hour, then press +5 until the long red hand points at the ${m===0?12:m/5}.`,
      explain:`For ${tf(h,m)}, the long hand points at the ${m===0?12:m/5} (${m} minutes). The short hand is ${m===0?'right on':'a little past'} the ${h}.`};}
  if(t===2)return {prompt:`Which clock shows <span class="lcd sm">${tf(h,m)}</span>?`,clockChoices:true,...strChoices(tf(h,m),readWrong(h,m)),hint:CLOCK_HINT,explain:readExplain(h,m)};
  if(t===3){let d;do{d=pick(Dv([15,30,45],[10,15,20,25,30,35,40,45,50,55,65,75],[25,35,45,55,65,75,85,95]))}while(m+d>=120);const ans=addMin(h,m,d);
    const ex=m+d<60?`${m} + ${d} = ${m+d} minutes. So Pip finishes at <b>${ans}</b>.`:`From ${tf(h,m)}, ${60-m} minutes takes Pip to ${tf(wrapH(h+1),0)}. ${m+d-60} more minutes makes <b>${ans}</b>.`;
    return {prompt:`Pip starts reading at <b>${tf(h,m)}</b> and reads for <b>${d} minutes</b>. What time does Pip finish?`,visual:clockSVG(h,m,210),...strChoices(ans,[tf(h,(m+d)%60),addMin(h,m,d+10),addMin(h,m,d-10),addMin(h,m,d+60)]),
      anim:clockSVG(h,m,200,'',d),hint:`Count up to the next full hour first, then add the minutes that are left.`,explain:ex};}
  const k=R(0,3);let phrase,ans,why;
  if(k===0){phrase=`${h} o'clock`;ans=tf(h,0);why=`"O'clock" means exactly on the hour, zero minutes.`}
  else if(k===1){phrase=`quarter past ${h}`;ans=tf(h,15);why=`A quarter of an hour is 15 minutes. "Past ${h}" means after ${h}:00.`}
  else if(k===2){phrase=`half past ${h}`;ans=tf(h,30);why=`Half an hour is 30 minutes. "Past ${h}" means after ${h}:00.`}
  else{phrase=`quarter to ${h}`;ans=tf(wrapH(h-1),45);why=`"Quarter to ${h}" means 15 minutes <i>before</i> ${h}:00.`}
  const [ah,am]=ans.split(':').map(Number);
  return {prompt:`What time is <b>${phrase}</b>?`,...strChoices(ans,[tf(h,45),tf(h,15),tf(h,30),tf(wrapH(h-1),15),tf(wrapH(h+1),45),tf(h,0)]),hint:`A quarter hour is 15 minutes and half an hour is 30 minutes.`,explain:`${why} So it's <b>${ans}</b>.`,anim:clockSVG(ah,am,170)};
}
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],DSHORT=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'],MDAYS=[31,28,31,30,31,30,31,31,30,31,30,31];
const SEAS=['Winter','Spring','Summer','Fall'];
const seasonOf=i=>i===11||i<2?'Winter':i<5?'Spring':i<8?'Summer':'Fall';
const SEASON_MONTHS={Winter:'December, January and February',Spring:'March, April and May',Summer:'June, July and August',Fall:'September, October and November'};
function calVis(mi,s,day){let g=DSHORT.map(d=>`<b>${d}</b>`).join('');for(let k=0;k<s;k++)g+='<span class="blank"></span>';for(let d=1;d<=MDAYS[mi];d++)g+=d===day?'<span class="q">?</span>':`<span>${d}</span>`;
  return `<div class="cal"><div class="calm">${MONTHS[mi]}</div><div class="calg">${g}</div></div>`}
function genWeek(t){
  if(t===0)return {kind:'order',items:DAYS,prompt:`Tap the days of the week in order, starting with <b>Sunday</b>.`,hint:`Sunday starts the week on most calendars. Say the days out loud: Sunday, Monday...`,explain:`The week goes: ${DAYS.join(', ')}. Then it starts over!`};
  const x=R(0,6);
  if(t===1){const after=coin(),ans=DAYS[(x+(after?1:6))%7];
    return {prompt:`What day comes right <b>${after?'after':'before'}</b> ${DAYS[x]}?`,...strChoices(ans,[DAYS[(x+(after?6:1))%7],DAYS[(x+(after?2:5))%7],DAYS[x],DAYS[(x+3)%7]]),hint:`Say the days in order and stop at ${DAYS[x]}.`,explain:after?`${DAYS[x]}, then <b>${ans}</b>.`:`<b>${ans}</b>, then ${DAYS[x]}.`};}
  if(t===2){const n=R(2,Dv(6,12,20)),ans=DAYS[(x+n)%7];const rest=n%7,wk=Math.floor(n/7);const path=Array.from({length:rest},(_,k)=>DAYS[(x+k+1)%7]);
    return {prompt:`Today is <b>${DAYS[x]}</b>. What day will it be in <b>${n} days</b>?`,...strChoices(ans,[DAYS[(x+n+1)%7],DAYS[(x+n+6)%7],DAYS[(x+n+2)%7],DAYS[x]]),
      hint:n>=7?`7 days from any day is the same day again! Then count the days that are left.`:`Count forward one day at a time.`,
      explain:n>=7?`${n} days = ${wk} week${wk>1?'s':''} + ${rest} day${rest===1?'':'s'}. ${wk>1?`${wk} weeks`:'One week'} from ${DAYS[x]} is ${DAYS[x]} again${rest?`. Then count ${rest} more: ${path.join(', ')}`:''}. Answer: <b>${ans}</b>.`:`Count ${n} days: ${path.join(', ')}. Answer: <b>${ans}</b>.`};}
  if(t===3){const w=R(2,Dv(5,9,15));
    if(coin())return {prompt:`How many days are in <b>${w} weeks</b>?`,...numChoices(7*w,[7*w+7,7*w-7,w+7,7*w+1]),hint:`Every week has 7 days.`,explain:`${w} weeks × 7 days = <b>${7*w} days</b>.`};
    return {prompt:`How many weeks are in <b>${7*w} days</b>?`,...numChoices(w,[w+1,w-1,7,w+2]),hint:`Every week has 7 days. Divide by 7.`,explain:`${7*w} ÷ 7 = <b>${w} weeks</b>.`};}
  const mi=R(0,11),s=R(0,6),day=R(2,MDAYS[mi]),ans=DAYS[(s+day-1)%7];
  return {prompt:`What day of the week is <b>${MONTHS[mi]} ${day}</b>? It's the yellow box.`,visual:calVis(mi,s,day),...strChoices(ans,[DAYS[(s+day)%7],DAYS[(s+day+5)%7],DAYS[(s+day+1)%7]]),
    hint:`Find the yellow box, then look straight up to the top of its column.`,explain:`The yellow box is in the ${DSHORT[(s+day-1)%7]} column. So ${MONTHS[mi]} ${day} is a <b>${ans}</b>.`};
}
const SCENES={
  Winter:`<rect width="220" height="140" rx="18" fill="#dcefff"/><ellipse cx="110" cy="140" rx="150" ry="34" fill="#fff"/><path d="M58 122 V72 M58 90 L42 76 M58 84 L72 68 M58 104 L70 96" stroke="#8c5a2c" stroke-width="5" stroke-linecap="round" fill="none"/>
    <circle cx="150" cy="100" r="22" fill="#fff" stroke="#b8cfe3" stroke-width="2"/><circle cx="150" cy="66" r="15" fill="#fff" stroke="#b8cfe3" stroke-width="2"/><circle cx="145" cy="63" r="2" fill="#1f3557"/><circle cx="155" cy="63" r="2" fill="#1f3557"/><path d="M150 68 l11 3 l-11 2z" fill="#ff9f43"/>
    <rect x="137" y="47" width="26" height="6" rx="2" fill="#1f3557"/><rect x="142" y="32" width="16" height="17" rx="2" fill="#1f3557"/><path d="M136 78 h28" stroke="#ff6b57" stroke-width="5" stroke-linecap="round"/>`+
    [[30,22],[90,16],[120,40],[190,22],[200,64],[100,70],[20,60],[80,46],[176,46]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.5" fill="#9cc5e8"/>`).join(''),
  Spring:`<rect width="220" height="140" rx="18" fill="#e6f8e3"/><ellipse cx="110" cy="146" rx="150" ry="40" fill="#8fd16a"/><g fill="#fff"><circle cx="60" cy="30" r="14"/><circle cx="78" cy="24" r="17"/><circle cx="96" cy="32" r="12"/><rect x="50" y="30" width="54" height="14" rx="7"/></g>
    <path d="M62 52 l-3 9 M78 52 l-3 9 M94 52 l-3 9 M70 66 l-3 9 M86 66 l-3 9" stroke="#2f9fe0" stroke-width="3" stroke-linecap="round"/>`+
    [[40,'#e2558f'],[78,'#ffc23d'],[116,'#ff6b57'],[154,'#e2558f'],[190,'#ffc23d']].map(([x,c])=>`<path d="M${x} 126 V104" stroke="#2b8a62" stroke-width="3"/><path d="M${x-9} 92 L${x-9} 104 Q${x} 112 ${x+9} 104 L${x+9} 92 L${x+4} 98 L${x} 90 L${x-4} 98Z" fill="${c}"/>`).join('')+
    `<ellipse cx="166" cy="40" rx="8" ry="6" fill="#ffc23d"/><ellipse cx="180" cy="40" rx="8" ry="6" fill="#ff9f43"/><path d="M173 34 V46" stroke="#1f3557" stroke-width="2"/>`,
  Summer:`<rect width="220" height="140" rx="18" fill="#fff1c4"/><circle cx="182" cy="34" r="20" fill="#ffc23d"/><path d="M182 4 v8 M182 56 v8 M152 34 h8 M204 34 h8 M161 13 l6 6 M197 49 l6 6 M161 55 l6 -6 M197 19 l6 -6" stroke="#ffc23d" stroke-width="4" stroke-linecap="round"/>
    <rect x="0" y="82" width="220" height="24" fill="#5fc3f0"/><path d="M0 104 H220 V122 Q220 140 202 140 H18 Q0 140 0 122Z" fill="#f6d48f"/><path d="M70 128 L78 60" stroke="#8c5a2c" stroke-width="4"/><path d="M42 64 Q78 30 114 64Z" fill="#ff6b57"/><path d="M66 64 Q78 38 90 64Z" fill="#fff"/>
    <circle cx="150" cy="120" r="12" fill="#fff"/><path d="M138 120 h24 M150 108 v24" stroke="#2f9fe0" stroke-width="4"/>`,
  Fall:`<rect width="220" height="140" rx="18" fill="#ffe8cf"/><ellipse cx="110" cy="146" rx="150" ry="36" fill="#e0a35a"/><path d="M80 128 V70" stroke="#8c5a2c" stroke-width="10" stroke-linecap="round"/>
    <circle cx="80" cy="52" r="30" fill="#ff9f43"/><circle cx="58" cy="64" r="18" fill="#ff6b57"/><circle cx="104" cy="62" r="20" fill="#ffc23d"/><circle cx="80" cy="34" r="16" fill="#ff6b57"/>`+
    [[130,40,'#ff6b57',30],[150,70,'#ffc23d',-20],[118,92,'#ff9f43',50],[180,50,'#ff6b57',-40],[30,40,'#ffc23d',20]].map(([x,y,c,r])=>`<ellipse cx="${x}" cy="${y}" rx="7" ry="4" fill="${c}" transform="rotate(${r} ${x} ${y})"/>`).join('')+
    `<ellipse cx="164" cy="118" rx="20" ry="15" fill="#ff8c1a"/><path d="M156 106 Q164 120 156 132 M172 106 Q164 120 172 132" stroke="#e06f00" stroke-width="2" fill="none"/><rect x="161" y="98" width="6" height="9" rx="2" fill="#2b8a62"/>`
};
const sceneVis=s=>`<svg class="scene" viewBox="0 0 220 140" role="img" aria-label="A picture of one season">${SCENES[s]}</svg>`;
function genSeason(t){
  if(t===0){const s=R(0,11),items=Array.from({length:Dv(4,5,7)},(_,k)=>MONTHS[(s+k)%12]);return {kind:'order',items,prompt:`Tap these months in order, starting with <b>${MONTHS[s]}</b>.`,hint:`Say the months out loud: January, February, March, April...`,explain:`In order: ${items.join(', ')}.`};}
  const x=R(0,11);
  if(t===1){const after=coin(),ans=MONTHS[(x+(after?1:11))%12];
    return {prompt:`Which month comes right <b>${after?'after':'before'}</b> ${MONTHS[x]}?`,...strChoices(ans,[MONTHS[(x+(after?11:1))%12],MONTHS[(x+(after?2:10))%12],MONTHS[x]]),hint:`Say the months in order and stop at ${MONTHS[x]}.`,
      explain:after?`${MONTHS[x]}, then <b>${ans}</b>.${x===11?' After December, a new year starts with January!':''}`:`<b>${ans}</b>, then ${MONTHS[x]}.`};}
  if(t===2){const ans=seasonOf(x);return {prompt:`In California, which season is <b>${MONTHS[x]}</b> in?`,choices:shuffle([...SEAS]),answer:ans,hint:`Think about that month. Is it cold, are flowers blooming, is school out for summer, or are leaves falling?`,explain:`${ans} is ${SEASON_MONTHS[ans]}. ${MONTHS[x]} is one of them.`};}
  if(t===3){const ans=`${MDAYS[x]} days`;return {prompt:`How many days does <b>${MONTHS[x]}</b> have?`,choices:shuffle(['28 days','30 days','31 days']),answer:ans,hint:`Knuckle trick: make two fists. Months on a bump have 31 days. Months in a dip have 30. February is special.`,
    explain:x===1?`February has <b>28 days</b> (and 29 in a leap year, every 4 years).`:`${MONTHS[x]} has <b>${ans}</b>. Months with 30 days: April, June, September and November. February has 28. All the rest have 31.`};}
  if(t===4){const n=x+1;
    if(coin())return {prompt:`Which month is the <b>${ord(n)}</b> month of the year?`,...strChoices(MONTHS[n-1],[MONTHS[n%12],MONTHS[(n+10)%12],MONTHS[(n+1)%12]]),hint:`Count on your fingers: January is 1st, February is 2nd...`,explain:`Counting from January, the ${ord(n)} month is <b>${MONTHS[n-1]}</b>.`};
    return {prompt:`<b>${MONTHS[n-1]}</b> is which month of the year?`,...strChoices(ord(n),[ord(n%12+1),ord(n===1?12:n-1),ord((n+1)%12+1)]),hint:`Count on your fingers: January is 1st, February is 2nd...`,explain:`${MONTHS[n-1]} is the <b>${ord(n)}</b> month.`};}
  const s=pick(SEAS);
  return {prompt:`Which season is in this picture?`,visual:sceneVis(s),choices:shuffle([...SEAS]),answer:s,hint:`Look for clues: snow, flowers and rain, hot sunshine, or colorful falling leaves.`,explain:`That's <b>${s}</b>! Here in California, ${s.toLowerCase()} is ${SEASON_MONTHS[s]}.`};
}
/* ===== math reasoning like the spring test: find the mistake, choose the right explanation, Yes/No tables, a big task with 4 linked steps ===== */
function genMistake(){const nm=pick(NAMES),k=R(0,5);
  if(k===0){let a,b;do{a=R(Dv(120,1200,12000),Dv(899,8999,89999));b=R(Dv(110,1100,11000),Dv(899,8999,89999))}while(noCarrySum(a,b)===a+b||String(noCarrySum(a,b)).length!==String(a+b).length);const w=noCarrySum(a,b);
    return {prompt:`${nm} added <b>${fmt(a)} + ${fmt(b)}</b> and got <b>${fmt(w)}</b>. What mistake did ${nm} make?`,...strChoices('Forgot to carry when a column added up to 10 or more',['Subtracted instead of adding','Did not line up the ones under the ones','Added an extra zero at the end']),long:true,
      hint:`Add it yourself, column by column. Do any columns make 10 or more?`,explain:`The right answer is <b>${fmt(a+b)}</b>. ${nm} wrote only the ones digit of each column and <b>forgot to carry</b> the 1.`}}
  if(k===1){const d=pick([5,6,8,10,12]),a=R(1,d-2),b=R(1,d-1-a);
    return {prompt:`${nm} says <b>${a}/${d} + ${b}/${d} = ${a+b}/${d*2}</b>. What is wrong?`,...strChoices(`The bottom number should stay ${d}. The answer is ${a+b}/${d}.`,[`The top numbers should be multiplied: ${a*b}/${d*2}.`,`Nothing is wrong.`,`The answer should be ${a+b}/${d+1}.`]),long:true,render:fracText,
      hint:`When the pieces are the same size, does the size of the pieces change when you add them?`,explain:`${frac(a,d)} + ${frac(b,d)}: the pieces are still <b>${d}ths</b>. Only the tops add: ${frac(a+b,d)}. ${nm} wrongly added the bottoms too.`}}
  if(k===2){let n;do{n=R(11,98)*100+R(1,99)}while(Math.floor(n/100)%10<5);const down=Math.floor(n/1000)*1000;
    return {prompt:`${nm} rounded <b>${fmt(n)}</b> to the nearest thousand and got <b>${fmt(down)}</b>. Is that right?`,...strChoices(`No. The hundreds digit is ${Math.floor(n/100)%10}, which is 5 or more, so it rounds up to ${fmt(down+1000)}.`,[`Yes. You always round down.`,`No. It should be ${fmt(Math.round(n/100)*100)}.`,`Yes. Look at the ones digit to round.`]),long:true,
      hint:`To round to the nearest thousand, look at the hundreds digit.`,explain:`Hundreds digit: ${Math.floor(n/100)%10}. That is 5 or more, so round <b>up</b>: ${fmt(down+1000)}.`}}
  if(k===3){const t=R(2,9)*10,o=R(2,9),m=R(3,9),wrong=(t/10)*m+o*m,right=(t+o)*m;
    return {prompt:`${nm} worked out <b>${t+o} × ${m}</b> like this:<br><span class="mono">${t/10} × ${m} = ${t/10*m}<br>${o} × ${m} = ${o*m}<br>${t/10*m} + ${o*m} = ${wrong}</span><br>What mistake did ${nm} make?`,...strChoices(`The first part should be ${t} × ${m} = ${t*m}, not ${t/10} × ${m}.`,[`${o} × ${m} should be ${o*m+m}.`,`${nm} should have subtracted the parts.`,`Nothing is wrong.`]),long:true,
      hint:`The tens digit ${t/10} in ${t+o} is really worth ${t}.`,explain:`${t+o} = ${t} + ${o}. So ${t} × ${m} = ${t*m} and ${o} × ${m} = ${o*m}. Total <b>${right}</b>. ${nm} forgot that the ${t/10} means ${t}.`}}
  if(k===4){const d=R(3,8),q=R(4,12),r=R(1,d-1),n=q*d+r,wr=r+d;
    return {prompt:`${nm} says <b>${n} ÷ ${d} = ${q-1} R ${wr}</b>. What is wrong?`,...strChoices(`The remainder ${wr} is bigger than ${d}, so one more group fits: ${q} R ${r}.`,[`The remainder can never be more than 1.`,`It should be ${q+1} R ${r}.`,`Nothing is wrong.`]),long:true,
      hint:`The leftover (remainder) must always be smaller than the number you divide by.`,explain:`R ${wr} is more than ${d}, so another group of ${d} fits. ${d} × ${q} = ${q*d}, and ${n} − ${q*d} = ${r}: <b>${q} R ${r}</b>.`}}
  const a=R(2,8);let b;do{b=R(a*10-9,a*10-1)}while(b%10===0||b<10);const sa=`0.${a}`,sb=dec(b);
  return {prompt:`${nm} says <b>${sb} &gt; ${sa}</b> because ${b} is bigger than ${a}. Is ${nm} right?`,...strChoices(`No. ${sa} is the same as ${sa}0, and ${a*10} hundredths is more than ${b} hundredths.`,[`Yes. More digits always means a bigger number.`,`Yes. ${b} is bigger than ${a}.`,`No. They are equal.`]),long:true,
    hint:`Write both numbers with two places after the point.`,explain:`${sa} = ${sa}0 = ${a*10} hundredths. ${sb} = ${b} hundredths. So <b>${sa} is greater</b>.`};
}
function genExplain(){const k=R(0,3),nm=pick(NAMES);
  if(k===0){const a=R(1,3),d1=pick([3,4,5]),d2=d1*2;
    return {prompt:`${nm} says <b>${a}/${d2} is greater than ${a}/${d1}</b> because ${d2} is greater than ${d1}. Which answer is correct?`,...strChoices(`${nm} is wrong. ${d2}ths are smaller pieces than ${d1}ths, so ${a}/${d1} is greater.`,[`${nm} is right. A bigger bottom number means a bigger fraction.`,`${nm} is right. They are equal.`,`${nm} is wrong. You must add them to compare.`]),long:true,render:fracText,
      hint:`Picture the same pizza cut into ${d1} slices and into ${d2} slices. Which slices are bigger?`,explain:`More slices means <b>smaller</b> slices. ${a} big slices (${frac(a,d1)}) is more than ${a} small slices (${frac(a,d2)}).`}}
  if(k===1){const m=R(3,9),t=R(1,4)*10,o=R(1,9),n=t+o;
    return {prompt:`Which explains why <b>${m} × ${n} = ${m} × ${t} + ${m} × ${o}</b>?`,...strChoices(`${n} is ${t} + ${o}, so you can multiply each part by ${m} and add.`,[`You can always add instead of multiply.`,`${m} × ${t} is the same as ${m} × ${o}.`,`Multiplying makes numbers smaller.`]),long:true,
      hint:`Break ${n} into tens and ones.`,explain:`${n} = ${t} + ${o}. ${m} groups of ${n} = ${m} groups of ${t} plus ${m} groups of ${o}: ${m*t} + ${m*o} = <b>${m*n}</b>.`}}
  if(k===2){let a,b;do{a=R(2,8)*100+R(-4,4);b=R(1,5)*100+R(-4,4)}while(a<=b);const wrong=a+b+R(1,3)*100+(coin()?100:0);
    return {prompt:`${nm} says <b>${a} + ${b} = ${wrong}</b>. How can you tell quickly that this is <b>not reasonable</b>?`,...strChoices(`${a} is about ${Math.round(a/100)*100} and ${b} is about ${Math.round(b/100)*100}, so the answer should be about ${Math.round(a/100)*100+Math.round(b/100)*100}.`,[`The answer has too many digits.`,`Adding always gives an even number.`,`${b} is smaller than ${a}.`]),long:true,
      hint:`Round each number to the nearest hundred and add in your head.`,explain:`Estimate: about ${Math.round(a/100)*100} + ${Math.round(b/100)*100} = ${Math.round(a/100)*100+Math.round(b/100)*100}. ${wrong} is too far off. The real sum is <b>${a+b}</b>.`}}
  const e=R(1,6)*2,o=pick([3,5,7,9]);
  return {prompt:`Is the product of <b>${o} × an even number</b> always even? Which explanation is right?`,...strChoices(`Yes. An even number is made of pairs, and ${o} groups of pairs are still pairs.`,[`No. ${o} is odd, so the answer is always odd.`,`Yes. Every product is even.`,`No. It depends on the day.`]),long:true,
    hint:`Try it: ${o} × ${e} = ?`,explain:`${o} × ${e} = ${o*e}, which is even. Even numbers are made of pairs, so <b>any number times an even number is even</b>.`};
}
function genYesNoFrac(){const [a,b]=pick([[1,2],[2,3],[3,4],[2,5],[3,5],[1,3],[1,4]]);const ks=shuffle([2,3,4,5].filter(k=>b*k<=20)).slice(0,2);
  let rows=ks.map(k=>({html:frac(a*k,b*k),name:`${a*k}/${b*k}`,yes:true}));
  const fake=shuffle([[a+1,b+1],[a,b*2],[a*2,b],[a+2,b+2],[b-a,b]].filter(([x,y])=>x>0&&x*b!==a*y&&y<=20));rows=rows.concat(fake.slice(0,4-rows.length).map(([x,y])=>({html:frac(x,y),name:`${x}/${y}`,yes:false})));
  rows=shuffle(rows);
  return {kind:'yesno',rows,colHead:`Equal to ${frac(a,b)}?`,prompt:`Is each fraction <b>equal to ${frac(a,b)}</b>? Choose Yes or No for each one.`,
    hint:`Equal fractions: multiply the top AND the bottom of ${frac(a,b)} by the same number.`,explain:rows.map(r=>`${r.html} ${r.yes?'= ':'≠ '}${frac(a,b)}`).join('. ')+'.'}}
function genYesNoMult(){const N=pick([24,36,48,60,72,30,40]);const prs=[];for(let f=2;f*f<=N;f++)if(N%f===0)prs.push([f,N/f]);
  const t=shuffle(prs.slice()).slice(0,2).map(([x,y])=>({html:`${x} × ${y}`,v:x*y,yes:true}));
  const f=shuffle(prs.slice()).slice(0,2).map(([x,y])=>{const z=coin()?y+1:y-1;return {html:`${x} × ${z}`,v:x*z,yes:false}});
  const add={html:`${N-10} + 10`,v:N,yes:true},sub=coin()?{html:`${N/2} + ${N/2-1}`,v:N-1,yes:false}:{html:`2 × ${N/2}`,v:N,yes:true};
  const rows=shuffle([...t,...f,coin()?add:sub]).slice(0,5);
  return {kind:'yesno',rows,colHead:`Equal to ${N}?`,prompt:`Is each expression <b>equal to ${N}</b>? Choose Yes or No for each one.`,hint:`Work out each one. Use your times tables!`,
    explain:rows.map(r=>`${r.html} = ${r.v}${r.v===N?' ✓':''}`).join('. ')+'.'}}
/* the big task: 3 situations, 4 linked steps; all 4 steps share one seed, so the numbers stay the same */
function ptCard(title,rows){return `<div class="ptcard"><div class="pthead">${title}</div><table>${rows.map(r=>`<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join('')}</table></div>`}
function genTask(sc,step){
  if(sc===0){const s=R(52,98),a=R(4,9),cap=pick([24,30,36]),ps=R(7,12),pa=ps+R(3,6),h=8,m=pick([10,15,20,25]),dur=pick([35,40,45,50]);
    const card=ptCard('Class trip to the aquarium',[['Students',s],['Adults',a],['Each bus holds',`${cap} people`],['Student ticket',`$${ps}`],['Adult ticket',`$${pa}`],['Buses leave',`${h}:${String(m).padStart(2,'0')} AM`],['Bus ride',`${dur} minutes`]]),tot=s+a,bus=Math.ceil(tot/cap),cost=s*ps+a*pa,arr=m+dur;
    const pre=`<span class="ptstep">Big task · step ${step+1} of 4</span>`;
    if(step===0)return {visual:card,prompt:`${pre}How many people are going on the trip in all?`,...numChoices(tot,[s,s-a,tot+10,tot-1]),hint:`Students + adults.`,explain:`${s} + ${a} = <b>${tot}</b> people.`};
    if(step===1)return {visual:card,prompt:`${pre}How many buses do they need so <b>everyone</b> can ride?`,...numChoices(bus,[bus-1,bus+1,Math.floor(tot/cap)+2]),hint:`${tot} ÷ ${cap}. If there is a remainder, those people need a bus too!`,explain:`${tot} ÷ ${cap} = ${Math.floor(tot/cap)} R ${tot%cap}. The ${tot%cap||0} extra people need one more bus: <b>${bus}</b> buses.`};
    if(step===2)return {visual:card,prompt:`${pre}How much do <b>all</b> the tickets cost?`,...numChoices(cost,[s*ps,(s+a)*ps,cost+pa,cost-ps]),unit:'dollars',hint:`Students: ${s} × $${ps}. Adults: ${a} × $${pa}. Then add.`,explain:`${s} × $${ps} = $${s*ps}. ${a} × $${pa} = $${a*pa}. Total: <b>$${fmt(cost)}</b>.`};
    const tt=(mm)=>`${h+Math.floor(mm/60)}:${String(mm%60).padStart(2,'0')} AM`;
    return {visual:card,prompt:`${pre}What time will the buses <b>arrive</b> at the aquarium?`,...strChoices(tt(arr),[tt(arr+10),tt(arr-5),tt(m+dur+60),`${h}:${String(dur).padStart(2,'0')} AM`]),hint:`Start at ${h}:${String(m).padStart(2,'0')} and count on ${dur} minutes.`,explain:`${h}:${String(m).padStart(2,'0')} + ${dur} minutes = <b>${tt(arr)}</b>.`};}
  if(sc===1){const w=pick([2,4]),l=pick([4,6,8,10]),n=R(3,6),f=pick([[1,4],[3,8],[1,2],[3,4]]),A=l*w,area=A,pp=2*(l+w);
    const card=ptCard('The school garden',[['Each garden bed',`${l} feet long, ${w} feet wide`],['Number of beds',n],['Fence',`goes around each bed`],['Tomatoes',`${f[0]}/${f[1]} of each bed`]]);const pre=`<span class="ptstep">Big task · step ${step+1} of 4</span>`;
    if(step===0)return {visual:card,prompt:`${pre}What is the <b>area</b> of one garden bed?`,...numChoices(area,[pp,l+w,area+l,area*2]),unit:'sq ft',hint:`Area = length × width.`,explain:`${l} × ${w} = <b>${area} square feet</b>.`};
    if(step===1)return {visual:card,prompt:`${pre}What is the <b>total area</b> of all ${n} beds?`,...numChoices(area*n,[area+n,pp*n,area*(n+1)]),unit:'sq ft',hint:`One bed is ${area} square feet. Multiply by ${n}.`,explain:`${area} × ${n} = <b>${area*n} square feet</b>.`};
    if(step===2)return {visual:card,prompt:`${pre}How many feet of fence are needed for <b>one</b> bed?`,...numChoices(pp,[area,l+w,pp+2,2*l+w]),unit:'ft',hint:`Perimeter: add all 4 sides.`,explain:`${l} + ${w} + ${l} + ${w} = <b>${pp} feet</b>.`};
    const sq=area*f[0]/f[1];return {visual:card,prompt:`${pre}How many square feet of <b>one</b> bed are for tomatoes?`,...numChoices(sq,[area-sq,f[0]*f[1],sq+1,area/f[1]===sq?sq*2:area/f[1]]),unit:'sq ft',hint:`Find ${f[0]}/${f[1]} of ${area}: divide by ${f[1]}, then multiply by ${f[0]}.`,explain:`${area} ÷ ${f[1]} = ${area/f[1]}. ${area/f[1]} × ${f[0]} = <b>${sq} square feet</b>.`};}
  const per=pick([12,16,18,20,24]),tr=R(3,6),pk=pick([4,6]),price=R(2,5),tot=per*tr,packs=Math.floor(tot/pk),left=tot%pk||0;
  const card=ptCard('The bake sale',[['Cookies on each tray',per],['Trays baked',tr],['Cookies in each bag',pk],['Price of one bag',`$${price}`]]);const pre=`<span class="ptstep">Big task · step ${step+1} of 4</span>`;
  if(step===0)return {visual:card,prompt:`${pre}How many cookies did they bake in all?`,...numChoices(tot,[per+tr,tot+per,tot-tr]),hint:`${tr} trays with ${per} cookies each.`,explain:`${per} × ${tr} = <b>${tot}</b> cookies.`};
  if(step===1)return {visual:card,prompt:`${pre}How many <b>full</b> bags can they make?`,...numChoices(packs,[packs+1,tot*pk>0?Math.max(1,packs-1):packs+2,tr*pk]),hint:`${tot} ÷ ${pk}. Only count the bags that are full.`,explain:`${tot} ÷ ${pk} = ${packs}${left?` R ${left}`:''}. They can fill <b>${packs}</b> bags.`};
  if(step===2)return {visual:card,prompt:`${pre}If they sell every full bag, how much money do they make?`,...numChoices(packs*price,[packs+price,tot*price,packs*price+price]),unit:'dollars',hint:`${packs} bags × $${price}.`,explain:`${packs} × $${price} = <b>$${packs*price}</b>.`};
  const goal=Math.ceil(packs*price/10)*10+R(1,3)*10,more=goal-packs*price,bags=Math.ceil(more/price);
  return {visual:card,prompt:`${pre}Their goal is <b>$${goal}</b>. After selling every bag, how much <b>more</b> money do they need?`,...numChoices(more,[goal+packs*price,packs*price,more+price,bags]),unit:'dollars',hint:`Goal − money made: ${goal} − ${packs*price}.`,explain:`$${goal} − $${packs*price} = <b>$${more}</b>.`};
}
function riddleRound(isl){
  if(coin()){const seed=R(1,2e9),sc=R(0,2),qs=[0,1,2,3].map(k=>makeQ(isl,10+sc*4+k,seed));return qs.concat([0,1].map(()=>makeQ(isl,R(0,9),R(1,2e9))))}
  return Array.from({length:6},()=>makeQ(isl,R(0,9),R(1,2e9)))}
/* the same figure at a slant: kids learn to name lines and figures in any direction, not just flat */
function turnBox(svg){const d=pick([0,0,-30,-20,20,30,45,-45]);return d?`<div style="display:inline-block;margin:18px 6px;transform:rotate(${d}deg)">${svg}</div>`:svg}
