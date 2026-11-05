(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=localStorage.getItem('arcades-motion')==='off',observer;
 const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 const toggle=document.createElement('button');toggle.className='motion-toggle';document.body.append(toggle);
 function state(){document.body.classList.toggle('motion-off',paused);toggle.textContent=paused?'开启动效':'暂停动效';toggle.setAttribute('aria-pressed',String(paused))}
 toggle.onclick=()=>{paused=!paused;localStorage.setItem('arcades-motion',paused?'off':'on');state();if(paused)document.querySelectorAll('.reveal-pending').forEach(e=>e.classList.remove('reveal-pending'))};state();
 function enhance(){
  observer?.disconnect();
  const heading=document.querySelector('.hero h1');
  if(heading&&!heading.querySelector('.letter')){let i=0;heading.innerHTML=heading.innerHTML.split(/(<br\s*\/?>)/i).map(part=>/^<br/i.test(part)?part:Array.from(part).map(c=>`<span class="letter" style="--i:${i++}">${c}</span>`).join('')).join('');heading.setAttribute('aria-label','在巴黎的梦中漫游');heading.querySelectorAll('span').forEach(e=>e.setAttribute('aria-hidden','true'))}
  document.querySelectorAll('nav a').forEach(a=>{if(location.hash.startsWith(a.hash))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  if(!paused&&!reduce.matches&&'IntersectionObserver'in window){
   observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');entry.target.classList.add('reveal-seen');observer.unobserve(entry.target)}}),{threshold:.08});
   document.body.classList.add('motion-ready');
   document.querySelectorAll('.section h2,.intro p,.intro blockquote,.timeline a,.place-row,.people a,.memory-card,.group-card,.night-intro blockquote,.atlas-card,.atlas-home-intro>div,.dossier-links').forEach((e,i)=>{e.classList.add('reveal-pending');e.style.setProperty('--delay',(i%3)*65+'ms');observer.observe(e)});
  }
  update();
 }
 function update(){let max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;let hero=document.querySelector('.hero-art');if(hero&&!paused&&!reduce.matches)hero.style.setProperty('--drift',Math.min(scrollY*.075,45)+'px')}
 let pending=false;addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(()=>{update();pending=false})}},{passive:true});addEventListener('resize',update);
 const original=render;render=function(){original();enhance()};
 removeEventListener('hashchange',original);
 addEventListener('hashchange',()=>{if(document.startViewTransition&&!paused&&!reduce.matches)document.startViewTransition(()=>render());else render()});
 enhance();
})();
