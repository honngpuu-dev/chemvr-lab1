/* ChemVR Lab – VR realism add-on. Dán trong <script> MỚI, ngay trước </body> (sau script chính). Không cần sửa code cũ. */
(()=>{try{
const V3=THREE.Vector3,Q=THREE.Quaternion,tmp=new V3(),tm2=new V3(),mouth=new V3(),up=new V3();
const clock={t:performance.now()},tw=[],hands=[],bots={};let busy=0,coat=0,reach=0,curlD=0;
// ===== 1. Ánh sáng, bóng đổ, tông màu thực tế =====
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
S.traverse(o=>{if(o.isAmbientLight)o.intensity=.28;if(o.isHemisphereLight)o.intensity=.22;if(o.isMesh&&(o.material===glassM||o.material===lm))o.castShadow=false});
flr.material.emissiveIntensity=.06;sun.position.set(2.6,3,1.8);sun.target.position.set(0,.9,-.4);S.add(sun.target);sun.intensity=.75;sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-3,right:3,top:3,bottom:-3,near:.5,far:9});sun.shadow.camera.updateProjectionMatrix();sun.shadow.bias=-.0004;sun.shadow.radius=3;
const spot=new THREE.SpotLight(0xfff4e6,.8,6,.8,.6,1);spot.position.set(0,2.9,.3);spot.target.position.set(0,.9,-.2);S.add(spot,spot.target);
lm.envMapIntensity=1.2;lm.reflectivity=.6;
// ===== 2. Găng tay nitrile =====
const GM=new THREE.MeshStandardMaterial({color:0x2f86e6,roughness:.32,envMapIntensity:.9}),CM=new THREE.MeshStandardMaterial({color:0xf4f7fa,roughness:.85});
const seg=l=>{const s=new THREE.Group(),c=new THREE.Mesh(new THREE.CylinderGeometry(.0092,.0098,l,10),GM),b=new THREE.Mesh(new THREE.SphereGeometry(.0094,10,8),GM);c.rotation.x=PI/2;c.position.z=-l/2;b.position.z=-l;s.add(c,b);return s};
function glove(){const g=new THREE.Group(),fs=[],mk=(x,y,z,l1,l2,ry,w)=>{const p=new THREE.Group(),q=new THREE.Group();p.position.set(x,y,z);p.rotation.y=ry;p.add(seg(l1));q.position.z=-l1;q.add(seg(l2));p.add(q);g.add(p);fs.push({p,q,w})};
 const palm=new THREE.Mesh(new THREE.SphereGeometry(.05,20,14),GM);palm.scale.set(.95,.42,1.05);g.add(palm);
 const wr=new THREE.Mesh(new THREE.CylinderGeometry(.034,.04,.09,16),GM);wr.rotation.x=PI/2;wr.position.z=.07;g.add(wr);
 const cuff=new THREE.Mesh(new THREE.CylinderGeometry(.045,.056,.17,18,1,true),CM);cuff.material.side=THREE.DoubleSide;cuff.rotation.x=PI/2;cuff.position.z=.15;cuff.visible=false;g.add(cuff);
 [[-.03,.036,.028,1],[-.01,.042,.032,.9],[.012,.04,.03,1],[.032,.032,.026,1]].forEach(([x,l1,l2,w],i)=>mk(x,0,-.045,l1,l2,0,i?1:.5));
 mk(.045,-.004,-.012,.034,.028,-.7,.7);g.userData={fs,cuff};return g}
function curl(g,sq,tr){g.userData.fs.forEach((f,i)=>{const c=i==0?tr*.5+sq*.5:i==4?sq*.6+tr*.2:sq;f.p.rotation.x=-c*1.15;f.q.rotation.x=-c*1.3})}
// ----- tay VR (gắn vào controller grip) -----
[0,1].forEach(i=>{const c=R.xr.getController(i),gp=R.xr.getControllerGrip(i),gv=glove();gv.position.set(0,-.01,.03);gv.rotation.x=-.35;gp.add(gv);rig.add(gp);
 const h={c,gp,gv,src:null,held:null,cool:0,prev:new V3(),vel:0};hands.push(h);
 c.addEventListener('connected',e=>{h.src=e.data;if(e.data.handedness=='left')gv.scale.x=-1});
 c.addEventListener('squeezestart',()=>grab(h));c.addEventListener('squeezeend',()=>drop(h))});
// ----- tay màn hình (desktop): luôn hiện 2 bàn tay đeo găng -----
const ov=new THREE.Group(),gl=glove(),gr=glove();gl.scale.setScalar(1.15);gr.scale.setScalar(1.15);ov.add(gl,gr);C.add(ov);
// ===== 3. Bảo hộ: áo blouse + kính =====
bx(.62,.86,.5,cab,2.4,.43,.35);bx(.68,.04,.56,topM,2.4,.88,.35);
const gG=new THREE.Group(),lens=new THREE.MeshPhysicalMaterial({color:0xbfe8ff,transparent:true,opacity:.28,roughness:.05,clearcoat:1,side:THREE.DoubleSide,depthWrite:false}),frm=new THREE.MeshStandardMaterial({color:0x2f7fc0,roughness:.5});
[-.04,.04].forEach(x=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.032,.006,8,24),frm),l=new THREE.Mesh(new THREE.CircleGeometry(.032,24),lens);r.position.set(x,0,0);l.position.set(x,0,0);gG.add(r,l)});
const st=new THREE.Mesh(new THREE.TorusGeometry(.085,.005,6,24,PI),frm);st.rotation.x=PI/2;st.position.z=.01;gG.add(st);gG.position.set(2.4,.97,.35);gG.rotation.x=-.3;S.add(gG);gG.traverse(o=>{if(o.isMesh)reg(o,{act:'goggles'})});
reg(bx(.3,.012,.16,topM,2.4,.912,.35),{act:'goggles'});
const hk=reg(cy(.014,.014,1.9,steel,2.9,.95,.2),{act:'coat'});reg(bx(.5,.02,.02,steel,2.9,1.82,.2),{act:'coat'});cy(.18,.18,.03,steel,2.9,.02,.2);
const cG=new THREE.Group(),wm=new THREE.MeshStandardMaterial({color:0xf2f6f9,roughness:.85,side:THREE.DoubleSide});
const cb=new THREE.Mesh(new THREE.BoxGeometry(.46,.9,.1),wm);cb.position.y=-.45;cG.add(cb);[-1,1].forEach(s=>{const sl=new THREE.Mesh(new THREE.CylinderGeometry(.06,.05,.62,14),wm);sl.position.set(s*.27,-.38,0);sl.rotation.z=s*.12;cG.add(sl);const pk2=new THREE.Mesh(new THREE.BoxGeometry(.12,.1,.012),M(0xdde6ee));pk2.position.set(s*.12,-.62,.056);cG.add(pk2)});
cG.position.set(2.9,1.8,.2);S.add(cG);cG.traverse(o=>{if(o.isMesh){o.castShadow=true;reg(o,{act:'coat'})}});
// kính trên mặt (gắn camera) + viền nhìn qua kính
const fc=document.createElement('canvas');fc.width=1024;fc.height=512;{const g=fc.getContext('2d');g.fillStyle='rgba(20,60,110,.55)';g.fillRect(0,0,1024,512);g.globalCompositeOperation='destination-out';g.beginPath();g.roundRect?g.roundRect(70,60,884,392,150):g.rect(70,60,884,392);g.fill();g.globalCompositeOperation='source-over';g.strokeStyle='rgba(150,210,255,.9)';g.lineWidth=6;g.beginPath();g.roundRect?g.roundRect(70,60,884,392,150):g.rect(70,60,884,392);g.stroke();g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=10;g.beginPath();g.moveTo(240,150);g.lineTo(380,110);g.stroke()}
const fT=new THREE.CanvasTexture(fc),face=new THREE.Mesh(new THREE.PlaneGeometry(.6,.3),new THREE.MeshBasicMaterial({map:fT,transparent:true,depthTest:false,depthWrite:false}));face.position.z=-.25;face.renderOrder=999;C.add(face);
NM.coat='Áo blouse (mặc/cởi)';NM.goggles='Kính bảo hộ (đeo/tháo)';
const fly=(o,done)=>{const p0=o.position.clone(),s0=o.scale.clone();let t=0;tw.push(dt=>{t+=dt/.5;C.getWorldPosition(tm2);o.parent.worldToLocal(tm2);o.position.lerpVectors(p0,tm2,Math.min(1,t*t));o.scale.copy(s0).multiplyScalar(1-.7*Math.min(1,t));if(t>=1){o.position.copy(p0);o.scale.copy(s0);done&&done();return 1}})};
ACTS.goggles=()=>{if(gog){gog=0;sync();toast('Đã tháo kính bảo hộ');note('🥽 Đã <b>tháo kính</b>. Nhớ đeo lại trước khi pha hóa chất.')}else fly(gG,()=>{gog=1;sync();toast('🥽 Đã đeo kính bảo hộ');note('🥽 Đã <b>đeo kính bảo hộ</b>: mắt được che chắn khi hóa chất văng.')})};
ACTS.coat=()=>{if(coat){coat=0;toast('Đã cởi áo blouse')}else fly(cG,()=>{coat=1;toast('🥼 Đã mặc áo blouse');note('🥼 Đã <b>mặc áo blouse</b> – tay áo trắng phủ lên găng. PPE: áo blouse, kính, găng tay.')})};
gog=0;sync();note('🥼 <b>Trước khi làm thí nghiệm:</b> ra bàn bên phải, lấy <b>kính bảo hộ</b> và <b>áo blouse</b> (VR: bóp grip vào đồ; PC: bấm vào đồ). Găng tay đã được đeo sẵn.');
// ===== 4. Nghiêng chai để rót =====
pk.forEach(o=>{const i=o.userData.id;if(i&&o.parent&&o.parent!==S&&!bots[i]){const g=o.parent;g.userData={id:i,hp:g.position.clone(),hq:g.quaternion.clone(),acc:0};bots[i]=g}});
const stm=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,10,1,true),new THREE.MeshPhysicalMaterial({transparent:true,opacity:.85,roughness:.05,clearcoat:1,side:THREE.DoubleSide}));stm.visible=false;stm.frustumCulled=false;S.add(stm);
const hap=(h,a,d)=>{try{const x=h&&h.src&&h.src.gamepad&&h.src.gamepad.hapticActuators;x&&x[0]&&x[0].pulse(a,d)}catch(e){}};
function pour(g,dt,h){const id=g.userData.id,c=D[id];g.updateWorldMatrix(true,false);mouth.set(0,.235,0).applyMatrix4(g.matrixWorld);up.set(0,1,0).transformDirection(g.matrixWorld);
 const over=Math.hypot(mouth.x,mouth.z-bz0)<bR+.015&&mouth.y>bY+bH-.05&&mouth.y<bY+bH+.5,ti=up.y<.2,col=new THREE.Color(c.c),liquid=c.s=='l';
 if(ti&&over){const f=Math.min(1,(.2-up.y)/.9+.3),unit=liquid?5:.2;g.userData.acc+=dt*(liquid?14:1.4)*f;
  if(liquid){const ey=Math.max(bY+.01,surf()),len=Math.max(.01,mouth.y-ey);stm.visible=true;stm.position.set(mouth.x,ey+len/2,mouth.z);stm.scale.set(.006,len,.006);stm.material.color.copy(col);
   if(rnd()<.6*f)PD.e(mouth.x+(rnd()-.5)*.02,ey,mouth.z+(rnd()-.5)*.02,(rnd()-.5)*.25,.5+rnd()*.5,(rnd()-.5)*.25,.35,.012,col,.9,9.8,0,0)}
  else for(let k=0;k<2;k++)PD.e(mouth.x+(rnd()-.5)*.012,mouth.y,mouth.z+(rnd()-.5)*.012,(rnd()-.5)*.05,-.1,(rnd()-.5)*.05,.25,.011,col,.95,9.8,0,0);
  if(g.userData.acc>=unit){g.userData.acc-=unit;if(vol()+unit<=250)add(id,0);hap(h,.25,35)}return 1}
 if(ti&&liquid&&mouth.y<1.4&&mouth.y>.95&&Math.abs(mouth.x)<1.7&&mouth.z>-.7&&mouth.z<.3){for(let k=0;k<2;k++)PD.e(mouth.x,mouth.y,mouth.z,(rnd()-.5)*.1,-.2,(rnd()-.5)*.1,.5,.014,col,.9,9.8,0,0);
  g.userData.sp=(g.userData.sp||0)+dt;if(g.userData.sp>1){g.userData.sp=0;safe=Math.max(0,safe-2);note('💦 <b>Đổ ra ngoài bàn!</b> Căn miệng chai vào giữa cốc trước khi nghiêng (−2 điểm).')}}
 return 0}
// desktop/tia chọn: chai tự cầm lên, nghiêng, rót rồi đặt về
function pourAnim(id){const g=bots[id];if(!g||busy)return;busy=1;const hp=g.userData.hp,mh=hp.clone().setY(hp.y+.235),M0=new V3(0,bY+bH+.03,bz0),hi=M0.clone().setY(M0.y+.26),th=D[id].s=='l'?1.95:2.1,es=x=>x*x*(3-2*x),P=[.8,.7,1.5,.7,.8];let t=0,m=new V3();
 tw.push(dt=>{t+=dt;let ph=0,u=t,tt=0;while(ph<4&&u>P[ph]){u-=P[ph];ph++}const x=es(Math.min(1,u/P[ph]));
  if(ph==0)m.lerpVectors(mh,hi,x);else if(ph==1){m.lerpVectors(hi,M0,x);tt=th*x}else if(ph==2){m.copy(M0);tt=th}else if(ph==3){m.lerpVectors(M0,hi,x);tt=th*(1-x)}else m.lerpVectors(hi,mh,x);
  g.rotation.set(0,0,tt);g.position.set(m.x+.235*Math.sin(tt),m.y-.235*Math.cos(tt),m.z);reach+=((ph<5?1:0)-reach)*Math.min(1,dt*6);curlD=ph==2?1:.7;
  if(ph==2)pour(g,dt,null);if(t>=P.reduce((a,b)=>a+b)){g.position.copy(hp);g.quaternion.copy(g.userData.hq);busy=0;reach=0;curlD=0;return 1}})}
const od=doPick;doPick=u=>{if(u.id){if(!busy&&!hands.some(h=>h.held))pourAnim(u.id)}else od(u)};
// ===== 5. Cầm nắm bằng grip trong VR =====
function grab(h){if(h.cool>0)return;h.gp.getWorldPosition(tmp);let best=null,bd=.2;
 for(const id in bots){bots[id].getWorldPosition(tm2);tm2.y+=.09;const d=tmp.distanceTo(tm2);if(d<bd){bd=d;best={b:bots[id]}}}
 if(!best)for(const o of pk){const u=o.userData;if(!u.act||u.act=='stir')continue;o.getWorldPosition(tm2);const d=tmp.distanceTo(tm2);if(d<bd){bd=d;best={u}}}
 if(!best)return;h.cool=.4;hap(h,.5,60);if(best.b){h.held=best.b;best.b.userData.ret=0;h.gp.attach(best.b)}else od(best.u)}
function drop(h){const g=h.held;if(!g)return;h.held=null;S.attach(g);g.updateWorldMatrix(true,false);g.getWorldPosition(tmp);
 if(tmp.y>.85&&Math.abs(tmp.x)<1.7&&tmp.z>-.7&&tmp.z<.3){g.quaternion.identity();g.position.set(tmp.x,.912,tmp.z);hap(h,.3,40)}else g.userData.ret=1}
// ===== 6. Vòng cập nhật mỗi khung hình (cả trong VR) =====
function upd(){const n=performance.now(),dt=Math.min(.05,(n-clock.t)/1000);clock.t=n;const vr=R.xr.isPresenting;stm.visible=false;
 for(let i=tw.length-1;i>=0;i--)if(tw[i](dt))tw.splice(i,1);
 for(const id in bots){const g=bots[id];if(g.userData.ret){const k=1-Math.exp(-dt*8);g.position.lerp(g.userData.hp,k);g.quaternion.slerp(g.userData.hq,k);if(g.position.distanceTo(g.userData.hp)<.004){g.position.copy(g.userData.hp);g.quaternion.copy(g.userData.hq);g.userData.ret=0}}}
 gG.visible=!gog;cG.visible=!coat;face.visible=!!gog;
 hands.forEach((h,i)=>{h.gv.visible=vr;h.gv.userData.cuff.visible=!!coat;h.cool=Math.max(0,h.cool-dt);const gp=h.src&&h.src.gamepad,b=gp&&gp.buttons;
  curl(h.gv,Math.max(h.held?.85:0,b&&b[1]?b[1].value:0),b&&b[0]?b[0].value:0);h.gp.getWorldPosition(tmp);h.vel=tmp.distanceTo(h.prev)/Math.max(dt,.001);h.prev.copy(tmp);
  if(h.held)pour(h.held,dt,h);
  if(hasRod&&!h.held&&b&&b[1]&&b[1].value>.5&&Math.hypot(tmp.x,tmp.z-bz0)<.1&&tmp.y>bY&&tmp.y<bY+bH+.2&&h.vel>.25){stirT=Math.max(stirT,.35);hap(h,.1,20)}
  if(gp&&vr){const x=gp.axes[2]||0,y=gp.axes[3]||0,left=h.src.handedness=='left';
   if(left&&(Math.abs(x)>.15||Math.abs(y)>.15)){C.getWorldDirection(tm2);tm2.y=0;tm2.normalize();rig.position.addScaledVector(tm2,-y*1.6*dt).x+=0;rig.position.x+=-tm2.z*x*1.6*dt;rig.position.z+=tm2.x*x*1.6*dt;rig.position.x=cl(rig.position.x,-3.8,3.8);rig.position.z=cl(rig.position.z,-2.3,3)}
   if(!left){if(Math.abs(x)>.7&&!h.snap){rig.rotation.y-=Math.sign(x)*PI/6;h.snap=1}else if(Math.abs(x)<.3)h.snap=0}}});
 ov.visible=!vr;if(!vr){const tm=n/1000,sw=Math.sin(tm*1.3)*.004,f=C.fov*PI/360,hh=.25*Math.tan(f),ww=hh*C.aspect;face.scale.set(Math.max(1,ww*2/.6),Math.max(1,hh*2/.3),1);
  gl.position.set(-.2,-.2+sw,-.45);gl.rotation.set(.5,.25,0);gl.userData.cuff.visible=!!coat;gr.userData.cuff.visible=!!coat;
  gr.position.set(.2-reach*.1,-.2+sw+reach*.08,-.45-reach*.1);gr.rotation.set(.5-reach*.2,-.25,0);curl(gl,.15,0);curl(gr,.15+curlD*.8,0)}
 else{face.scale.set(1,1.3,1)}}
const rr=R.render.bind(R);R.render=(s,c)=>{try{upd()}catch(e){errMsg(e)}rr(s,c)};
R.xr.addEventListener('sessionstart',()=>rig.position.set(0,0,.7));
}catch(e){errMsg(e)}})();
