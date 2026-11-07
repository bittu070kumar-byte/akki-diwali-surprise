/* Music starts only after the visitor taps, as required by mobile browsers. */
const audio=document.getElementById('song');
const begin=document.getElementById('begin');
const note=document.getElementById('musicNote');
const musicControl=document.getElementById('musicControl');
const musicToggle=document.getElementById('musicToggle');

begin.addEventListener('click',async()=>{
  try{await audio.play();begin.textContent='Enjoy the evening';note.textContent='Your song is playing in the background.';musicControl.classList.add('show');}
  catch(e){note.textContent='Tap once more to play your song.';}
  document.getElementById('lyrics').scrollIntoView({behavior:'smooth'});
});
musicToggle.addEventListener('click',async()=>{
  if(audio.paused){try{await audio.play();musicToggle.textContent='Pause music';}catch(e){musicToggle.textContent='Tap to play';}}
  else{audio.pause();musicToggle.textContent='Play music';}
});
audio.addEventListener('play',()=>musicToggle.textContent='Pause music');
audio.addEventListener('pause',()=>musicToggle.textContent='Play music');

/* Interactive diyas */
const teases=[
  'Careful… keep looking at me like that and I might forget the fireworks.',
  'I was going to make a wish, but then I remembered I already found you.',
  'That smile of yours deserves its own celebration.',
  'One little diya for the light, and one big crush for you.',
  'If I were there, I would save the first sparkler moment just for us.',
  'You make even the stars look a little less impressive.'
];
let teaseIndex=-1;
const diyaButtons=[...document.querySelectorAll('.diya-button')];
function lightDiya(button,showTease=true){
  const tease=button.parentElement.querySelector('.tease');
  const wasLit=button.classList.contains('diya-lit');
  button.classList.add('diya-lit');
  if(showTease&&!wasLit){teaseIndex=(teaseIndex+1)%teases.length;tease.textContent=teases[teaseIndex];tease.classList.add('visible');}
}
diyaButtons.forEach(button=>button.addEventListener('click',()=>lightDiya(button)));
document.getElementById('lightAll').addEventListener('click',()=>{
  diyaButtons.forEach(button=>lightDiya(button,false));
  const first=diyaButtons[0].parentElement.querySelector('.tease');
  first.textContent='All lit up… just like your talent for stealing the spotlight.';first.classList.add('visible');
});
document.getElementById('turnOff').addEventListener('click',()=>{
  diyaButtons.forEach(button=>{button.classList.remove('diya-lit');const tease=button.parentElement.querySelector('.tease');tease.textContent='';tease.classList.remove('visible');});
});

/* Lightweight fireworks: animation loop runs only while fireworks are active. */
const canvas=document.getElementById('realFireworksCanvas');
const ctx=canvas.getContext('2d',{alpha:true});
const burst=document.getElementById('burst');
let width=0,height=0,dpr=1,raf=0,lastFrame=0;
const rockets=[],particles=[];
const colors=['#ffd166','#ff8c42','#ff4d6d','#b388ff','#64d8ff','#fff1b8','#ff9fca','#a8ffcf'];
function resizeCanvas(){
  dpr=Math.min(window.devicePixelRatio||1,1.5);
  width=window.innerWidth;height=window.innerHeight;
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
resizeCanvas();
let resizeTimer;
window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(resizeCanvas,120);});
function launchRocket(x,targetY,color,scale=1){
  rockets.push({x,y:height+10,vx:(Math.random()-.5)*.8,vy:-(7+Math.random()*2),targetY,color,scale});
  startAnimation();
}
function explode(x,y,color,scale=1){
  const baseCount=window.innerWidth<600?65:95;
  const count=Math.round(baseCount*scale);
  for(let i=0;i<count;i++){
    const angle=Math.random()*Math.PI*2,speed=(1.1+Math.random()*4.4)*scale;
    particles.push({x,y,px:x,py:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:48+Math.random()*32,max:80,size:.8+Math.random()*1.3,color:Math.random()<.16?'#fff':color,gravity:.045});
  }
}
function launchPhuljhari(){
  // Ground fountain: a fan of bright upward sparks, not an aerial rocket.
  const originX=width*.5,originY=height*.78;
  for(let i=0;i<150;i++){
    const angle=-Math.PI+(Math.random()*Math.PI);
    const speed=2.4+Math.random()*5.2;
    const vx=Math.cos(angle)*speed*.62+(Math.random()-.5)*.8;
    const vy=-Math.abs(Math.sin(angle))*speed-1.5;
    const color=['#fff4c2','#ffd166','#ffad42','#fff'][Math.floor(Math.random()*4)];
    particles.push({x:originX+(Math.random()-.5)*10,y:originY,px:originX,py:originY,vx,vy,life:24+Math.random()*24,max:48,size:.8+Math.random()*1.5,color,gravity:.13});
  }
  startAnimation();
}
function launchFirework(type){
  burst.replaceChildren();
  const names={phuljhari:'A sparkling fountain of light',rocket:'One rocket, one brilliant burst',skyshot:'A volley of colourful sky shots',finale:'A Diwali night to remember'};
  const label=document.createElement('div');label.className='firework-label';label.textContent=names[type];burst.appendChild(label);
  if(type==='phuljhari'){launchPhuljhari();return;}
  if(type==='rocket'){
    launchRocket(width*.5,height*.2,'#ffb347',1.35);
    return;
  }
  if(type==='skyshot'){
    const shots=[{x:width*.27,y:height*.24,color:'#64d8ff'},{x:width*.5,y:height*.15,color:'#ff4d6d'},{x:width*.73,y:height*.28,color:'#b388ff'}];
    shots.forEach((shot,i)=>setTimeout(()=>launchRocket(shot.x,shot.y,shot.color,.72),i*360));
    return;
  }
  // Grand finale: preserve the multi-rocket sequence.
  for(let i=0;i<5;i++){
    const x=width*(.15+Math.random()*.7),targetY=height*(.13+Math.random()*.35),color=colors[Math.floor(Math.random()*colors.length)];
    setTimeout(()=>launchRocket(x,targetY,color,1),i*220);
  }
  for(let i=0;i<3;i++)setTimeout(()=>launchRocket(width*(.15+Math.random()*.7),height*(.12+Math.random()*.3),colors[Math.floor(Math.random()*colors.length)],1.05),700+i*260);
}
document.querySelectorAll('.cracker').forEach(button=>button.addEventListener('click',()=>launchFirework(button.dataset.fire)));
function startAnimation(){if(!raf)raf=requestAnimationFrame(animateFireworks);}
function animateFireworks(timestamp){
  raf=0;
  const delta=lastFrame?Math.min((timestamp-lastFrame)/16.67,2):1;lastFrame=timestamp;
  ctx.clearRect(0,0,width,height);
  ctx.globalCompositeOperation='lighter';
  for(let i=rockets.length-1;i>=0;i--){
    const r=rockets[i];r.x+=r.vx*delta;r.y+=r.vy*delta;r.vy+=.045*delta;
    ctx.beginPath();ctx.moveTo(r.x,r.y+8);ctx.lineTo(r.x-r.vx*2,r.y+20);
    ctx.strokeStyle=r.color;ctx.lineWidth=2;ctx.stroke();
    if(r.y<=r.targetY||r.vy>=-1){explode(r.x,r.y,r.color,r.scale||1);rockets.splice(i,1);}
  }
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];p.px=p.x;p.py=p.y;p.x+=p.vx*delta;p.y+=p.vy*delta;
    p.vx*=Math.pow(.986,delta);p.vy=p.vy*Math.pow(.986,delta)+p.gravity*delta;p.life-=delta;
    ctx.globalAlpha=Math.max(0,p.life/p.max);
    ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(p.x,p.y);
    ctx.strokeStyle=p.color;ctx.lineWidth=p.size;ctx.stroke();
    if(p.life<=0)particles.splice(i,1);
  }
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  if(rockets.length||particles.length){raf=requestAnimationFrame(animateFireworks);}
  else{lastFrame=0;ctx.clearRect(0,0,width,height);}
}
document.getElementById('openMessage').addEventListener('click',()=>{
  const card=document.getElementById('messageCard');card.classList.add('open');
  document.getElementById('openMessage').textContent='A little note, just for you';
  card.scrollIntoView({behavior:'smooth',block:'center'});
});

/* Reveal the invitation after the visitor has viewed the open message. */
const messageCardForReveal=document.getElementById('messageCard');
const memoryInvitation=document.getElementById('memoryInvitation');
const memoryReveal=document.getElementById('memoryReveal');
const revealMemoriesButton=document.getElementById('revealMemories');
if(messageCardForReveal&&memoryInvitation){
  if('IntersectionObserver' in window){
    const messageObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting&&messageCardForReveal.classList.contains('open')){
          memoryInvitation.hidden=false;
          messageObserver.disconnect();
        }
      });
    },{threshold:.6});
    messageObserver.observe(messageCardForReveal);
  }else{
    document.getElementById('openMessage').addEventListener('click',()=>setTimeout(()=>{memoryInvitation.hidden=false;},900));
  }
}
if(revealMemoriesButton&&memoryReveal){
  revealMemoriesButton.addEventListener('click',()=>{
    memoryReveal.classList.add('visible');
    memoryReveal.setAttribute('aria-hidden','false');
    revealMemoriesButton.setAttribute('aria-expanded','true');
    revealMemoriesButton.textContent='Your surprise is here';
    memoryReveal.scrollIntoView({behavior:'smooth',block:'start'});
  });
}
