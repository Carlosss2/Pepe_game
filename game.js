// ============================================================
//  CONFIGURACIONES GENERALES DEL MOTOR
// ============================================================
const W = 800, H = 300;
const GRAVITY = 1850;
const JUMP_VEL = -640;
const BASE_SPEED = 260;
const MAX_SPEED = 680;
const SPEED_INCR = 2.5;
const THEME_CHANGE_EVERY = 600;

const MILESTONES = [
  {score:100,name:'¡Primeros pasos!'},
  {score:250,name:'¡Salto experto!'},
  {score:500,name:'¡Aventurero!'},
  {score:1000,name:'¡Super Cerdo!'},
  {score:2000,name:'¡Legendario!'},
  {score:3500,name:'¡Imparable!'},
  {score:5000,name:'¡Inmortal!'},
  {score:10000,name:'¡Dios del Salto!'},
];

// ============================================================
//  SISTEMA NATIVO INDEXEDDB (PERSISTENCIA COMPLETA)
// ============================================================
const DB_NAME = 'PepeCerditoDB';
const DB_VERSION = 1;
const STORE_NAME = 'saveData';

const DB = {
  db: null,
  init() {
    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(true);
      };
      request.onerror = () => resolve(false);
    });
  },
  async get(key, defaultVal) {
    if (!this.db) return defaultVal;
    return new Promise((resolve) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result !== undefined ? request.result : defaultVal);
      request.onerror = () => resolve(defaultVal);
    });
  },
  async set(key, value) {
    if (!this.db) return;
    return new Promise((resolve) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }
};

// ============================================================
//  DEFINICIÓN DE TEMAS VISUALES
// ============================================================
const THEMES = [
  {id:'classic',name:'Clásico',
    bg:['#87CEEB','#E0F0FF'],ground:'#5a4a3a',groundLine:'#3a2a1a',
    groundTop:'#7a6a4a',decorColor:'rgba(255,255,255,0.5)',
    drawBg(ctx,w,h){
      let g=ctx.createLinearGradient(0,0,0,h);
      g.addColorStop(0,'#87CEEB');g.addColorStop(.7,'#B0E0FF');g.addColorStop(1,'#E0F0FF');
      ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
      for(let i=0;i<6;i++){let x=(i*150+Date.now()*.01)%(w+200)-100;
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.beginPath();ctx.arc(x,30+i*25,20+i*5,0,Math.PI*2);ctx.fill()}
    },
    drawObs(ctx,t,x,y,w,h){ctx.fillStyle='#4CAF50';ctx.fillRect(x+3,y,w-6,h);}},
  {id:'outlast',name:'Outlast',
    bg:['#0a0000','#1a0505'],ground:'#2a1010',groundLine:'#1a0000',
    groundTop:'#3a1515',decorColor:'rgba(255,0,0,0.12)',
    drawBg(ctx,w,h){
      let g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#1a0505');g.addColorStop(1,'#050000');
      ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    },
    drawObs(ctx,t,x,y,w,h){ctx.fillStyle='#8B0000';ctx.fillRect(x,y,w,h);}},
  {id:'gears',name:'Gears of War',
    bg:['#2a2a2a','#1a1a1a'],ground:'#4a3a2a',groundLine:'#3a2a1a',
    groundTop:'#5a4a3a',decorColor:'rgba(180,120,60,0.15)',
    drawBg(ctx,w,h){ctx.fillStyle='#222';ctx.fillRect(0,0,w,h);},
    drawObs(ctx,t,x,y,w,h){ctx.fillStyle='#8B7355';ctx.fillRect(x,y,w,h);}},
  {id:'halo',name:'Halo',
    bg:['#0a0a2a','#050515'],ground:'#2a2a4a',groundLine:'#1a1a3a',
    groundTop:'#3a3a5a',decorColor:'rgba(100,200,255,0.12)',
    drawBg(ctx,w,h){ctx.fillStyle='#0a0a2a';ctx.fillRect(0,0,w,h);},
    drawObs(ctx,t,x,y,w,h){ctx.fillStyle='#00BFFF';ctx.fillRect(x,y,w,h);}},
  {id:'clash',name:'Clash Royale',
    bg:['#2a1a4a','#1a0a2a'],ground:'#4a3a1a',groundLine:'#3a2a0a',
    groundTop:'#5a4a2a',decorColor:'rgba(255,215,0,0.1)',
    drawBg(ctx,w,h){ctx.fillStyle='#2a1a4a';ctx.fillRect(0,0,w,h);},
    drawObs(ctx,t,x,y,w,h){ctx.fillStyle='#C0A030';ctx.fillRect(x,y,w,h);}},
  {id:'western',name:'Western',
    bg:['#FF8C42','#FFB347'],ground:'#8B6914',groundLine:'#6B4914',
    groundTop:'#A07924',decorColor:'rgba(210,180,140,0.25)',
    drawBg(ctx,w,h){ctx.fillStyle='#FF8C42';ctx.fillRect(0,0,w,h);},
    drawObs(ctx,t,x,y,w,h){ctx.fillStyle='#8B6914';ctx.fillRect(x,y,w,h);}},
  {id:'retro',name:'Retro Arcade',
    bg:['#0a0a0a','#1a0a1a'],ground:'#ff00ff',groundLine:'#cc00cc',
    groundTop:'#ff33ff',decorColor:'rgba(255,0,255,0.12)',
    drawBg(ctx,w,h){ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,w,h);},
    drawObs(ctx,t,x,y,w,h){ctx.fillStyle='#FF00FF';ctx.fillRect(x,y,w,h);}}
];

// ============================================================
//  NÚCLEO DEL MODELO DE LÓGICA
// ============================================================
const Model = {
  state:'menu',
  score:0,
  renderScore:0,
  highScore:0,gamesPlayed:0,
  speed:BASE_SPEED,currentTheme:0,startTheme:0,
  milestoneIndex:0,groundOffset:0,topSpeed:0,
  pig:{x:80,y:0,w:42,h:42,vy:0,grounded:true,legPhase:0,sq:1,st:1,earA:0},
  obstacles:[],particles:[],trail:[],

  get groundY(){return H-58-this.pig.h},
  get theme(){return THEMES[this.currentTheme]},

  resetPig(){
    const p=this.pig;
    p.y=this.groundY;p.vy=0;p.grounded=true;p.legPhase=0;p.sq=1;p.st=1;p.earA=0;
  },

  reset(opts={}){
    this.score=0;this.renderScore=0;this.speed=BASE_SPEED;this.milestoneIndex=0;
    this.groundOffset=0;this.topSpeed=0;
    this.currentTheme=opts.theme!==undefined?opts.theme:0;
    this.startTheme=this.currentTheme;
    this.obstacles=[];this.particles=[];this.trail=[];
    this.resetPig();
  },

  addParticles(list){for(const p of list)this.particles.push(p)},

  updatePig(dt){
    const p=this.pig;
    if(!p.grounded){
      p.vy+=GRAVITY*dt;p.y+=p.vy*dt;p.earA=Math.min(p.earA+dt*8,.5);
    }else p.earA=Math.max(p.earA-dt*4,0);
    p.legPhase+=dt*12;p.sq+=(1-p.sq)*.15;p.st+=(1-p.st)*.15;
    if(p.y>=this.groundY){
      if(!p.grounded){p.sq=1.3;p.st=.8}
      p.y=this.groundY;p.vy=0;p.grounded=true;
    }
  },

  updateObstacles(dt){
    for(const o of this.obstacles)o.x-=this.speed*dt;
    this.obstacles=this.obstacles.filter(o=>o.x+o.w>-60);
  },

  updateParticles(dt){
    for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=200*dt;p.life-=dt}
    this.particles=this.particles.filter(p=>p.life>0);
  },

  checkCollision(){
    const p=this.pig,px=p.x+8,py=p.y+8,pw=p.w-16,ph=p.h-16;
    for(const o of this.obstacles){
      const ox=o.x+3,oy=o.y+3,ow=o.w-6,oh=o.h-6;
      if(px<ox+ow&&px+pw>ox&&py<oy+oh&&py+ph>oy)return true;
    }
    return false;
  },

  spawnObstacle(){
    this.obstacles.push({type:'generic',x:W,y:H-58-32,w:28,h:32,themeIdx:this.currentTheme});
  },

  jump(){
    const p=this.pig;if(!p.grounded)return;
    p.vy=JUMP_VEL;p.grounded=false;p.sq=.8;p.st=1.2;
    this.addParticles(Array.from({length:6},()=>({
      x:p.x+p.w/2,y:p.y+p.h,vx:(Math.random()-.5)*120,vy:-Math.random()*100-50,
      life:.4+Math.random()*.3,maxLife:.4+Math.random()*.3,size:2+Math.random()*3,color:'#FFB5C5'
    })));
  },

  getNextMilestone(){
    for(const m of MILESTONES)if(this.score<m.score)return m;
    return null;
  }
};

// ============================================================
//  VISTA (MANIPULACIÓN Y RENDER DEL DOM Y CANVAS)
// ============================================================
const View = {
  canvas:null,ctx:null,els:{},

  init(canvasId){
    this.canvas=document.getElementById(canvasId);
    this.ctx=this.canvas.getContext('2d');
    this.canvas.width=W;this.canvas.height=H;
    
    const ids=['score','high-score','milestone','theme-name','controls-hint',
      'pause-btn','menu-overlay','gameover-overlay','final-score','final-record',
      'final-achievement','theme-grid','start-btn','restart-btn','menu-btn',
      'theme-label','progress-bar','progress-fill','progress-label',
      'menu-highscore','menu-games','go-theme','go-top-speed'];
    for(const id of ids)this.els[id]=document.getElementById(id);
    this.els.highScore=this.els['high-score'];
  },

  render(model){
    const{ctx}=this;const th=model.theme;
    th.drawBg(ctx,W,H);

    const gy=H-55;
    ctx.fillStyle=th.ground;ctx.fillRect(0,gy,W,55);
    ctx.fillStyle=th.groundTop;ctx.fillRect(0,gy,W,5);

    ctx.strokeStyle=th.groundLine;ctx.lineWidth=1.5;ctx.beginPath();
    for(let x=0;x<=W;x+=4){
      let yo=Math.sin((x+model.groundOffset)*.04)*1.8;
      x===0?ctx.moveTo(x,gy+5+yo):ctx.lineTo(x,gy+5+yo);
    }ctx.stroke();

    const p=model.pig;
    let sS=p.grounded?1:Math.max(.3,1-Math.abs(p.vy)/1200);
    ctx.fillStyle='rgba(0,0,0,0.1)';ctx.beginPath();ctx.ellipse(p.x+p.w/2,gy+4,p.w*.35*sS,4*sS,0,0,Math.PI*2);ctx.fill();

    ctx.globalAlpha=.15;
    for(let i=0;i<model.trail.length;i++){
      const t=model.trail[i];ctx.fillStyle='#FFB5C5';ctx.beginPath();ctx.arc(t.x+21,t.y+21,12*(i/model.trail.length),0,Math.PI*2);ctx.fill();
    }ctx.globalAlpha=1;

    for(const o of model.obstacles){THEMES[o.themeIdx||model.currentTheme].drawObs(ctx,o.type,o.x,o.y,o.w,o.h)}
    for(const pt of model.particles){
      let a=Math.max(0,pt.life/pt.maxLife);ctx.globalAlpha=a;ctx.fillStyle=pt.color;ctx.beginPath();ctx.arc(pt.x,pt.y,pt.size*a,0,Math.PI*2);ctx.fill();
    }ctx.globalAlpha=1;

    this.drawPig(ctx,p);

    if(model.state==='paused'){
      ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#fff';ctx.font='bold 32px sans-serif';ctx.textAlign='center';
      ctx.fillText('JUEGO PAUSADO',W/2,H/2-4);ctx.textAlign='left';
    }
  },

  drawPig(ctx,p){
    const{x,y,w,h}=p;const cx=x+w/2,cy=y+h/2,sq=p.sq,st=p.st;
    ctx.save();ctx.translate(cx,cy+h*(1-sq)*.1);ctx.scale(1/sq*st,1/st*sq);
    ctx.strokeStyle='#FF8FA3';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-w*.35,0);ctx.quadraticCurveTo(-w*.5,-h*.2,-w*.35,-h*.25);ctx.stroke();
    const lOff=p.grounded?Math.sin(p.legPhase)*4:2;
    ctx.fillStyle='#FF8FA3';ctx.fillRect(-w*.2,h*.3,8,14+lOff);ctx.fillRect(w*.05,h*.3,8,14-lOff);
    ctx.fillStyle='#FFB5C5';ctx.beginPath();ctx.ellipse(0,4,w*.32,h*.28,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#FF8FA3';ctx.fillRect(w*.15,h*.3,8,14-lOff);ctx.fillRect(w*.3,h*.3,8,14+lOff);
    ctx.fillStyle='#FFB5C5';ctx.beginPath();ctx.arc(w*.35,-h*.05,w*.22,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#FF8FA3';
    ctx.save();ctx.translate(w*.2,-h*.25);ctx.rotate(-.3+p.earA);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,-14);ctx.lineTo(8,-10);ctx.fill();ctx.restore();
    ctx.save();ctx.translate(w*.35,-h*.28);ctx.rotate(.2+p.earA);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(8,-14);ctx.lineTo(-6,-10);ctx.fill();ctx.restore();
    ctx.fillStyle='#FFC8D3';ctx.beginPath();ctx.ellipse(w*.45,h*.02,10,7,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#E88090';ctx.beginPath();ctx.arc(w*.42,h*.04,2.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(w*.48,h*.04,2.5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#333';ctx.beginPath();ctx.arc(w*.28,-h*.08,4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(w*.38,-h*.08,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(w*.26,-h*.1,1.8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(w*.36,-h*.1,1.8,0,Math.PI*2);ctx.fill();
    ctx.restore();
  },

  animateScore(rendered, target, highScore) {
    this.els.score.textContent = Math.floor(rendered);
    this.els.highScore.textContent = 'RECORD: ' + Math.max(Math.floor(rendered), highScore);
  },

  updateThemeLabel(th){this.els['theme-label'].textContent=th.name},

  updateProgress(score,next){
    if(Model.state==='playing'){
      this.els['progress-bar'].style.display='flex';
      const prevScore = Model.milestoneIndex > 0 ? MILESTONES[Model.milestoneIndex - 1].score : 0;
      const targetScore = next ? next.score : 10000;
      const pct = ((score - prevScore) / (targetScore - prevScore)) * 100;
      this.els['progress-fill'].style.width=Math.min(100, Math.max(0, pct))+'%';
      this.els['progress-label'].textContent=next ? next.name : '¡MÁXIMO!';
    }else{this.els['progress-bar'].style.display='none'}
  },

  showMilestone(name){
    this.els.milestone.textContent=name;this.els.milestone.className='show';
    setTimeout(()=>{this.els.milestone.className=''},2100);
  },

  showThemeTransition(idx){
    this.els['theme-name'].textContent=THEMES[idx].name;this.els['theme-name'].className='show';
    setTimeout(()=>{this.els['theme-name'].className=''},2600);
  },

  showGameOver(score,highScore,theme,topSpeed,achievement){
    this.els['final-score'].textContent=score;
    this.els['final-record'].textContent='RECORD: '+highScore;
    this.els['go-theme'].textContent=THEMES[theme].name;
    this.els['go-top-speed'].textContent=Math.round(topSpeed)+' KM/H';
    if(achievement){this.els['final-achievement'].textContent='LOGRO: '+achievement.name;this.els['final-achievement'].style.display='block'}
    else this.els['final-achievement'].style.display='none';
    this.els['gameover-overlay'].style.display='flex';
  },

  buildThemeSelector(current, callback){
    this.els['theme-grid'].innerHTML='';
    THEMES.forEach((th,i)=>{
      const row=document.createElement('button');
      row.className='theme-row-btn'+(i===current?' active':'');
      row.innerHTML=`<span class="t-name">${th.name}</span><span class="t-status">${i===current?'Seleccionado':'Explorar'}</span>`;
      row.addEventListener('click',(e)=>{
        e.stopPropagation();
        document.querySelectorAll('.theme-row-btn').forEach(b=>{
          b.classList.remove('active');
          b.querySelector('.t-status').textContent='Explorar';
        });
        row.classList.add('active');
        row.querySelector('.t-status').textContent='Seleccionado';
        callback(i);
      });
      this.els['theme-grid'].appendChild(row);
    });
  },

  resize(){
    const wrapper=document.getElementById('game-wrapper');
    const container=document.getElementById('game-container');
    const maxW=Math.min(container.clientWidth, 850);
    wrapper.style.width=maxW+'px';
    wrapper.style.height=(maxW*(300/800))+'px';
  }
};

// ============================================================
//  CONTROLADOR - INTERACCIONES Y BUCLE DE JUEGO
// ============================================================
const VM = {
  model:Model,view:View,
  lastTime:0,obstacleTimer:1.5,shakeTime:0,shakeIntensity:0,

  async init(){
    const m=this.model;
    
    await DB.init();
    m.highScore = await DB.get('highScore', 0);
    m.gamesPlayed = await DB.get('gamesPlayed', 0);
    m.currentTheme = await DB.get('selectedTheme', 0);

    this.view.init('gameCanvas');
    this.view.buildThemeSelector(m.currentTheme, async (idx)=>{
      m.currentTheme=idx;
      await DB.set('selectedTheme', idx);
    });
    
    this.view.resize();
    window.addEventListener('resize',()=>this.view.resize());

    this.bindInputs();
    this.view.els['menu-overlay'].style.display='flex';
    this.view.els['gameover-overlay'].style.display='none';
    this.view.els['menu-highscore'].textContent=m.highScore;
    this.view.els['menu-games'].textContent=m.gamesPlayed;
    
    m.reset({theme:m.currentTheme});
    m.state='menu';
    requestAnimationFrame((t)=>this.loop(t));
  },

  bindInputs(){
    const container = document.getElementById('game-container');

    // SOLUCIÓN USABILIDAD MÓVIL: Tocar en CUALQUIER zona libre de la pantalla ejecuta el salto
    container.addEventListener('touchstart',(e)=>{
      // Permitir el click normal en botones reales de la UI
      if(e.target.tagName === 'BUTTON' || e.target.closest('.theme-list-scroll')) return;
      e.preventDefault();
      if(this.model.state==='playing') this.model.jump();
    },{passive:false});

    container.addEventListener('mousedown',(e)=>{
      if(e.target.tagName === 'BUTTON' || e.target.closest('.theme-list-scroll')) return;
      e.preventDefault();
      if(this.model.state==='playing') this.model.jump();
    });

    // Teclado para Laptops/PC
    document.addEventListener('keydown',(e)=>{
      if(e.code==='Space'||e.key===' '){
        e.preventDefault();
        if(this.model.state==='playing') this.model.jump();
        else if(this.model.state==='menu'||this.model.state==='gameover') this.startGame();
      }
      if(e.code==='KeyP'||e.code==='Escape'){e.preventDefault();this.onPause()}
    });
    
    this.view.els['start-btn'].addEventListener('click',()=>this.startGame());
    this.view.els['restart-btn'].addEventListener('click',()=>this.startGame());
    this.view.els['menu-btn'].addEventListener('click',()=>this.goMenu());
    this.view.els['pause-btn'].addEventListener('click',(e)=>{
      e.stopPropagation();
      this.onPause();
    });
  },

  onPause(){
    const m=this.model;const btn=this.view.els['pause-btn'];
    if(m.state==='playing'){m.state='paused';btn.classList.add('playing')}
    else if(m.state==='paused'){m.state='playing';btn.classList.remove('playing');this.lastTime=0}
  },

  startGame(){
    const m=this.model;
    this.view.els['menu-overlay'].style.display='none';
    this.view.els['gameover-overlay'].style.display='none';
    m.reset({theme:m.currentTheme});
    m.state='playing';
    this.obstacleTimer=1.4;this.shakeTime=0;
    this.view.updateThemeLabel(m.theme);
    this.view.els['pause-btn'].style.display='flex';
    this.view.els['pause-btn'].classList.remove('playing');
    this.view.els['controls-hint'].style.display='block';
    this.lastTime=0;
  },

  goMenu(){
    this.model.state='menu';
    this.view.els['gameover-overlay'].style.display='none';
    this.view.els['pause-btn'].style.display='none';
    this.view.els['controls-hint'].style.display='none';
    this.view.els['progress-bar'].style.display='none';
    this.view.els['menu-highscore'].textContent=this.model.highScore;
    this.view.els['menu-games'].textContent=this.model.gamesPlayed;
    this.view.els['menu-overlay'].style.display='flex';
    this.view.buildThemeSelector(this.model.currentTheme, async (idx)=>{
      this.model.currentTheme=idx;
      await DB.set('selectedTheme', idx);
    });
  },

  async gameOver(){
    const m=this.model;m.state='gameover';
    const isNew=m.score>m.highScore;
    if(isNew){m.highScore=m.score; await DB.set('highScore', m.highScore)}
    m.gamesPlayed++; await DB.set('gamesPlayed', m.gamesPlayed);

    let ach=null;
    for(const ml of MILESTONES)if(m.score>=ml.score)ach=ml;

    this.view.showGameOver(m.score,m.highScore,m.currentTheme,m.topSpeed,ach);
    this.shakeTime=.25;this.shakeIntensity=5;
    
    m.addParticles(Array.from({length:25},()=>{
      const a=Math.random()*Math.PI*2;
      return{x:m.pig.x+20,y:m.pig.y+20,vx:Math.cos(a)*(60+Math.random()*240),vy:Math.sin(a)*(60+Math.random()*240)-60,
        life:.6+Math.random()*.6,maxLife:.6+Math.random()*.6,size:2+Math.random()*4,color:'#FF6B8A'};
    }));
  },

  update(dt){
    const m=this.model;if(m.state!=='playing')return;

    m.updatePig(dt);
    m.groundOffset+=m.speed*dt;
    m.updateObstacles(dt);

    this.obstacleTimer-=dt;
    if(this.obstacleTimer<=0){
      m.spawnObstacle();
      this.obstacleTimer=0.9+Math.random()*(2.0-m.speed*.002);
    }

    if(m.speed<MAX_SPEED)m.speed+=SPEED_INCR*dt;
    m.topSpeed=Math.max(m.topSpeed,m.speed);

    m.score+=Math.round(m.speed*dt*.06);
    
    if(m.renderScore<m.score){
      m.renderScore+= (m.score - m.renderScore) * 12 * dt; 
      if(m.score - m.renderScore < 1) m.renderScore = m.score;
    }
    this.view.animateScore(m.renderScore, m.score, m.highScore);

    const p=m.pig;m.trail.push({x:p.x,y:p.y,life:1});
    m.trail=m.trail.filter(t=>{t.life-=dt*4;return t.life>0});
    if(m.trail.length>5)m.trail.shift();

    const adv=Math.floor(m.score/THEME_CHANGE_EVERY);
    const exp=Math.min(m.startTheme+adv,THEMES.length-1);
    if(exp!==m.currentTheme){
      m.currentTheme=exp;this.view.showThemeTransition(m.currentTheme);
      this.view.updateThemeLabel(m.theme);m.obstacles=[];this.obstacleTimer=1.0;
    }

    for(let i=m.milestoneIndex;i<MILESTONES.length;i++){
      if(m.score>=MILESTONES[i].score){
        m.milestoneIndex=i+1;this.view.showMilestone(MILESTONES[i].name);
        m.addParticles(Array.from({length:15},()=>{
          const a=Math.random()*Math.PI*2;
          return{x:W/2,y:H/2,vx:Math.cos(a)*(100+Math.random()*150),vy:Math.sin(a)*(100+Math.random()*150)-40,
            life:.5+Math.random()*.5,maxLife:.5+Math.random()*.5,size:2+Math.random()*4,color:'#ffd700'};
        }));
        break;
      }
    }

    this.view.updateProgress(m.score,m.getNextMilestone());
    m.updateParticles(dt);
    if(m.checkCollision()){this.gameOver()}
  },

  loop(timestamp){
    if(this.lastTime===0)this.lastTime=timestamp;
    let dt=(timestamp-this.lastTime)/1000;this.lastTime=timestamp;
    dt=Math.min(dt,.05);

    if((Model.state==='menu'||Model.state==='gameover')&&Model.pig){
      Model.pig.legPhase+=dt*3;Model.pig.sq+=(1-Model.pig.sq)*.05;Model.pig.st+=(1-Model.pig.st)*.05;
    }

    this.update(dt);

    const ctx=View.ctx;
    if(this.shakeTime>0){
      this.shakeTime-=dt;
      ctx.save();ctx.translate((Math.random()-.5)*this.shakeIntensity,(Math.random()-.5)*this.shakeIntensity);
      this.view.render(Model);ctx.restore();
    }else{
      this.view.render(Model);
    }
    requestAnimationFrame((t)=>this.loop(t));
  }
};

window.addEventListener('load',()=>VM.init());