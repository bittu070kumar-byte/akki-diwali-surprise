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
'Itni roshni toh tumhare nakhron mein bhi nahi hai.',
'Ek diya tumhare liye… baaki meri patience ke liye.',
'Tumhari smile ke saamne yeh roshni bhi thodi kam hai.',
'Ab ghar roshan hai, bas tumhara reply pending hai.',
'Diya jal gaya, ab attitude thoda dim kar do.',
'Tum ho toh festival, warna bas holiday.'
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
function launchRocket(x,targetY,color){
  rockets.push({x,y:height+10,vx:(Math.random()-.5)*.8,vy:-(7+Math.random()*2),targetY,color});
  startAnimation();
}
function explode(x,y,color,scale=1){
  const count=window.innerWidth<600?65:95;
  for(let i=0;i<count;i++){
    const angle=Math.random()*Math.PI*2,speed=(1.1+Math.random()*4.4)*scale;
    particles.push({x,y,px:x,py:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:55+Math.random()*30,max:85,size:.8+Math.random()*1.3,color:Math.random()<.16?'#fff':color,gravity:.045});
  }
}
function launchFirework(type){
  burst.replaceChildren();
  const names={phuljhari:'A little shower of light',rocket:'Straight into the night',skyshot:'A sky full of sparkle',finale:'A Diwali night to remember'};
  const label=document.createElement('div');label.className='firework-label';label.textContent=names[type];burst.appendChild(label);
  const count=type==='finale'?5:type==='phuljhari'?1:2;
  for(let i=0;i<count;i++){
    const x=width*(.15+Math.random()*.7),targetY=height*(.13+Math.random()*.35),color=colors[Math.floor(Math.random()*colors.length)];
    setTimeout(()=>launchRocket(x,targetY,color),i*220);
  }
  if(type==='finale')for(let i=0;i<3;i++)setTimeout(()=>launchRocket(width*(.15+Math.random()*.7),height*(.12+Math.random()*.3),colors[Math.floor(Math.random()*colors.length)]),700+i*260);
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
    if(r.y<=r.targetY||r.vy>=-1){explode(r.x,r.y,r.color);rockets.splice(i,1);}
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
