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
  const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:false}); R.setPixelRatio(Math.min(devicePixelRatio,2));
  const S=new THREE.Scene(); const sk=document.createElement('canvas');sk.width=4;sk.height=256;const sg=sk.getContext('2d'),gd=sg.createLinearGradient(0,0,0,256);
  gd.addColorStop(0,'#0c1a26');gd.addColorStop(.5,'#2f5870');gd.addColorStop(.8,'#8fa3a8');gd.addColorStop(1,'#f0b27a');sg.fillStyle=gd;sg.fillRect(0,0,4,256);
  S.background=new THREE.CanvasTexture(sk); S.fog=new THREE.Fog(0x6b8796,25,200);
  const C=new THREE.PerspectiveCamera(52,1,.1,400); const OC=new THREE.OrbitControls(C,cv);
  OC.enableDamping=true; OC.dampingFactor=.08; OC.maxPolarAngle=Math.PI*.495; OC.minDistance=1.2; OC.maxDistance=20;
  S.add(new THREE.HemisphereLight(0xfff2e0,0x2a3036,.5));
  const sun=new THREE.DirectionalLight(0xffe2bd,.45); sun.position.set(-6,12,8); S.add(sun); const sun2=new THREE.DirectionalLight(0xbcd2e0,.5); sun2.position.set(4,6,-12); S.add(sun2);
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
  poly(foot,mWood,.005);
  const tiles=[[[310,190],[470,190],[470,452],[310,452]],[[1145,215],[1340,262],[1305,392],[1145,350]],[[1345,250],[1485,285],[1432,525],[1285,490]],[[640,822],[1035,822],[1035,945],[640,945]]];
  tiles.forEach(t=>poly(t.map(p=>W(p[0],p[1])),mTile,.012));

  /* muros */
  const wallsG=new THREE.Group(); S.add(wallsG);
  WALLS.forEach(w=>{const sh=new THREE.Shape(w.map(p=>{const m=M(p[0],p[1]);return new THREE.Vector2(m[0],-m[1]);}));
    const g=new THREE.ExtrudeGeometry(sh,{depth:HW,bevelEnabled:false}); g.rotateX(-Math.PI/2);
    wallsG.add(new THREE.Mesh(g,[mWallTop,mWall]));});
  /* vanos: ventanas y puerta de ingreso */
  const glassAt=(x0,z0,x1,z1,y0,h,m)=>{const L=Math.hypot(x1-x0,z1-z0);const b=new THREE.Mesh(new THREE.BoxGeometry(L,h,.06),m||mGlass);
    b.position.set((x0+x1)/2,y0+h/2,(z0+z1)/2); b.rotation.y=-Math.atan2(z1-z0,x1-x0); wallsG.add(b);};
  let a=W(475,830),b=W(602,830); glassAt(a[0],a[1],b[0],b[1],.9,1.4);            // hab. 1
  a=W(1075,905);b=W(1205,905); glassAt(a[0],a[1],b[0],b[1],.9,1.4);              // hab. 2
  a=W(720,822);b=W(1030,822); glassAt(a[0],a[1],b[0],b[1],.02,2.3);              // puertaventana sala-balcón
  a=W(695,948);b=W(1030,948); glassAt(a[0],a[1],b[0],b[1],.02,1.05);             // baranda balcón
  a=W(903,180);b=W(1003,180); glassAt(a[0],a[1],b[0],b[1],.02,2.1,mDoor);        // ingreso

  /* ---- muebles ---- */
  const FUR=new THREE.Group(); S.add(FUR);
  function box(g,w,h,d,x,y,z,m){const me=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);me.position.set(x,y+h/2,z);g.add(me);return me;}
  function place(g,ix,iy,ry){const p=W(ix,iy);g.position.set(p[0],0,p[1]);g.rotation.y=ry;FUR.add(g);return g;}

  /* sala: mueble de TV 2,10 m — apoyado en el muro de la sala-comedor, mirando al este */
  const tv=new THREE.Group();
  box(tv,2.1,.36,.45,0,0,0,mGrey);                       // base con 3 cajones
  [-.7,0,.7].forEach(x=>box(tv,.66,.003,.002,x,.17,.226,mDark));
  box(tv,2.1,.04,.45,0,.36,0,mNut);
  box(tv,1.5,1.55,.04,-.2,.4,-.205,mNut);               // panel de TV
  box(tv,1.2,.7,.03,-.2,.9,-.16,mDark);                 // pantalla
  box(tv,1.0,.2,.4,-.25,.4,0,mNut);                     // repisa baja
  box(tv,.9,.45,.4,-.65,1.75,.02,mGrey);                  // alacena alta
  box(tv,.55,1.9,.4,.78,.4,.02,mNut); box(tv,.5,.03,.38,.78,.8,.02,mGrey); box(tv,.5,.03,.38,.78,1.2,.02,mGrey); box(tv,.5,.03,.38,.78,1.6,.02,mGrey);
  box(tv,.04,.01,.01,-.2,1.5,-.17,mLed).scale.x=30;
  tv.userData.led=[[0,1.5,0]];
  place(tv,640+22,690,Math.PI/2).position.x+=.225;

  /* cocina en U con barra */
  const ck=new THREE.Group();
  const cw=2.2, cd=2.4;                                  // ancho y fondo útiles (m)
  box(ck,cw,.9,.6,0,0,-cd/2+.3,mGrey); box(ck,cw,.04,.62,0,.9,-cd/2+.3,mTop);        // fondo
  box(ck,.6,.9,cd-.6,-cw/2+.3,0,.3,mGrey); box(ck,.62,.04,cd-.6,-cw/2+.3,.9,.3,mTop); // izquierda
  box(ck,.6,.9,1.0,cw/2-.3,0,-cd/2+1.1,mGrey); box(ck,.62,.04,1.0,cw/2-.3,.9,-cd/2+1.1,mTop); // derecha
  box(ck,1.5,.7,.35,-.2,1.5,-cd/2+.18,mNut); box(ck,.35,.7,1.4,-cw/2+.18,1.5,.0,mNut);        // alacenas
  box(ck,1.4,1.04,.5,.15,0,cd/2-.35,mNut); box(ck,1.45,.04,.62,.15,1.04,cd/2-.35,mTop);       // barra
  [.5,1.0].forEach(x=>{box(ck,.34,.05,.34,x-.35,.62,cd/2+.15,mDark);box(ck,.05,.62,.05,x-.35,0,cd/2+.15,mDark);});
  box(ck,1.5,.01,.02,-.2,1.46,-cd/2+.38,mLed);
  place(ck,768,330,0);

  /* vestier: clóset a medida contra el muro este */
  const cl=new THREE.Group();
  box(cl,1.95,2.4,.6,0,0,0,mNut);
  for(let k=0;k<4;k++) box(cl,.012,2.2,.01,-.73+k*.485,.1,.3,mGrey);
  [-.73,0,.73].forEach(x=>box(cl,.5,.012,.01,x,.45,.3,mGrey));
  place(cl,630,362,-Math.PI/2); cl.position.x=W(630,0)[0]-.31;

  /* etiquetas */
  const labs=new THREE.Group(); S.add(labs);
  function lab(txt,ix,iy,hi){const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.font='600 46px Sora,system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';
    g.fillStyle=hi?'#ffb869':'rgba(255,255,255,.9)';g.fillText(txt,256,64);const t=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));
    const p=W(ix,iy);s.position.set(p[0],hi?2.9:.35,p[1]);s.scale.set(2,.5,1);s.renderOrder=9;labs.add(s);}
  [['Sala–comedor',840,640],['Cocina',768,300,1],['Vestier',551,330,1],['Habitación',470,650],['Habitación',1200,700],['Baño',390,300],['Baño',1380,400],['Lavado',1235,300],['Estudio',1070,270],['Balcón',840,885]].forEach(l=>lab(l[0],l[1],l[2],l[3]));
  lab('Mueble de sala',700,650,1); labs.children[labs.children.length-1].position.y=2.9;

  /* cámaras */
  const V={
    aerea:{p:[0,8.6,6.9],t:[0,0,.2]},
    sala:{p:[1.1,1.55,2.4],t:[-2.3,1.1,1.0]},
    cocina:{p:[-1.2,2.0,1.7],t:[-1.25,.9,-2.2]},
    vestier:{p:[-3.7,1.7,.9],t:[-2.9,1.1,-1.8]},
    balcon:{p:[-.7,1.6,2.9],t:[-.7,3.2,14]}
  };
  let anim=null,curK='aerea';
  let labOn=true;function fly(k){const v=V[k];if(!v)return;labs.visible=labOn&&k==='aerea';curK=k;anim={t0s:performance.now(),t:0,p0:C.position.clone(),t0:OC.target.clone(),p1:new THREE.Vector3(...v.p),t1:new THREE.Vector3(...v.t)};}
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
