/* Pip's Sky Islands: grade 5 math depth, part 2. More kinds of questions inside the thinnest grade 5 skills
   (shapes, ten times as much, fractions as division, multiplying fractions, mixed numbers, benchmark estimates,
   area with fraction sides, conversion word problems). Each wrapper keeps the same type numbers, so skills,
   progress and tests see the same types; the new variants simply share the type with the old one.
   Loaded after js/math5x.js and before js/islands.js. */
const M5D=(base,map)=>t=>{const v=map[t];return v&&rand()<.65?v():base(t)};
const nm5=()=>pick(NAMES5);
/* wrong answers: different value from the answer and from each other */
const fW5=(ans,list)=>{const seen=[fVal(ans)];return list.filter(x=>{if(!x||fVal(x)<=0)return false;const v=fVal(x);if(seen.some(s=>Math.abs(s-v)<1e-9))return false;seen.push(v);return true})};
const coprime=b=>{let a;do{a=R(1,b-1)}while(gcd(a,b)!==1);return a};

/* ---------- Fraction Falls (5.NF.1-7) ---------- */
const MIXED_CTX=[['hiked','miles','in the morning','in the afternoon','How far did %s hike in all?'],['painted for','hours','on Saturday','on Sunday','How long did %s paint in all?'],
  ['used','cups of flour','for bread','for muffins','How much flour did %s use in all?'],['ran','kilometers','on Monday','on Tuesday','How far did %s run in all?'],['picked','pounds of apples','from one tree','from another tree','How many pounds did %s pick in all?']];
function fr5Mixed(){const d=pick([2,4,8,3,6]),[b,dd]=pick([[d,d],[2,4],[4,8],[3,6],[2,8]]),w1=R(1,4),w2=R(1,3),a=coprime(b),c=coprime(dd),L=b*dd/gcd(b,dd),N=(w1*b+a)*L/b+(w2*dd+c)*L/dd,ans=fStr(N,L),who=nm5(),C=pick(MIXED_CTX);
  return {prompt:`${who} ${C[0]} <b>${w1} ${frac(a,b)}</b> ${C[1]} ${C[2]} and <b>${w2} ${frac(c,dd)}</b> ${C[1]} ${C[3]}. ${C[4].replace('%s',who)}`,...strChoices(ans+' '+C[1].split(' ')[0],fW5(ans,[fStr(N+L,L),fStr(N-1,L),`${w1+w2} ${a+c}/${b+dd}`,fStr(N+1,L)]).map(x=>x+' '+C[1].split(' ')[0])),render:fracText,
    hint:`Add the whole numbers, then add the fractions with a common denominator (${L}).`,explain:`${w1} ${frac(a,b)} + ${w2} ${frac(c,dd)} = ${w1+w2} + ${frac(a*L/b,L)} + ${frac(c*L/dd,L)} = <b>${fracText(ans)}</b>.`}}
const BENCH=[[0,'0'],[.5,'1/2'],[1,'1'],[1.5,'1 1/2'],[2,'2']];
const nearB=v=>BENCH.slice().sort((x,y)=>Math.abs(x[0]-v)-Math.abs(y[0]-v));
function fr5Bench(){const F=[[1,8],[1,6],[1,5],[1,10],[2,5],[1,2],[3,5],[4,5],[5,6],[7,8],[9,10],[11,12],[1,12],[4,9],[5,9]];
  for(let k=0;k<60;k++){const [a,b]=pick(F),[c,d]=pick(F),sub=coin(),v=sub?a/b-c/d:a/b+c/d;if(v<0||a*d===b*c)continue;const clear=x=>{const n=nearB(x);return Math.abs(n[1][0]-x)-Math.abs(n[0][0]-x)>=.1};if(!clear(a/b)||!clear(c/d))continue;
    const near=nearB(v);if(Math.abs(near[1][0]-v)-Math.abs(near[0][0]-v)<.2)continue;
    const L=b*d/gcd(b,d),ex=fStr(Math.round(v*L),L)||'0';
    return {prompt:`Use benchmark fractions to estimate: <b>${frac(a,b)} ${sub?'−':'+'} ${frac(c,d)}</b> is closest to...`,...strChoices(near[0][1],near.slice(1,4).map(x=>x[1])),render:fracText,
      hint:`Is each fraction close to 0, one half or 1?`,explain:`${frac(a,b)} is close to ${fracText(nearB(a/b)[0][1])} and ${frac(c,d)} is close to ${fracText(nearB(c/d)[0][1])}. The exact answer is ${fracText(String(ex))}, closest to <b>${fracText(near[0][1])}</b>.`}}
  return fr5Reason()}
function fr5Reason(){const [a,b]=pick([[5,6],[7,8],[4,5],[3,4]]),[c,d]=pick([[2,3],[3,4],[5,8],[4,5]]),who=nm5();
  return {prompt:`${who} says <b>${frac(a,b)} + ${frac(c,d)}</b> is less than 1. Is that reasonable?`,...strChoices(`No. Both fractions are more than one half, so the sum is more than 1.`,[`Yes. Fractions always add up to less than 1.`,`Yes, because ${b} and ${d} are small numbers.`,`No. The sum must be exactly 1.`]),
    hint:`Compare each fraction with one half.`,explain:`${frac(a,b)} > ${frac(1,2)} and ${frac(c,d)} > ${frac(1,2)}, so the sum is <b>more than 1</b>.`}}
const SHARE_CTX=[['pizzas','friends','pizza'],['feet of ribbon','students','foot of ribbon'],['liters of lemonade','cups','liter'],['pounds of rice','bags','pound'],['sandwiches','hikers','sandwich'],['meters of rope','teams','meter of rope'],['pans of brownies','tables','pan']];
function fr5Share(){const s=R(2,8),p=R(1,s*3);if(p%s===0)return fr5Share();const C=pick(SHARE_CTX),ans=fStr(p,s),k=R(0,2);
  if(k===0)return {prompt:`<b>${p}</b> ${C[0]} are shared equally among <b>${s}</b> ${C[1]}. How much does each get?`,...strChoices(ans,fW5(ans,[`${s}/${p}`,`1/${s}`,fStr(p+1,s),`${p}/${s+1}`])),render:fracText,hint:`${p} ÷ ${s} can be written as the fraction ${frac(p,s)}.`,explain:`${p} ÷ ${s} = ${frac(p,s)}${ans!==`${p}/${s}`?' = '+fracText(ans):''} ${C[2]} each.`};
  if(k===1){if(p<s)return fr5Share();const lo=Math.floor(p/s);return {prompt:`<b>${p} ÷ ${s}</b> is between which two whole numbers?`,...strChoices(`${lo} and ${lo+1}`,[`${lo+1} and ${lo+2}`,`${lo-1>=0?lo-1:lo+2} and ${lo-1>=0?lo:lo+3}`,`${s} and ${p}`]),hint:`${s} × ${lo} = ${s*lo} and ${s} × ${lo+1} = ${s*(lo+1)}.`,explain:`${p} ÷ ${s} = ${fracText(ans)}, which is between <b>${lo} and ${lo+1}</b>.`}}
  return {prompt:`Which division is the same as <b>${frac(p,s)}</b>?`,...strChoices(`${p} ÷ ${s}`,[`${s} ÷ ${p}`,`${p} × ${s}`,`${p} − ${s}`]),hint:`The fraction bar means "divided by."`,explain:`${frac(p,s)} means <b>${p} ÷ ${s}</b>.`}}
function fr5OfStory(){const k=R(0,3),who=nm5();
  if(k===0){const d=pick([3,4,5,6,8]),a=R(1,d-1),n=d*R(3,8),ans=n/d*a,g=pick([['students in the class','ride the bus','students'],['marbles in a jar','are blue','marbles'],['books on the shelf','are mysteries','books'],['minutes of practice','are spent on scales','minutes']]);
    return {prompt:`There are <b>${n}</b> ${g[0]}. <b>${frac(a,d)}</b> of them ${g[1]}. How many is that?`,unit:g[2],...numChoices(ans,[n/d,n-ans,ans+a,n*a].filter(x=>x>0&&x!==ans)),hint:`Find ${frac(1,d)} of ${n} first: ${n} ÷ ${d}.`,explain:`${n} ÷ ${d} = ${n/d}. ${n/d} × ${a} = <b>${ans}</b>.`}}
  if(k===1){const [a,b]=pick([[2,3],[3,4],[1,2],[3,5],[5,8]]),[c,d]=pick([[1,2],[1,3],[2,3],[1,4]]),ans=fStr(a*c,b*d);
    return {prompt:`A recipe uses <b>${frac(a,b)} cup</b> of sugar. ${who} makes <b>${frac(c,d)}</b> of the recipe. How much sugar does ${who} need?`,...strChoices(ans+' cup',fW5(ans,[fStr(a+c,b+d),fStr(a*d,b*c),fStr(a*c,b+d)]).map(x=>x+' cup')),render:fracText,hint:`Find ${frac(c,d)} of ${frac(a,b)}: multiply.`,explain:`${frac(c,d)} × ${frac(a,b)} = ${frac(a*c,b*d)}${ans!==`${a*c}/${b*d}`?' = '+fracText(ans):''} cup.`}}
  if(k===2){const [a,b]=pick([[3,4],[2,3],[3,5],[4,5]]),[c,d]=pick([[1,2],[1,3],[2,3],[1,4]]),ans=fStr(a*c,b*d);
    return {prompt:`<b>${frac(a,b)}</b> of a garden is vegetables. <b>${frac(c,d)}</b> of the vegetable part is tomatoes. What fraction of the whole garden is tomatoes?`,...strChoices(ans,fW5(ans,[fStr(a+c,b+d),fStr(a*d,b*c),fStr(c,d),fStr(a*c,b+d)])),render:fracText,hint:`"${frac(c,d)} of ${frac(a,b)}" means ${frac(c,d)} × ${frac(a,b)}.`,explain:`${frac(c,d)} × ${frac(a,b)} = <b>${fracText(ans)}</b> of the garden.`}}
  const w=R(2,5),[a,b]=pick([[1,2],[1,4],[3,4],[1,3],[2,3]]),n=pick([2,4,6,8,12]),tot=(w*b+a)*n,ans=fStr(tot,b);
  return {prompt:`Each bag holds <b>${w} ${frac(a,b)} pounds</b> of soil. How many pounds are in <b>${n}</b> bags?`,...strChoices(ans+' lb',fW5(ans,[fStr(w*n*b+a,b),fStr(tot+b,b),String(w*n)]).map(x=>x+' lb')),render:fracText,hint:`Multiply the whole part and the fraction part by ${n}, then add.`,explain:`${w} × ${n} = ${w*n} and ${frac(a,b)} × ${n} = ${fracText(fStr(a*n,b))}. Total: <b>${fracText(ans)} lb</b>.`}}
genFrac5=M5D(genFrac5,{2:fr5Mixed,3:()=>coin()?fr5Bench():fr5Reason(),4:fr5Share,5:fr5OfStory,6:fr5OfStory});

/* ---------- Fence Farm: area with fraction side lengths (5.NF.4b) ---------- */
function vol5FracArea(){const [a,b]=pick([[1,2],[2,3],[3,4],[1,3],[3,5],[5,6],[3,8]]),[c,d]=pick([[1,2],[3,4],[2,3],[4,5],[1,4],[5,8]]),k=R(0,2);
  if(k===0){const C=pick([['garden bed','ft','sq ft'],['rug','yd','sq yd'],['poster','m','sq m'],['tile','ft','sq ft'],['patch of grass','m','sq m']]),ans=fStr(a*c,b*d);
    return {prompt:`A ${C[0]} is <b>${frac(a,b)} ${C[1]}</b> long and <b>${frac(c,d)} ${C[1]}</b> wide. What is its area?`,...strChoices(ans+' '+C[2],fW5(ans,[fStr(a*d+c*b,b*d),fStr(a+c,b+d),fStr(2*(a*d+c*b),b*d)]).map(x=>x+' '+C[2])),render:fracText,hint:`Area = length × width.`,explain:`${frac(a,b)} × ${frac(c,d)} = <b>${fracText(ans)} ${C[2]}</b>.`}}
  if(k===1){const ans=fStr(a*a,b*b);return {prompt:`A square has sides <b>${frac(a,b)} m</b> long. What is its area?`,...strChoices(ans+' sq m',fW5(ans,[fStr(4*a,b),fStr(2*a,b),fStr(a,b*2)]).map(x=>x+' sq m')),render:fracText,hint:`Area of a square = side × side.`,explain:`${frac(a,b)} × ${frac(a,b)} = <b>${fracText(ans)} sq m</b>.`}}
  const w=R(2,4),ans=fStr((w*b+a)*c,b*d);return {prompt:`A board is <b>${w} ${frac(a,b)} ft</b> long and <b>${frac(c,d)} ft</b> wide. What is its area?`,...strChoices(ans+' sq ft',fW5(ans,[fStr(w*c,d),fStr((w*b+a)*d+c*b,b*d),fStr((w*b+a)*c+b*d,b*d)]).map(x=>x+' sq ft')),render:fracText,hint:`Change ${w} ${frac(a,b)} to ${frac(w*b+a,b)}, then multiply.`,explain:`${frac(w*b+a,b)} × ${frac(c,d)} = ${frac((w*b+a)*c,b*d)} = <b>${fracText(ans)} sq ft</b>.`}}
genVol5=M5D(genVol5,{4:vol5FracArea});

/* ---------- Shape Shipyard: classifying figures (5.G.3-4) ---------- */
const SH_TF=[['All squares are rhombuses.','True'],['All rhombuses are squares.','False'],['All rectangles are quadrilaterals.','True'],['All quadrilaterals are rectangles.','False'],['Some parallelograms are rectangles.','True'],
  ['A trapezoid can be a square.','False'],['Every square is a parallelogram.','True'],['Every kite is a rhombus.','False'],['Some rectangles are rhombuses.','True'],['All parallelograms have 4 right angles.','False'],
  ['Every equilateral triangle is also isosceles.','True'],['A right triangle can also be isosceles.','True'],['A triangle can have two right angles.','False'],['An obtuse triangle can be equilateral.','False']];
const SH_WHICH=[['Which shape has exactly one pair of parallel sides?','trapezoid',['square','rhombus','rectangle']],['Which shape has 4 equal sides but does not need right angles?','rhombus',['rectangle','trapezoid','kite']],
  ['Which shape has 2 pairs of parallel sides and 4 right angles, but its sides do not all have to be equal?','rectangle',['rhombus','trapezoid','kite']],['Which is the most specific name for a shape with 4 equal sides and 4 right angles?','square',['rectangle','rhombus','parallelogram']],
  ['Which word describes every square, rectangle, rhombus and trapezoid?','quadrilateral',['parallelogram','triangle','pentagon']],['A shape is a parallelogram with 4 right angles. What must it be?','a rectangle',['a trapezoid','a kite','a triangle']]];
function sh5TF(){const q=pick(SH_TF);return {prompt:`True or false? <b>${q[0]}</b>`,choices:['True','False'],answer:q[1],hint:`List what each shape must have, then check.`,explain:`It is <b>${q[1].toLowerCase()}</b>.`}}
function sh5Which(){const q=pick(SH_WHICH);return {prompt:q[0],...strChoices(q[1],q[2]),hint:`Parallelograms have 2 pairs of parallel sides; rectangles add right angles; rhombuses add equal sides; a square has both.`,explain:`It is <b>${q[1]}</b>.`}}
function sh5Tri(){const k=R(0,1);
  if(k===0){let A,B,C;do{A=R(20,120);B=R(20,120);C=180-A-B}while(C<15||A===90||B===90||C===90||Math.max(A,B,C)>145);if(coin()){A=90;B=R(20,70);C=90-B}
    const mx=Math.max(A,B,C),ans=mx===90?'right':mx>90?'obtuse':'acute';return {prompt:`A triangle has angles of <b>${A}°</b>, <b>${B}°</b> and <b>${C}°</b>. What kind of triangle is it?`,...strChoices(ans,['acute','right','obtuse','equilateral'].filter(x=>x!==ans)),hint:`Look at the largest angle: under 90°, exactly 90° or over 90°?`,explain:`The largest angle is ${mx}°, so it is <b>${ans}</b>.`}}
  const u=pick(['cm','in','m']),t=R(0,2);let s;if(t===0){const x=R(3,9);s=[x,x,x]}else if(t===1){const x=R(4,9);let y;do{y=R(3,12)}while(y===x||y>=2*x);s=[x,x,y]}else{const x=R(3,6),y=x+R(1,3),z=y+R(1,2);s=[x,y,z]}
  const ans=['equilateral','isosceles','scalene'][t];return {prompt:`A triangle has sides of <b>${s[0]} ${u}</b>, <b>${s[1]} ${u}</b> and <b>${s[2]} ${u}</b>. What kind of triangle is it?`,...strChoices(ans,['equilateral','isosceles','scalene','right'].filter(x=>x!==ans)),hint:`Count how many sides are equal.`,explain:`${t===0?'All three sides are equal':t===1?'Exactly two sides are equal':'No sides are equal'}: <b>${ans}</b>.`}}
const SH_ATTR=[['All quadrilaterals have 4 sides. A trapezoid is a quadrilateral. So a trapezoid...','has 4 sides',['has 3 sides','has 2 pairs of parallel sides','has 4 right angles']],
  ['All rhombuses have 4 equal sides. A square is a rhombus. So a square...','has 4 equal sides',['has no equal sides','has only 2 equal sides','has 5 sides']],
  ['All rectangles have opposite sides that are equal. A square is a rectangle. So a square...','has opposite sides that are equal',['has no equal sides','has one pair of parallel sides','is a triangle']],
  ['Which attribute do ALL parallelograms share?','2 pairs of parallel sides',['4 right angles','4 equal sides','exactly one pair of parallel sides']],
  ['Which attribute do rectangles have that not every parallelogram has?','4 right angles',['4 sides','2 pairs of parallel sides','opposite sides equal']],
  ['Which attribute do squares share with rhombuses?','4 equal sides',['exactly one pair of parallel sides','5 vertices','no parallel sides']],
  ['A shape has 2 pairs of parallel sides. Which could it NOT be?','a trapezoid with exactly one pair of parallel sides',['a rectangle','a square','a rhombus']]];
function sh5Attr(){const q=pick(SH_ATTR);return {prompt:q[0],...strChoices(q[1],q[2]),hint:`A shape inside a category has every attribute of that category.`,explain:`<b>${q[1]}</b>.`}}
genShape5=M5D(genShape5,{0:sh5TF,1:sh5Tri,2:sh5Which,3:sh5Attr});

/* ---------- Digit Cliffs: ten times as much (5.NBT.1) ---------- */
function pl5Ten(){const d=R(2,9),P=[['tens',10],['ones',1],['tenths',.1],['hundredths',.01],['thousandths',.001]],i=R(0,3),j=i+1,k=R(0,2);
  if(k===0)return {prompt:`What is <b>10 times</b> ${d} ${P[j][0]}?`,...strChoices(`${d} ${P[i][0]}`,[`${d} ${P[j+1]?P[j+1][0]:'tens'}`,`${d*10} ${P[i][0]}`,`${d} ${P[j][0]}`].filter(x=>x!==`${d} ${P[i][0]}`)),hint:`Each place is 10 times the place to its right.`,explain:`10 × ${d} ${P[j][0]} = <b>${d} ${P[i][0]}</b>.`};
  if(k===1)return {prompt:`What is <b>1/10 of</b> ${d} ${P[i][0]}?`,...strChoices(`${d} ${P[j][0]}`,[`${d} ${i>0?P[i-1][0]:'hundreds'}`,`${d*10} ${P[j][0]}`,`${d} ${P[i][0]}`].filter(x=>x!==`${d} ${P[j][0]}`)),render:fracText,hint:`Each place is 1/10 of the place to its left.`,explain:`1/10 of ${d} ${P[i][0]} = <b>${d} ${P[j][0]}</b>.`};
  const a=d*P[i][1],b=d*P[j][1];return {prompt:`How does the value of the ${d} in <b>${dk(Math.round(a*1000))}</b> compare to the value of the ${d} in <b>${dk(Math.round(b*1000))}</b>?`,...strChoices('10 times as much',['1/10 as much','100 times as much','the same']),render:fracText,hint:`Which place is each ${d} in?`,explain:`${d} ${P[i][0]} is <b>10 times</b> ${d} ${P[j][0]}.`}}
genPlace5=M5D(genPlace5,{1:pl5Ten});

/* ---------- Measure Mine: conversion word problems (5.MD.1) ---------- */
function ms5Story(){const k=R(0,4),who=nm5();
  if(k===0){const g=R(2,6),c=pick([2,4]),cups=g*4*c;return {prompt:`${who} has <b>${g} gallons</b> of juice. Each glass holds <b>${c===2?'1 pint':'1 cup'}</b>. How many glasses can ${who} fill? (1 gallon = 4 quarts, 1 quart = 2 pints, 1 pint = 2 cups)`,...numChoices(g*4*(c===2?2:4),[g*4,g*2,g*8*(c===2?2:1)].filter(x=>x!==g*4*(c===2?2:4))),unit:'glasses',hint:`Change gallons to quarts, then to ${c===2?'pints':'cups'}.`,explain:`${g} gal = ${g*4} qt = ${g*8} pt${c===2?'':` = ${g*16} cups`}: <b>${g*4*(c===2?2:4)}</b> glasses.`}}
  if(k===1){const h=R(2,5),m=pick([15,20,30]),n=h*60/m;return {prompt:`${who} practices piano for <b>${h} hours</b> this week, in sessions of <b>${m} minutes</b>. How many sessions is that?`,...numChoices(n,[h*m,n*2,Math.round(h*100/m)].filter(x=>x>0&&x!==n)),unit:'sessions',hint:`${h} hours = ${h*60} minutes.`,explain:`${h*60} ÷ ${m} = <b>${n}</b> sessions.`}}
  if(k===2){const m=R(2,6),piece=pick([20,25,50]),n=m*100/piece;return {prompt:`A roll of fabric is <b>${m} meters</b> long. ${who} cuts it into strips <b>${piece} cm</b> long. How many strips?`,...numChoices(n,[m*piece,n*10,n/2,n+m].filter(x=>Number.isInteger(x)&&x>0&&x!==n)),unit:'strips',hint:`1 meter = 100 cm, so ${m} m = ${m*100} cm.`,explain:`${m*100} ÷ ${piece} = <b>${n}</b> strips.`}}
  if(k===3){const bags=R(3,8),g=pick([250,500]),kg=bags*g/1000;return {prompt:`${who} packs <b>${bags}</b> bags of trail mix. Each bag has <b>${g} grams</b>. How many kilograms is that in all?`,...strChoices(`${dk(kg*1000)} kg`,[`${dk(kg*10000)} kg`,`${bags*g} kg`,`${dk(kg*100)} kg`].filter(x=>x!==`${dk(kg*1000)} kg`)),hint:`Find the total grams, then divide by 1,000.`,explain:`${bags} × ${g} = ${fmt(bags*g)} g = <b>${dk(kg*1000)} kg</b>.`}}
  const ft=R(2,5),inch=R(1,11),total=ft*12+inch,cut=R(4,10);if(cut>=total)return ms5Story();const left=total-cut;
  return {prompt:`A board is <b>${ft} feet ${inch} inches</b> long. ${who} saws off <b>${cut} inches</b>. How long is the board now, in inches?`,...numChoices(left,[ft*10+inch-cut,total+cut,left+12,left-2].filter(x=>x>0&&x!==left)),unit:'inches',hint:`${ft} feet = ${ft*12} inches. Add ${inch}, then subtract ${cut}.`,explain:`${ft*12} + ${inch} = ${total}. ${total} − ${cut} = <b>${left} inches</b>.`}}
genMeasure5=M5D(genMeasure5,{3:ms5Story});
