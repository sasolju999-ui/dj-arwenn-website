/* DJ Arwenn booking calendar – unavailable full dates are stored in booked-dates.json */
(() => {
'use strict';
const el=id=>document.getElementById(id);
const input=el('event-date'),toggle=el('calendar-trigger'),panel=el('booking-calendar');
const grid=el('calendar-days'),weekdays=el('calendar-weekdays'),caption=el('calendar-month');
const previous=el('calendar-prev'),following=el('calendar-next'),notice=el('availability-note');
if(!input||!toggle||!panel||!grid||!weekdays||!caption||!previous||!following||!notice)return;
const en=()=>document.documentElement.lang==='en';
const tr=(sl,eng)=>en()?eng:sl;
const pad=n=>String(n).padStart(2,'0');
const iso=d=>[d.getFullYear(),pad(d.getMonth()+1),pad(d.getDate())].join('-');
const today=new Date();
today.setHours(0,0,0,0);
let month=new Date(today.getFullYear(),today.getMonth(),1);
let booked=new Set(),loading=null;
function dateLabel(s){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return s;
  const parts=s.split('-').map(Number);
  return new Intl.DateTimeFormat(en()?'en-GB':'sl-SI',{day:'numeric',month:'short',year:'numeric'}).format(new Date(parts[0],parts[1]-1,parts[2]));
}
function hint(message,type='info'){notice.textContent=message;notice.dataset.state=type;notice.hidden=!message;}
function updateLabel(){
  toggle.replaceChildren();
  const label=document.createElement('span');
  label.textContent=input.value?dateLabel(input.value):tr('Izberi datum dogodka','Choose event date');
  const glyph=document.createElement('span');glyph.textContent='▦';glyph.setAttribute('aria-hidden','true');
  toggle.append(label,glyph);
}
function parseBooked(data){
  const result=new Set();
  const valid=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T12:00:00'));
  (Array.isArray(data.bookedDates)?data.bookedDates:[]).forEach(s=>{if(valid(s))result.add(s);});
  (Array.isArray(data.bookedRanges)?data.bookedRanges:[]).forEach(r=>{
    if(!r||!valid(r.from)||!valid(r.to)||r.from>r.to)return;
    let current=new Date(r.from+'T12:00:00'),end=new Date(r.to+'T12:00:00');
    for(let n=0;current<=end&&n<3700;n++,current.setDate(current.getDate()+1))result.add(iso(current));
  });
  return result;
}
async function refresh(){
  if(loading)return loading;
  loading=(async()=>{
    try{
      const response=await fetch('booked-dates.json?ts='+Date.now(),{cache:'no-store'});
      if(!response.ok)throw new Error('Availability feed unavailable');
      booked=parseBooked(await response.json());
      if(input.value&&booked.has(input.value)){
        input.value='';updateLabel();
        hint(tr('Izbrani datum je postal zaseden. Izberi drugega.','The date you chose is now booked. Please select another.'),'error');
      }else hint(tr('Sivo označeni datumi so zasedeni. Razpoložljivost dokončno potrdim osebno.','Grey dates are booked. I confirm final availability personally.'),'info');
      render();
      return true;
    }catch(_){
      hint(tr('Koledarja trenutno ni mogoče osvežiti. Razpoložljivost preverim osebno.','Availability cannot be refreshed now. I will confirm it personally.'),'warning');
      render();
      return false;
    }finally{loading=null;}
  })();
  return loading;
}
function render(){
  caption.textContent=new Intl.DateTimeFormat(en()?'en-GB':'sl-SI',{year:'numeric',month:'long'}).format(month);
  weekdays.replaceChildren();
  (en()?['Mon','Tue','Wed','Thu','Fri','Sat','Sun']:['Po','To','Sr','Če','Pe','So','Ne']).forEach(name=>{
    const item=document.createElement('span');item.textContent=name;weekdays.appendChild(item);
  });
  grid.replaceChildren();
  const y=month.getFullYear(),m=month.getMonth(),offset=(new Date(y,m,1).getDay()+6)%7;
  for(let k=0;k<offset;k++){const spacer=document.createElement('span');spacer.setAttribute('aria-hidden','true');grid.appendChild(spacer);}
  const last=new Date(y,m+1,0).getDate();
  for(let day=1;day<=last;day++){
    const current=new Date(y,m,day),code=iso(current),occupied=booked.has(code),past=current<today;
    const b=document.createElement('button');
    b.type='button';b.className='calendar-day';
    if(occupied)b.classList.add('booked');
    if(code===iso(today))b.classList.add('today');
    if(input.value===code){b.classList.add('selected');b.setAttribute('aria-pressed','true');}
    b.textContent=day;b.disabled=past||occupied;
    b.setAttribute('aria-label',dateLabel(code)+(occupied?tr(' – zasedeno',' – booked'):past?tr(' – preteklost',' – past'):'' ));
    b.addEventListener('click',()=>{
      input.value=code;
      input.dispatchEvent(new Event('change',{bubbles:true}));
      updateLabel();render();close();toggle.focus();
      hint(tr('Datum je izbran. Termin potrdim po prejemu povpraševanja.','Date selected. I will confirm after receiving your enquiry.'),'info');
    });
    grid.appendChild(b);
  }
  previous.disabled=month.getFullYear()===today.getFullYear()&&month.getMonth()===today.getMonth();
}
function close(){panel.hidden=true;toggle.setAttribute('aria-expanded','false');}
async function open(){
  if(!panel.hidden){close();return;}
  panel.hidden=false;toggle.setAttribute('aria-expanded','true');render();
  await refresh();
}
toggle.addEventListener('click',open);
previous.addEventListener('click',()=>{month=new Date(month.getFullYear(),month.getMonth()-1,1);render();});
following.addEventListener('click',()=>{month=new Date(month.getFullYear(),month.getMonth()+1,1);render();});
document.addEventListener('click',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!toggle.contains(e.target))close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){close();toggle.focus();}});
document.addEventListener('arwenn:languagechanged',()=>{updateLabel();render();});
document.addEventListener('arwenn:booking-reset',()=>{input.value='';updateLabel();render();});
document.documentElement.classList.add('calendar-enhanced');
toggle.hidden=false;input.tabIndex=-1;input.required=false;
updateLabel();render();refresh();
window.DJArwennCalendar={
  async validate(){
    if(!input.value){hint(tr('Izberi datum dogodka.','Please choose an event date.'),'error');toggle.focus();return false;}
    if(new Date(input.value+'T12:00:00')<today){hint(tr('Datum ne more biti v preteklosti.','The date cannot be in the past.'),'error');toggle.focus();return false;}
    await refresh();
    if(!input.value||booked.has(input.value)){hint(tr('Ta datum je zaseden ali ni več izbran. Izberi drugega.','This date is booked or no longer selected. Choose another.'),'error');toggle.focus();return false;}
    return true;
  },
  refresh,render
};
})();