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
  const words = {
    sl: {
      heading:'PRAVI TRENUTKI. PRAVA GLASBA.',
      intro:'Nekaj utrinkov izza DJ-pulta. Ostalih 18 te čaka v galeriji.',
      openAll:'POGLEJ VSEH 23 FOTOGRAFIJ',openGallery:'Odpri galerijo fotografij',
      all:'VSE',nastopi:'NASTOPI',portreti:'PORTRETI',utrinki:'UTRINKI',
      count:'fotografij',open:'Odpri fotografijo',close:'Zapri galerijo',
      back:'Nazaj na galerijo',prev:'Prejšnja fotografija',next:'Naslednja fotografija',
      fullTitle:'DJ ARWENN / GALERIJA'
    },
    en: {
      heading:'REAL MOMENTS. REAL MUSIC.',
      intro:'A few moments behind the decks. Find all the others in the gallery.',
      openAll:'VIEW ALL 23 PHOTOS',openGallery:'Open photo gallery',
      all:'ALL',nastopi:'LIVE',portreti:'PORTRAITS',utrinki:'MOMENTS',
      count:'photos',open:'Open photograph',close:'Close gallery',
      back:'Back to gallery',prev:'Previous photo',next:'Next photo',
      fullTitle:'DJ ARWENN / GALLERY'
    }
  };
  const lang = () => document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'sl';
  const styleText = '.arwenn-feature{margin:30px 0 40px;color:#fff}.arwenn-feature h3{font:900 clamp(23px,3vw,37px)/1.1 Inter,Arial,sans-serif;letter-spacing:-.035em;margin:0 0 12px}.arwenn-feature>p{font:500 15px/1.7 Inter,Arial,sans-serif;color:#bcb6bb;margin:0 0 21px;max-width:65ch}.arwenn-mosaic{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:10px;aspect-ratio:2.7/1}.arwenn-mosaic button{position:relative;display:block;overflow:hidden;min-width:0;border:1px solid #ffffff37;border-radius:9px;padding:0;cursor:zoom-in;background:#171419;color:#fff}.arwenn-mosaic button:first-child{grid-column:span 2;grid-row:span 2}.arwenn-mosaic img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .24s ease}.arwenn-mosaic button:hover img{transform:scale(1.045)}.arwenn-mosaic span{position:absolute;inset:auto 0 0 0;padding:28px 12px 11px;text-align:left;background:linear-gradient(transparent,#000e);font:750 11px/1.45 Inter,Arial,sans-serif}.arwenn-feature-more{margin-top:17px;display:flex;align-items:center;justify-content:center;gap:14px;min-height:52px;padding:14px 22px;width:100%;color:#fff;border:1px solid #e82a4b;border-radius:8px;background:linear-gradient(105deg,#99152c,#d51b3d);font:850 12px/1.2 Inter,Arial,sans-serif;letter-spacing:.065em;cursor:pointer}.arwenn-feature-more:hover{background:#e92a4d}.arwenn-feature-more .arrow{font-size:20px}.arwenn-gallery-dialog{background:#0c0b0f;color:#fff;inset:0;width:100vw;height:100dvh;max-width:100vw;max-height:100dvh;margin:0;padding:0;border:0;overflow:hidden}.arwenn-gallery-dialog::backdrop{background:#000e}.arwenn-gallery-panel{display:flex;flex-direction:column;height:100%;min-height:0}.arwenn-gallery-head{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:18px clamp(15px,3vw,40px);border-bottom:1px solid #ffffff24;background:#130f14}.arwenn-gallery-head-title{font:900 clamp(16px,2.1vw,23px)/1.1 Inter,Arial,sans-serif;letter-spacing:.045em}.arwenn-gallery-head-count{display:block;font:650 11px/1.7 Inter,Arial,sans-serif;color:#bdb6bf;margin-top:4px}.arwenn-gallery-dialog button{cursor:pointer;color:white}.arwenn-gallery-close,.arwenn-gallery-back,.arwenn-gallery-nav{background:#27232a;border:1px solid #ffffff44;border-radius:7px;min-width:44px;min-height:44px;font-size:24px}.arwenn-gallery-browser{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:20px clamp(15px,3vw,40px) 44px}.arwenn-gallery-categories{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}.arwenn-gallery-categories button{background:#211b23;border:1px solid #ffffff36;border-radius:6px;min-height:42px;padding:9px 15px;font:800 11px Inter,Arial,sans-serif;letter-spacing:.045em}.arwenn-gallery-categories button[aria-pressed=true]{background:#c81336;border-color:#e5264d}.arwenn-gallery-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}.arwenn-gallery-grid button{min-width:0;aspect-ratio:4/5;position:relative;overflow:hidden;border:1px solid #ffffff30;border-radius:8px;padding:0;background:#1c171c;cursor:zoom-in}.arwenn-gallery-grid button[hidden]{display:none!important}.arwenn-gallery-grid img{display:block;width:100%;height:100%;object-fit:cover}.arwenn-gallery-grid span{position:absolute;left:0;right:0;bottom:0;text-align:left;padding:29px 10px 10px;background:linear-gradient(transparent,#000e);font:750 11px/1.35 Inter,Arial,sans-serif}.arwenn-gallery-detail{flex:1;min-height:0;display:flex;flex-direction:column;align-items:stretch;justify-content:center;padding:12px clamp(10px,2vw,24px) 22px;gap:10px}.arwenn-gallery-detail[hidden],.arwenn-gallery-browser[hidden]{display:none!important}.arwenn-gallery-detail-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;max-width:1200px;width:100%;margin:0 auto}.arwenn-gallery-back{font:750 12px Inter,Arial,sans-serif;min-width:auto;padding:0 15px;min-height:42px}.arwenn-gallery-position{font:750 12px Inter,Arial,sans-serif;color:#e4dce0}.arwenn-gallery-photo{display:grid;grid-template-columns:48px minmax(0,1fr) 48px;align-items:center;gap:8px;flex:1;min-height:0;width:min(100%,1200px);margin:auto}.arwenn-gallery-photo img{min-width:0;display:block;object-fit:contain;max-width:100%;max-height:calc(100dvh - 180px);width:auto;height:auto;margin:auto}.arwenn-gallery-detail-caption{text-align:center;color:#eee1e7;font:750 13px/1.4 Inter,Arial,sans-serif}.arwenn-feature button:focus-visible,.arwenn-gallery-dialog button:focus-visible{outline:3px solid #ff5e77;outline-offset:3px}@media(max-width:950px){.arwenn-gallery-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:650px){.arwenn-feature{margin:24px 0 31px}.arwenn-feature>p{font-size:13px}.arwenn-mosaic{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:none;aspect-ratio:auto;gap:8px}.arwenn-mosaic button{aspect-ratio:4/3;border-radius:7px}.arwenn-mosaic button:first-child{grid-column:span 2;grid-row:auto;aspect-ratio:16/9}.arwenn-mosaic span{font-size:10px;padding:24px 9px 9px}.arwenn-feature-more{font-size:11px;min-height:50px}.arwenn-gallery-head{padding:13px 15px}.arwenn-gallery-browser{padding:17px 12px 30px}.arwenn-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.arwenn-gallery-categories{gap:6px}.arwenn-gallery-categories button{padding:9px 11px;font-size:10px}.arwenn-gallery-photo{grid-template-columns:38px minmax(0,1fr) 38px;gap:2px}.arwenn-gallery-nav{min-width:36px;min-height:48px;font-size:22px}.arwenn-gallery-photo img{max-height:calc(100dvh - 175px)}}@media(prefers-reduced-motion:reduce){.arwenn-mosaic img{transition:none}}';
  const feature = document.createElement('section');
  feature.id='arwenn-photo-gallery'; feature.className='arwenn-feature';
  feature.setAttribute('aria-label','Fotogalerija DJ Arwenn');
  feature.innerHTML='<h3></h3><p></p><div class="arwenn-mosaic"></div><button class="arwenn-feature-more" type="button"><span class="text"></span><span class="arrow" aria-hidden="true">↗</span></button>';
  const mosaic = feature.querySelector('.arwenn-mosaic');
  const selected = [19,12,1,18,16];
  selected.forEach(number=>{
    const p=photos[number-1];
    const button=document.createElement('button'); button.type='button'; button.dataset.number=number;
    const img=document.createElement('img');img.src=p.thumb;img.decoding='async';img.loading='lazy';img.alt='DJ Arwenn – '+p.name;
    const cap=document.createElement('span');cap.textContent=p.name;
    button.append(img,cap);mosaic.append(button);
  });
  const dialog=document.createElement('dialog');dialog.className='arwenn-gallery-dialog';
  dialog.innerHTML='<div class="arwenn-gallery-panel"><header class="arwenn-gallery-head"><div><div class="arwenn-gallery-head-title"></div><span class="arwenn-gallery-head-count" aria-live="polite"></span></div><button class="arwenn-gallery-close" type="button">×</button></header><div class="arwenn-gallery-browser"><nav class="arwenn-gallery-categories" aria-label="Filter fotografij"></nav><div class="arwenn-gallery-grid"></div></div><div class="arwenn-gallery-detail" hidden><div class="arwenn-gallery-detail-toolbar"><button class="arwenn-gallery-back" type="button"></button><span class="arwenn-gallery-position"></span></div><div class="arwenn-gallery-photo"><button class="arwenn-gallery-nav arwenn-gallery-prev" type="button">‹</button><img alt=""><button class="arwenn-gallery-nav arwenn-gallery-next" type="button">›</button></div><span class="arwenn-gallery-detail-caption"></span></div></div>';
  const browser=dialog.querySelector('.arwenn-gallery-browser');
  const grid=dialog.querySelector('.arwenn-gallery-grid');
  const categories=dialog.querySelector('.arwenn-gallery-categories');
  const detail=dialog.querySelector('.arwenn-gallery-detail');
  const photo=dialog.querySelector('.arwenn-gallery-photo img');
  let currentCategory='all',visible=photos,position=0;
  ['all','nastopi','portreti','utrinki'].forEach(cat=>{
    const b=document.createElement('button');b.type='button';b.dataset.category=cat;
    b.setAttribute('aria-pressed',String(cat==='all'));categories.append(b);
  });
  photos.forEach(p=>{
    const b=document.createElement('button');b.type='button';b.dataset.number=p.n;b.dataset.category=p.cat;
    const img=document.createElement('img');img.src=p.thumb;img.decoding='async';img.loading='lazy';img.alt='DJ Arwenn – '+p.name;
    const cap=document.createElement('span');cap.textContent=p.name;
    b.append(img,cap);grid.append(b);
  });
  function translate(){
    const t=words[lang()];
    feature.querySelector('h3').textContent=t.heading;
    feature.querySelector('p').textContent=t.intro;
    feature.querySelector('.arwenn-feature-more .text').textContent=t.openAll;
    feature.querySelector('.arwenn-feature-more').setAttribute('aria-label',t.openGallery);
    dialog.querySelector('.arwenn-gallery-head-title').textContent=t.fullTitle;
    dialog.querySelector('.arwenn-gallery-head-count').textContent=visible.length+' '+t.count;
    dialog.querySelector('.arwenn-gallery-close').setAttribute('aria-label',t.close);
    dialog.querySelector('.arwenn-gallery-back').textContent='← '+t.back;
    dialog.querySelector('.arwenn-gallery-prev').setAttribute('aria-label',t.prev);
    dialog.querySelector('.arwenn-gallery-next').setAttribute('aria-label',t.next);
    categories.querySelectorAll('button').forEach(b=>b.textContent=t[b.dataset.category]);
    grid.querySelectorAll('button').forEach(b=>b.setAttribute('aria-label',t.open+': '+b.textContent));
    mosaic.querySelectorAll('button').forEach(b=>b.setAttribute('aria-label',t.open+': '+b.textContent));
  }
  function filter(cat){
    currentCategory=cat;
    visible=photos.filter(p=>cat==='all'||p.cat===cat);
    categories.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===cat)));
    grid.querySelectorAll('button').forEach(b=>b.hidden=cat!=='all'&&b.dataset.category!==cat);
    translate();
  }
  function openBrowser(){
    detail.hidden=true; browser.hidden=false;
    filter(currentCategory); dialog.showModal();
  }
  function updateDetail(index){
    position=(index+visible.length)%visible.length;
    const p=visible[position];
    photo.src=p.image;photo.alt='DJ Arwenn – '+p.name;
    dialog.querySelector('.arwenn-gallery-position').textContent=(position+1)+' / '+visible.length;
    dialog.querySelector('.arwenn-gallery-detail-caption').textContent=p.name;
  }
  function openDetail(number){
    filter('all');
    const index=visible.findIndex(p=>p.n===number);
    if(index<0)return;
    if(!dialog.open)dialog.showModal();
    browser.hidden=true;detail.hidden=false;
    updateDetail(index);
    dialog.querySelector('.arwenn-gallery-back').focus();
  }
  feature.querySelector('.arwenn-feature-more').addEventListener('click',()=>{filter('all');openBrowser();});
  mosaic.addEventListener('click',e=>{
    const button=e.target.closest('button[data-number]');
    if(button)openDetail(Number(button.dataset.number));
  });
  categories.addEventListener('click',e=>{
    const button=e.target.closest('button[data-category]');
    if(button)filter(button.dataset.category);
  });
  grid.addEventListener('click',e=>{
    const button=e.target.closest('button[data-number]');
    if(!button)return;
    const index=visible.findIndex(p=>p.n===Number(button.dataset.number));
    if(index<0)return;
    browser.hidden=true;detail.hidden=false;updateDetail(index);
    dialog.querySelector('.arwenn-gallery-back').focus();
  });
  dialog.querySelector('.arwenn-gallery-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.arwenn-gallery-back').addEventListener('click',()=>{
    detail.hidden=true;browser.hidden=false;
    categories.querySelector('button[aria-pressed="true"]').focus();
  });
  dialog.querySelector('.arwenn-gallery-prev').addEventListener('click',()=>updateDetail(position-1));
  dialog.querySelector('.arwenn-gallery-next').addEventListener('click',()=>updateDetail(position+1));
  dialog.addEventListener('keydown',e=>{
    if(detail.hidden)return;
    if(e.key==='ArrowLeft'){e.preventDefault();updateDetail(position-1);}
    if(e.key==='ArrowRight'){e.preventDefault();updateDetail(position+1);}
  });
  let touchX=null;
  photo.addEventListener('touchstart',e=>{if(e.touches.length===1)touchX=e.touches[0].clientX;},{passive:true});
  photo.addEventListener('touchend',e=>{
    if(touchX===null||!e.changedTouches.length)return;
    const dx=e.changedTouches[0].clientX-touchX;touchX=null;
    if(Math.abs(dx)>45)updateDetail(position+(dx<0?1:-1));
  },{passive:true});
  const probe=new Image();
  probe.onload=()=>{
    const style=document.createElement('style');style.textContent=styleText;document.head.append(style);
    teaser.replaceWith(feature);document.body.append(dialog);filter('all');
    new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  };
  probe.onerror=()=>{};
  probe.src=photos[17].thumb;
})();