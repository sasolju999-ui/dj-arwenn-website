(() => {
  'use strict';
  const teaser = document.querySelector('#utrinki .moments-teaser');
  if (!teaser || document.getElementById('arwenn-photo-gallery')) return;
  const labels = [
    ['nastopi','Pod šotorom'],['nastopi','Za DJ-pultom'],['nastopi','Prvi samostojni nastop'],
    ['portreti','Studijski nasmeh'],['nastopi','Nastop z dolgimi rokavi'],['nastopi','Za mešalno mizo'],
    ['portreti','Temni portret'],['portreti','Portret z obeskom'],['portreti','Portret s tatujem'],
    ['portreti','Nagajivi nasmeh'],['portreti','Pogled v kamero'],['portreti','Pogled vstran'],
    ['portreti','Svetlejši portret'],['portreti','Temnejši portret'],['portreti','Polovica v senci'],
    ['utrinki','Utrinek z odra'],['utrinki','Utrinek z odra – druga različica'],
    ['nastopi','Pioneer brez piva'],['nastopi','Pred leseno steno'],
    ['portreti','S prekrižanimi rokami'],['portreti','Originalni portret'],['portreti','Originalni nasmeh'],
    ['nastopi','Pod šotorom – pogled s strani']
  ];
  const photos=labels.map(([cat,name],i)=>({
    cat,name,n:i+1,
    image:'assets/gallery/'+String(i+1).padStart(2,'0')+'.webp',
    thumb:'assets/gallery/'+String(i+1).padStart(2,'0')+'-thumb.webp'
  }));
  const dict={
    sl:{title:'PRAVI TRENUTKI. PRAVA GLASBA.',intro:'Fotografije z nastopov, portreti in utrinki za DJ-pultom.',all:'VSE',nastopi:'NASTOPI',portreti:'PORTRETI',utrinki:'UTRINKI',count:'fotografij',open:'Odpri fotografijo',close:'Zapri',prev:'Prejšnja',next:'Naslednja'},
    en:{title:'REAL MOMENTS. REAL MUSIC.',intro:'Live performances, portraits and moments behind the decks.',all:'ALL',nastopi:'LIVE',portreti:'PORTRAITS',utrinki:'MOMENTS',count:'photos',open:'Open photo',close:'Close',prev:'Previous',next:'Next'}
  };
  const language=()=>document.documentElement.lang.toLowerCase().startsWith('en')?'en':'sl';
  const css='.arwenn-gallery{margin:32px 0 46px;color:white}.arwenn-gallery h3{font:900 clamp(24px,3.1vw,38px)/1.08 Inter,Arial,sans-serif;letter-spacing:-.04em;margin:0 0 12px}.arwenn-gallery p{color:#bdb6bc;font-size:15px;line-height:1.7;max-width:68ch;margin:0 0 23px}.arwenn-controls{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:18px}.arwenn-tabs{display:flex;gap:8px;flex-wrap:wrap}.arwenn-tabs button{cursor:pointer;color:white;background:#201b21;border:1px solid #ffffff44;border-radius:6px;min-height:42px;padding:9px 14px;font:800 11px Inter,Arial,sans-serif}.arwenn-tabs button[aria-pressed=true]{background:#d91538;border-color:#e92a4b}.arwenn-count{font:700 11px Inter,Arial,sans-serif;color:#bbb}.arwenn-photos{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px}.arwenn-photo{padding:0;min-width:0;position:relative;overflow:hidden;border-radius:8px;border:1px solid #ffffff33;background:#1c171c;color:white;aspect-ratio:4/5;cursor:zoom-in}.arwenn-photo img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .24s ease}.arwenn-photo:hover img{transform:scale(1.035)}.arwenn-photo span{position:absolute;bottom:0;left:0;right:0;text-align:left;background:linear-gradient(transparent,#000d);padding:30px 10px 11px;font:750 11px/1.45 Inter,Arial,sans-serif}.arwenn-photo[hidden]{display:none!important}.arwenn-dialog{border:1px solid #ffffff55;border-radius:10px;background:#0d0d10;color:white;max-width:96vw;max-height:95vh;width:min(96vw,1100px);padding:0}.arwenn-dialog::backdrop{background:#000e}.arwenn-lightbox{display:grid;grid-template-columns:48px minmax(0,1fr) 48px;align-items:center;min-height:min(80vh,640px);position:relative;padding:50px 4px 40px}.arwenn-lightbox img{max-width:100%;max-height:74vh;width:auto;height:auto;object-fit:contain;margin:auto}.arwenn-dialog button{background:#222229e8;border:1px solid #ffffff55;color:white;min-width:42px;min-height:42px;font-size:25px;border-radius:6px;cursor:pointer}.arwenn-close{position:absolute;top:7px;right:9px}.arwenn-caption{position:absolute;left:12px;right:12px;bottom:11px;text-align:center;font:700 12px Inter,Arial,sans-serif}.arwenn-gallery button:focus-visible,.arwenn-dialog button:focus-visible{outline:3px solid #ff6880;outline-offset:3px}@media(max-width:900px){.arwenn-photos{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:650px){.arwenn-gallery{margin:25px 0 35px}.arwenn-photos{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.arwenn-tabs button{padding:9px 11px;font-size:10px}.arwenn-photo span{font-size:10px}}@media(prefers-reduced-motion:reduce){.arwenn-photo img{transition:none}}';
  const gallery=document.createElement('section');
  gallery.id='arwenn-photo-gallery';
  gallery.className='arwenn-gallery';
  gallery.setAttribute('aria-label','Galerija fotografij DJ Arwenn');
  gallery.innerHTML='<h3></h3><p></p><div class="arwenn-controls"><div class="arwenn-tabs" role="group" aria-label="Filter fotografij"></div><span class="arwenn-count" aria-live="polite"></span></div><div class="arwenn-photos"></div>';
  const grid=gallery.querySelector('.arwenn-photos'), tabs=gallery.querySelector('.arwenn-tabs'), count=gallery.querySelector('.arwenn-count');
  const choices=['all','nastopi','portreti','utrinki'];
  let visible=photos,active=0;
  choices.forEach(cat=>{const b=document.createElement('button');b.type='button';b.dataset.cat=cat;b.setAttribute('aria-pressed',String(cat==='all'));tabs.append(b);});
  photos.forEach(p=>{
    const b=document.createElement('button');b.type='button';b.className='arwenn-photo';b.dataset.cat=p.cat;b.dataset.number=p.n;
    const img=document.createElement('img');img.loading='lazy';img.decoding='async';img.src=p.thumb;img.alt='DJ Arwenn – '+p.name;
    const text=document.createElement('span');text.textContent=p.name;b.append(img,text);grid.append(b);
  });
  const dialog=document.createElement('dialog');dialog.className='arwenn-dialog';
  dialog.innerHTML='<div class="arwenn-lightbox"><button class="arwenn-close" type="button">×</button><button class="arwenn-prev" type="button">‹</button><img alt=""><button class="arwenn-next" type="button">›</button><span class="arwenn-caption" aria-live="polite"></span></div>';
  function translate(){
    const t=dict[language()];
    gallery.querySelector('h3').textContent=t.title;gallery.querySelector('p').textContent=t.intro;
    tabs.querySelectorAll('button').forEach(b=>b.textContent=t[b.dataset.cat]);
    count.textContent=visible.length+' '+t.count;
    dialog.querySelector('.arwenn-close').setAttribute('aria-label',t.close);
    dialog.querySelector('.arwenn-prev').setAttribute('aria-label',t.prev);
    dialog.querySelector('.arwenn-next').setAttribute('aria-label',t.next);
    grid.querySelectorAll('button').forEach(b=>b.setAttribute('aria-label',t.open+': '+b.textContent));
  }
  function filter(cat){
    visible=photos.filter(p=>cat==='all'||p.cat===cat);
    grid.querySelectorAll('button').forEach(b=>b.hidden=cat!=='all'&&b.dataset.cat!==cat);
    tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cat===cat)));
    translate();
  }
  function show(i){
    active=(i+visible.length)%visible.length;
    const p=visible[active];const img=dialog.querySelector('img');
    img.src=p.image;img.alt='DJ Arwenn – '+p.name;
    dialog.querySelector('.arwenn-caption').textContent=(active+1)+' / '+visible.length+' · '+p.name;
  }
  tabs.addEventListener('click',e=>{if(e.target.matches('button[data-cat]'))filter(e.target.dataset.cat);});
  grid.addEventListener('click',e=>{
    const item=e.target.closest('.arwenn-photo');if(!item)return;
    const pos=visible.findIndex(p=>p.n===Number(item.dataset.number));if(pos<0)return;
    show(pos);dialog.showModal();
  });
  dialog.querySelector('.arwenn-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.arwenn-prev').addEventListener('click',()=>show(active-1));
  dialog.querySelector('.arwenn-next').addEventListener('click',()=>show(active+1));
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(active-1)}else if(e.key==='ArrowRight'){e.preventDefault();show(active+1)}});
  const probe=new Image();
  probe.onload=()=>{
    const style=document.createElement('style');style.textContent=css;document.head.append(style);
    teaser.replaceWith(gallery);document.body.append(dialog);filter('all');
    new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  };
  probe.onerror=()=>{};
  probe.src=photos[0].thumb;
})();