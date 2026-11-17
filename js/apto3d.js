/* Vista 3D del apartamento Tipo B 66 m² — construida a partir de los planos 1:50 y 1:60 del grupo.
   Muros vectorizados del plano acotado (walls.json embebido en WALLS), recintos del plano de distribución. */
(function(){
'use strict';
const WALLS=[[[225,251],[224,423],[209,424],[207,429],[209,431],[224,432],[224,501],[263,502],[265,497],[262,495],[230,494],[230,442],[262,441],[265,439],[265,425],[277,424],[278,418],[230,416],[230,252]],[[534,188],[475,417],[475,473],[477,475],[502,474],[501,465],[489,464],[489,414],[546,194],[545,190]],[[462,15],[460,16],[460,82],[469,82],[469,27],[471,25],[537,25],[538,82],[540,83],[538,85],[538,124],[586,137],[591,137],[593,133],[591,131],[548,121],[546,119],[554,85],[548,85],[545,95],[544,86],[541,84],[544,81],[544,27],[549,26],[668,55],[669,57],[663,76],[663,82],[665,83],[660,89],[642,160],[642,164],[644,165],[649,162],[668,87],[665,84],[669,82],[676,57],[757,77],[758,84],[755,86],[743,135],[749,139],[724,233],[605,204],[600,204],[598,208],[603,211],[710,236],[723,241],[667,460],[664,464],[584,466],[585,475],[671,475],[675,469],[772,89],[771,83],[774,81],[775,75],[531,15]],[[393,16],[227,15],[224,17],[223,56],[126,56],[125,50],[121,49],[119,50],[119,139],[125,140],[126,63],[223,63],[224,81],[227,83],[224,86],[224,194],[232,195],[234,194],[234,86],[231,83],[234,81],[234,47],[257,45],[259,25],[386,25],[387,68],[393,69]],[[16,15],[14,16],[14,82],[16,84],[14,85],[13,103],[14,430],[124,431],[125,425],[123,424],[24,423],[24,196],[124,195],[125,189],[24,187],[24,87],[21,84],[29,83],[31,81],[32,25],[124,25],[125,16]]];
const U=67.564, CX=394, CY=258, K=1.597*U;              // px máscara por metro / centro / px plano por metro
const W=(ix,iy)=>[(ix-293)/K-5.639,(iy-177)/K-3.597];    // px del plano de distribución -> metros
const M=(x,y)=>[(x-CX)/U,(y-CY)/U];                      // px de la máscara de muros -> metros
const HW=2.5;

function init(host){
  if(!window.THREE||!THREE.OrbitControls||host.dataset.ready) return; host.dataset.ready=1;
  const cv=host.querySelector('canvas');
  const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:false}); R.setPixelRatio(Math.min(devicePixelRatio,2)); R.shadowMap.enabled=true; R.shadowMap.type=THREE.PCFSoftShadowMap; R.toneMapping=THREE.ACESFilmicToneMapping; R.toneMappingExposure=.9; R.outputEncoding=THREE.sRGBEncoding;
  const S=new THREE.Scene(); const sk=document.createElement('canvas');sk.width=4;sk.height=256;const sg=sk.getContext('2d'),gd=sg.createLinearGradient(0,0,0,256);
  gd.addColorStop(0,'#0c1a26');gd.addColorStop(.5,'#2f5870');gd.addColorStop(.8,'#8fa3a8');gd.addColorStop(1,'#f0b27a');sg.fillStyle=gd;sg.fillRect(0,0,4,256);
  S.background=new THREE.CanvasTexture(sk); S.fog=new THREE.Fog(0x6b8796,25,200);
  const C=new THREE.PerspectiveCamera(52,1,.1,400); const OC=new THREE.OrbitControls(C,cv);
  OC.enableDamping=true; OC.dampingFactor=.08; OC.maxPolarAngle=Math.PI*.495; OC.minDistance=1.2; OC.maxDistance=20;
  S.add(new THREE.HemisphereLight(0xfff2e0,0x2a3036,.38));
  const sun=new THREE.DirectionalLight(0xffe2bd,.5); sun.position.set(-6,12,8); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); const sc2=sun.shadow.camera; sc2.left=-9;sc2.right=9;sc2.top=9;sc2.bottom=-9;sc2.near=1;sc2.far=40; sun.shadow.bias=-.0006; S.add(sun); const sun2=new THREE.DirectionalLight(0xbcd2e0,.5); sun2.position.set(4,6,-12); S.add(sun2);
  const warm=new THREE.PointLight(0xffe0b8,.55,9); C.add(warm); S.add(C);
  const mat=(c,r,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:r==null?.7:r},o||{}));
  const mWood=mat(0xb59b7e,.55), mTile=mat(0x6d767c,.4), mWall=mat(0xcfcac2,.9), mWallTop=mat(0xe9e5de,.9),
        mNut=mat(0x7d4b2a,.5), mGrey=mat(0x555a62,.6), mDark=mat(0x1d2024,.3), mLed=new THREE.MeshBasicMaterial({color:0xffc27a}),
        mGlass=mat(0x9fe0d6,.05,{transparent:true,opacity:.22,depthWrite:false}), mDoor=mat(0x7a5a3c,.6), mTop=mat(0xb9b4ab,.35), mGreen=mat(0x35523f,.8);


  /* Bogotá de fondo (referencial): cerros, manzanas urbanas y ventanas encendidas */
  (function(){const c=document.createElement('canvas');c.width=1024;c.height=128;const g=c.getContext('2d');g.fillStyle='#16303d';g.beginPath();g.moveTo(0,128);
    let y=70;for(let x=0;x<=1024;x+=12){y=Math.max(20,Math.min(104,y+(Math.sin(x*.011)*6+(Math.random()-.5)*8)));g.lineTo(x,y);}g.lineTo(1024,128);g.fill();
    const t=new THREE.CanvasTexture(c);const m=new THREE.Mesh(new THREE.PlaneGeometry(420,52),new THREE.MeshBasicMaterial({map:t,transparent:true,fog:false}));m.position.set(0,22,170);m.rotation.y=Math.PI;S.add(m);
    const bm=new THREE.MeshLambertMaterial({color:0x5d7686}),pts=[];
    for(let i=0;i<520;i++){const w=2+Math.random()*5,h=4+Math.random()*20,d=2+Math.random()*5,x=(Math.random()-.5)*300,z=48+Math.random()*110;
      const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),bm);b.position.set(x,h/2-.02,z);S.add(b);
      const n=Math.floor(w*h*.25);for(let k=0;k<n;k++)if(Math.random()<.45)pts.push(x+(Math.random()-.5)*w*.9,.6+Math.random()*(h-1),z-d/2-.05);}
    const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
    S.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0xffc98a,size:.35,fog:false})));})();
  /* suelo exterior */
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(500,500),new THREE.MeshBasicMaterial({color:0x2c4350})); gr.rotation.x=-Math.PI/2; gr.position.y=-.02; S.add(gr);

  const poly=(pts,m,y)=>{const sh=new THREE.Shape(pts.map(p=>new THREE.Vector2(p[0],-p[1])));const g=new THREE.ShapeGeometry(sh);g.rotateX(-Math.PI/2);const me=new THREE.Mesh(g,m);me.position.y=y||0;S.add(me);return me;};
  /* planta (perímetro) y pisos */
  const foot=[[20,16],[125,16],[125,60],[228,60],[228,16],[530,16],[775,78],[668,468],[475,468],[475,498],[230,498],[230,427],[20,427]].map(p=>M(p[0],p[1]));
  poly(foot,mWood,.005).receiveShadow=true;
  const tiles=[[[310,190],[470,190],[470,452],[310,452]],[[1145,215],[1340,262],[1305,392],[1145,350]],[[1345,250],[1485,285],[1432,525],[1285,490]],[[640,822],[1035,822],[1035,945],[640,945]]];
  tiles.forEach(t=>poly(t.map(p=>W(p[0],p[1])),mTile,.012));

  /* muros */
  const wallsG=new THREE.Group(); S.add(wallsG);
  WALLS.forEach(w=>{const sh=new THREE.Shape(w.map(p=>{const m=M(p[0],p[1]);return new THREE.Vector2(m[0],-m[1]);}));
    const g=new THREE.ExtrudeGeometry(sh,{depth:HW,bevelEnabled:false}); g.rotateX(-Math.PI/2);
    {const mm=new THREE.Mesh(g,[mWallTop,mWall]);mm.castShadow=mm.receiveShadow=true;wallsG.add(mm);}});
  /* vanos: ventanas y puerta de ingreso */
  const glassAt=(x0,z0,x1,z1,y0,h,m)=>{const L=Math.hypot(x1-x0,z1-z0);const b=new THREE.Mesh(new THREE.BoxGeometry(L,h,.06),m||mGlass);
    b.position.set((x0+x1)/2,y0+h/2,(z0+z1)/2); b.rotation.y=-Math.atan2(z1-z0,x1-x0); wallsG.add(b);};
  let a=W(475,830),b=W(602,830); glassAt(a[0],a[1],b[0],b[1],.9,1.4);            // hab. 1
  a=W(1075,905);b=W(1205,905); glassAt(a[0],a[1],b[0],b[1],.9,1.4);              // hab. 2
  a=W(720,822);b=W(1030,822); glassAt(a[0],a[1],b[0],b[1],.02,2.3);              // puertaventana sala-balcón
  a=W(695,948);b=W(1030,948); glassAt(a[0],a[1],b[0],b[1],.02,1.05);             // baranda balcón
  a=W(903,180);b=W(1003,180); glassAt(a[0],a[1],b[0],b[1],.02,2.1,mDoor);        // ingreso

  /* ---- texturas procedurales ---- */
  const TX=(w,h,draw,rep)=>{const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rep)t.repeat.set(rep[0],rep[1]);t.anisotropy=4;t.encoding=THREE.sRGBEncoding;return t;};
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const walnutT=TX(512,512,(g,w,h)=>{g.fillStyle='#6a4529';g.fillRect(0,0,w,h);for(let i=0;i<420;i++){const y=rnd(0,h),a=rnd(.03,.14);g.strokeStyle=Math.random()<.5?`rgba(35,18,8,${a})`:`rgba(190,125,75,${a})`;g.lineWidth=rnd(.6,3);g.beginPath();g.moveTo(0,y);g.bezierCurveTo(w*.3,y+rnd(-9,9),w*.6,y+rnd(-9,9),w,y+rnd(-5,5));g.stroke();}},[1,1]);
  const concT=TX(512,512,(g,w,h)=>{g.fillStyle='#8c8f90';g.fillRect(0,0,w,h);for(let i=0;i<9000;i++){const v=Math.floor(rnd(105,165));g.fillStyle=`rgba(${v},${v},${v+2},.12)`;g.fillRect(rnd(0,w),rnd(0,h),rnd(1,14),rnd(1,14));}for(let i=0;i<30;i++){g.fillStyle=`rgba(255,255,255,${rnd(.02,.06)})`;g.beginPath();g.ellipse(rnd(0,w),rnd(0,h),rnd(30,110),rnd(20,70),rnd(0,3),0,7);g.fill();}},[5,5]);
  const marbleT=TX(512,512,(g,w,h)=>{g.fillStyle='#ece9e3';g.fillRect(0,0,w,h);for(let i=0;i<26;i++){g.strokeStyle=`rgba(120,120,125,${rnd(.08,.3)})`;g.lineWidth=rnd(.5,2.4);g.beginPath();let x=rnd(0,w),y=0;g.moveTo(x,y);while(y<h){x+=rnd(-26,26);y+=rnd(14,36);g.lineTo(x,y);}g.stroke();}},[1,1]);
  const flutedT=TX(256,64,(g,w,h)=>{for(let x=0;x<w;x+=8){const gr=g.createLinearGradient(x,0,x+8,0);gr.addColorStop(0,'#5a3418');gr.addColorStop(.5,'#c0884f');gr.addColorStop(1,'#4a2a12');g.fillStyle=gr;g.fillRect(x,0,8,h);}},[1,1]);
  const forestT=new THREE.TextureLoader().load('img/tv-bosque.jpg');forestT.encoding=THREE.sRGBEncoding;
  const PM=(o)=>new THREE.MeshStandardMaterial(o);
  const fWalnut=PM({map:walnutT,roughness:.5,metalness:.02}), fGrey=PM({color:0x4b4f55,roughness:.68}), fBlack=PM({color:0x0f1113,roughness:.4,metalness:.5}),
        fMarble=PM({map:marbleT,roughness:.22,metalness:.0}), fFlute=PM({map:flutedT,roughness:.45,emissive:0x3a1c08,emissiveIntensity:.55}), fSteel=PM({color:0xbfc3c6,roughness:.28,metalness:.9}),
        fGlass=PM({color:0x2a2420,roughness:.08,metalness:.2,transparent:true,opacity:.42}), fLED=new THREE.MeshBasicMaterial({color:0xffcf94}), fTV=new THREE.MeshBasicMaterial({map:forestT}),
        fCer=PM({color:0xd8d0c6,roughness:.5}), fLeather=PM({color:0x1a1613,roughness:.55});
  mWood.map=concT; mWood.color.set(0xb8bcbe); mWood.roughness=.55; mWood.needsUpdate=true;
  mTile.color.set(0x9aa0a4); mTop.color.set(0xd5d2cb);
  const FUR=new THREE.Group(); S.add(FUR);
  const lights=[];
  function box(g,w,h,d,x,y,z,m){const me=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);me.position.set(x,y+h/2,z);me.castShadow=me.receiveShadow=true;g.add(me);return me;}
  function cyl(g,r1,r2,h,x,y,z,m,seg){const me=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg||24),m);me.position.set(x,y+h/2,z);me.castShadow=true;g.add(me);return me;}
  function glow(g,x,y,z,c,i,d){const l=new THREE.PointLight(c||0xffb869,i||.5,d||3.2);l.position.set(x,y,z);g.add(l);lights.push(l);return l;}
  function place(g,ix,iy,ry){const p=W(ix,iy);g.position.set(p[0],0,p[1]);g.rotation.y=ry;FUR.add(g);return g;}
  function textured(m,rx,ry){const c=m.clone();c.map=m.map.clone();c.map.needsUpdate=true;c.map.encoding=THREE.sRGBEncoding;c.map.repeat.set(rx,ry);return c;}

  /* ===== MUEBLE DE SALA · 2,10 m (según render y plano 1:20) ===== */
  const tv=new THREE.Group();
  const wA=textured(fWalnut,1.4,1.2), wB=textured(fWalnut,.4,1.2);
  box(tv,2.1,.06,.42,0,0,0,fBlack);                                             // zócalo
  [-.7,0,.7].forEach(x=>{box(tv,.68,.34,.02,x,.07,.22,fGrey);box(tv,.3,.012,.012,x,.36,.235,fBlack);}); // cajones
  box(tv,2.1,.34,.4,0,.07,-.01,fGrey);                                          // cuerpo
  box(tv,2.1,.04,.42,0,.41,0,wA);                                               // tapa
  box(tv,1.42,1.56,.035,-.34,.45,-.185,wA);                                     // fondo nogal
  box(tv,.04,1.9,.4,-1.04,.0,0,wB);                                             // costado izq.
  box(tv,1.28,.73,.03,-.34,.78,-.16,fBlack); box(tv,1.2,.67,.005,-.34,.81,-.143,fTV);  // TV
  box(tv,.9,.15,.36,-.55,.45,.01,textured(fWalnut,.9,.15)); box(tv,.03,.15,.36,-.55-.435,.45,.01,wB); box(tv,.03,.15,.36,-.1,.45,.01,wB); box(tv,.03,.15,.36,-.55,.45,.01,wB); // repisa baja
  box(tv,1.5,.4,.36,-.3,1.4,.03,fGrey).scale.x=1; [-.67,.07].forEach(x=>box(tv,.73,.38,.02,x-.0,1.41,.215,fGrey)); // alacenas altas
  box(tv,.9,.02,.01,-.3,1.36,.2,fLED); box(tv,.7,.02,.01,.0,.95,-.15,fLED).visible=false;
  [-.85,.2].forEach(()=>0);
  box(tv,.04,1.9,.4,.72,.0,0,wB); box(tv,.04,1.9,.4,1.04,.0,0,wB);              // columna derecha
  box(tv,.28,1.9,.01,.88,.0,-.19,fGrey);
  [.62,.95,1.28,1.6].forEach(y=>{box(tv,.3,.025,.36,.88,y,.01,fGrey);box(tv,.28,.012,.01,.88,y-.012,.17,fLED);});
  box(tv,.34,.22,.4,.88,1.9,0,fGrey);                                            // cabecera
  [[.1,.45],[.1,.78]].forEach(p=>{box(tv,.22,.025,.2,.52,p[1],.07,fWalnut);cyl(tv,.04,.05,.13,.52,p[1]+.025,.07,fCer);}); // repisas redondas + vasijas
  box(tv,.2,.03,.14,.88,1.62,.0,fCer).visible=false; box(tv,.13,.04,.1,.9,1.285,.0,PM({color:0xcdbb9e,roughness:.8})); box(tv,.1,.03,.08,.89,1.325,.0,PM({color:0x3a5a52,roughness:.8}));
  glow(tv,-.34,1.2,.5,0xffb869,.5,2.8); glow(tv,.88,1.2,.4,0xffb869,.35,2.2);
  tv.userData.k='sala';
  { // pared opuesta: muro inclinado de la habitación 2 (lado este de la sala)
    const P=W(1078,640), n=[-.977,-.214]; tv.position.set(P[0]+n[0]*.21,0,P[1]+n[1]*.21); tv.rotation.y=Math.atan2(n[0],n[1]); FUR.add(tv); }

  /* ===== COCINA EN U CON BARRA (según render: barra al frente, hornilla y nevera al fondo) ===== */
  const ck=new THREE.Group(), cw=2.25, cd=2.45, X0=-cw/2, X1=cw/2, Z0=-cd/2, Z1=cd/2;
  const wn=(w,h)=>textured(fWalnut,w,h);
  const base=(x0,x1,z0,z1)=>{const w=x1-x0,d=z1-z0,cx=(x0+x1)/2,cz=(z0+z1)/2;box(ck,w,.86,d,cx,0,cz,wn(Math.max(w,d),.86));box(ck,w+.02,.035,d+.02,cx,.86,cz,fMarble);};
  base(X0,X1-.72,Z0,Z0+.6);                                   // fondo: hornilla y fregadero
  base(X0,X0+.6,Z0+.6,Z1-.95);                                // pierna izquierda
  /* barra al frente, mirando a la sala; cascada de mármol en el extremo */
  const bx1=X0+1.3, bz0=Z1-.95, bz1=Z1-.35;
  box(ck,bx1-X0,.78,.1,(X0+bx1)/2,0,bz0+.05,wn(1,.8)); 
  box(ck,bx1-X0-.04,1.0,.5,(X0+bx1)/2,0,bz1-.27,fFlute); box(ck,bx1-X0+.03,.045,.72,(X0+bx1)/2,1.0,(bz0+bz1)/2+.02,fMarble); // frente acanalado + tapa
  box(ck,.05,1.04,.72,bx1+.02,0,(bz0+bz1)/2+.02,fMarble);     // cascada
  box(ck,bx1-X0,.86,.1,(X0+bx1)/2,0,bz0+.05,fFlute).visible=false;
  /* salpicadero de mármol */
  box(ck,X1-X0-.72,.55,.015,(X0+X1-.72)/2,.9,Z0+.008,fMarble); box(ck,.015,.55,cd-1.5,X0+.008,.9,(Z0+Z1-.95+.0)/2-.12,fMarble);
  /* hornilla (4 quemadores), horno bajo cubierta y fregadero */
  box(ck,.52,.012,.46,X0+.75,.895,Z0+.3,fBlack); [[-.12,-.1],[.12,-.1],[-.12,.1],[.12,.1]].forEach(p=>cyl(ck,.05,.05,.02,X0+.75+p[0],.905,Z0+.3+p[1],fBlack,16));
  box(ck,.5,.015,.38,X1-1.0,.896,Z0+.3,fSteel); box(ck,.02,.2,.02,X1-1.0,.9,Z0+.12,fSteel);
  box(ck,.55,.02,.02,X0+.75,.5,Z0+.605,fSteel).visible=false;
  /* nevera de piso a techo bajo (1,85 m), independiente, apoyada en el piso al final del muro del fondo */
  const fr=new THREE.Group(); box(fr,.7,1.85,.68,0,0,0,fSteel); box(fr,.7,.012,.01,0,1.17,.345,fBlack); box(fr,.02,.45,.03,-.29,1.22,.36,fBlack); box(fr,.02,.6,.03,-.29,.5,.36,fBlack);
  fr.position.set(X1-.36,0,Z0+.35); ck.add(fr);
  box(ck,.72,.4,.35,X1-.36,1.9,Z0+.2,fBlack);                 // alacena sobre la nevera
  /* alacenas altas nogal + estante abierto con marco negro */
  box(ck,X1-X0-.74-.0,.62,.34,(X0+X1-.74)/2+.0,1.5,Z0+.18,wn(1.6,.6));
  box(ck,.34,.62,cd-1.5-.0,X0+.18,1.5,(Z0+Z1-.95)/2-.12,wn(.5,.6));
  box(ck,.5,.18,.3,X0+.75,1.28,Z0+.19,fSteel).visible=false;
  /* luz bajo alacenas + péndulos sobre la barra */
  box(ck,X1-X0-.78,.014,.012,(X0+X1-.74)/2,1.49,Z0+.36,fLED); box(ck,.014,.014,cd-1.6,X0+.36,1.49,(Z0+Z1-.95)/2-.12,fLED);
  [0,1,2].forEach(i=>{const x=X0+.3+i*.42,z=bz1-.1;const l=new THREE.Mesh(new THREE.ConeGeometry(.12,.2,4,1,true),fBlack);l.position.set(x,1.72,z);l.castShadow=true;ck.add(l);const b=new THREE.Mesh(new THREE.SphereGeometry(.035,12,12),fLED);b.position.set(x,1.66,z);ck.add(b);const cc=new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,.55,6),fBlack);cc.position.set(x,2.05,z);ck.add(cc);});
  /* taburetes del lado de la sala */
  [0,1].forEach(i=>{const x=X0+.4+i*.6,z=Z1-.05;cyl(ck,.17,.17,.05,x,.66,z,fLeather,20);cyl(ck,.025,.025,.66,x,0,z,fBlack,8);});
  glow(ck,0,1.4,0,0xffb869,.6,3.4); glow(ck,X0+.6,.5,Z1-.1,0xff9a4a,.35,1.8);
  place(ck,768,328,0);

  /* ===== VESTIER · CLÓSET A MEDIDA (marco nogal, vidrio ahumado, LED) ===== */
  const cl=new THREE.Group(), cwid=1.95, ch=2.4, cdp=.6;
  box(cl,cwid,.04,cdp,0,0,0,fWalnut); box(cl,cwid,.04,cdp,0,ch-.04,0,fWalnut);
  box(cl,.04,ch,cdp,-cwid/2+.02,0,0,fWalnut); box(cl,.04,ch,cdp,cwid/2-.02,0,0,fWalnut);
  box(cl,cwid-.08,ch-.08,.02,0,.04,-cdp/2+.01,textured(fWalnut,1.9,2.4));
  [-.33,.42].forEach(x=>box(cl,.03,ch-.08,cdp-.02,x,.04,0,fWalnut));              // divisiones
  box(cl,.62,ch-.1,.012,-cwid/2+.35,.05,cdp/2,fGlass); box(cl,.42,ch-.1,.012,cwid/2-.36,.05,cdp/2,fGlass);   // puertas de vidrio (izq., der.)
  [-.64,-.7].forEach(x=>box(cl,.008,ch-.14,.012,x-.0+0,.07,cdp/2+.008,fLED));
  box(cl,.014,.22,.02,-.66+.0,1.05,cdp/2+.02,fBlack); box(cl,.014,.22,.02,.84,1.05,cdp/2+.02,fBlack);
  box(cl,.7,.012,.02,.045,2.15,cdp/2-.05,fLED); cyl(cl,.012,.012,.7,.045,1.95,0,fSteel,8).rotation.z=Math.PI/2;      // varilla + LED
  [0,1,2,3].forEach(i=>{box(cl,.68,.17,.02,.045,.06+i*.19,cdp/2-.0,textured(fWalnut,.6,.16));box(cl,.2,.008,.01,.045,.06+i*.19+.12,cdp/2+.012,fBlack);});   // 4 cajones
  [.5,.9,1.3,1.7,2.1].forEach(y=>{box(cl,.4,.02,cdp-.06,cwid/2-.36,y,0,fWalnut);box(cl,.38,.008,.008,cwid/2-.36,y-.008,cdp/2-.03,fLED);});   // estantes con LED
  box(cl,.5,1.2,.02,-cwid/2+.35,.2,-.2,PM({color:0x6d6a66,roughness:.9})).visible=false;
  glow(cl,.04,1.9,.35,0xffb869,.55,2.6);
  cl.userData.k='vestier';
  place(cl,630,362,-Math.PI/2); cl.position.x=W(630,0)[0]-.31;

  /* etiquetas */
  const labs=new THREE.Group(); S.add(labs);
  function lab(txt,ix,iy,hi){const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.font='600 46px Sora,system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';
    g.fillStyle=hi?'#ffb869':'rgba(255,255,255,.9)';g.fillText(txt,256,64);const t=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));
    const p=W(ix,iy);s.position.set(p[0],hi?2.9:.35,p[1]);s.scale.set(2,.5,1);s.renderOrder=9;labs.add(s);}
  [['Sala–comedor',840,640],['Cocina',768,300,1],['Vestier',551,330,1],['Habitación',470,650],['Habitación',1200,700],['Baño',390,300],['Baño',1380,400],['Lavado',1235,300],['Estudio',1070,270]].forEach(l=>lab(l[0],l[1],l[2],l[3]));
  lab('Mueble de sala',1040,640,1); labs.children[labs.children.length-1].position.y=2.9;

  /* cámaras */
  const V={
    aerea:{p:[0,8.6,6.9],t:[0,0,.2]},
    sala:{p:[-1.9,1.55,1.5],t:[1.4,1.05,.7]},
    cocina:{p:[-1.2,2.0,1.7],t:[-1.25,.9,-2.2]},
    vestier:{p:[-3.85,1.55,.9],t:[-2.85,1.15,-1.8]}
  };
  let anim=null,curK='aerea';
  let labOn=true;function fly(k){const v=V[k];if(!v)return;labs.visible=labOn&&k==='aerea';host.dispatchEvent(new CustomEvent('view',{detail:k}));curK=k;anim={t0s:performance.now(),t:0,p0:C.position.clone(),t0:OC.target.clone(),p1:new THREE.Vector3(...v.p),t1:new THREE.Vector3(...v.t)};}
  C.position.set(...V.aerea.p); OC.target.set(...V.aerea.t);
  /* controles */
  host.querySelectorAll('[data-v]').forEach(b=>b.addEventListener('click',()=>{host.querySelectorAll('[data-v]').forEach(x=>x.classList.toggle('on',x===b));fly(b.dataset.v);}));
  const tg=(sel,fn)=>{const b=host.querySelector(sel);b&&b.addEventListener('click',()=>{b.classList.toggle('on');fn(b.classList.contains('on'));});};
  tg('[data-t=muebles]',on=>{FUR.visible=on;});
  tg('[data-t=corte]',on=>{wallsG.scale.y=on?1.2/HW:1;});
  tg('[data-t=etiq]',on=>{labOn=on;labs.visible=on&&!(anim&&anim.k!=='aerea')&&curK==='aerea';});

  /* bucle */
  function size(){const w=host.clientWidth,h=host.clientHeight;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix();}
  size(); new ResizeObserver(size).observe(host);
  let vis=true; new IntersectionObserver(e=>{vis=e[0].isIntersecting;}).observe(host);
  let idle=0; OC.addEventListener('start',()=>{idle=-1;});
  function loop(){requestAnimationFrame(loop); if(!vis) return;
    if(anim){anim.t=Math.min(1,(performance.now()-anim.t0s)/1500);const e=anim.t<.5?2*anim.t*anim.t:1-Math.pow(-2*anim.t+2,2)/2;
      C.position.lerpVectors(anim.p0,anim.p1,e);OC.target.lerpVectors(anim.t0,anim.t1,e);if(anim.t>=1)anim=null;}
    OC.update(); R.render(S,C);}
  loop(); host.classList.add('live'); window.__apto3d={fly,S,C,OC,R};
}
window.initApto3D=init;
})();
