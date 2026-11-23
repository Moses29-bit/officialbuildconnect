(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
// ---------- intro: start gate -> sound + video + build sequence ----------
history.scrollRestoration='manual';scrollTo(0,0);
const boot=$('#boot'),brandVideo=$('#brandVideo');let done=false,begun=false,siteMediaStarted=false,introSoundOn=false,siteSoundAfterIntro=false,A=null;
function playMedia(video,label){video.play().catch(error=>console.warn(label+' could not be played:',error))}
function startSiteMedia(){if(calm)return;siteMediaStarted=true;
 if(brandVideo)playMedia(brandVideo,'Brand animation')}
startSiteMedia();
const finish=()=>{if(done)return;done=true;if(introSoundOn)setIntroSnd(false);
 if(A){const intro=A;setTimeout(()=>intro.stop().then(()=>{if(A===intro)A=null}).catch(error=>console.warn('Opening audio could not be stopped:',error)),450)}
 startSiteMedia();boot.classList.add('out');setTimeout(()=>document.body.classList.add('go'),250);
 if(siteSoundAfterIntro)setTimeout(()=>{siteMusic.currentTime=0;setSiteSound(true)},1250);
 setTimeout(()=>{boot.remove();document.body.classList.remove('lock')},1500)};
function armExit(){let ok=false,y0=0;setTimeout(()=>{ok=true;const cue=$('#cue');if(cue)cue.classList.add('show')},2200);const go=()=>{if(ok&&!done)finish()};
 addEventListener('wheel',e=>{if(!done&&Math.abs(e.deltaY)>6)go()},{passive:true});
 addEventListener('touchstart',e=>{y0=e.touches[0].clientY},{passive:true});
 addEventListener('touchmove',e=>{if(!done&&Math.abs(e.touches[0].clientY-y0)>30)go()},{passive:true});
 addEventListener('keydown',e=>{if(!done&&[' ','ArrowDown','ArrowUp','PageDown','PageUp','End','Home'].includes(e.key)){e.preventDefault();go()}});
 $('#cue').addEventListener('click',go)}
function begin(withSound){if(begun)return;begun=true;siteSoundAfterIntro=withSound;const t0=performance.now(),video=$('#bvid');
 boot.classList.remove('gate');boot.classList.add('play','has-vid');$('.sc',boot).setAttribute('preserveAspectRatio',innerWidth/innerHeight>1.2?'xMidYMid slice':'xMidYMid meet');
 video.play().catch(error=>{boot.classList.remove('has-vid');console.error('Intro video could not be played:',error)});
 if(withSound){prepareSiteSound();setIntroSnd(true).then(()=>{if(A&&!done){A.startup();A.scene(t0)}})}armExit()}
if(calm){boot.remove();document.body.classList.add('go')}
else{document.body.classList.add('lock');
$('#start').addEventListener('click',()=>begin(true));$('#quiet').addEventListener('click',()=>begin(false));
$('#skip').addEventListener('click',finish);addEventListener('keydown',e=>{if(e.key==='Escape')finish()});$('#start').focus({preventScroll:true})}

// nav state + scroll progress
const nav=$('#nav'),bar=$('#progress');
addEventListener('scroll',()=>{const h=document.documentElement;nav.classList.toggle('solid',scrollY>40);bar.style.width=(scrollY/(h.scrollHeight-innerHeight)*100)+'%'},{passive:true});
// rotating hero word
const cy=$('#cycle'),words=['workers','crews','materials','discipline'];let w=0;
if(!calm)setInterval(()=>{cy.classList.add('out');setTimeout(()=>{cy.textContent=words[w=++w%words.length];cy.classList.remove('out')},350)},3200);
// reveal on scroll
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15});
$$('[data-reveal]').forEach(el=>io.observe(el));
// tabs
const tabs=$$('.tablist button'),panels=$$('.panel');
tabs.forEach((t,i)=>t.addEventListener('click',()=>{tabs.forEach((b,j)=>{b.setAttribute('aria-selected',i===j);panels[j].hidden=i!==j})}));
const servicesFilm=$('#servicesFilm'),servicesVideo=$('#servicesVideo');
servicesVideo.addEventListener('play',()=>{servicesFilm.classList.add('is-playing');if(siteSoundOn&&siteAudio)siteAudio.duck(.06)});
servicesVideo.addEventListener('pause',()=>{servicesFilm.classList.remove('is-playing');if(siteSoundOn&&siteAudio)siteAudio.duck(.55)});
servicesVideo.addEventListener('ended',()=>{if(siteSoundOn&&siteAudio)siteAudio.duck(.55)});
$('#playServicesVideo').addEventListener('click',()=>servicesVideo.play().catch(error=>console.error('Services video could not be played:',error)));
// drag row
const d=$('#drag');let down=false,sx=0,sl=0;
d.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;down=true;d.classList.add('on');sx=e.clientX;sl=d.scrollLeft});
addEventListener('pointerup',()=>{down=false;d.classList.remove('on')});
addEventListener('pointermove',e=>{if(down)d.scrollLeft=sl-(e.clientX-sx)});
d.addEventListener('keydown',e=>{if(e.key==='ArrowRight')d.scrollBy({left:300,behavior:'smooth'});if(e.key==='ArrowLeft')d.scrollBy({left:-300,behavior:'smooth'})});
// team: scroll-driven sequence
const tm=$('#team'),tt=$$('.t-tabs button',tm),ti=$$('.t-img',tm),tx=$$('.t-info',tm);let cur=0;
const setT=i=>{if(i===cur)return;ti.forEach(e=>e.classList.remove('prev'));ti[cur].classList.replace('on','prev');ti[i].classList.remove('prev');ti[i].classList.add('on');
tx.forEach((e,j)=>e.classList.toggle('on',j===i));tt.forEach((b,j)=>b.setAttribute('aria-selected',j===i));cur=i;siteEffect('select',0)};
const span=()=>tm.offsetHeight-innerHeight;
const upd=()=>{const p=Math.min(.9999,Math.max(0,-tm.getBoundingClientRect().top/span())),n=tt.length,i=Math.floor(p*n);setT(i);
tt.forEach((b,j)=>b.style.setProperty('--p',j<i?1:j>i?0:p*n-i))};
addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
tt.forEach((b,i)=>b.addEventListener('click',()=>scrollTo({top:tm.offsetTop+span()*(i+.5)/tt.length})));
// testimonials
const q=$$('#quotes blockquote');let qi=0;
const nextQ=()=>{q[qi].classList.remove('on');qi=(qi+1)%q.length;q[qi].classList.add('on')};
$('#quotes').addEventListener('click',nextQ);if(!calm)setInterval(nextQ,6500);
// ---------- intro-only construction audio + optional site soundscape ----------
const VOL=.9,introBtn=$('#bsound');let introSuspendTimer=null;
function build(){
 const ctx=new(window.AudioContext||window.webkitAudioContext)(),master=ctx.createGain(),comp=ctx.createDynamicsCompressor();
 master.gain.value=0;comp.threshold.value=-24;comp.knee.value=6;comp.ratio.value=12;comp.attack.value=.002;comp.release.value=.15;const out=ctx.createGain();out.gain.value=.7;master.connect(comp);comp.connect(out);out.connect(ctx.destination);
 const bus=ctx.createGain(),dl=ctx.createDelay(),fb=ctx.createGain(),wet=ctx.createGain();   // open-air echo
 dl.delayTime.value=.23;fb.gain.value=.35;wet.gain.value=.28;bus.connect(master);bus.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(master);
 const mk=k=>{const n=ctx.sampleRate*2,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;d[i]=k?(l=(l+.02*w)/1.02)*3.5:w}return b};
 const brown=mk(1),white=mk(0),nz=(b,loop)=>{const x=ctx.createBufferSource();x.buffer=b;x.loop=loop;return x};
 const flt=(t,f,q=1)=>{const x=ctx.createBiquadFilter();x.type=t;x.frequency.value=f;x.Q.value=q;return x};
 const chain=(...n)=>n.reduce((a,b)=>(a.connect(b),b));
 const pan=p=>{const x=ctx.createStereoPanner();x.pan.value=Math.max(-1,Math.min(1,p));x.connect(bus);return x};
 const env=(g,t,v,d,a=.002)=>{g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0005,t+d)};
 const rnd=(a,b)=>a+Math.random()*(b-a),P=()=>rnd(-.7,.7);
 // Keep the low engine bed behind the intro's clearer construction sounds.
 const engineBus=ctx.createGain(),eng=ctx.createOscillator(),eg=ctx.createGain(),chug=ctx.createOscillator(),cg=ctx.createGain();
 engineBus.gain.value=.32;engineBus.connect(master);
 eng.type='sawtooth';eng.frequency.value=46;eg.gain.value=.18;chug.frequency.value=11;cg.gain.value=.08;
 chain(eng,flt('lowpass',160,.7),eg,engineBus);chug.connect(cg);cg.connect(eg.gain);eng.start();chug.start();
 const r=nz(brown,true),rg=ctx.createGain(),lfo=ctx.createOscillator(),lg=ctx.createGain();rg.gain.value=.35;lfo.frequency.value=.12;lg.gain.value=.14;
 chain(r,flt('lowpass',200),rg,engineBus);lfo.connect(lg);lg.connect(rg.gain);r.start();lfo.start();
 const air=nz(white,true),ag=ctx.createGain();ag.gain.value=.025;chain(air,flt('bandpass',900,.5),ag,master);air.start();
 // hammer strike: noise snap + metal pings + body thump
 const hit=(t,v=.6,p=0,k=1)=>{const o=pan(p),s=nz(white,false),g=ctx.createGain();env(g,t,v,.05);chain(s,flt('highpass',1200),g,o);s.start(t,Math.random(),.08);
  [[780,.55,.16],[2150,.35,.1],[3600,.18,.06]].forEach(([f,a,d])=>{const x=ctx.createOscillator(),xg=ctx.createGain();x.frequency.value=f*k*rnd(.97,1.03);env(xg,t,v*a,d);chain(x,xg,o);x.start(t);x.stop(t+d+.05)});
  const th=ctx.createOscillator(),tg=ctx.createGain();th.frequency.setValueAtTime(150*k,t);th.frequency.exponentialRampToValueAtTime(60,t+.06);env(tg,t,v*.9,.09);chain(th,tg,o);th.start(t);th.stop(t+.12)};
 const hammer=(t,p)=>{let x=t,gap=.34;const n=4+Math.floor(Math.random()*4);for(let i=0;i<n;i++){hit(x,i===n-1?.9:.55,p);x+=gap;gap=Math.max(.15,gap*.82)}};
 const saw=(t,p)=>{const o=pan(p),d=rnd(1.4,2.6),x=ctx.createOscillator(),xg=ctx.createGain(),s=nz(white,true),sg=ctx.createGain(),ramp=(g,v)=>{g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.3);g.gain.setValueAtTime(v,t+d-.3);g.gain.exponentialRampToValueAtTime(.0005,t+d)};
  x.type='sawtooth';x.frequency.setValueAtTime(260,t);x.frequency.exponentialRampToValueAtTime(520,t+.35);x.frequency.setValueAtTime(520,t+d-.3);x.frequency.exponentialRampToValueAtTime(240,t+d);
  ramp(xg,.16);ramp(sg,.35);chain(x,flt('lowpass',2400),xg,o);chain(s,flt('bandpass',3200,1.2),sg,o);x.start(t);x.stop(t+d+.05);s.start(t);s.stop(t+d+.05)};
 const drill=(t,p,n=3)=>{const o=pan(p);for(let i=0;i<n;i++){const s=t+i*.55,x=ctx.createOscillator(),g=ctx.createGain();x.type='square';
  x.frequency.setValueAtTime(140,s);x.frequency.exponentialRampToValueAtTime(330,s+.12);x.frequency.setValueAtTime(330,s+.4);x.frequency.exponentialRampToValueAtTime(170,s+.45);
  g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(.13,s+.1);g.gain.setValueAtTime(.13,s+.38);g.gain.exponentialRampToValueAtTime(.0005,s+.45);chain(x,flt('lowpass',1800),g,o);x.start(s);x.stop(s+.5)}};
 const beeps=(t,p,n=6)=>{const o=pan(p);for(let i=0;i<n;i++){const s=t+i*.5,x=ctx.createOscillator(),g=ctx.createGain();x.type='square';x.frequency.value=1000;
  g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(.07,s+.01);g.gain.setValueAtTime(.07,s+.23);g.gain.exponentialRampToValueAtTime(.0005,s+.25);chain(x,flt('lowpass',2600),g,o);x.start(s);x.stop(s+.3)}};
 const jack=(t,p)=>{const o=pan(p);for(let i=0;i<34;i++){const s=t+i*.045,g=ctx.createGain(),n=nz(white,false),x=ctx.createOscillator(),xg=ctx.createGain();
  env(g,s,.3,.04);chain(n,flt('lowpass',1100),g,o);n.start(s,Math.random(),.05);x.frequency.value=65;env(xg,s,.35,.05);chain(x,xg,o);x.start(s);x.stop(s+.06)}};
 const scrape=(t,p=0)=>{const n=nz(white,true),bp=flt('bandpass',700,2),g=ctx.createGain();bp.frequency.setValueAtTime(700,t);bp.frequency.exponentialRampToValueAtTime(2600,t+.5);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.12,t+.08);g.gain.exponentialRampToValueAtTime(.0005,t+.5);chain(n,bp,g,pan(p));n.start(t);n.stop(t+.55)};
 const tick=(t,p=0,v=.25)=>{const n=nz(white,false),g=ctx.createGain();env(g,t,v,.02,.001);chain(n,flt('highpass',3500),g,pan(p));n.start(t,Math.random(),.03)};
 const ratchet=(t,p=0)=>{for(let i=0;i<5;i++)tick(t+i*(.04-i*.004),p,.2)};
 // "start work": engine fires up with three hammer blows
 const timers=[];let hold=0,sv=0,scripted=false;
 const startup=()=>{const t=ctx.currentTime;hold=t+1.9;eng.frequency.cancelScheduledValues(t);eng.frequency.setValueAtTime(20,t);eng.frequency.exponentialRampToValueAtTime(70,t+.9);eng.frequency.exponentialRampToValueAtTime(46,t+1.8);
  chug.frequency.cancelScheduledValues(t);chug.frequency.setValueAtTime(5,t);chug.frequency.linearRampToValueAtTime(18,t+.9);chug.frequency.linearRampToValueAtTime(11,t+1.8);[0,.18,.36].forEach((d,i)=>hit(t+.05+d,.7+i*.1,(i-1)*.4,1+i*.12))};
 const hyd=(t,d,f0,f1)=>{const x=ctx.createOscillator(),g=ctx.createGain(),n=nz(white,true),ng=ctx.createGain(),o=pan(0);x.type='sawtooth';x.frequency.setValueAtTime(f0,t);x.frequency.exponentialRampToValueAtTime(f1,t+d);
  [g,ng].forEach((q,i)=>{const v=i?.05:.07;q.gain.setValueAtTime(.0001,t);q.gain.exponentialRampToValueAtTime(v,t+.12);q.gain.setValueAtTime(v,t+d-.12);q.gain.exponentialRampToValueAtTime(.0005,t+d)});
  chain(x,flt('lowpass',500),g,o);chain(n,flt('bandpass',1400,.8),ng,o);x.start(t);x.stop(t+d+.05);n.start(t);n.stop(t+d+.05)};
 const thump=(t,v=.9)=>{const x=ctx.createOscillator(),g=ctx.createGain(),n=nz(white,false),ng=ctx.createGain(),o=pan(0);x.frequency.setValueAtTime(110,t);x.frequency.exponentialRampToValueAtTime(40,t+.18);
  env(g,t,v,.3);env(ng,t,v*.5,.28);chain(x,g,o);chain(n,flt('lowpass',1200),ng,o);x.start(t);x.stop(t+.35);n.start(t,Math.random(),.3)};
 const dump=t=>{const n=nz(white,false),g=ctx.createGain();env(g,t,.32,.9,.06);chain(n,flt('lowpass',3000),g,pan(.3));n.start(t,Math.random(),1);for(let i=0;i<10;i++)tick(t+.1+i*.07+Math.random()*.04,.3,.12);thump(t+.62,.45)};
 const clank=t=>[[520,.5],[1330,.3],[2210,.2]].forEach(([f,v])=>{const x=ctx.createOscillator(),g=ctx.createGain();x.frequency.value=f;env(g,t,v*.2,.9);chain(x,g,pan(.2));x.start(t);x.stop(t+1)});
 // the excavator film's soundtrack, on the same clock as the animation (two 4s dig cycles)
 const intro=D=>{const t0=ctx.currentTime;scripted=true;hold=t0+D;setTimeout(()=>{scripted=false},D*1000);
  for(let c=0;c<2;c++){const s=t0+c*4;hyd(s,.95,120,240);thump(s+1);scrape(s+1,-.2);scrape(s+1.3,-.2);
   eng.frequency.setTargetAtTime(66,s+1,.12);chug.frequency.setTargetAtTime(17,s+1,.12);eng.frequency.setTargetAtTime(46,s+2.3,.2);chug.frequency.setTargetAtTime(11,s+2.3,.2);
   hyd(s+1.8,1,200,330);hyd(s+2.85,.4,260,150);dump(s+3.12);clank(s+3.6)}
  master.gain.setTargetAtTime(0,t0+D-.9,.2)};
 // excavator soundtrack, locked to the animation's 4s dig cycle and repeated for as long as the scene plays
 const hyO=ctx.createOscillator(),hyG=ctx.createGain(),hyN=nz(white,true),hnG=ctx.createGain(),tr=ctx.createOscillator(),trG=ctx.createGain(),trL=ctx.createOscillator(),trLG=ctx.createGain();
 hyO.type='sawtooth';hyO.frequency.value=140;hyG.gain.value=0;hnG.gain.value=0;tr.type='sawtooth';tr.frequency.value=38;trG.gain.value=0;trL.frequency.value=6.5;trLG.gain.value=.03;
 chain(hyO,flt('lowpass',650),hyG,master);chain(hyN,flt('bandpass',1100,.9),hnG,master);chain(tr,flt('lowpass',120),trG,master);trL.connect(trLG);trLG.connect(trG.gain);
 hyO.start();hyN.start();tr.start();trL.start();
 const MOTC=[.6,.8,.8,.7,.9,.9,.6,.5,.7,.9,.9,.8,.9,.6,.4,.3];   // how hard the machine works in each quarter-second of the cycle
 const scene=t0=>{const base=ctx.currentTime-(performance.now()-t0)/1000;let c=0;   // base = audio-clock time when the animation began
  const sched=k=>{const a=x=>Math.max(base+k*4+x,ctx.currentTime);hyd(a(0),.95,120,240);thump(a(1));scrape(a(1),-.2);scrape(a(1.3),-.2);hyd(a(1.8),1,200,330);hyd(a(2.85),.4,260,150);dump(a(3.12));clank(a(3.6))};
  const id=setInterval(()=>{const t=ctx.currentTime;
   if(!introSoundOn||done){clearInterval(id);hyG.gain.setTargetAtTime(0,t,.2);hnG.gain.setTargetAtTime(0,t,.2);trG.gain.setTargetAtTime(0,t,.3);return}
   while(base+c*4<t+.6){const k=c++;sched(k)}
   const m=MOTC[Math.min(15,Math.floor((((t-base)%4)+4)%4*4))];
   hyG.gain.setTargetAtTime(.015+m*.07,t,.1);hnG.gain.setTargetAtTime(.01+m*.05,t,.1);hyO.frequency.setTargetAtTime(110+m*160,t,.1);trG.gain.setTargetAtTime(.07,t,.3);sv=Math.max(sv,m*.9)},80);timers.push(id)};
 const t0=ctx.currentTime;let nx={h:t0+1.4,s:t0+7,d:t0+12,b:t0+21,j:t0+34,c:t0+9};
 const ambientTimer=setInterval(()=>{if(!introSoundOn||ctx.state!=='running'||scripted){if(!introSoundOn)clearInterval(ambientTimer);return}const t=ctx.currentTime;
  if(t>=nx.h){hammer(t+.05,P());nx.h=t+rnd(3.5,7)}if(t>=nx.s){saw(t+.05,P());nx.s=t+rnd(14,26)}if(t>=nx.d){drill(t+.05,P());nx.d=t+rnd(16,32)}
  if(t>=nx.b){beeps(t+.05,P());nx.b=t+rnd(28,48)}if(t>=nx.j){jack(t+.05,P());nx.j=t+rnd(40,65)}if(t>=nx.c){scrape(t+.05,P());nx.c=t+rnd(8,15)}
  if(t>hold){eng.frequency.setTargetAtTime(46+sv*24,t,.12);chug.frequency.setTargetAtTime(11+sv*8,t,.12)}sv*=.7},120);timers.push(ambientTimer);
 return{scene,intro,ctx,master,hit,drill,scrape,ratchet,tick,startup,rev:v=>{sv=Math.max(sv,v)},stop:()=>{timers.forEach(clearInterval);return ctx.close()}}}
async function setIntroSnd(v){introSoundOn=v;
 if(introSuspendTimer){clearTimeout(introSuspendTimer);introSuspendTimer=null}
 if(v&&begun){if(!A)A=build();await A.ctx.resume();if(introSoundOn)A.master.gain.setTargetAtTime(VOL,A.ctx.currentTime,.4)}
 else if(A){A.master.gain.setTargetAtTime(0,A.ctx.currentTime,.12);if(!done)introSuspendTimer=setTimeout(()=>{if(!introSoundOn&&A)A.ctx.suspend()},500)}
 introBtn.setAttribute('aria-pressed',v);introBtn.querySelector('span').textContent=v?'Intro sound on':'Intro sound off';document.body.classList.toggle('intro-snd-on',v)}
introBtn.addEventListener('click',()=>setIntroSnd(!introSoundOn));
const siteMusic=$('#siteMusic');let siteAudio=null,siteSoundOn=false,siteSuspendTimer=null;
function buildSiteAudio(){
 const ctx=new(window.AudioContext||window.webkitAudioContext)(),master=ctx.createGain(),compressor=ctx.createDynamicsCompressor();
 master.gain.value=0;compressor.threshold.value=-22;compressor.knee.value=12;compressor.ratio.value=3;compressor.attack.value=.02;compressor.release.value=.35;
 master.connect(compressor);compressor.connect(ctx.destination);
 const musicGain=ctx.createGain();musicGain.gain.value=0;
 ctx.createMediaElementSource(siteMusic).connect(musicGain);musicGain.connect(master);
 const playTone=(frequency,delay,duration,volume,pan=0)=>{
  const start=ctx.currentTime+delay,osc=ctx.createOscillator(),gain=ctx.createGain(),panner=ctx.createStereoPanner();
  osc.type='sine';osc.frequency.setValueAtTime(frequency,start);panner.pan.value=Math.max(-1,Math.min(1,pan));
  gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(volume,start+.07);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  osc.connect(gain);gain.connect(panner);panner.connect(master);osc.start(start);osc.stop(start+duration+.04)
 };
 return{ctx,master,hover:p=>playTone(659.25,0,.22,.025,p),tap:p=>{playTone(523.25,0,.3,.045,p);playTone(659.25,.08,.4,.03,p)},
  select:p=>{playTone(587.33,0,.35,.04,p);playTone(783.99,.12,.45,.03,p)},
  scroll:p=>{playTone(392,0,.36,.025,p);playTone(523.25,.12,.45,.022,p)},
  musicGain,duck:v=>musicGain.gain.setTargetAtTime(v,ctx.currentTime,.5)}
}
function prepareSiteSound(){
 if(!siteAudio)siteAudio=buildSiteAudio();
 siteMusic.currentTime=0;
 siteMusic.play().catch(error=>console.warn('Website music could not be played:',error));
 siteAudio.ctx.resume().catch(error=>console.warn('Website sound could not be prepared:',error))
}
async function setSiteSound(v){siteSoundOn=v;
 if(siteSuspendTimer){clearTimeout(siteSuspendTimer);siteSuspendTimer=null}
 if(v){
  if(!siteAudio)siteAudio=buildSiteAudio();
  siteMusic.play().catch(error=>console.warn('Website music could not be played:',error));
  await siteAudio.ctx.resume();
  if(siteSoundOn){siteAudio.master.gain.setTargetAtTime(.8,siteAudio.ctx.currentTime,.5);siteAudio.musicGain.gain.setTargetAtTime(servicesVideo && !servicesVideo.paused ? .06 : .55,siteAudio.ctx.currentTime,1.2)}
 }else if(siteAudio){
  siteAudio.master.gain.setTargetAtTime(0,siteAudio.ctx.currentTime,.3);
  siteSuspendTimer=setTimeout(()=>{if(!siteSoundOn&&siteAudio){siteMusic.pause();siteAudio.ctx.suspend()}},550)
 }
 const button=$('#snd');button.setAttribute('aria-pressed',v);button.querySelector('span').textContent=v?'Site music on':'Site music off';document.body.classList.toggle('site-snd-on',v)}
$('#snd').addEventListener('click',()=>setSiteSound(!siteSoundOn));
function siteEffect(effect,pan=0){if(siteSoundOn&&siteAudio)siteAudio[effect](pan)}
document.addEventListener('visibilitychange',()=>{if(A&&introSoundOn&&!done)document.hidden?A.ctx.suspend():A.ctx.resume();
 if(siteAudio&&siteSoundOn){
  if(document.hidden){siteMusic.pause();siteAudio.ctx.suspend()}
  else siteAudio.ctx.resume().then(()=>siteMusic.play()).catch(error=>console.warn('Website music could not be resumed:',error))
 }
 if(document.hidden){if(brandVideo)brandVideo.pause()}
 else if(siteMediaStarted&&brandVideo)playMedia(brandVideo,'Brand animation')});
let lastHovered=null,lastSiteSoundAt=0,lastSoundScrollY=scrollY;
document.addEventListener('pointerover',e=>{if(!siteSoundOn||document.body.classList.contains('lock'))return;
 const el=e.target.closest('.card,.step,.btn,nav a,.sb,.t-tabs button,.tablist button,.services-film-overlay button,#skip,#start');
 if(!el||el===lastHovered)return;lastHovered=el;const now=performance.now();if(now-lastSiteSoundAt<180)return;lastSiteSoundAt=now;
 siteEffect('hover',(e.clientX/innerWidth-.5)*1.2)});
document.addEventListener('pointerdown',e=>{if(!siteSoundOn||document.body.classList.contains('lock')||e.target.closest('#snd'))return;
 siteEffect('tap',(e.clientX/innerWidth-.5)*1.2)});
addEventListener('scroll',()=>{const moved=scrollY-lastSoundScrollY;if(Math.abs(moved)>=420){lastSoundScrollY=scrollY;siteEffect('scroll',Math.sign(moved)*.25)}},{passive:true});
// custom cursor (native cursor stays visible)
const c=$('#cursor');
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!calm){
addEventListener('pointermove',e=>{c.style.opacity=1;c.style.transform=`translate(${e.clientX}px,${e.clientY}px)`});
document.addEventListener('pointerover',e=>c.classList.toggle('big',!!e.target.closest('a,button,.card,.step')));}
// contact form -> opens the visitor's email app (no backend needed)
$('#form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);
location.href='mailto:buildconnect1414@gmail.com?subject='+encodeURIComponent('Request from '+f.get('n'))+'&body='+encodeURIComponent(f.get('m')+'\n\nContact: '+f.get('c'))});
})();
