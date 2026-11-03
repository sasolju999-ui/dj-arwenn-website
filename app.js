/* DJ Arwenn — lightweight, dependency-free static site. No analytics or cookies. */
(() => {
  'use strict';
  const strings = {
    sl: {
      skip:'Preskoči na vsebino', mobileBook:'PREVERI PROST TERMIN', navServices:'Dogodki',navMusic:'Glasba',navMoments:'Utrinki',navContact:'Kontakt',navCheck:'Preveri termin',
      heroEyebrow:'DJ ZA TVOJE NEPOZABNE TRENUTKE',heroTop:'DOBER VEČER.',heroBottom:'HUD ŽUR.',heroLead:'Od prvega komada do zadnjega refrena. Glasba, ki poveže generacije in spravi družbo na plesišče.',heroCta:'PREVERI PROST TERMIN',heroMore:'ODKRIJ VEČ',metaOne:'POROKE',metaTwo:'ZABAVE',metaThree:'DOGODKI',
      servicesKicker:'ZA VSAK DOBER RAZLOG ZA ZABAVO',servicesTitle:'TVOJ DOGODEK.<br><em>MOJA GLASBA.</em>',servicesLead:'Vsaka zabava ima svojo zgodbo. Skupaj poiščemo pravi ritem, od prvih gostov do zadnjega plesa.',
      service1Title:'POROKE',service1Body:'Od nežnih trenutkov do plesišča, ki ne počiva. Glasbena spremljava za vajin dan.',service2Title:'ROJSTNI DNEVI',service2Body:'18-ka, 30-ka, abraham ali kar tako. Najljubši hiti in energija za vse generacije.',service3Title:'POSLOVNI DOGODKI',service3Body:'Zaključki, obletnice in druženja. Pravo vzdušje za sproščen in nepozaben večer.',service4Title:'KLUBI & EVENTI',service4Body:'House, tech house in techno. Seti za večere, ko ritem prevzame glavno besedo.',serviceLink:'POVPRAŠAJ ZA TERMIN <span aria-hidden="true">↗</span>',
      musicKicker:'ZA VSE OKUSE IN VSE GENERACIJE',musicTitle:'KO SE NAJDE<br><em>PRAVI RITEM.</em>',musicLead:'Nobeni dve zabavi nista enaki. Zato tudi ni ene same playliste za vse. Glasbo prilagodim dogodku, gostom in razpoloženju.',musicCta:'POVEJ MI, KAJ NAČRTUJEŠ',musicPanelTitle:'OD KLASIK DO KLUBSKEGA RITMA',
      momentsKicker:'UŠEČKAŠ? NAJPREJ POGLEJ.',momentsTitle:'VZDUŠJE, KI GA<br><em>NE POZABIŠ.</em>',momentsLead:'Najboljše zgodbe nastanejo na plesišču. Poglej utrinke z nastopov in spremljaj dogajanje.',moment1Small:'POGLEJ DOGAJANJE',moment1Title:'UTRINKI Z<br>NASTOPOV',moment2Small:'OSTANI V RITMU',moment2Title:'ZA ODRSKIMI<br>LUČMI',moment3Small:'VSE NA ENEM MESTU',moment3Title:'ŠE VEČ<br>GLASBE',momentButton:'ODPRI PROFIL',
      contactKicker:'REZERVACIJE IN POVPRAŠEVANJA',contactTitle:'IMAŠ DATUM?<br><em>JAZ IMAM BEAT.</em>',contactLead:'Povej mi, kakšno zabavo pripravljaš. Preveriva termin in skupaj začrtava pravi glasbeni večer.',directMessenger:'PIŠI MI NA MESSENGER',contactNote:'Najhitreje me dosežeš prek Facebook Messengerja.',
      formTitle:'SESTAVI POVPRAŠEVANJE',formHelp:'Izpolni podatke, pripravi sporočilo in ga kopiraj v Messenger.',fieldType:'VRSTA DOGODKA',typeParty:'Rojstni dan / zasebna zabava',typeWedding:'Poroka',typeBusiness:'Poslovni dogodek',typeClub:'Klub / javna prireditev',typeOther:'Drugo',fieldDate:'DATUM',fieldLocation:'KRAJ DOGODKA',locationPlaceholder:'npr. Ptuj',fieldNotes:'DODATNE INFORMACIJE (NEOBVEZNO)',notesPlaceholder:'Okvirno število gostov, glasbene želje ...',formGenerate:'PRIPRAVI SPOROČILO',messageLabel:'TVOJE SPOROČILO',copyButton:'KOPIRAJ SPOROČILO',copiedButton:'KOPIRANO ✓',copyError:'OZNAČI IN KOPIRAJ SPOROČILO',openMessenger:'ODPRI MESSENGER ↗',messageHelp:'Sporočilo se ne pošlje samodejno. Prilepi ga v Messenger in pošlji.',
      footerTag:'TVOJ VEČER. TVOJ RITEM.',footerPrivacy:'Brez sledilnih piškotkov · Zunanje povezave imajo svoje pogoje.',
      inquiryIntro:'Živjo, DJ Arwenn! Zanima me, ali si prost za naslednji dogodek:',inquiryType:'Vrsta dogodka',inquiryDate:'Datum',inquiryPlace:'Kraj',inquiryNotes:'Dodatne informacije',inquiryClosing:'Mi lahko sporočiš, ali imaš termin prost? Hvala!'
    },
    en: {
      skip:'Skip to content',mobileBook:'CHECK AVAILABILITY',navServices:'Events',navMusic:'Music',navMoments:'Highlights',navContact:'Contact',navCheck:'Check a date',
      heroEyebrow:'THE DJ FOR YOUR BEST MOMENTS',heroTop:'GOOD EVENING.',heroBottom:'GREAT PARTY.',heroLead:'From the first track to the last singalong. Music that brings generations together and fills the dance floor.',heroCta:'CHECK AVAILABILITY',heroMore:'EXPLORE MORE',metaOne:'WEDDINGS',metaTwo:'PARTIES',metaThree:'EVENTS',
      servicesKicker:'EVERY GREAT PARTY HAS A REASON',servicesTitle:'YOUR EVENT.<br><em>MY MUSIC.</em>',servicesLead:'Every celebration has a story. Together we find its perfect rhythm, from the first guest to the last dance.',
      service1Title:'WEDDINGS',service1Body:'From the heartfelt moments to a packed dance floor. Music for your special day.',service2Title:'BIRTHDAYS',service2Body:'Milestone birthdays, anniversaries, or just because. Favourite hits for every generation.',service3Title:'CORPORATE EVENTS',service3Body:'Team parties, celebrations and get-togethers. The right atmosphere for a memorable night.',service4Title:'CLUBS & EVENTS',service4Body:'House, tech house and techno. Sets for nights when the beat takes over.',serviceLink:'ASK ABOUT A DATE <span aria-hidden="true">↗</span>',
      musicKicker:'EVERY TASTE. EVERY GENERATION.',musicTitle:'FINDING<br><em>YOUR RHYTHM.</em>',musicLead:'No two celebrations are alike. There is no one-size-fits-all playlist. I adapt the music to your event, your guests and the mood.',musicCta:'TELL ME YOUR PLANS',musicPanelTitle:'FROM CLASSICS TO CLUB BEATS',
      momentsKicker:'THE VIBE SPEAKS FOR ITSELF',momentsTitle:'NIGHTS TO<br><em>REMEMBER.</em>',momentsLead:'The best stories happen on the dance floor. Explore event highlights and stay connected.',moment1Small:'SEE THE ACTION',moment1Title:'LIVE<br>HIGHLIGHTS',moment2Small:'STAY IN THE LOOP',moment2Title:'BEHIND<br>THE BEATS',moment3Small:'ALL IN ONE PLACE',moment3Title:'MORE<br>MUSIC',momentButton:'VIEW PROFILE',
      contactKicker:'BOOKINGS & ENQUIRIES',contactTitle:'GOT A DATE?<br><em>I’VE GOT THE BEAT.</em>',contactLead:'Tell me what you’re planning. Let’s check availability and shape the soundtrack to your night.',directMessenger:'MESSAGE ME ON MESSENGER',contactNote:'The easiest way to reach me is via Facebook Messenger.',
      formTitle:'PREPARE YOUR ENQUIRY',formHelp:'Fill in a few details, generate a message and paste it into Messenger.',fieldType:'EVENT TYPE',typeParty:'Birthday / private party',typeWedding:'Wedding',typeBusiness:'Corporate event',typeClub:'Club / public event',typeOther:'Other',fieldDate:'DATE',fieldLocation:'EVENT LOCATION',locationPlaceholder:'e.g. Ptuj',fieldNotes:'ADDITIONAL DETAILS (OPTIONAL)',notesPlaceholder:'Approx. number of guests, music preferences ...',formGenerate:'PREPARE MESSAGE',messageLabel:'YOUR MESSAGE',copyButton:'COPY MESSAGE',copiedButton:'COPIED ✓',copyError:'SELECT & COPY MESSAGE',openMessenger:'OPEN MESSENGER ↗',messageHelp:'Your message is not sent automatically. Paste it into Messenger and send it.',
      footerTag:'YOUR NIGHT. YOUR RHYTHM.',footerPrivacy:'No tracking cookies · External links have their own terms.',
      inquiryIntro:'Hi DJ Arwenn! I would like to ask about your availability for this event:',inquiryType:'Event type',inquiryDate:'Date',inquiryPlace:'Location',inquiryNotes:'Additional details',inquiryClosing:'Could you let me know if the date is available? Thank you!'
    }
  };
  let lang = 'sl';
  const choose = (id) => document.getElementById(id);
  const langButtons = document.querySelectorAll('[data-lang]');
  function renderLanguage(nextLang) {
    lang = nextLang === 'en' ? 'en' : 'sl';
    document.documentElement.lang = lang;
    const dict = strings[lang];
    document.querySelectorAll('[data-t]').forEach((el) => {
      const key = el.dataset.t;
      if (Object.prototype.hasOwnProperty.call(dict, key)) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-t-placeholder]').forEach((el) => {
      const val = dict[el.dataset.tPlaceholder];
      if (val) el.placeholder = val;
    });
    langButtons.forEach((b) => {const active = b.dataset.lang === lang; b.classList.toggle('active', active);b.setAttribute('aria-pressed',String(active));});
    if (!choose('message-result').hidden) generateMessage();
    document.title = lang === 'sl' ? 'DJ Arwenn | Tvoj večer. Tvoja glasba.' : 'DJ Arwenn | Your night. Your music.';
  }
  langButtons.forEach((button) => button.addEventListener('click',() => renderLanguage(button.dataset.lang)));
  const menu = choose('menu-toggle');
  const nav = choose('main-nav');
  menu.addEventListener('click',() => {const open = nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open ? 'Zapri meni / Close menu' : 'Odpri meni / Open menu');});
  document.querySelectorAll('#main-nav a').forEach((link) => link.addEventListener('click',() => {nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
  const bars = choose('wave-bars');
  for (let i = 0; i < 63; i++) {const bar = document.createElement('span');const h = 4 + (Math.abs(Math.sin(i * .51) * Math.sin(i * .13)) * 18);bar.style.setProperty('--h',`${h.toFixed(1)}px`);bars.appendChild(bar);}
  const dateInput = choose('event-date');
  const today = new Date();
  const y = today.getFullYear(),m = String(today.getMonth()+1).padStart(2,'0'),d = String(today.getDate()).padStart(2,'0');
  dateInput.min = `${y}-${m}-${d}`;
  function generateMessage() {
    const dict = strings[lang];
    const type = choose('event-type');
    const optionLabel = type.options[type.selectedIndex].text;
    const dateVal = dateInput.value;
    const dateStr = dateVal ? new Intl.DateTimeFormat(lang === 'sl' ? 'sl-SI' : 'en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${dateVal}T12:00:00Z`)) : '-';
    const location = choose('event-location').value.trim();
    const extra = choose('event-notes').value.trim();
    const lines = [dict.inquiryIntro,'',`${dict.inquiryType}: ${optionLabel}`,`${dict.inquiryDate}: ${dateStr}`,`${dict.inquiryPlace}: ${location}`];
    if (extra) lines.push(`${dict.inquiryNotes}: ${extra}`);
    lines.push('',dict.inquiryClosing);
    choose('message-preview').value = lines.join('\n');
  }
  choose('inquiry-form').addEventListener('submit',(event) => {event.preventDefault();if (!event.currentTarget.reportValidity()) return;generateMessage();choose('message-result').hidden = false;choose('copy-message').textContent = strings[lang].copyButton;choose('message-result').scrollIntoView({behavior:'smooth',block:'nearest'});});
  choose('copy-message').addEventListener('click',async () => {
    const text = choose('message-preview').value;
    let copied = false;
    try { if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(text);copied=true;} } catch(e) {copied=false;}
    if (!copied) {const t = choose('message-preview');t.focus();t.select();try{copied = document.execCommand('copy');}catch(e){copied=false;}}
    choose('copy-message').textContent = strings[lang][copied ? 'copiedButton' : 'copyError'];
  });
  choose('year').textContent = String(new Date().getFullYear());
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('js-ready');
    const observer = new IntersectionObserver((entries) => {for (const entry of entries) {if (entry.isIntersecting) {entry.target.classList.add('visible');observer.unobserve(entry.target);}}},{threshold:.08,rootMargin:'0px 0px 45px 0px'});
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }
})();
