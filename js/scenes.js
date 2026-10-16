/* Pip's Sky Islands: little picture scenes for word problems ("a garden has 9 rows with 15 tulips", "31 stickers shared by 6 friends").
   The picture shows the story, never the answer: groups carry their number on a tag, piles show the total on a tag,
   the unknown is a "?" tag. Small numbers draw every item, big ones draw a few and the tag says how many. */
const SC_INK='#1f3557';
const SC_ICON={
  student:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><circle cy="-5" r="4.2" fill="#f5c9a0" stroke="${SC_INK}" stroke-width="1.2"/><path d="M-5.5 6a5.5 5 0 0 1 11 0z" fill="#5fc3f0" stroke="${SC_INK}" stroke-width="1.2"/></g>`,
  crayon:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s}) rotate(-20)"><rect x="-2.6" y="-8" width="5.2" height="13" rx="1" fill="#ff6b57" stroke="${SC_INK}" stroke-width="1.1"/><path d="M-2.6 5h5.2L0 9.5z" fill="#ffd56b" stroke="${SC_INK}" stroke-width="1.1" stroke-linejoin="round"/></g>`,
  tulip:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 9V0" stroke="#2c9a5b" stroke-width="1.8"/><path d="M-5-7l2.5 3L0-8l2.5 4L5-7v4a5 5 0 0 1-10 0z" fill="#e2558f" stroke="${SC_INK}" stroke-width="1.1" stroke-linejoin="round"/></g>`,
  sticker:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0-7.5l2.2 4.6 5 .6-3.7 3.4 1 5L0 3.6-4.5 6.1l1-5L-7.2-2.3l5-.6z" fill="#ffc23d" stroke="${SC_INK}" stroke-width="1.1" stroke-linejoin="round"/></g>`,
  cupcake:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 0h12l-2 8h-8z" fill="#8fd3f7" stroke="${SC_INK}" stroke-width="1.1" stroke-linejoin="round"/><path d="M-6.5 0a6.5 5.5 0 0 1 13 0z" fill="#ffb3c7" stroke="${SC_INK}" stroke-width="1.1"/><circle cy="-6.3" r="1.6" fill="#e2453a"/></g>`,
  acorn:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-4.5-1h9v1.5a4.5 6 0 0 1-9 0z" fill="#c98a4b" stroke="${SC_INK}" stroke-width="1.1"/><path d="M-5.5-1a5.5 4 0 0 1 11 0z" fill="#7a5230" stroke="${SC_INK}" stroke-width="1.1"/><path d="M0-5v-2" stroke="${SC_INK}" stroke-width="1.2"/></g>`,
  book:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-6" y="-7" width="12" height="14" rx="1.5" fill="#7b6cf0" stroke="${SC_INK}" stroke-width="1.1"/><path d="M-3.5-7v14" stroke="#fff" stroke-width="1.2"/></g>`,
  shell:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-7 4a7 9 0 0 1 14 0z" fill="#ffd9b8" stroke="${SC_INK}" stroke-width="1.1"/><path d="M0-5v9M-3.5-3.5-2 4M3.5-3.5 2 4" stroke="${SC_INK}" stroke-width=".9"/></g>`,
  marble:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><circle r="5.5" fill="#38b98a" stroke="${SC_INK}" stroke-width="1.1"/><circle cx="-1.8" cy="-1.8" r="1.6" fill="#fff" opacity=".8"/></g>`,
  point:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><circle r="6" fill="#ffc23d" stroke="${SC_INK}" stroke-width="1.1"/><text y="3" text-anchor="middle" font-size="8" ${FONT} fill="${SC_INK}">1</text></g>`,
  stamp:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-6" y="-7" width="12" height="14" fill="#fff" stroke="${SC_INK}" stroke-width="1.1" stroke-dasharray="2 1.2"/><rect x="-3.5" y="-4.5" width="7" height="9" fill="#5fc3f0"/></g>`,
  coin:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><circle r="6" fill="#ffc23d" stroke="${SC_INK}" stroke-width="1.1"/><circle r="3.6" fill="none" stroke="#e0a21c" stroke-width="1"/></g>`};
SC_ICON.stickers=SC_ICON.sticker;SC_ICON.shells=SC_ICON.shell;SC_ICON.books=SC_ICON.book;SC_ICON.marbles=SC_ICON.marble;SC_ICON.points=SC_ICON.point;SC_ICON.stamps=SC_ICON.stamp;
const scTag=(x,y,t,o={})=>{const w=Math.max(26,String(t).length*8.6+14);return `<g transform="translate(${x} ${y})"><rect x="${-w/2}" y="-11" width="${w}" height="22" rx="11" fill="${o.q?'#fff':o.fill||'#fff7d6'}" stroke="${o.q?'#e2453a':SC_INK}" stroke-width="1.5"${o.q?' stroke-dasharray="4 3"':''}/><text y="5" text-anchor="middle" font-size="14" ${FONT} fill="${o.q?'#e2453a':SC_INK}">${t}</text></g>`};
const scSvg=(w,h,body,label)=>`<svg class="scene" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${esc(label)}">${body}</svg>`;
/* a few items in a little cluster; the tag says the real number */
function scCluster(icon,n,cx,cy,max=6,s=1){const k=Math.min(n,max),cols=Math.min(k,3),rows=Math.ceil(k/cols);let g='';
  for(let i=0;i<k;i++){const c=i%cols,r=Math.floor(i/cols);g+=SC_ICON[icon](cx+(c-(cols-1)/2)*15*s,cy+(r-(rows-1)/2)*15*s,s)}return g}
const SC_BOX={
  bus:(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-27" y="-17" width="54" height="30" rx="7" fill="#ffc23d" stroke="${SC_INK}" stroke-width="1.6"/><rect x="-21" y="-11" width="12" height="9" rx="2" fill="#dff3ff" stroke="${SC_INK}"/><rect x="-6" y="-11" width="12" height="9" rx="2" fill="#dff3ff" stroke="${SC_INK}"/><rect x="9" y="-11" width="12" height="9" rx="2" fill="#dff3ff" stroke="${SC_INK}"/><circle cx="-15" cy="14" r="4.5" fill="${SC_INK}"/><circle cx="15" cy="14" r="4.5" fill="${SC_INK}"/></g>`,
  box:(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-24" y="-14" width="48" height="30" rx="4" fill="#e6b980" stroke="${SC_INK}" stroke-width="1.6"/><path d="M-24-6h48" stroke="${SC_INK}" stroke-width="1.2"/></g>`,
  sbox:(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-18" y="-14" width="36" height="30" rx="4" fill="#e6b980" stroke="${SC_INK}" stroke-width="1.6"/><path d="M-18-6h36" stroke="${SC_INK}" stroke-width="1.2"/></g>`,
  bag:(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-18-8q-4 26 18 26t18-26z" fill="#d9b48a" stroke="${SC_INK}" stroke-width="1.6"/><path d="M-12-10q12-8 24 0" fill="none" stroke="${SC_INK}" stroke-width="1.6"/></g>`};
/* equal groups: "b buses with a students each", "b rows with a tulips each" */
function sceneGroups(kind,b,a,icon){const per=Math.min(b,5),cw=66,W=Math.max(220,Math.min(b,9)*cw/ (b>5?1.6:1)+20);let g='';
  if(kind==='row'){const H=Math.min(b,9)*25+12,W2=250;for(let r=0;r<b;r++){const y=18+r*25;for(let i=0;i<6;i++)g+=SC_ICON.tulip(20+i*20,y,.8);g+=`<text x="${20+6*20}" y="${y+4}" font-size="13" ${FONT} fill="${SC_INK}">…</text>`;g+=scTag(205,y,a,{fill:'#e8fbf2'})}
    return scSvg(W2,H,`<rect x="6" y="4" width="166" height="${H-8}" rx="8" fill="#c8ecc0" opacity=".6"/>${g}`,`${b} rows with ${a} in each row`)}
  const n=Math.min(b,9),cols=n>5?Math.ceil(n/2):n,rows=n>5?2:1,W3=cols*cw+14,H3=rows*72+18;
  for(let i=0;i<n;i++){const c=i%cols,r=Math.floor(i/cols),x=14+cw/2+c*cw-7,y=44+r*72;g+=SC_BOX[kind](x,y);if(icon)g+=scCluster(icon,Math.min(a,3),x,y+2,3,.75);g+=scTag(x,y-27,a)}
  return scSvg(W3,H3,g,`${b} groups with ${a} in each`)}
/* sharing: a pile of n items, d friends, each gets "?" */
function sceneShare(icon,n,d){const fr=Math.min(d,9),fw=34,W=Math.max(240,fr*fw+130),H=96;let g=`<g>${scCluster(icon,n,52,46,9,1)}</g>`+scTag(52,84,n);
  g+=`<path d="M100 46h16" stroke="${SC_INK}" stroke-width="2" marker-end="url(#scA)"/>`;
  for(let i=0;i<fr;i++){const x=134+i*fw;g+=SC_ICON.student(x,44,1.6)+`<circle cx="${x}" cy="74" r="8" fill="#fff" stroke="${SC_INK}" stroke-width="1.2"/><text x="${x}" y="78" text-anchor="middle" font-size="11" ${FONT} fill="#e2453a">?</text>`}
  return scSvg(W,H,`<defs><marker id="scA" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${SC_INK}"/></marker></defs>${g}`,`${n} shared by ${d} friends`)}
/* packing: n cupcakes into boxes of d */
function scenePack(n,d){const W=282,H=100;let g=scCluster('cupcake',n,50,44,9,1)+scTag(50,86,n);
  g+=`<path d="M100 46h20" stroke="${SC_INK}" stroke-width="2" marker-end="url(#scB)"/>`;
  for(let i=0;i<3;i++){const x=150+i*42;g+=`<g opacity="${1-i*.25}">${SC_BOX.sbox(x,48)}</g>`;if(i===0)g+=scCluster('cupcake',Math.min(d,3),x,50,3,.7)}
  g+=scTag(192,86,`${d} in a box`,{fill:'#e8f6ff'})+`<text x="258" y="54" font-size="18" ${FONT} fill="${SC_INK}">…</text>`;
  return scSvg(W,H,`<defs><marker id="scB" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${SC_INK}"/></marker></defs>${g}`,`${n} cupcakes, ${d} in each box`)}
/* "times as many": one child's pile, the other child's pile is n of those, or the unknown */
function sceneTimes(icon,nameA,a,nameB,b,n,unknownB){const W=290,H=118;const ic=SC_ICON[icon]?icon:'sticker';
  let g=`<text x="56" y="16" text-anchor="middle" font-size="14" ${FONT} fill="${SC_INK}">${esc(nameA)}</text>`+(unknownB?scCluster(ic,a,56,52,6,1):SC_BOX.bag(56,50)+`<text x="56" y="62" text-anchor="middle" font-size="18" ${FONT} fill="#e2453a">?</text>`)+scTag(56,100,unknownB?a:'?',unknownB?{}:{q:1}); // the unknown pile is a closed bag: nothing to count
  g+=`<text x="200" y="16" text-anchor="middle" font-size="14" ${FONT} fill="${SC_INK}">${esc(nameB)}</text>`;
  const k=Math.min(n,5);for(let i=0;i<k;i++)g+=`<rect x="${140+i*24}" y="34" width="20" height="40" rx="5" fill="#dff3ff" stroke="${SC_INK}" stroke-width="1.2"/>`+SC_ICON[ic](150+i*24,54,.7);
  if(n>5)g+=`<text x="262" y="60" font-size="16" ${FONT} fill="${SC_INK}">…</text>`;
  g+=scTag(200,100,unknownB?'?':b,unknownB?{q:1}:{})+`<text x="200" y="88" text-anchor="middle" font-size="11" ${FONT} fill="#5b6b86">${n} times as many</text>`;
  return scSvg(W,H,g,`${nameA} and ${nameB}: ${n} times as many`)}
/* shopping: price tags and the money paid */
function sceneShop(items,pay){const W=Math.max(200,items.length*110+(pay?110:0)),H=96;let g='',x=55;
  for(const [name,price] of items){g+=`<g transform="translate(${x} 40)"><path d="M-34-20h52l16 20-16 20h-52z" fill="#fff7d6" stroke="${SC_INK}" stroke-width="1.5" stroke-linejoin="round"/><circle cx="24" cy="0" r="3" fill="#fff" stroke="${SC_INK}"/><text x="-8" y="6" text-anchor="middle" font-size="17" ${FONT} fill="${SC_INK}">${price}</text></g><text x="${x}" y="84" text-anchor="middle" font-size="12" ${FONT} fill="#5b6b86">${esc(name)}</text>`;x+=110}
  if(pay)g+=`<g transform="translate(${x} 40)"><rect x="-36" y="-18" width="72" height="36" rx="5" fill="#bfe8c9" stroke="${SC_INK}" stroke-width="1.5"/><circle r="10" fill="#e8fbf2" stroke="#2c9a5b"/><text y="5" text-anchor="middle" font-size="12" ${FONT} fill="#2c7a4b">$</text><text x="0" y="34" text-anchor="middle" font-size="13" ${FONT} fill="${SC_INK}">pays ${pay}</text></g>`;
  return scSvg(W,H,g,'Price tags'+(pay?' and the money paid':''))}
/* bags of acorns, some given away */
function sceneBagsGive(b,p,give){const n=Math.min(b,6),W=Math.max(230,n*50+120),H=110;let g='';
  for(let i=0;i<n;i++){const x=30+i*50;g+=SC_BOX.bag(x,52)+scCluster('acorn',2,x,58,2,.8)+scTag(x,22,p)}
  if(b>6)g+=`<text x="${30+n*50-12}" y="60" font-size="16" ${FONT} fill="${SC_INK}">…</text>`;
  const sx=30+n*50+40;g+=`<g transform="translate(${sx} 52) scale(1.35)"><ellipse cx="0" cy="10" rx="14" ry="11" fill="#b5824f" stroke="${SC_INK}" stroke-width="1.3"/><circle cx="-6" cy="-6" r="8" fill="#b5824f" stroke="${SC_INK}" stroke-width="1.3"/><path d="M12 14q16-8 6-26" fill="none" stroke="#b5824f" stroke-width="7" stroke-linecap="round"/><circle cx="-9" cy="-8" r="1.4" fill="${SC_INK}"/></g>`+scTag(sx,96,`−${give}`,{fill:'#ffe3dd'});
  return scSvg(W,H,g,`${b} bags of ${p} acorns, ${give} given to a squirrel`)}
