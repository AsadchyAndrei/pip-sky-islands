/* Pip's Sky Islands: grade 3 math depth, part 2. More kinds of questions inside the thinnest grade 3 skills
   (equal parts, same area / different perimeter, equivalent fractions, arrays, what multiplication and division mean,
   sharing equally, splitting a rectangle). The type numbers stay the same; new variants share the type with the old one.
   Loaded after js/math3x.js and before js/islands.js. */
const M3D=(base,map)=>t=>{const v=map[t];return v&&rand()<.65?v():base(t)};
const nm3=()=>pick(NAMES3);

/* ---------- Pie Peak (3.NF.1, 3.NF.3, 3.G.2) ---------- */
const PARTS_CTX=[['pizza','slices'],['sandwich','pieces'],['garden','sections'],['pie','slices'],['chocolate bar','pieces'],['flag','stripes'],['poster','boxes']];
function fr3Parts(){const d=pick([2,3,4,6,8]),C=pick(PARTS_CTX),k=R(0,3),who=nm3();
  if(k===0)return {prompt:`A ${C[0]} is cut into <b>${d}</b> equal ${C[1]}. What fraction of the ${C[0]} is <b>one</b> of the ${C[1]}?`,...strChoices(`1/${d}`,[`${d}/1`,`1/${d+1}`,`${d-1}/${d}`]),render:fracText,hint:`One out of ${d} equal parts.`,explain:`Each piece is <b>${frac(1,d)}</b> of the whole.`};
  if(k===1){const n=R(1,d-1),F=pick([['pizza','slices'],['sandwich','pieces'],['pie','slices'],['chocolate bar','pieces']]);return {prompt:`${who} cuts a ${F[0]} into <b>${d}</b> equal ${F[1]} and eats <b>${n}</b>. What fraction of the ${F[0]} did ${who} eat?`,...strChoices(`${n}/${d}`,[`${d}/${n}`,`${d-n}/${d}`,`${n}/${d+n}`].filter(x=>x!==`${n}/${d}`)),render:fracText,hint:`Top: how many pieces eaten. Bottom: how many equal pieces in all.`,explain:`${n} out of ${d} equal pieces is <b>${frac(n,d)}</b>.`}}
  if(k===2)return {prompt:`Each part of a shape is <b>${frac(1,d)}</b> of the whole. How many equal parts does the shape have?`,...numChoices(d,[d+1,d-1,d*2,1].filter(x=>x>0&&x!==d)),hint:`${frac(1,d)} means one of ${d} equal parts.`,explain:`${frac(1,d)} means the whole is cut into <b>${d}</b> equal parts.`};
  return {prompt:`Why must the parts be <b>equal</b> for each part to be ${frac(1,d)}?`,...strChoices(`A fraction like ${frac(1,d)} means ${d} parts of the same size.`,[`Because ${d} is an even number.`,`Parts never have to be equal.`,`Because shapes are always round.`]),render:c=>c,hint:`Think about fair sharing.`,explain:`Fractions name <b>equal</b> parts of a whole.`}}
function fr3Equiv(){const [a,b]=pick([[1,2],[1,3],[2,3],[1,4],[3,4]]),k=pick([2,3,4].filter(x=>b*x<=12)),m=R(0,2);
  if(m===0)return {prompt:`${frac(a,b)} = <b>?</b>/${b*k}`,...numChoices(a*k,[a,a*k+1,b*k-a*k,a+k].filter(x=>x>0&&x!==a*k)),hint:`The bottom number was multiplied by ${k}. Do the same to the top.`,explain:`${frac(a,b)} = ${frac(a*k,b*k)}, so the missing number is <b>${a*k}</b>.`};
  if(m===1)return {prompt:`Which fraction is <b>equal</b> to ${frac(a*k,b*k)}?`,...strChoices(`${a}/${b}`,[`${a*k}/${b}`,`${a}/${b*k}`,`${a+1}/${b}`].filter(x=>x!==`${a}/${b}`&&!(x.split('/')[0]*b===x.split('/')[1]*a))),render:fracText,hint:`Use fraction bars or a number line: they cover the same amount.`,explain:`${frac(a*k,b*k)} and <b>${frac(a,b)}</b> name the same amount.`};
  const who=nm3(),ot=pick(NAMES3.filter(x=>x!==who));return {prompt:`${who} ate ${frac(a,b)} of a sandwich. ${ot} ate ${frac(a*k,b*k)} of the same size sandwich. Who ate more?`,...strChoices('They ate the same amount.',[`${who} ate more.`,`${ot} ate more.`,`You can't tell.`]),hint:`Are the fractions equivalent?`,explain:`${frac(a,b)} = ${frac(a*k,b*k)}: they ate <b>the same amount</b>.`}}
genFrac3=M3D(genFrac3,{2:fr3Equiv,7:fr3Parts});

/* ---------- Fence Farm (3.MD.7c, 3.MD.8) ---------- */
const AREAS3=[12,16,18,20,24,30,36];
const pairs3=A=>{const o=[];for(let x=1;x*x<=A;x++)if(A%x===0)o.push([x,A/x]);return o};
function ar3SameArea(){const k=R(0,2);
  if(k===0){const A=pick(AREAS3),ps=pairs3(A);if(ps.length<3)return ar3SameArea();const pick2=pick(ps),[x,y]=pick2,P=2*(x+y);
    return {prompt:`Each rectangle has an area of <b>${A}</b> square units. Which one has a perimeter of <b>${P}</b> units?`,...strChoices(`${x} by ${y}`,ps.filter(o=>o!==pick2).map(o=>`${o[0]} by ${o[1]}`).slice(0,3)),hint:`Perimeter = 2 × (length + width). Try each one.`,explain:`${x} by ${y}: 2 × (${x} + ${y}) = <b>${P}</b>.`}}
  if(k===1){const A=pick(AREAS3),ps=pairs3(A);if(ps.length<2)return ar3SameArea();const [x,y]=ps[ps.length-1],[u,v]=ps[0];
    return {prompt:`A ${x} by ${y} rectangle and a ${u} by ${v} rectangle have the same area (${A} square units). Which has the <b>greater perimeter</b>?`,...strChoices(`${u} by ${v}`,[`${x} by ${y}`,'They are the same.']),hint:`Find 2 × (length + width) for each.`,explain:`${x} by ${y}: ${2*(x+y)}. ${u} by ${v}: ${2*(u+v)}. The long, thin <b>${u} by ${v}</b> has the greater perimeter.`}}
  const P=pick([12,16,20]),h=P/2,sq=h/2;const opts=[[sq,sq],[1,h-1],[2,h-2]];
  return {prompt:`These rectangles all have a perimeter of <b>${P}</b> units: ${opts.map(o=>`${o[0]} by ${o[1]}`).join(', ')}. Which has the <b>greatest area</b>?`,...strChoices(`${sq} by ${sq}`,[`1 by ${h-1}`,`2 by ${h-2}`]),hint:`Area = length × width. Try each one.`,explain:`${sq} × ${sq} = ${sq*sq}, 1 × ${h-1} = ${h-1}, 2 × ${h-2} = ${2*(h-2)}. The square <b>${sq} by ${sq}</b> has the greatest area.`}}
function ar3Split(){const b1=R(3,7),b2=R(2,5),h=R(3,8),k=R(0,1);
  if(k===0)return {prompt:`Pip wants to find <b>${h} × ${b1+b2}</b>. He splits ${b1+b2} into ${b1} + ${b2}. What is the total area?`,unit:'square units',...numChoices(h*(b1+b2),[h*b1+b2,h*b1,h+b1+b2,h*(b1+b2)+h].filter(x=>x!==h*(b1+b2))),hint:`${h} × ${b1} = ${h*b1} and ${h} × ${b2} = ${h*b2}. Add them.`,explain:`${h*b1} + ${h*b2} = <b>${h*(b1+b2)}</b> square units.`};
  return {prompt:`A garden is split into two rectangles: <b>${h} × ${b1}</b> and <b>${h} × ${b2}</b>. Which shows the area of the <b>whole</b> garden?`,...strChoices(`${h} × ${b1+b2}`,[`${h} × ${b1} × ${b2}`,`${h} + ${b1+b2}`,`${h+b1} × ${b2}`]),hint:`Both parts are ${h} wide. Put the lengths together.`,explain:`${h} × ${b1} + ${h} × ${b2} = <b>${h} × ${b1+b2}</b> = ${h*(b1+b2)}.`}}
genArea3=M3D(genArea3,{3:ar3Split,6:ar3SameArea});

/* ---------- Times Tower and Sharing Shore (3.OA.1-3) ---------- */
const ARR_CTX=[['rows of chairs','chairs'],['rows of stamps','stamps'],['rows of eggs in a carton','eggs'],['rows of cupcakes on a tray','cupcakes'],['rows of windows on a building','windows'],['rows of tiles on a floor','tiles']];
function mu3Array(){const a=R(2,6);let b;do{b=R(2,9)}while(b===a);const C=pick(ARR_CTX),k=R(0,2);
  if(k===0)return {prompt:`There are <b>${a}</b> ${C[0]} with <b>${b}</b> in each row. Which shows how many ${C[1]} in all?`,...strChoices(`${a} × ${b}`,[`${a} + ${b}`,`${a} × ${b+1}`,`${a+1} × ${b}`]),hint:`Rows × number in each row.`,explain:`${a} rows of ${b}: <b>${a} × ${b}</b> = ${a*b}.`};
  if(k===1)return {prompt:`An array has <b>${a*b}</b> ${C[1]} in <b>${a}</b> equal rows. How many are in each row?`,...numChoices(b,[a*b-a,b+1,b-1,a].filter(x=>x>0&&x!==b)),hint:`${a} × ? = ${a*b}.`,explain:`${a*b} ÷ ${a} = <b>${b}</b> in each row.`};
  return {prompt:`An array has <b>${a}</b> rows and <b>${b}</b> columns. If you turn it on its side, which multiplication does it show?`,...strChoices(`${b} × ${a}`,[`${a} + ${b}`,`${b} + ${a}`,`${a} × ${a}`]),hint:`Rows and columns switch.`,explain:`Turned on its side it shows <b>${b} × ${a}</b>, still ${a*b}.`}}
const GROUP_CTX=[['boxes','crayons'],['vases','flowers'],['teams','players'],['nests','eggs'],['bags','marbles'],['packs','juice boxes'],['cars on a train','seats']];
function mu3Mean(){const a=R(2,9);let b;do{b=R(2,9)}while(b===a);const C=pick(GROUP_CTX),k=R(0,1);
  if(k===0)return {prompt:`Which story matches <b>${a} × ${b}</b>?`,...strChoices(`There are ${a} ${C[0]} with ${b} ${C[1]} in each.`,[`There are ${a} ${C[1]} and ${b} more.`,`There are ${a+b} ${C[1]} in all.`,`${a} ${C[1]} are taken from ${b}.`]),render:c=>c,hint:`× means equal groups.`,explain:`${a} × ${b} = <b>${a} groups of ${b}</b>.`};
  return {prompt:`<b>${b<=5?Array(b).fill(a).join(' + '):Array(3).fill(a).join(' + ')+' + ...'}</b> (${a} added ${b} times) is the same as...`,...strChoices(`${b} × ${a}`,[`${a} + ${b}`,`${a} × ${a}`,`${b} + ${b}`].filter(x=>x!==`${b} × ${a}`)),hint:`Adding the same number again and again is multiplying.`,explain:`Adding ${a} ${b} times is <b>${b} × ${a}</b> = ${a*b}.`}}
const SHARE3_CTX=[['stickers','friends','shares them equally among'],['apples','baskets','puts them equally into'],['crayons','tables','splits them equally among'],['cookies','plates','puts them equally onto'],['books','shelves','puts them equally onto'],['seeds','pots','plants them equally in'],['balloons','kids','gives them equally to']];
function dv3Share(){const d=R(2,9),q=R(2,9),n=d*q,C=pick(SHARE3_CTX),who=nm3(),k=R(0,1);
  if(k===0)return {prompt:`${who} has <b>${n}</b> ${C[0]}. ${who} ${C[2]} <b>${d}</b> ${C[1]}. How many does each get?`,...numChoices(q,[n-d,q+1,q-1,d].filter(x=>x>0&&x!==q)),hint:`${n} ÷ ${d}. Think: ${d} × ? = ${n}.`,explain:`${n} ÷ ${d} = <b>${q}</b> each.`};
  return {prompt:`<b>${n}</b> ${C[0]} are shared equally. Each of the ${C[1]} gets <b>${q}</b>. How many ${C[1]} are there?`,...numChoices(d,[n-q,d+1,d-1,q].filter(x=>x>0&&x!==d)),hint:`How many groups of ${q} make ${n}?`,explain:`${n} ÷ ${q} = <b>${d}</b> ${C[1]}.`}}
genMult3=M3D(genMult3,{1:mu3Array,7:mu3Mean});
genDiv3=M3D(genDiv3,{0:dv3Share});
