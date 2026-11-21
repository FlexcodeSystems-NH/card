// Shared interactions: reveal, counters, progress, toc, pipeline lights, tabs, lightbox
(function(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));

  // counters
  const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;cio.unobserve(el);
    const to=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length,t0=performance.now(),dur=1400;
    (function tick(t){const p=Math.min(1,(t-t0)/dur),v=to*(1-Math.pow(1-p,3));el.textContent=v.toFixed(dec);if(p<1)requestAnimationFrame(tick)})(t0)}),{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

  // progress + toc
  const bar=document.querySelector('.progress'),links=[...document.querySelectorAll('.toc a')];
  const secs=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function onScroll(){const h=document.documentElement;if(bar)bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
    let cur=0;secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<140)cur=i});links.forEach((a,i)=>a.classList.toggle('on',i===cur))}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // pipeline: light steps one by one when visible
  document.querySelectorAll('.pipe').forEach(p=>{const steps=[...p.querySelectorAll('.step')];let i=0,timer;
    const pio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!timer){timer=setInterval(()=>{steps.forEach((s,j)=>s.classList.toggle('lit',j<=i));i=(i+1)%(steps.length+2)},700)}}),{threshold:.4});pio.observe(p)});

  // tabs
  document.querySelectorAll('[data-tabs]').forEach(g=>{const btns=g.querySelectorAll('.tabs button');btns.forEach(b=>b.onclick=()=>{
    btns.forEach(x=>x.classList.toggle('on',x===b));g.querySelectorAll('.tabpane').forEach(p=>p.classList.toggle('on',p.id===b.dataset.t))})});

  // lightbox
  const lb=document.createElement('div');lb.className='lightbox';lb.innerHTML='<img alt="">';document.body.appendChild(lb);
  document.querySelectorAll('.shot img').forEach(img=>img.parentElement.onclick=()=>{lb.querySelector('img').src=img.src;lb.classList.add('on')});
  lb.onclick=()=>lb.classList.remove('on');addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('on')});
})();
