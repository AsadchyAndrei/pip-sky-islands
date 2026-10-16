/* Pip's Sky Islands: more 5th grade math question types (depth for the ca-5 pack).
   Same scheme as js/math3x.js: each entry names its skill (sk); tools/sync_ext_skills.py writes the type numbers
   into content/skills/math.json. Decimals are worked in thousandths with dk() so there are no float errors. */
const X5={};
const NAMES5=['Maya','Leo','Ava','Sam','Nora','Eli','Zoe','Jay','Luz','Omar'];
const money5=x=>{const t=dk(x);return '$'+(t.includes('.')?t.replace(/\.(\d)$/,'.$10'):t+'.00')};

/* Digit Cliffs */
X5.place5=[
 {sk:'math.place5.value-of-a-digit',f(){let n;do{n=R(1001,9999)}while(new Set(String(n)).size<4||String(n)[1]==='0'||String(n)[2]==='0'||String(n)[3]==='0');const s=String(n),i=R(1,3),pl=['ones','tenths','hundredths','thousandths'][i];
  return {prompt:`In <b>${dk(n)}</b>, which place is the <b>${s[i]}</b> in?`,...strChoices(pl,['tenths','hundredths','thousandths','tens','ones'].filter(x=>x!==pl)),hint:`After the decimal point: tenths, hundredths, thousandths.`,explain:`The ${s[i]} is ${i} place${i>1?'s':''} after the decimal point: the <b>${pl}</b> place.`}}},
 {sk:'math.place5.ten-times-as-much',f(){const d=R(2,9);return {prompt:`The ${d} in <b>0.0${d}</b> is what part of the value of the ${d} in <b>0.${d}</b>?`,...strChoices('1/10',['10 times','1/100','the same']),render:fracText,hint:`The ${d} in 0.0${d} is in the hundredths place; the ${d} in 0.${d} is in the tenths place. How do those places compare?`,explain:`0.0${d} is ${frac(1,10)} of 0.${d}: <b>${frac(1,10)}</b> as much.`}}},
 {sk:'math.place5.powers-of-ten',f(){const e=R(2,5),a=R(2,9),k=coin();
  return k?{prompt:`How many zeros are in <b>10<sup>${e}</sup></b> written as a whole number?`,...numChoices(e,[e+1,e-1,10].filter(x=>x!==e)),hint:`10<sup>${e}</sup> = 10 × 10 ... (${e} tens).`,explain:`10<sup>${e}</sup> = ${fmt(10**e)}: <b>${e}</b> zeros.`}
   :{prompt:`${a} × 10<sup>${e}</sup> = ?`,...strChoices(fmt(a*10**e),[fmt(a*10**(e-1)),fmt(a*10**(e+1)),fmt(a*10*e)]),hint:`10<sup>${e}</sup> is 1 followed by ${e} zeros.`,explain:`${a} × ${fmt(10**e)} = <b>${fmt(a*10**e)}</b>.`}}},
 {sk:'math.place5.powers-of-ten',f(){const n=R(11,99),e=R(1,3),z=10**e,ans=dk(n*100*z);
  return {prompt:`${dk(n*100)} × 10<sup>${e}</sup> = ?`,...strChoices(ans,[dk(n*100*z*10),dk(n*100*z/10),dk(n*100+z*1000)].filter(x=>x!==ans)),hint:`× 10<sup>${e}</sup> moves each digit ${e} place${e>1?'s':''} to the left.`,explain:`${dk(n*100)} × ${fmt(z)} = <b>${ans}</b>.`}}},
 {sk:'math.place5.comparing-decimals',f(){let a,b;do{a=R(101,999);b=pick([Math.floor(a/10)*10,a+R(-30,30),Math.floor(a/100)*100+R(0,9)*10])}while(b<=0);const sign=a>b?'>':a<b?'<':'=';
  return {prompt:`Which sign makes it true? <b>${dk(a)} ☐ ${dk(b)}</b>`,choices:['<','>','='],answer:sign,hint:`Line up the decimal points. Compare tenths, then hundredths, then thousandths.`,explain:`<b>${dk(a)} ${sign} ${dk(b)}</b>.`}}},
 {sk:'math.place5.rounding-decimals',f(){let n;do{n=R(1100,9900)}while(n%100===0||n%100===50);const r=Math.round(n/100)*100,[who,u]=pick([['Pip ran','kilometers'],['A puppy weighs','kilograms'],['The rain gauge shows','inches']]);
  return {prompt:`${who} <b>${dk(n)}</b> ${u}. What is that rounded to the nearest <b>tenth</b>?`,...strChoices(dk(r),[dk(r===n-n%100?r+100:r-100),dk(Math.round(n/1000)*1000),dk(Math.round(n/10)*10)].filter(x=>x!==dk(r))),hint:`Look at the hundredths digit. 5 or more rounds the tenths up.`,explain:`${dk(n)} rounded to the nearest tenth is <b>${dk(r)}</b>.`}}},
 {sk:'math.place5.decimals-in-expanded-form',f(){const w=R(1,9),h=R(11,99),ans=dk(w*1000+h*10);
  return {prompt:`Which number is <b>${DW[w]} and ${numWords(h)} hundredths</b>?`,...strChoices(ans,[dk(w*1000+h),dk(h*1000+w*10),dk(w*1000+h*100)].filter(x=>x!==ans)),hint:`Hundredths means 2 digits after the decimal point.`,explain:`${DW[w]} and ${h} hundredths = <b>${ans}</b>.`}}}];

/* Carry Canyon (expressions) */
X5.expr5=[
 {sk:'math.expr5.order-of-operations',f(){const d=R(2,6),q=R(2,9),a=R(2,9),b=R(2,9),ans=q+a*b;
  return {prompt:`${d*q} ÷ ${d} + ${a} × ${b} = ?`,...numChoices(ans,[(d*q/d+a)*b,d*q/(d+a*b)|0||ans+3,q+a+b,ans+a]),hint:`Multiply and divide first (left to right), then add.`,explain:`${d*q} ÷ ${d} = ${q} and ${a} × ${b} = ${a*b}. ${q} + ${a*b} = <b>${ans}</b>.`}}},
 {sk:'math.expr5.brackets-and-parentheses',f(){const a=R(2,9),b=R(2,9),c=R(2,6),want=(a+b)*c;
  return {prompt:`Where do the parentheses go so that the answer is <b>${want}</b>?`,...strChoices(`(${a} + ${b}) × ${c}`,[`${a} + (${b} × ${c})`,`${a} + ${b} × ${c}`,`(${a} × ${b}) + ${c}`]),hint:`Try each one. What gets done first?`,explain:`(${a} + ${b}) × ${c} = ${a+b} × ${c} = <b>${want}</b>.`}}},
 {sk:'math.expr5.writing-expressions',f(){const a=R(2,9),b=R(2,9),c=R(2,5);
  return {prompt:`Which expression means <i>"add ${a} and ${b}, then multiply by ${c}"</i>?`,...strChoices(`(${a} + ${b}) × ${c}`,[`${a} + ${b} × ${c}`,`${c} × ${a} + ${b}`,`${a} × ${b} + ${c}`]),hint:`The adding happens first, so it needs parentheses.`,explain:`<b>(${a} + ${b}) × ${c}</b>: the parentheses make you add first.`}}},
 {sk:'math.expr5.reading-expressions',f(){const a=R(30,90),b=R(10,a-5),k=pick([2,3,4]);
  return {prompt:`Which expression is <b>${k} times as large</b> as <b>${a} − ${b}</b>, without calculating?`,...strChoices(`${k} × (${a} − ${b})`,[`${k} + (${a} − ${b})`,`${k} × ${a} − ${b}`,`(${a} − ${b}) − ${k}`]),hint:`"Times as large" means multiply the whole expression.`,explain:`<b>${k} × (${a} − ${b})</b> is ${k} times the value of ${a} − ${b}.`}}},
 {sk:'math.expr5.brackets-and-parentheses',f(){const a=R(2,6),b=R(2,5),c=R(1,4),d=R(2,4),ans=d*(a*b-c)+R(0,0);
  return {prompt:`${d} × [${a} × ${b} − ${c}] = ?`,...numChoices(ans,[d*a*b-c,d*(a*b)+c,ans+d]),hint:`Work inside the brackets first: multiply, then subtract.`,explain:`${a} × ${b} − ${c} = ${a*b-c}. ${d} × ${a*b-c} = <b>${ans}</b>.`}}}];

/* Times Meadow */
X5.mult5=[
 {sk:'math.mult5.multiplying-by-two-digit-numbers',f(){const a=R(12,89),b=R(2,9)*10,p=a*b;
  return {prompt:`${a} × ${b} = ?`,...numChoices(p,[a*b/10,p*10,p+b,p-a]),hint:`Multiply ${a} × ${b/10}, then multiply by 10.`,explain:`${a} × ${b/10} = ${a*b/10}. × 10 = <b>${fmt(p)}</b>.`}}},
 {sk:'math.mult5.multiplying-four-digit-numbers',f(){const a=R(1,9)*1000+R(0,0)*100+R(1,9)*10+R(1,9),b=R(3,9),p=a*b;
  return {prompt:`${fmt(a)} × ${b} = ?`,...numChoices(p,[p-1000*b+100*b,p+b*10,p-b,(a+100)*b]),hint:`There is a 0 in the hundreds place. ${b} × 0 hundreds = 0 hundreds, plus anything you carried.`,explain:`${fmt(a)} × ${b} = <b>${fmt(p)}</b>.`}}},
 {sk:'math.mult5.multiplication-word-problems',f(){const r=R(18,42),s=R(24,56),p=r*s;
  return {visual:sceneGroups('row',r,s,'seat'),prompt:`A theater has <b>${r}</b> rows with <b>${s}</b> seats in each row. How many seats are there?`,...numChoices(p,[r+s,p+s,p-r,r*(s-10)]),hint:`Rows × seats in each row.`,explain:`${r} × ${s} = <b>${fmt(p)}</b> seats.`}}},
 {sk:'math.mult5.estimating-products',f(){const a=R(31,89)*10+R(1,9),b=R(18,29),est=Math.round(a/100)*100*Math.round(b/10)*10,p=a*b,line=Math.round(est/1000)*1000||est;const more=p>line;
  return {prompt:`Without multiplying exactly: is <b>${a} × ${b}</b> more or less than <b>${fmt(line)}</b>?`,choices:['more','less'],answer:more?'more':'less',hint:`Round both numbers and multiply: about ${Math.round(a/100)*100} × ${Math.round(b/10)*10}. Then think about which way you rounded.`,explain:`${a} × ${b} = ${fmt(p)}, which is <b>${more?'more':'less'}</b> than ${fmt(line)}.`}}},
 {sk:'math.mult5.multiplying-by-two-digit-numbers',f(){const a=R(2,9)*100,b=R(2,9)*10,p=a*b;
  return {prompt:`${a} × ${b} = ?`,...numChoices(p,[p/10,p*10,a*b/100]),hint:`Multiply ${a/100} × ${b/10}, then add the zeros: 3 of them.`,explain:`${a/100} × ${b/10} = ${a*b/1000}, then 3 zeros: <b>${fmt(p)}</b>.`}}}];

/* Sharing Shore */
X5.div5=[
 {sk:'math.div5.dividing-by-two-digit-numbers',f(){const d=R(2,9)*10,q=R(12,48),n=d*q;
  return {prompt:`${fmt(n)} ÷ ${d} = ?`,...numChoices(q,[q*10,q+1,Math.round(q/10)||q+10].filter(x=>x!==q)),hint:`Divide both numbers by 10 first: ${fmt(n/10)} ÷ ${d/10}.`,explain:`${fmt(n/10)} ÷ ${d/10} = <b>${q}</b>.`}}},
 {sk:'math.div5.dividing-by-two-digit-numbers',f(){const d=R(12,35),q=R(21,69),n=d*q;
  return {prompt:`Which multiplication checks that <b>${fmt(n)} ÷ ${d} = ${q}</b>?`,...strChoices(`${q} × ${d} = ${fmt(n)}`,[`${q} + ${d} = ${q+d}`,`${fmt(n)} × ${d} = ${q}`,`${q} × ${fmt(n)} = ${d}`]),hint:`Quotient × divisor should give the dividend.`,explain:`<b>${q} × ${d} = ${fmt(n)}</b>, so the division is right.`}}},
 {sk:'math.div5.interpreting-remainders',f(){const per=R(12,24),full=R(8,30),extra=R(1,per-1),n=per*full+extra,k=coin();
  return k?{visual:scenePackInto(n,per,'crayon','in a box'),prompt:`A factory packs <b>${n}</b> crayons into boxes of <b>${per}</b>. How many <b>full</b> boxes can it make?`,...numChoices(full,[full+1,extra,per].filter(x=>x!==full)),hint:`Divide. The crayons left over do not fill a box.`,explain:`${n} ÷ ${per} = ${full} R ${extra}. <b>${full}</b> full boxes.`}
   :{visual:scenePackInto(n,per,'crayon','in a box'),prompt:`<b>${n}</b> crayons go into boxes of <b>${per}</b>. How many crayons are <b>left over</b>?`,...numChoices(extra,[full,per-extra,extra+1].filter(x=>x!==extra)),hint:`Find how many full boxes, then what is left.`,explain:`${per} × ${full} = ${per*full}. ${n} − ${per*full} = <b>${extra}</b> left over.`}}},
 {sk:'math.div5.estimating-quotients',f(){const d=R(3,8),q=R(4,9),n=d*q*100+R(-40,40),dv=d*10+R(-3,3);
  return {prompt:`Which is the best estimate for <b>${fmt(n)} ÷ ${dv}</b>?`,...numChoices(q*10,[q,q*100,q*10+10]),hint:`Use friendly numbers: ${fmt(d*q*100)} ÷ ${d*10}.`,explain:`${fmt(d*q*100)} ÷ ${d*10} = ${q*10}, so about <b>${q*10}</b>.`}}},
 {sk:'math.div5.dividing-unit-fractions',f(){const k=pick([2,3,4]),c=R(2,6),ans=c*k;
  return {prompt:`Pip has <b>${c} cups</b> of trail mix. Each bag gets ${frac(1,k)} cup. How many bags can he fill?`,...numChoices(ans,[c+k,c,ans+k].filter(x=>x!==ans)),hint:`How many ${frac(1,k)}s are in 1 cup? Then in ${c} cups?`,explain:`There are ${k} pieces of ${frac(1,k)} in each cup. ${c} × ${k} = <b>${ans}</b> bags.`}}},
 {sk:'math.div5.dividing-unit-fractions',f(){const k=pick([2,3,4]),n=pick([2,3,4,5]),ans=`1/${k*n}`;
  return {prompt:`${frac(1,k)} of a pan of brownies is shared equally by <b>${n}</b> friends. What fraction of the whole pan does each friend get?`,...strChoices(ans,fWrong(ans,[`${n}/${k}`,`1/${k+n}`,`${k}/${n}`])),render:fracText,hint:`${frac(1,k)} ÷ ${n}: cut the ${frac(1,k)} into ${n} equal parts.`,explain:`${frac(1,k)} ÷ ${n} = <b>${frac(1,k*n)}</b> of the pan.`}}}];

/* Decimal Dock */
X5.dec5=[
 {sk:'math.dec5.adding-and-subtracting-decimals',f(){const a=R(11,99)*100,b=R(101,999)*10,s=a+b;
  return {prompt:`${dk(a)} + ${dk(b)} = ?`,...strChoices(dk(s),[dk(a/10+b),dk(a+b/10),dk(s+100)].filter(x=>x!==dk(s))),hint:`Line up the decimal points. ${dk(a)} = ${dk(a)}0.`,explain:`${dk(a)}0 + ${dk(b)} = <b>${dk(s)}</b>.`}}},
 {sk:'math.dec5.adding-and-subtracting-decimals',f(){const w=R(3,9),b=R(101,(w-1)*100-1)*10,d=w*1000-b;
  return {prompt:`${w} − ${dk(b)} = ?`,...strChoices(dk(d),[dk(d+100),dk(d+10),dk(Math.abs(b-w*100))].filter(x=>x!==dk(d))),hint:`Write ${w} as ${w}.00, then subtract.`,explain:`${w}.00 − ${dk(b)} = <b>${dk(d)}</b>.`}}},
 {sk:'math.dec5.multiplying-decimals',f(){const a=R(2,9),b=R(2,9),[thing,u]=pick([['A path is','km'],['A board is','m']]);
  return {prompt:`${thing} <b>0.${a}</b> ${u} long. Pip walks <b>0.${b}</b> of it. How far does he walk?`,...strChoices(dk(a*b*10),[dk(a*b*100),dk(a*b),dk((a+b)*100)]),hint:`0.${b} of 0.${a} means 0.${b} × 0.${a}. Tenths × tenths = hundredths.`,explain:`${a} × ${b} = ${a*b}, as hundredths: <b>${dk(a*b*10)} ${u}</b>.`}}},
 {sk:'math.dec5.dividing-decimals',f(){const n=R(3,6),each=R(105,499)*10,tot=each*n;
  return {prompt:`<b>${n}</b> friends share <b>${money5(tot)}</b> equally. How much does each friend get?`,...strChoices(money5(each),[money5(each*10),money5(each+100),money5(tot-each)]),hint:`Divide the money into ${n} equal parts.`,explain:`${money5(tot)} ÷ ${n} = <b>${money5(each)}</b>.`}}},
 {sk:'math.dec5.dividing-decimals',f(){const w=R(2,9),d=pick([5,25]),dv=dk(d*(d===5?100:10)),ans=w*(d===5?2:4);
  return {prompt:`${w} ÷ ${dv} = ?`,...numChoices(ans,[w*2===ans?w*4:w*2,w,ans*10].filter(x=>x!==ans)),hint:`How many ${dv}s fit in 1? Then in ${w}?`,explain:`There are ${d===5?2:4} pieces of ${dv} in 1, so ${w} × ${d===5?2:4} = <b>${ans}</b>.`}}},
 {sk:'math.dec5.money-problems-with-decimals',f(){const p=[R(105,499),R(105,499),R(105,499)].map(x=>x*10),s=p.reduce((a,b)=>a+b,0),pay=Math.ceil((s+1)/10000)*10000,ch=pay-s,m=money5;
  return {visual:sceneShop([['book',m(p[0])],['pen',m(p[1])],['snack',m(p[2])]],m(pay)),prompt:`Pip buys a book for <b>${m(p[0])}</b>, a pen for <b>${m(p[1])}</b> and a snack for <b>${m(p[2])}</b>. He pays with <b>${m(pay)}</b>. How much change does he get?`,...strChoices(m(ch),[m(ch+100),m(s),m(Math.abs(ch-100))].filter(x=>x!==m(ch))),hint:`Add the three prices, then subtract from what he paid.`,explain:`Total: ${m(s)}. ${m(pay)} − ${m(s)} = <b>${m(ch)}</b>.`}}}];

/* Pie Peak */
X5.frac5=[
 {sk:'math.frac5.unlike-denominators',f(){const [b,d]=pick([[4,3],[2,3],[3,4],[4,6],[2,5]]),a=b-1,c=1,L=b*d/gcd(b,d),N=a*L/b-c*L/d;if(N<=0)return X5.frac5[0].f();const ans=fStr(N,L);
  return {prompt:`Pip had ${frac(a,b)} cup of milk. He used ${frac(c,d)} cup in a recipe. How much milk is left?`,...strChoices(ans+' cup',fWrong(ans,[`${a-c}/${Math.abs(b-d)||1}`,fStr(a*L/b+c*L/d,L),`${a-c}/${L}`]).map(x=>x+' cup')),render:fracText,hint:`Use a common denominator: ${L}.`,explain:`${frac(a,b)} = ${frac(a*L/b,L)} and ${frac(c,d)} = ${frac(c*L/d,L)}. ${frac(a*L/b,L)} − ${frac(c*L/d,L)} = <b>${fracText(ans)} cup</b>.`}}},
 {sk:'math.frac5.adding-mixed-numbers',f(){const d=pick([4,8,6]),w1=R(3,6),a=R(1,d-2),w2=R(1,w1-2),c=R(a+1,d-1),N=(w1*d+a)-(w2*d+c);const ans=fStr(N,d);
  return {prompt:`${w1} ${frac(a,d)} − ${w2} ${frac(c,d)} = ?`,...strChoices(ans,fWrong(ans,[`${w1-w2} ${c-a}/${d}`,fStr(N+d,d),fStr(N-1,d)])),render:fracText,hint:`${frac(a,d)} is less than ${frac(c,d)}: regroup 1 whole as ${frac(d,d)}.`,explain:`${w1} ${frac(a,d)} = ${w1-1} ${frac(a+d,d)}. Subtract: <b>${fracText(ans)}</b>.`}}},
 {sk:'math.frac5.fractions-as-division',f(){const n=pick([3,4,5,6,8]),p=R(1,n+3);if(p===n||p%n===0)return X5.frac5[2].f();const ans=fStr(p,n);
  return {prompt:`<b>${n}</b> friends share <b>${p}</b> pizza${p>1?'s':''} equally. How much pizza does each friend get?`,...strChoices(ans,fWrong(ans,[`${n}/${p}`,`1/${n}`,`${p}/${n+p}`])),render:fracText,hint:`Sharing ${p} by ${n} is ${p} ÷ ${n}, which is the fraction ${frac(p,n)}.`,explain:`${p} ÷ ${n} = ${frac(p,n)}${ans.includes(' ')?` = ${fracText(ans)}`:''}: <b>${fracText(ans)}</b> pizza each.`}}},
 {sk:'math.frac5.multiplying-fractions',f(){const d=pick([3,4,5,6]),a=R(1,d-1),n=d*R(3,8),ans=n/d*a;
  return {prompt:`There are <b>${n}</b> students. ${frac(a,d)} of them walk to school. How many students walk?`,...numChoices(ans,[n/d,n-ans,ans+a].filter(x=>x!==ans)),hint:`Find ${frac(1,d)} of ${n} first (divide by ${d}), then multiply by ${a}.`,explain:`${n} ÷ ${d} = ${n/d}. ${n/d} × ${a} = <b>${ans}</b> students.`}}},
 {sk:'math.frac5.multiplication-as-scaling',f(){const n=R(5,15),[a,b]=pick([[3,4],[5,3],[2,5],[7,4],[1,2],[9,8]]),bigger=a>b;
  return {prompt:`Without multiplying: is <b>${n} × ${frac(a,b)}</b> greater than or less than <b>${n}</b>?`,choices:['greater than','less than'],answer:bigger?'greater than':'less than',hint:`Is ${frac(a,b)} more or less than 1?`,explain:`${frac(a,b)} is ${bigger?'more':'less'} than 1, so ${n} × ${frac(a,b)} is <b>${bigger?'greater':'less'} than ${n}</b>.`}}},
 {sk:'math.frac5.multiplying-fractions',f(){const w=R(1,3),d=pick([2,4]),a=R(1,d-1),k=R(2,6),N=(w*d+a)*k,ans=fStr(N,d);
  return {prompt:`Each lap is ${w} ${frac(a,d)} miles. Pip runs <b>${k}</b> laps. How far does he run?`,...strChoices(ans+' miles',fWrong(ans,[fStr(w*k*d+a,d),fStr(N+d,d),String(w*k)]).map(x=>x+' miles')),render:fracText,hint:`${k} × ${w} = ${w*k}, and ${k} × ${frac(a,d)} = ${frac(a*k,d)}. Add them.`,explain:`${w*k} + ${frac(a*k,d)} = <b>${fracText(ans)} miles</b>.`}}}];

/* Fence Farm (volume) */
X5.vol5=[
 {sk:'math.vol5.volume-with-unit-cubes',f(){const l=R(2,5),w=R(2,4),h=R(2,6),layer=l*w;
  return {visual:sceneBox(2,2,Math.min(h,6),{layers:`${layer} cubes each`,lab:['','',`${h} layers`]}),prompt:`Each layer of a box holds <b>${layer}</b> unit cubes. The box has <b>${h}</b> layers. What is its volume?`,unit:'cubic units',...numChoices(layer*h,[layer+h,layer*h+layer,2*(layer+h)]),hint:`Layers × cubes in each layer.`,explain:`${h} × ${layer} = <b>${layer*h} cubic units</b>.`}}},
 {sk:'math.vol5.volume-formulas',f(){const e=R(2,6);return {visual:sceneBox(e,e,e,{lab:[`${e} cm`,`${e} cm`,`${e} cm`]}),prompt:`A cube has edges that are <b>${e} cm</b> long. What is its volume?`,unit:'cubic cm',...numChoices(e**3,[e*e,e*3,6*e*e].filter(x=>x!==e**3)),hint:`Volume = length × width × height. All three are ${e}.`,explain:`${e} × ${e} × ${e} = <b>${e**3} cubic cm</b>.`}}},
 {sk:'math.vol5.volume-formulas',f(){const l=R(4,10),w=R(3,6),h=R(2,5),V=l*w*h;
  return {visual:sceneBox(l,w,h,{lab:[`${l} ft`,`${w} ft`,`${h} ft`]}),prompt:`A storage box is <b>${l} ft</b> long, <b>${w} ft</b> wide and <b>${h} ft</b> tall. How many 1-foot cubes fit inside?`,unit:'cubes',...numChoices(V,[l*w,l+w+h,V+l*w]),hint:`Volume = length × width × height.`,explain:`${l} × ${w} × ${h} = <b>${V}</b> cubes.`}}},
 {sk:'math.vol5.adding-volumes',f(){let a,b;do{a=[R(2,6),R(2,5),R(2,5)];b=[R(2,6),R(2,5),R(2,5)]}while(a[0]*a[1]*a[2]===b[0]*b[1]*b[2]);const va=a[0]*a[1]*a[2],vb=b[0]*b[1]*b[2];
  return {prompt:`Box A is <b>${a.join(' × ')}</b> cm. Box B is <b>${b.join(' × ')}</b> cm. Which box holds more, and by how much?`,...strChoices(`Box ${va>vb?'A':'B'}, by ${Math.abs(va-vb)} cubic cm`,[`Box ${va>vb?'B':'A'}, by ${Math.abs(va-vb)} cubic cm`,`Box ${va>vb?'A':'B'}, by ${Math.abs(a.reduce((x,y)=>x+y)-b.reduce((x,y)=>x+y))||1} cubic cm`,`They hold the same`]),hint:`Find each volume, then compare.`,explain:`A: ${va}. B: ${vb}. <b>Box ${va>vb?'A':'B'}</b> holds ${Math.abs(va-vb)} cubic cm more.`}}},
 {sk:'math.vol5.area-with-fraction-sides',f(){const [a,b]=pick([[1,2],[2,3],[3,4],[3,5],[1,4]]),ans=fStr(a*a,b*b);
  return {prompt:`A square tile has sides of ${frac(a,b)} m. What is its area?`,...strChoices(ans+' sq m',fWrong(ans,[fStr(4*a,b),fStr(a*2,b*2+1),fStr(a,b*b)]).map(x=>x+' sq m')),render:fracText,hint:`Area = side × side.`,explain:`${frac(a,b)} × ${frac(a,b)} = <b>${fracText(ans)} square meters</b>.`}}}];

/* Shape Shipyard */
X5.shape5=[
 {sk:'math.shape5.classifying-triangles',f(){const [ang,ans]=pick([[[30,60,90],'right'],[[50,60,70],'acute'],[[20,40,120],'obtuse'],[[45,45,90],'right'],[[35,35,110],'obtuse'],[[60,60,60],'acute']]);
  return {prompt:`A triangle has angles of <b>${ang.join('°, ')}°</b>. What kind of triangle is it?`,...strChoices(ans,['right','acute','obtuse'].filter(x=>x!==ans)),hint:`Right: one 90° angle. Obtuse: one angle more than 90°. Acute: all less than 90°.`,explain:`${ans==='right'?'It has a 90° angle':ans==='obtuse'?'One angle is more than 90°':'All angles are less than 90°'}: <b>${ans}</b>.`}}},
 {sk:'math.shape5.classifying-triangles',f(){const [s,ans]=pick([[[5,5,5],'equilateral'],[[6,6,4],'isosceles'],[[3,4,5],'scalene'],[[7,7,7],'equilateral'],[[8,5,8],'isosceles'],[[4,6,9],'scalene']]);
  return {prompt:`A triangle has sides of <b>${s.join(' cm, ')} cm</b>. What kind of triangle is it?`,...strChoices(ans,['equilateral','isosceles','scalene'].filter(x=>x!==ans)),hint:`Equilateral: 3 equal sides. Isosceles: at least 2 equal sides. Scalene: no equal sides.`,explain:`<b>${ans[0].toUpperCase()+ans.slice(1)}</b>.`}}},
 {sk:'math.shape5.attributes-of-categories',f(){const q=pick([['All squares are rectangles.','True'],['All rectangles are squares.','False'],['All rhombuses are parallelograms.','True'],['All parallelograms are rectangles.','False'],['Every trapezoid is a parallelogram.','False'],['Every square is a rhombus.','True']]);
  return {prompt:`True or false? <b>${q[0]}</b>`,choices:['True','False'],answer:q[1],hint:`Does every shape of the first kind have everything the second kind needs?`,explain:`<b>${q[1]}</b>. ${q[1]==='True'?'Every one of them has all the properties.':'Some of them do not have all the properties.'}`}}},
 {sk:'math.shape5.shape-hierarchy',f(){return {prompt:`Which shape is <b>not always</b> a parallelogram?`,...strChoices('trapezoid',['rectangle','rhombus','square']),hint:`A parallelogram needs two pairs of parallel sides.`,explain:`A <b>trapezoid</b> has only one pair of parallel sides (in the definition used in this game), so it is not a parallelogram.`}}},
 {sk:'math.shape5.classifying-triangles',f(){const q=pick([['Can a triangle be both right and isosceles?','Yes',`A 45°-45°-90° triangle has a right angle and two equal sides.`],['Can a triangle have two right angles?','No',`Two 90° angles already make 180°, leaving nothing for the third angle.`],['Can an obtuse triangle be equilateral?','No',`An equilateral triangle has three 60° angles, so none is obtuse.`]]);
  return {prompt:q[0],choices:['Yes','No'],answer:q[1],hint:`The three angles of a triangle add up to 180°.`,explain:`<b>${q[1]}.</b> ${q[2]}`}}}];

/* Graph Garden */
X5.graph5=[
 {sk:'math.graph5.coordinate-plane',f(){const x=R(1,5),y=R(1,6),dx=R(1,3),up=coin();
  return {prompt:`Point A is at <b>(${x}, ${y})</b>. It moves <b>${dx}</b> unit${dx>1?'s':''} ${up?'up':'to the right'}. Where is it now?`,...strChoices(up?`(${x}, ${y+dx})`:`(${x+dx}, ${y})`,[up?`(${x+dx}, ${y})`:`(${x}, ${y+dx})`,`(${x+dx}, ${y+dx})`,`(${y}, ${x})`]),hint:`Right changes the first number (x). Up changes the second number (y).`,explain:`${up?'Up':'Right'} changes ${up?'y':'x'}: <b>${up?`(${x}, ${y+dx})`:`(${x+dx}, ${y})`}</b>.`}}},
 {sk:'math.graph5.coordinate-plane',f(){const x=R(1,7),y1=R(0,2),y2=R(4,8),d=y2-y1;
  return {prompt:`On a town map, the school is at <b>(${x}, ${y1})</b> and the library is at <b>(${x}, ${y2})</b>. Each unit is 1 block. How many blocks apart are they?`,...numChoices(d,[y1+y2,x,d+1].filter(x=>x!==d&&x>0)),hint:`The x is the same, so count along y.`,explain:`${y2} − ${y1} = <b>${d}</b> blocks.`}}},
 {sk:'math.graph5.coordinate-plane',f(){const names=['A','B','C','D'],k=R(0,3),pts=names.map((n,i)=>i===k?[R(1,7),0,n]:[R(1,7),R(1,7),n]),vis=gridPlane(pts);
  return {prompt:`Which point is on the <b>x-axis</b>?`,visual:vis,choices:names.slice(),answer:names[k],hint:`Points on the x-axis have y = 0.`,explain:`Point ${names[k]} is at (${pts[k][0]}, 0): <b>${names[k]}</b>.`}}},
 {sk:'math.graph5.line-plots-with-fractions',f(){const d=pick([4,8]),n=R(4,6);let vals;do{vals=[...Array(n)].map(()=>R(1,d-1))}while(vals.reduce((a,b)=>a+b,0)%n!==0);const tot=vals.reduce((a,b)=>a+b,0),each=fStr(tot/n,d);
  return {prompt:`<b>${n}</b> beakers hold ${vals.map(v=>fracText(fStr(v,d))).join(', ')} liters. If the water is poured so every beaker has the <b>same</b> amount, how much is in each?`,...strChoices(each+' L',fWrong(each,[fStr(tot,d),fStr(tot,d*n*2),fStr(tot/n+1,d)]).map(x=>x+' L')),render:fracText,hint:`Add all the water, then share it by ${n}.`,explain:`Total: ${fracText(fStr(tot,d))} L. ${fracText(fStr(tot,d))} ÷ ${n} = <b>${fracText(each)} L</b> each.`}}}];

/* Pattern Pass */
X5.pattern5=[
 {sk:'math.pattern5.two-patterns',f(){const a=R(2,4),k=R(2,4),b=a*k;
  return {prompt:`Pattern A starts at 0 and adds <b>${a}</b>. Pattern B starts at 0 and adds <b>${b}</b>. Each term in B is how many times the term in A?`,...numChoices(k,[b-a,a,b].filter(x=>x!==k)),hint:`Write a few terms of each and compare: ${a} and ${b}, ${2*a} and ${2*b}...`,explain:`${b} ÷ ${a} = ${k}. Each B term is <b>${k} times</b> the A term.`}}},
 {sk:'math.pattern5.ordered-pairs-from-patterns',f(){const k=R(2,6),n=R(4,6);
  return {prompt:`The ordered pairs follow a pattern: <b>${[0,1,2,3].map(i=>`(${i}, ${i*k})`).join(', ')}</b>. What is the pair with x = <b>${n}</b>?`,...strChoices(`(${n}, ${n*k})`,[`(${n}, ${n+k})`,`(${n*k}, ${n})`,`(${n}, ${(n-1)*k})`]),hint:`How is each y found from its x?`,explain:`y = ${k} × x, so the pair is <b>(${n}, ${n*k})</b>.`}}},
 {sk:'math.pattern5.ordered-pairs-from-patterns',f(){const k=R(2,5),pts=[1,2,3].map(i=>`(${i}, ${i*k})`);
  return {prompt:`Pip plots ${pts.join(', ')}. Which rule fits all the points?`,...strChoices(`y is ${k} times x`,[`y is x + ${k}`,`x is ${k} times y`,`y is x − ${k}`]),hint:`Check the rule on every point, not just the first one.`,explain:`${pts.join(', ')}: every y is <b>${k} times x</b>.`}}},
 {sk:'math.pattern5.two-patterns',f(){const a=R(2,5),b=R(2,5)*a,n=R(5,8);
  return {prompt:`Pattern A: start at 0, add ${a}. Pattern B: start at 0, add ${b}. What is the <b>${n}th</b> term of each (counting 0 as the 1st)?`,...strChoices(`A: ${(n-1)*a}, B: ${(n-1)*b}`,[`A: ${n*a}, B: ${n*b}`,`A: ${(n-1)*a}, B: ${(n-1)*a+b}`,`A: ${(n-1)*b}, B: ${(n-1)*a}`]),hint:`The 1st term is 0, the 2nd is one jump, so the ${n}th is ${n-1} jumps.`,explain:`${n-1} jumps: A = ${n-1} × ${a} = ${(n-1)*a}, B = ${n-1} × ${b} = ${(n-1)*b}.`}}}];

/* Measure Mine */
X5.measure5=[
 {sk:'math.measure5.converting-units',f(){const [big,small,f]=pick([['kilograms','grams',1000],['liters','milliliters',1000],['meters','centimeters',100],['kilometers','meters',1000]]),v=R(11,99)*100,ans=v*f/1000;
  return {prompt:`<b>${dk(v)} ${big}</b> = ___ ${small}`,...strChoices(fmt(ans),[fmt(ans/10),fmt(ans*10),fmt(v/100)].filter(x=>x!==fmt(ans))),hint:`1 ${big.replace(/s$/,'')} = ${fmt(f)} ${small}. Multiply.`,explain:`${dk(v)} × ${fmt(f)} = <b>${fmt(ans)} ${small}</b>.`}}},
 {sk:'math.measure5.converting-units',f(){const [big,small,f]=pick([['liters','milliliters',1000],['kilograms','grams',1000],['meters','centimeters',100]]),n=R(11,99)*(f===1000?100:10)+0,ans=dk(n*1000/f);
  return {prompt:`<b>${fmt(n)} ${small}</b> = ___ ${big}`,...strChoices(ans,[dk(n*10000/f),dk(n*100/f),fmt(n*f)].filter(x=>x!==ans)),hint:`${fmt(f)} ${small} = 1 ${big.replace(/s$/,'')}. Divide by ${fmt(f)}.`,explain:`${fmt(n)} ÷ ${fmt(f)} = <b>${ans} ${big}</b>.`}}},
 {sk:'math.measure5.conversion-word-problems',f(){const y=R(2,5),cut=R(2,3*y-2);
  return {prompt:`A ribbon is <b>${y} yards</b> long. Pip cuts off <b>${cut} feet</b>. How many feet are left?`,unit:'feet',...numChoices(3*y-cut,[y-cut>0?y-cut:3*y,3*y,3*y-cut+3].filter(x=>x!==3*y-cut)),hint:`1 yard = 3 feet. Change yards to feet first.`,explain:`${y} yards = ${3*y} feet. ${3*y} − ${cut} = <b>${3*y-cut} feet</b>.`}}},
 {sk:'math.measure5.converting-units',f(){const h=R(1,4),half=coin(),m=h*60+(half?30:15);
  return {prompt:`<b>${h} ${half?frac(1,2):frac(1,4)} hours</b> = ___ minutes`,unit:'minutes',...numChoices(m,[h*100+(half?50:25),h*60,m+30]),hint:`1 hour = 60 minutes. ${half?'Half':'A quarter'} of an hour is ${half?30:15} minutes.`,explain:`${h} × 60 + ${half?30:15} = <b>${m} minutes</b>.`}}},
 {sk:'math.measure5.conversion-word-problems',f(){const ft=R(4,7),inch=ft*12+pick([-3,-2,2,3,5]),longer=inch>ft*12?`${inch} inches`:`${ft} feet`;
  return {prompt:`Which is longer: <b>${ft} feet</b> or <b>${inch} inches</b>?`,choices:shuffle([`${ft} feet`,`${inch} inches`]),answer:longer,hint:`1 foot = 12 inches. Change the feet to inches.`,explain:`${ft} feet = ${ft*12} inches, so <b>${longer}</b> is longer.`}}}];

/* Riddle Reef */
X5.riddle5=[
 {sk:'math.riddle5.multi-step-problems',f(){const d=pick([4,3]),a=R(1,d-1),days=R(3,7),N=a*days,ans=fStr(N,d);
  const mi=x=>x+(x==='1'?' mile':' miles');return {prompt:`Pip walks ${frac(a,d)} mile every day for <b>${days}</b> days. How far does he walk in all?`,...strChoices(mi(ans),fWrong(ans,[fStr(a,d*days),fStr(N+d,d),String(days)]).map(mi)),render:fracText,hint:`${days} × ${frac(a,d)}`,explain:`${days} × ${frac(a,d)} = ${frac(N,d)} = <b>${fracText(ans)} miles</b>.`}}},
 {sk:'math.riddle5.find-the-mistake',f(){const a=R(2,9),b=R(2,9),p=a*b;
  return {prompt:`Zoe says <b>0.${a} × 0.${b} = ${dk(p*100)}</b>. What is wrong?`,...strChoices(`The decimal point is in the wrong place. Tenths × tenths = hundredths: ${dk(p*10)}.`,[`Nothing, it is right.`,`She should have added: ${dk((a+b)*100)}.`,`The answer should be ${p*10}.`]),hint:`Is 0.${a} × 0.${b} bigger or smaller than 1?`,explain:`Multiplying two numbers less than 1 gives an answer less than either one: <b>${dk(p*10)}</b>.`}}},
 {sk:'math.riddle5.explain-your-thinking',f(){const n=R(3,9),k=pick([2,3,4]),w={2:'halves',3:'thirds',4:'fourths'}[k];
  return {prompt:`Why is <b>${n} ÷ ${frac(1,k)}</b> bigger than <b>${n}</b>?`,...strChoices(`It counts how many ${w} fit in ${n}. Each whole has ${k} ${w}, so the answer is ${n*k}.`,[`Dividing always makes numbers bigger.`,`Because one of the ${w} is bigger than ${n}.`,`It is not bigger; it equals ${n}.`]),hint:`Think: how many ${frac(1,k)}-size pieces in 1 whole?`,explain:`${n} ÷ ${frac(1,k)} = <b>${n*k}</b>, because each whole has ${k} pieces of ${frac(1,k)}.`}}},
 {sk:'math.riddle5.multi-step-problems',f(){const l=R(3,6),w=R(2,4),h=R(2,4),c=R(2,5),V=l*w*h;
  return {prompt:`A sandbox is <b>${l} ft × ${w} ft × ${h} ft</b>. Sand costs <b>$${c}</b> per cubic foot. How much does it cost to fill it?`,...numChoices(V*c,[V,l*w*c,V*c+c]),hint:`Step 1: volume. Step 2: multiply by the price.`,explain:`${l} × ${w} × ${h} = ${V} cubic feet. ${V} × $${c} = <b>$${V*c}</b>.`}}}];

/* ---------- more lessons, grade 5 (math here; English, science and social studies in js/english5x.js) ---------- */
const X5N={place5:7,expr5:5,mult5:5,div5:7,dec5:7,frac5:8,vol5:6,shape5:4,graph5:5,pattern5:4,measure5:5,riddle5:5};
const tagIdx5=(bank,tag,n=3)=>BANK3[bank].map((it,i)=>it[0]===tag?i:-1).filter(i=>i>=0).slice(0,n);
const LESSONS5X=[
 {id:'g5_dec_times',gen:'dec5',isl:'dec',types:[3,X5N.dec5+2],title:'Where does the decimal point go?',
  build(){return [
   teachCard('Count the decimal places',`<p>To multiply <b>0.4 × 0.3</b>, first multiply the digits: <b>4 × 3 = 12</b>.</p><p>Count the decimal places in both numbers: 1 + 1 = <b>2</b>.</p><p>Put 2 decimal places in the answer: <b>0.12</b>.</p><p>Check: both numbers are less than 1, so the answer must be smaller than each one.</p>`,'Let\'s try one!'),
   guided(`0.6 × 0.2: what is 6 × 2?`,numChoices(12,[8,62]),`Ignore the decimal points for now.`,`6 × 2 = <b>12</b>.`),
   guided(`So 0.6 × 0.2 = ?`,strChoices('0.12',['1.2','12']),`Two decimal places in all.`,`<b>0.12</b>.`)]},
  get practice(){return [3,X5N.dec5+2,2]}},
 {id:'g5_div_unitfrac',gen:'div5',isl:'div',types:[4,5,6],title:'Dividing by a unit fraction',
  build(){return [
   teachCard('How many pieces fit?',`<p><b>3 ÷ ${frac(1,4)}</b> asks: how many quarters fit in 3 wholes?</p><p>Each whole has <b>4</b> quarters. 3 wholes have 3 × 4 = <b>12</b> quarters.</p><p>So 3 ÷ ${frac(1,4)} = <b>12</b>. Dividing by a fraction less than 1 gives a <b>bigger</b> number!</p>`,'Let\'s try one!'),
   guided(`How many halves are in 1 whole?`,numChoices(2,[1,4]),`Cut it in half.`,`<b>2</b> halves.`),
   guided(`So 5 ÷ ${frac(1,2)} = ?`,numChoices(10,[3,25]),`2 halves in each of 5 wholes.`,`5 × 2 = <b>10</b>.`)]},
  get practice(){return [4,X5N.div5+4,5]}},
 {id:'g5_vol_formula',gen:'vol5',isl:'area',types:[1,3,X5N.vol5+1],title:'Volume = length × width × height',
  build(){return [
   teachCard('Base times height',`<div class="lrow">${boxSVG(4,3,2,false)}</div><p>The bottom layer has 4 × 3 = <b>12</b> cubes. There are <b>2</b> layers.</p><p>Volume = 12 × 2 = <b>24 cubic units</b>. That is l × w × h = 4 × 3 × 2.</p>`,'Let\'s try one!'),
   guided(`A box is 5 × 2 × 3. How many cubes in the bottom layer (5 × 2)?`,numChoices(10,[7,30]),`Length × width.`,`5 × 2 = <b>10</b>.`),
   guided(`With 3 layers, what is the volume?`,numChoices(30,[13,10]),`10 × 3`,`<b>30 cubic units</b>.`)]},
  get practice(){return [1,X5N.vol5+1,X5N.vol5+2]}},
 {id:'g5_frac_regroup',gen:'frac5',isl:'frac',types:[X5N.frac5+1],title:'Subtracting mixed numbers',
  build(){return [
   teachCard('Borrow a whole',`<p><b>4 ${frac(1,4)} − 1 ${frac(3,4)}</b>: you can't take ${frac(3,4)} from ${frac(1,4)}.</p><p>Borrow 1 whole: 4 ${frac(1,4)} = <b>3 ${frac(5,4)}</b>.</p><p>Now subtract: 3 ${frac(5,4)} − 1 ${frac(3,4)} = <b>2 ${frac(2,4)}</b>, which is 2 ${frac(1,2)}</p>`,'Let\'s try one!'),
   guided(`5 ${frac(1,3)} is the same as 4 and how many thirds?`,strChoices('4/3',['1/3','2/3']),`1 whole = ${frac(3,3)}. Add ${frac(1,3)}.`,`4 ${frac(4,3)}.`),
   guided(`So 5 ${frac(1,3)} − 2 ${frac(2,3)} = ?`,strChoices('2 2/3',['3 1/3','3 2/3']),`4 ${frac(4,3)} − 2 ${frac(2,3)}`,`<b>2 ${frac(2,3)}</b>.`)].map(q=>Object.assign(q,{render:fracText}))},
  get practice(){return [X5N.frac5+1,2,X5N.frac5]}},
 {id:'g5_graph_moves',gen:'graph5',isl:'graph',types:[0,X5N.graph5],title:'Moving on the coordinate grid',
  build(){return [
   teachCard('Across, then up',`<p>A point <b>(x, y)</b>: x is how far <b>across</b>, y is how far <b>up</b>.</p>${gridPlane([[3,2,'A']])}<p>A is at <b>(3, 2)</b>. Move it 2 to the right: x grows → <b>(5, 2)</b>. Move it 3 up: y grows → <b>(3, 5)</b>.</p>`,'Let\'s try one!'),
   guided(`Point B is at (4, 1). It moves 3 up. Where is it now?`,strChoices('(4, 4)',['(7, 1)','(1, 4)']),`Up changes y.`,`<b>(4, 4)</b>.`)]},
  get practice(){return [0,X5N.graph5,X5N.graph5+2]}},
 {id:'g5_measure_metric',gen:'measure5',isl:'measure',types:[X5N.measure5,X5N.measure5+1],title:'Metric conversions by moving the point',
  build(){return [
   teachCard('Powers of 10',`<p>1 kilogram = <b>1,000</b> grams. 1 liter = <b>1,000</b> milliliters. 1 meter = <b>100</b> centimeters.</p><p><b>Big to small unit:</b> multiply. 2.5 kg × 1,000 = <b>2,500 g</b>.</p><p><b>Small to big unit:</b> divide. 750 mL ÷ 1,000 = <b>0.75 L</b>.</p>`,'Let\'s try one!'),
   guided(`3.2 meters = ___ centimeters`,strChoices('320',['32','3,200']),`Multiply by 100.`,`<b>320 cm</b>.`),
   guided(`1,500 grams = ___ kilograms`,strChoices('1.5',['15','150']),`Divide by 1,000.`,`<b>1.5 kg</b>.`)]},
  get practice(){return [X5N.measure5,X5N.measure5+1,0]}}
];
