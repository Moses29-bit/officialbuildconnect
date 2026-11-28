(()=>{
const root=document.getElementById('rtb');
if(!root||root.dataset.bound==='1')return;
root.dataset.bound='1';

const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover: hover) and (pointer: fine)').matches&&!reduce;
const BRAND=reduce?1500:3600;
const PROP=reduce?1900:4300;
const EXIT=reduce?220:1100;
const RUN=BRAND+PROP;

const STILLS={
  anticipate:'images/Ghanaian Construction Team Portrait.png',
  brand:'images/hero.jpg',
  proposition:'images/Build Connect Team at Work.png'
};
const LIVE={
  brand:'Build Connect Ventures. Skill. Labour. Opportunity.',
  proposition:'We connect the people who build the future. Connecting construction projects with skilled professionals, reliable labour, and meaningful opportunities.',
  home:'Build Connect Ventures homepage.'
};

const world=root.querySelector('.rtb-world');
const shots=[...root.querySelectorAll('.rtb-shot')];
const scenes=[...root.querySelectorAll('.rtb-scene')];
const film=document.getElementById('rtbFilm');
const audio=document.getElementById('rtbAudio');
const soundBtn=document.getElementById('rtbSound');
const soundLabel=document.getElementById('rtbSoundLabel');
const enterBtn=document.getElementById('rtbEnter');
const quietBtn=document.getElementById('rtbQuiet');
const skipBtn=document.getElementById('rtbSkip');
const meter=document.getElementById('rtbMeter');
const meterFill=meter.querySelector('span');
const live=document.getElementById('rtbLive');
const shell=[document.querySelector('header'),document.querySelector('main'),document.querySelector('footer'),document.getElementById('snd')].filter(Boolean);

const state={phase:'gate',scene:'anticipate',layer:0,raf:0,sound:false,audioReady:false,started:0};
const timers=new Set();
const unbind=[];
let removed=false;

function on(target,type,fn,opts){
  target.addEventListener(type,fn,opts);
  unbind.push(()=>target.removeEventListener(type,fn,opts));
}
function later(fn,ms){
  const id=setTimeout(()=>{timers.delete(id);fn()},ms);
  timers.add(id);
}
function clearTimers(){
  timers.forEach(clearTimeout);
  timers.clear();
  if(state.raf)cancelAnimationFrame(state.raf);
  state.raf=0;
}
function setProgress(ratio){
  const value=Math.max(0,Math.min(100,Math.round(ratio*100)));
  meterFill.style.width=value+'%';
  meter.setAttribute('aria-valuenow',String(value));
  meter.setAttribute('aria-valuetext',value+' percent');
}
function showStill(scene){
  const next=shots[state.layer^1];
  const prev=shots[state.layer];
  next.style.backgroundImage='url("'+STILLS[scene]+'")';
  next.style.backgroundPosition=scene==='proposition'?'center 28%':'center 32%';
  next.classList.add('is-show');
  prev.classList.remove('is-show');
  state.layer^=1;
}
function showScene(id){
  if(state.scene===id&&id!=='anticipate')return;
  state.scene=id;
  scenes.forEach(scene=>{
    const onScene=scene.dataset.scene===id;
    scene.classList.toggle('is-on',onScene);
    scene.setAttribute('aria-hidden',onScene?'false':'true');
    scene.inert=!onScene;
  });
  if(id!=='anticipate')showStill(id);
  root.classList.toggle('is-film',id==='brand'&&!reduce);
  if(film){
    if(id==='brand'&&!reduce){
      try{film.currentTime=0}catch(e){}
      film.play().catch(()=>root.classList.remove('is-film'));
    }else later(()=>{if(state.scene!=='brand')film.pause()},700);
  }
  if(LIVE[id])live.textContent=LIVE[id];
  const active=document.activeElement;
  if(active&&root.contains(active)&&active.closest('.rtb-scene:not(.is-on)'))skipBtn.focus({preventScroll:true});
}
function tabbables(){
  return [...root.querySelectorAll('button')].filter(el=>!el.disabled&&!el.closest('[inert]'));
}
function stopSound(){
  state.sound=false;
  soundBtn.setAttribute('aria-pressed','false');
  if(state.audioReady)soundLabel.textContent='Sound off';
  if(!audio||audio.paused)return;
  const from=audio.volume;
  const t0=performance.now();
  const fade=now=>{
    if(state.sound||!audio)return;
    const p=Math.min(1,(now-t0)/260);
    audio.volume=from*(1-p);
    if(p<1)requestAnimationFrame(fade);
    else{audio.pause();audio.volume=.55}
  };
  requestAnimationFrame(fade);
}
function startSound(){
  if(!state.audioReady||!state.sound||state.phase==='leaving'||state.phase==='done')return;
  audio.volume=0;
  audio.play().then(()=>{
    const t0=performance.now();
    const fade=now=>{
      if(!state.sound||!audio)return;
      const p=Math.min(1,(now-t0)/480);
      audio.volume=.55*p;
      if(p<1)requestAnimationFrame(fade);
    };
    requestAnimationFrame(fade);
  }).catch(()=>{
    state.sound=false;
    soundBtn.setAttribute('aria-pressed','false');
    soundLabel.textContent='Sound off';
  });
}
function toggleSound(){
  if(!state.audioReady||state.phase==='leaving'||state.phase==='done')return;
  state.sound=!state.sound;
  soundBtn.setAttribute('aria-pressed',state.sound?'true':'false');
  soundLabel.textContent=state.sound?'Sound on':'Sound off';
  if(state.sound)startSound();
  else stopSound();
}
function releasePage(){
  if(removed)return;
  removed=true;
  state.phase='done';
  clearTimers();
  unbind.forEach(fn=>fn());
  document.documentElement.classList.remove('rtb-pending');
  document.body.classList.add('go');
  shell.forEach(el=>{el.inert=false});
  if(film)film.pause();
  if(audio){audio.pause();audio.removeAttribute('src');audio.load()}
  root.remove();
  const home=document.querySelector('#nav .logo')||document.querySelector('h1');
  if(home)home.focus({preventScroll:true});
  scrollTo(0,0);
}
function exit(){
  if(state.phase==='leaving'||state.phase==='done')return;
  state.phase='leaving';
  clearTimers();
  stopSound();
  setProgress(1);
  root.classList.remove('is-film');
  root.classList.add('is-exit');
  live.textContent=LIVE.home;
  on(root,'transitionend',event=>{if(event.target===root&&event.propertyName==='opacity')releasePage()});
  later(releasePage,EXIT+120);
}
function frame(now){
  if(state.phase!=='playing')return;
  const t=now-state.started;
  setProgress(Math.min(1,t/RUN));
  const scene=t<BRAND?'brand':'proposition';
  if(scene!==state.scene)showScene(scene);
  if(t>=BRAND+PROP){exit();return}
  state.raf=requestAnimationFrame(frame);
}
function enterExperience(){
  if(state.phase!=='gate')return;
  state.phase='playing';
  state.started=performance.now();
  showScene('brand');
  state.raf=requestAnimationFrame(frame);
}
function enterQuiet(){
  if(state.phase!=='gate')return;
  setProgress(1);
  exit();
}

if(!reduce)root.classList.add('is-motion');
scenes.forEach(scene=>{scene.inert=scene.dataset.scene!=='anticipate'});
shell.forEach(el=>{el.inert=true});
setProgress(.08);
Object.values(STILLS).forEach(src=>{const img=new Image();img.src=src});

on(enterBtn,'click',enterExperience);
on(quietBtn,'click',enterQuiet);
on(skipBtn,'click',()=>{if(state.phase==='gate'||state.phase==='playing')exit()});
on(soundBtn,'click',toggleSound);
on(document,'keydown',event=>{
  if(state.phase==='leaving'||state.phase==='done')return;
  if(event.key==='Escape'){event.preventDefault();exit();return}
  if(event.key!=='Tab')return;
  const items=tabbables();
  if(!items.length)return;
  const first=items[0],last=items[items.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
});
on(window,'wheel',event=>{if(!removed)event.preventDefault()},{passive:false});
on(window,'touchmove',event=>{if(!removed)event.preventDefault()},{passive:false});
if(fine){
  on(window,'pointermove',event=>{
    if(removed)return;
    const x=(event.clientX/innerWidth-.5)*-16;
    const y=(event.clientY/innerHeight-.5)*-10;
    world.style.transform='translate3d('+x+'px,'+y+'px,0)';
  });
}
if(audio){
  const ready=()=>{
    if(state.audioReady)return;
    state.audioReady=true;
    soundBtn.disabled=false;
    soundLabel.textContent='Sound off';
  };
  on(audio,'canplay',ready);
  on(audio,'error',()=>{
    state.audioReady=false;
    state.sound=false;
    soundBtn.disabled=true;
    soundLabel.textContent='Sound unavailable';
  });
  if(audio.readyState>=2)ready();
}
enterBtn.focus({preventScroll:true});
})();
