/* DJ Arwenn — lightweight, dependency-free static site. No analytics or cookies. */
(() => {
  'use strict';
  const strings = {
    sl: {
      aboutReadMore:"PREBERI CELOTNO ZGODBO",aboutReadLess:"SKRIJ ZGODBO",musicPanelFoot:"TVOJA GLASBA. TVOJ VEČER.",inquiryLabel:"POVPRAŠEVANJE / DJ ARWENN",
      navAbout:"O meni",
      musicPrivateTitle:"ZA VSE GENERACIJE",
      musicPrivateBody:"Slovenska, hrvaška, narodna in balkanska glasba, pop, rock ter hiti in remixi za skupno petje in ples.",
      musicClubTitle:"ZA KLUBSKE VEČERE",
      musicClubBody:"House, tech house in techno za trenutke, ko prostor narekuje bolj udaren ritem.",
      aboutKicker:"ZA MEŠALNO MIZO",
      aboutTitle:"MANJ GOVORA.<br><em>VEČ GLASBE.</em>",
      aboutP1:"Glasba me spremlja, odkar pomnim. Vse se je začelo z očetovo zbirko kaset, CD-jev in vinilnih plošč. Rock, pop, disco, slovenske in hrvaške uspešnice – vse to je bilo del mojega odraščanja. Glasba me je spremljala doma, na poti v šolo in praktično povsod vmes.",
      aboutP2:"Iz navdušenega poslušalca in zbiratelja glasbe sem sčasoma postal DJ. Med epidemijo sem naredil prve korake za mešalno mizo, danes pa že štiri leta pridobivam izkušnje na različnih dogodkih.",
      aboutEmphasis:"Vsaka zabava ima svoj ritem. In vsaka publika svojo zgodbo.",
      aboutP3:"Pri svojem delu ne prisegam na vnaprej določene playliste. Rad imam slovensko, hrvaško, narodno in balkansko glasbo, energične remixe, house, tech house in techno, vendar je na prvem mestu vedno občinstvo. Spremljam razpoloženje, prilagajam glasbo in z veseljem sprejemam glasbene želje. Navsezadnje so prav gostje tisti, ki ustvarijo pravo vzdušje.",
      aboutP4:"Veliko pozornosti namenim tudi pripravi na dogodek. Z naročniki se pogovorim o glasbenih željah, zvrsteh, ki jih ne želijo slišati, časovnici, posebnih trenutkih in osvetlitvi. Dobra zabava ni samo prava pesem, ampak tudi pravi trenutek zanjo.",
      aboutEmphasis2:"Najlepši del mojega dela pa ostajajo ljudje.",
      aboutP5:"Tisti presenečeni pogledi ob nepričakovani pesmi. Nasmehi, skupno petje in plesišče, na katerem se srečajo različne generacije. Včasih se zabava tako razživi, da se ples nadaljuje celo na mizah.",
      aboutP6:"Največ mi pomenijo trenutki ob koncu večera. Iskren stisk roke, nasmeh, čestitke ali sporočilo naslednji dan:",
      aboutQuote:"»To je bila nora fešta!«",
      aboutP7:"Takrat vem, da je glasba opravila svoje.",
      aboutSignature:"Manj govora. Več glasbe. Naj govori plesišče.",
      aboutRecordTop:"OD OČETOVE ZBIRKE",
      aboutRecordBottom:"DO DJ-PULTA.",
      aboutRecordNote:"Glasba je bila del zgodbe, še preden je prišla prva zabava.",
      collaborationKicker:"OD PRVEGA SPOROČILA DO ZADNJEGA KOMADA",
      collaborationTitle:"KAKO POTEKA<br><em>SODELOVANJE?</em>",
      collaborationLead:"Preprosto, osebno in prilagojeno tvojemu dogodku.",
      collaborationScope:"Tako običajno poteka sodelovanje pri zasebnih zabavah. Za klube in druge dogodke se dogovorimo posebej.",
      step1Title:"SPOZNAJMO TVOJ DOGODEK",
      step1Body:"Vsaka zabava je drugačna. Najprej se pogovorimo o datumu, lokaciji, trajanju in glasbenih željah. Na podlagi teh informacij pripravim ponudbo, prilagojeno tvojemu dogodku.",
      step2Title:"DOGOVOR IN POTRDITEV",
      step2Body:"Ko se dogovorimo in potrdiš ponudbo, termin zabeležim v koledar. O programu, posebnih željah in drugih podrobnostih se lahko dogovorimo pred dogodkom.",
      step3Title:"PRIPRAVE BREZ ZAPLETOV",
      step3Body:"Na prizorišče običajno pridem približno uro pred začetkom. Sam poskrbim za postavitev dogovorjenega ozvočenja, osvetlitve in DJ-opreme, da je vse pripravljeno pravočasno.",
      step4Title:"GLASBA PREVZAME GLAVNO VLOGO",
      step4Body:"Med zabavo spremljam vzdušje, prilagajam glasbo in z veseljem sprejemam glasbene želje. Če se večer razvije v pravo fešto in si želiš podaljšanja, se lahko o tem dogovorimo.",
      teaserKicker:"DJ ARWENN / THE MOMENTS",
      teaserTitle:"NAJBOLJŠIH VEČEROV NE MOREŠ OPISATI.<br><em>MORAŠ JIH DOŽIVETI.</em>",
      teaserLead:"Pravi foto in video utrinki so v pripravi. Medtem lahko spremljaš dogajanje na mojih profilih.",
      teaserBadge:"UTRINKI KMALU",
      availabilityKicker:'HITRO PREVERJANJE',availabilityTitle:'KDAJ NAČRTUJEŠ ZABAVO?',availabilityInfo:'Preveri svoj datum, brez javnega prikaza zasedenosti. Končni termin potrdim osebno.',availabilityDateLabel:'DATUM DOGODKA',availabilityAction:'PREVERI TERMIN',availabilityContinue:'POŠLJI POVPRAŠEVANJE →',formBooked:'Za izbrani datum trenutno ne sprejemam novih rezervacij. Izberi drug datum ali mi piši na Messenger.',
      dateDiscretion:'Razpoložljivost termina preverim osebno in odgovorim na povpraševanje.',
      heroArea:'⌖ OBMOČJE NASTOPOV: OD PREKMURJA DO CELJA',
      faqKicker:'DOBRO JE VEDETI',faqTitle:'PREDEN SE<br><em>DOGOVORIMO.</em>',
      faq1Q:'Kje nastopa DJ Arwenn?',faq1A:'Najpogosteje nastopam na dogodkih od Prekmurja do Celja.',
      faq2Q:'Za katere dogodke lahko rezerviram DJ-ja?',faq2A:'Za poroke, rojstne dneve, abrahame, zasebne zabave, poslovna srečanja in klubske večere.',
      faq3Q:'Kakšno glasbo vrtiš?',faq3A:'Od slovenske in hrvaške glasbe, narodne in narodnozabavne do popa, rocka, tech housa in techna. Izbor prilagodim dogodku in gostom.',
      faq4Q:'Kako preverim prost termin?',faq4A:'Piši na Messenger ali pošlji povpraševanje z datumom in krajem dogodka. Odgovorim po preverjanju termina.',
      privacyLink:'ZASEBNOST',formOpenMail:'ODPRI E-POŠTO',formOpenMessenger:'MESSENGER',
      formRecover:'Oddaja ni bila potrjena. Podatki ostanejo v obrazcu; pošlji povpraševanje prek e-pošte ali Messengerja.',
      turnstilePrivacy:'Razumem, da bodo moji podatki uporabljeni za odgovor na povpraševanje. Varnostno preverjanje opravi Cloudflare Turnstile, sporočilo pa posreduje Google Apps Script. Preberem lahko <a href="zasebnost.html" target="_blank" rel="noopener noreferrer">obvestilo o zasebnosti</a>.',turnstileServiceNote:'Obrazec uporablja Cloudflare Turnstile in Google Apps Script za dostavo sporočila. Če pošiljanje ni na voljo, lahko uporabiš e-pošto ali Messenger.',
      turnstileSuccess:'Povpraševanje je bilo poslano. Odgovorim, ko preverim termin.',
      turnstileIntro:'HITRO VARNOSTNO PREVERJANJE',turnstileWait:'Varnostno preverjanje se še nalaga. Poskusi znova ali uporabi Messenger.',formSlowDown:'Preveč povpraševanj v kratkem času. Poskusi pozneje ali mi piši na Messenger.',formUnavailable:'Pošiljanje trenutno ni na voljo. Poskusi znova ali mi piši prek Messengerja.',
      captchaIntro:'ZAŠČITA PRED NEŽELENO POŠTO · Potrdi, da nisi robot.',captchaRequired:'Pred pošiljanjem prosim potrdi preverjanje »Nisem robot«.',captchaUnavailable:'Varnostnega preverjanja ni mogoče naložiti. Poskusi osvežiti stran ali mi piši prek Messengerja.',captchaRetry:'Povpraševanje ni bilo poslano. Po potrebi ponovno opravi preverjanje »Nisem robot« in poskusi znova.',formSending:'POŠILJANJE ...',formSuccess:'Povpraševanje je Web3Forms sprejel. Za dokončno potrditev preveri še, ali je sporočilo prispelo v nabiralnik.',
      formFailure:'Zunanja storitev se ni odzvala ali oddaje ni potrdila. Povpraševanja zato ne moremo šteti kot poslanega.',
      formServiceNote:'Podatki se pošljejo prek zunanjega ponudnika Web3Forms. Če ta ni dosegljiv, bo na voljo druga možnost stika.',
      formPrivacy:'Razumem, da bodo moji podatki uporabljeni za odgovor na povpraševanje in posredovani prek storitve Web3Forms. Preberem lahko <a href="zasebnost.html" target="_blank" rel="noopener noreferrer">obvestilo o zasebnosti</a>.',
      footerPrivacy:'Brez analitičnih piškotkov · Kontaktni obrazec uporablja zunanjo storitev.',
      heroPortraitTag:'ZA VSE GENERACIJE',genreSloCro:'SLO & CRO POP',genreNarodna:'NARODNA',genreNarodnozabavna:'NARODNOZABAVNA',genreTechHouse:'TECH HOUSE',genreTechno:'TECHNO',genreRock:'ROCK',genrePop:'POP',skip:'Preskoči na vsebino', mobileBook:'PREVERI TERMIN', navServices:'Dogodki',navMusic:'Glasba',navMoments:'Utrinki',navContact:'Kontakt',navCheck:'Preveri termin',
      heroEyebrow:'DJ ZA TVOJE NEPOZABNE TRENUTKE',heroTop:'DOBER VEČER.',heroBottom:'HUD ŽUR.',heroLead:'Od prvega komada do zadnjega refrena. Glasba, ki poveže generacije in spravi družbo na plesišče.',heroCta:'PREVERI PROST TERMIN',heroMore:'ODKRIJ MOJO GLASBO',metaOne:'POROKE',metaTwo:'ZABAVE',metaThree:'DOGODKI',
      servicesKicker:'ZA VSAK DOBER RAZLOG ZA ZABAVO',servicesTitle:'TVOJ DOGODEK.<br><em>MOJA GLASBA.</em>',servicesLead:'Vsaka zabava ima svojo zgodbo. Skupaj poiščemo pravi ritem, od prvih gostov do zadnjega plesa.',
      service1Title:'POROKE',service1Body:'Od nežnih trenutkov do plesišča, ki ne počiva. Glasbena spremljava za vajin dan.',service2Title:'ROJSTNI DNEVI',service2Body:'Od 18-ke do 80-ke – vsako praznovanje ima svoje hite. Glasba in energija za vse generacije.',service3Title:'POSLOVNI DOGODKI',service3Body:'Zaključki, obletnice in druženja. Pravo vzdušje za sproščen in nepozaben večer.',service4Title:'KLUBI & EVENTI',service4Body:'House, tech house in techno. Seti za večere, ko ritem prevzame glavno besedo.',serviceLink:'POVPRAŠAJ ZA TERMIN <span aria-hidden="true">↗</span>',
      musicKicker:'ZA VSE OKUSE IN VSE GENERACIJE',musicTitle:'KO SE NAJDE<br><em>PRAVI RITEM.</em>',musicLead:'Nobeni dve zabavi nista enaki. Zato tudi ni ene same playliste za vse. Glasbo prilagodim dogodku, gostom in razpoloženju.',musicCta:'POGLEJ UTRINKE',musicPanelTitle:'OD KLASIK DO<br><span>KLUBSKEGA RITMA</span>',
      momentsKicker:'UŠEČKAŠ? NAJPREJ POGLEJ.',momentsTitle:'VZDUŠJE, KI GA<br><em>NE POZABIŠ.</em>',momentsLead:'Najboljše zgodbe nastanejo na plesišču. Poglej utrinke z nastopov in spremljaj dogajanje.',moment1Small:'POGLEJ DOGAJANJE',moment1Title:'UTRINKI Z<br>NASTOPOV',moment2Small:'OSTANI V RITMU',moment2Title:'ZA ODRSKIMI<br>LUČMI',moment3Small:'VSE NA ENEM MESTU',moment3Title:'ŠE VEČ<br>GLASBE',momentButton:'ODPRI PROFIL',
      contactKicker:'REZERVACIJE IN POVPRAŠEVANJA',contactTitle:'IMAŠ DATUM?<br><em>JAZ IMAM BEAT.</em>',contactLead:'Povej mi, kakšno zabavo pripravljaš. Preveriva termin in skupaj začrtava pravi glasbeni večer.',directMessenger:'PIŠI MI NA MESSENGER',contactNote:'Piši mi prek Messengerja ali pošlji povpraševanje z obrazcem.',
      formTitle:'POŠLJI POVPRAŠEVANJE',formHelp:'Izpolni obrazec. Povpraševanje bom prejel po e-pošti in ti lahko odgovoril neposredno.',fieldType:'VRSTA DOGODKA',typeParty:'Rojstni dan / zasebna zabava',typeWedding:'Poroka',typeBusiness:'Poslovni dogodek',typeClub:'Klub / javna prireditev',typeOther:'Drugo',fieldDate:'DATUM',fieldLocation:'KRAJ DOGODKA',locationPlaceholder:'npr. Ptuj',fieldNotes:'DODATNE INFORMACIJE (NEOBVEZNO)',notesPlaceholder:'Okvirno število gostov, glasbene želje ...',formGenerate:'POŠLJI POVPRAŠEVANJE',messageLabel:'TVOJE SPOROČILO',copyButton:'KOPIRAJ SPOROČILO',copiedButton:'KOPIRANO ✓',copyError:'OZNAČI IN KOPIRAJ SPOROČILO',openMessenger:'ODPRI MESSENGER ↗',messageHelp:'Sporočilo se ne pošlje samodejno. Prilepi ga v Messenger in pošlji.',
      footerTag:'TVOJ VEČER. TVOJ RITEM.',footerPrivacy:'Brez sledilnih piškotkov · Zunanje povezave imajo svoje pogoje.',
      fieldName:'IME IN PRIIMEK',namePlaceholder:'Ime in priimek',fieldEmail:'E-POŠTA',emailPlaceholder:'ime@primer.si',fieldPhone:'TELEFON (NEOBVEZNO)',phonePlaceholder:'+386 ...',formPrivacy:'Razumem, da bodo moji podatki uporabljeni za odgovor na povpraševanje in posredovani prek storitve Web3Forms. Preberem lahko <a href="zasebnost.html" target="_blank" rel="noopener noreferrer">obvestilo o zasebnosti</a>.',formServiceNote:'Obrazec varno posreduje podatke prek storitve Web3Forms. Uporabim jih samo za odgovor na tvoje povpraševanje.',footerSocialTitle:'POVEŽIMO SE',
      inquiryIntro:'Živjo, DJ Arwenn! Zanima me, ali si prost za naslednji dogodek:',inquiryType:'Vrsta dogodka',inquiryDate:'Datum',inquiryPlace:'Kraj',inquiryNotes:'Dodatne informacije',inquiryClosing:'Mi lahko sporočiš, ali imaš termin prost? Hvala!'
    },
    en: {
      aboutReadMore:"READ MY FULL STORY",aboutReadLess:"HIDE STORY",musicPanelFoot:"YOUR MUSIC. YOUR NIGHT.",inquiryLabel:"ENQUIRY / DJ ARWENN",
      navAbout:"About",
      musicPrivateTitle:"FOR EVERY GENERATION",
      musicPrivateBody:"Slovenian, Croatian, folk and Balkan favourites, pop, rock, party hits and remixes that get everyone singing and dancing.",
      musicClubTitle:"FOR CLUB NIGHTS",
      musicClubBody:"House, tech house and techno when the night calls for a harder groove.",
      aboutKicker:"BEHIND THE DECKS",
      aboutTitle:"LESS TALK.<br><em>MORE MUSIC.</em>",
      aboutP1:"Music has been part of my life for as long as I can remember. It started with my dad’s collection of cassettes, CDs and vinyl records. Rock, pop, disco, Slovenian and Croatian hits – the soundtrack to my childhood, from home to the journey to school and everywhere in between.",
      aboutP2:"Over time, a passionate listener and music collector became a DJ. I took my first steps behind the decks during the pandemic, and I’ve now spent four years gaining experience at a variety of events.",
      aboutEmphasis:"Every party has its own rhythm. Every crowd has its own story.",
      aboutP3:"I don’t believe in one fixed playlist for every event. I love Slovenian, Croatian, folk and Balkan music, energetic remixes, house, tech house and techno, but the people always come first. I read the room, adapt the selection and genuinely enjoy taking song requests. After all, the guests are what make the atmosphere.",
      aboutP4:"Preparation matters just as much. I talk to clients about the music they love, the genres they’d rather avoid, the schedule, special moments and lighting. A great party is not just about the right song – it’s about playing it at the right moment.",
      aboutEmphasis2:"The best part of my work will always be the people.",
      aboutP5:"Those surprised looks when an unexpected song comes on. The smiles, the singalongs and a dance floor that brings generations together. Every now and then the atmosphere gets so lively that people end up dancing on the tables.",
      aboutP6:"What means the most are those moments at the end of the night: a sincere handshake, a smile, congratulations or a message the following day:",
      aboutQuote:"“What an incredible party!”",
      aboutP7:"That’s when I know the music did its job.",
      aboutSignature:"Less talk. More music. Let the dance floor speak.",
      aboutRecordTop:"FROM DAD’S COLLECTION",
      aboutRecordBottom:"TO THE DJ DECKS.",
      aboutRecordNote:"Music was part of the story long before the first party.",
      collaborationKicker:"FROM THE FIRST MESSAGE TO THE LAST TRACK",
      collaborationTitle:"HOW DOES IT<br><em>WORK?</em>",
      collaborationLead:"Simple, personal and tailored to your event.",
      collaborationScope:"This is how I usually work at private celebrations. Club and other event arrangements are agreed separately.",
      step1Title:"LET’S GET TO KNOW YOUR EVENT",
      step1Body:"Every party is different. First, we discuss the date, location, duration and music preferences. With those details, I can prepare a quote suited to your event.",
      step2Title:"AGREE AND CONFIRM",
      step2Body:"Once we agree on the details and you confirm the offer, I add the date to my calendar. We can fine-tune the programme, special requests and other details beforehand.",
      step3Title:"A SMOOTH SETUP",
      step3Body:"I usually arrive around an hour before the start. I set up the agreed sound system, lighting and DJ equipment myself so everything is ready on time.",
      step4Title:"LET THE MUSIC TAKE OVER",
      step4Body:"During the party I read the room, adapt the music and gladly take requests. If the night is going strong and you would like to extend it, we can discuss the options.",
      teaserKicker:"DJ ARWENN / THE MOMENTS",
      teaserTitle:"THE BEST NIGHTS ARE HARD TO DESCRIBE.<br><em>YOU HAVE TO FEEL THEM.</em>",
      teaserLead:"Real event photos and videos are on their way. In the meantime, follow the action on my social profiles.",
      teaserBadge:"HIGHLIGHTS COMING SOON",
      availabilityKicker:'QUICK DATE CHECK',availabilityTitle:'WHEN IS YOUR EVENT?',availabilityInfo:'Check your date privately, without a public booking calendar. I will confirm the final booking personally.',availabilityDateLabel:'EVENT DATE',availabilityAction:'CHECK DATE',availabilityContinue:'SEND AN ENQUIRY →',formBooked:'I am not taking new bookings for that date. Please choose another or message me on Messenger.',
      dateDiscretion:'I will check the requested date personally and respond to your enquiry.',
      heroArea:'⌖ SERVICE AREA: FROM PREKMURJE TO CELJE',
      faqKicker:'GOOD TO KNOW',faqTitle:'BEFORE WE<br><em>PLAN YOUR EVENT.</em>',
      faq1Q:'Where does DJ Arwenn perform?',faq1A:'I most often perform at events from Prekmurje to Celje.',
      faq2Q:'What events can I book DJ Arwenn for?',faq2A:'Weddings, birthdays, milestone celebrations, private parties, corporate gatherings and club nights.',
      faq3Q:'What music do you play?',faq3A:'Slovenian and Croatian hits, traditional folk and folk-pop, pop, rock, tech house and techno. The selection is tailored to the event and guests.',
      faq4Q:'How can I check availability?',faq4A:'Send a Messenger message or a booking enquiry with the event date and location. I will reply after checking availability.',
      privacyLink:'PRIVACY',formOpenMail:'OPEN EMAIL APP',formOpenMessenger:'MESSENGER',
      formRecover:'Submission could not be confirmed. Your details are still in the form. Please email your enquiry or use Messenger.',
      turnstilePrivacy:'I understand that my details will be used to respond to my enquiry. Cloudflare Turnstile performs the security check and Google Apps Script delivers the message. Read the <a href="zasebnost.html" target="_blank" rel="noopener noreferrer">privacy notice</a>.',turnstileServiceNote:'This form uses Cloudflare Turnstile and Google Apps Script to deliver your message. You can also contact me by email or Messenger.',
      turnstileSuccess:'Your enquiry was sent. I will reply after checking availability.',
      turnstileIntro:'QUICK SECURITY CHECK',turnstileWait:'Security verification is still loading. Please retry or use Messenger.',formSlowDown:'Too many enquiries. Please retry later or message me on Messenger.',formUnavailable:'Sending is currently unavailable. Please retry or contact me on Messenger.',
      captchaIntro:'SPAM PROTECTION · Please confirm you are not a robot.',captchaRequired:'Please complete the “I am human” check before sending.',captchaUnavailable:'The security check could not load. Please refresh the page or contact me via Messenger.',captchaRetry:'Your request was not sent. Please complete the captcha again if needed and retry.',formSending:'SENDING ...',formSuccess:'Web3Forms accepted your enquiry. I will confirm availability after receiving the email.',
      formFailure:'The external service was unavailable or did not confirm submission. We cannot mark your message as sent.',
      formServiceNote:'Your details are handled by the external provider Web3Forms. If it is unavailable, an alternative contact option will appear.',
      formPrivacy:'I understand that my details will be used to respond to my enquiry and processed via Web3Forms. Read the <a href="zasebnost.html" target="_blank" rel="noopener noreferrer">privacy notice</a>.',
      footerPrivacy:'No analytics cookies · The contact form uses an external provider.',
      heroPortraitTag:'FOR EVERY GENERATION',genreSloCro:'SLO & CRO POP',genreNarodna:'FOLK',genreNarodnozabavna:'SLOVENIAN FOLK POP',genreTechHouse:'TECH HOUSE',genreTechno:'TECHNO',genreRock:'ROCK',genrePop:'POP',skip:'Skip to content',mobileBook:'CHECK A DATE',navServices:'Events',navMusic:'Music',navMoments:'Highlights',navContact:'Contact',navCheck:'Check a date',
      heroEyebrow:'THE DJ FOR YOUR BEST MOMENTS',heroTop:'GOOD EVENING.',heroBottom:'GREAT PARTY.',heroLead:'From the first track to the last singalong. Music that brings generations together and fills the dance floor.',heroCta:'CHECK AVAILABILITY',heroMore:'DISCOVER MY MUSIC',metaOne:'WEDDINGS',metaTwo:'PARTIES',metaThree:'EVENTS',
      servicesKicker:'EVERY GREAT PARTY HAS A REASON',servicesTitle:'YOUR EVENT.<br><em>MY MUSIC.</em>',servicesLead:'Every celebration has a story. Together we find its perfect rhythm, from the first guest to the last dance.',
      service1Title:'WEDDINGS',service1Body:'From the heartfelt moments to a packed dance floor. Music for your special day.',service2Title:'BIRTHDAYS',service2Body:'From 18th to 80th birthdays, every celebration has its own hits. Music and energy for every generation.',service3Title:'CORPORATE EVENTS',service3Body:'Team parties, celebrations and get-togethers. The right atmosphere for a memorable night.',service4Title:'CLUBS & EVENTS',service4Body:'House, tech house and techno. Sets for nights when the beat takes over.',serviceLink:'ASK ABOUT A DATE <span aria-hidden="true">↗</span>',
      musicKicker:'EVERY TASTE. EVERY GENERATION.',musicTitle:'FINDING<br><em>YOUR RHYTHM.</em>',musicLead:'No two celebrations are alike. There is no one-size-fits-all playlist. I adapt the music to your event, your guests and the mood.',musicCta:'EXPLORE THE HIGHLIGHTS',musicPanelTitle:'FROM CLASSICS TO<br><span>CLUB BEATS</span>',
      momentsKicker:'THE VIBE SPEAKS FOR ITSELF',momentsTitle:'NIGHTS TO<br><em>REMEMBER.</em>',momentsLead:'The best stories happen on the dance floor. Explore event highlights and stay connected.',moment1Small:'SEE THE ACTION',moment1Title:'LIVE<br>HIGHLIGHTS',moment2Small:'STAY IN THE LOOP',moment2Title:'BEHIND<br>THE BEATS',moment3Small:'ALL IN ONE PLACE',moment3Title:'MORE<br>MUSIC',momentButton:'VIEW PROFILE',
      contactKicker:'BOOKINGS & ENQUIRIES',contactTitle:'GOT A DATE?<br><em>I’VE GOT THE BEAT.</em>',contactLead:'Tell me what you’re planning. Let’s check availability and shape the soundtrack to your night.',directMessenger:'MESSAGE ME ON MESSENGER',contactNote:'Reach me on Messenger or submit a booking request using the form.',
      formTitle:'SEND A BOOKING REQUEST',formHelp:'Fill in the form to send your enquiry to my email so I can reply to you.',fieldType:'EVENT TYPE',typeParty:'Birthday / private party',typeWedding:'Wedding',typeBusiness:'Corporate event',typeClub:'Club / public event',typeOther:'Other',fieldDate:'DATE',fieldLocation:'EVENT LOCATION',locationPlaceholder:'e.g. Ptuj',fieldNotes:'ADDITIONAL DETAILS (OPTIONAL)',notesPlaceholder:'Approx. number of guests, music preferences ...',formGenerate:'SEND ENQUIRY',messageLabel:'YOUR MESSAGE',copyButton:'COPY MESSAGE',copiedButton:'COPIED ✓',copyError:'SELECT & COPY MESSAGE',openMessenger:'OPEN MESSENGER ↗',messageHelp:'Your message is not sent automatically. Paste it into Messenger and send it.',
      footerTag:'YOUR NIGHT. YOUR RHYTHM.',footerPrivacy:'No tracking cookies · External links have their own terms.',
      fieldName:'FULL NAME',namePlaceholder:'Full name',fieldEmail:'EMAIL',emailPlaceholder:'name@example.com',fieldPhone:'PHONE (OPTIONAL)',phonePlaceholder:'+386 ...',formPrivacy:'I understand that my details will be used to respond to my enquiry and processed via Web3Forms. Read the <a href="zasebnost.html" target="_blank" rel="noopener noreferrer">privacy notice</a>.',formServiceNote:'This form sends your details via Web3Forms. Your information is used only to answer your enquiry.',footerSocialTitle:'CONNECT WITH ME',
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
    document.title = lang === 'sl' ? 'DJ Arwenn | DJ za poroke in zabave – Prekmurje do Celja' : 'DJ Arwenn | Weddings, parties & events – Prekmurje to Celje';
    document.dispatchEvent(new Event('arwenn:languagechanged'));
  }
  langButtons.forEach((button) => button.addEventListener('click',() => renderLanguage(button.dataset.lang)));
  const menu = choose('menu-toggle');
  const nav = choose('main-nav');
  menu.addEventListener('click',() => {const open = nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open ? 'Zapri meni / Close menu' : 'Odpri meni / Open menu');});
  document.querySelectorAll('#main-nav a').forEach((link) => link.addEventListener('click',() => {nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
  const bars = choose('wave-bars');
  for (let i = 0; i < 63; i++) {const bar = document.createElement('span');const h = 4 + (Math.abs(Math.sin(i * .51) * Math.sin(i * .13)) * 18);bar.style.setProperty('--h',`${h.toFixed(1)}px`);bars.appendChild(bar);}

  // DJ ARWENN FORM RELIABILITY: Web3Forms with email/Messenger fallback and live booked-date validation.
  const bookingForm = choose('inquiry-form');
  if (bookingForm) {
    const status = choose('form-status');
    const recovery = choose('form-recovery');
    const emailFallback = choose('fallback-mailto');
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const submitText = submitButton.querySelector('[data-t="formGenerate"]');
    const captchaBox = bookingForm.querySelector('.h-captcha');
    const captchaPanel = bookingForm.querySelector('.inquiry-captcha');
    const captchaLabel = captchaPanel?.querySelector('.inquiry-captcha-label');
    const consentLabel = bookingForm.querySelector('[data-t="formPrivacy"]');
    const serviceLabel = bookingForm.querySelector('[data-t="formServiceNote"]');
    let captchaMode = 'hcaptcha';
    let turnstileWidget = null;
    let turnstileToken = '';
    let turnstileReady = false;
    let turnstileFailed = false;

    function updateDeliveryLabels() {
      if (consentLabel) consentLabel.innerHTML = captchaMode === 'turnstile'
        ? strings[lang].turnstilePrivacy : strings[lang].formPrivacy;
      if (serviceLabel) serviceLabel.textContent = captchaMode === 'turnstile'
        ? strings[lang].turnstileServiceNote : strings[lang].formServiceNote;
      if (captchaLabel) captchaLabel.textContent = captchaMode === 'turnstile'
        ? strings[lang].turnstileIntro : strings[lang].captchaIntro;
    }

    // Preserve the Web3Forms + hCaptcha fallback if Turnstile cannot run.
    function restoreHcaptcha() {
      turnstileFailed = true;
      turnstileToken = '';
      turnstileReady = false;
      captchaMode = 'hcaptcha';
      if (captchaBox) captchaBox.hidden = false;
      if (window.turnstile && turnstileWidget !== null) {
        try { window.turnstile.remove(turnstileWidget); } catch (_) {}
      }
      turnstileWidget = null;
      captchaPanel?.querySelectorAll('.turnstile-widget').forEach(node => node.remove());
      updateDeliveryLabels();
    }

    async function configureEnquiryCaptcha() {
      try {
        const response = await fetch('/api/enquiry/config', { cache:'no-store' });
        if (!response.ok) return;
        const config = await response.json();
        if (config.mode !== 'turnstile' || typeof config.sitekey !== 'string') return;
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.onload = () => {
          if (!window.turnstile) return;
          try {
            const container = document.createElement('div');
            container.className = 'turnstile-widget';
            captchaPanel.appendChild(container);
            turnstileWidget = window.turnstile.render(container, {
              sitekey: config.sitekey,
              action: 'dj_enquiry',
              appearance: 'always',
              callback: token => { if (!turnstileFailed) turnstileToken = token; },
              'expired-callback': () => { turnstileToken = ''; },
              'error-callback': () => {
                turnstileFailed = true;
                if (turnstileReady) restoreHcaptcha();
                return true;
              }
            });
            if (turnstileFailed) { restoreHcaptcha(); return; }
            captchaMode = 'turnstile';
            turnstileReady = true;
            if (captchaBox) captchaBox.hidden = true;
            updateDeliveryLabels();
          } catch (_) { restoreHcaptcha(); }
        };
        script.onerror = () => { restoreHcaptcha(); };
        document.head.appendChild(script);
      } catch (_) { /* Keep the existing hCaptcha flow on network errors. */ }
    }
    configureEnquiryCaptcha();
    document.addEventListener('arwenn:languagechanged', updateDeliveryLabels);

    let lastSuccessAt = 0;
    const showFormIssue = (text) => {
      status.hidden = false;
      status.dataset.state = 'error';
      status.textContent = text;
      if (emailFallback) emailFallback.href = buildMailto();
      recovery.hidden = false;
    };
    const fieldValue = (id) => (choose(id)?.value || '').trim();
    const buildMailto = () => {
      const name = fieldValue('client-name');
      const subject = 'DJ Arwenn - povprasevanje za nastop';
      const body = [
        'Pozdravljen, DJ Arwenn!',
        '',
        'Ime: ' + name,
        'Kontakt: ' + fieldValue('client-email'),
        'Telefon: ' + (fieldValue('client-phone') || '-'),
        'Vrsta dogodka: ' + (fieldValue('event-type') || '-'),
        'Datum: ' + fieldValue('event-date'),
        'Kraj: ' + fieldValue('event-location'),
        'Opombe: ' + (fieldValue('event-notes').slice(0, 800) || '-'),
        '',
        'Prosim za preverjanje prostega termina.'
      ].join('\n');
      return 'mailto:sasolju999@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    };
    bookingForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (submitButton.disabled || !bookingForm.reportValidity()) return;
      // Both systems enforce their challenge server-side (Web3Forms or the Worker).
      const captchaToken = captchaMode === 'turnstile'
        ? (turnstileReady ? turnstileToken : '')
        : bookingForm.querySelector('[name="h-captcha-response"]')?.value?.trim();
      if (!captchaToken) {
        const captchaLoaded = captchaMode === 'turnstile' ? turnstileReady : Boolean(captchaBox?.querySelector('iframe'));
        showFormIssue(captchaMode === 'turnstile'
          ? strings[lang].turnstileWait
          : captchaLoaded ? strings[lang].captchaRequired : strings[lang].captchaUnavailable);
        captchaPanel?.scrollIntoView({ behavior:'smooth', block:'center' });
        return;
      }
      // Small accidental-double-submit guard in this tab; not a server-side spam limit.
      if (Date.now() - lastSuccessAt < 45000) {
        showFormIssue(strings[lang].captchaRetry);
        return;
      }
      submitButton.disabled = true;
      // Mandatory live single-date check for BOTH Turnstile and Web3Forms.
      // Unknown/unreachable/rate-limited never means available, and the
      // fallback must not bypass a confirmed Calendar booking block.
      const selectedBookingDate = choose('event-date')?.value || '';
      const statusOfDate = window.DJArwennAvailability && selectedBookingDate
        ? await window.DJArwennAvailability.lookup(selectedBookingDate, { fresh:true })
        : 'unknown';
      if (statusOfDate !== 'enquiries_open') {
        showFormIssue(statusOfDate === 'booked' ? strings[lang].formBooked
          : statusOfDate === 'rate_limited' ? strings[lang].formSlowDown
          : strings[lang].formUnavailable);
        submitButton.disabled = false;
        return;
      }
      const formData = new FormData(bookingForm);
      if (formData.get('botcheck')) { submitButton.disabled = false; return; }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 18000);
      submitButton.disabled = true;
      status.hidden = false;
      recovery.hidden = true;
      status.dataset.state = 'loading';
      status.textContent = strings[lang].formSending;
      if (submitText) submitText.textContent = strings[lang].formSending;
      try {
        const usingTurnstile = captchaMode === 'turnstile';
        const payload = usingTurnstile ? {
          name: fieldValue('client-name'),
          email: fieldValue('client-email'),
          phone: fieldValue('client-phone'),
          eventType: fieldValue('event-type'),
          eventDate: fieldValue('event-date'),
          location: fieldValue('event-location'),
          notes: fieldValue('event-notes'),
          consent: Boolean(bookingForm.querySelector('.inquiry-consent input[type="checkbox"]')?.checked),
          turnstileToken: captchaToken,
          botcheck: Boolean(formData.get('botcheck'))
        } : Object.fromEntries(formData.entries());
        const response = await fetch(usingTurnstile ? '/api/enquiry' : 'https://api.web3forms.com/submit', {
          method:'POST', body:JSON.stringify(payload), headers:{'Content-Type':'application/json',Accept:'application/json'}, signal:controller.signal, cache:'no-store'
        });
        const result = await response.json().catch(() => null);
        if (!response.ok || !(result && (result.success === true || result.success === 'true'))) {
          if (usingTurnstile && result?.error === 'booked') throw new Error('booked');
          if (usingTurnstile && response.status === 429) throw new Error('rate_limited');
          throw new Error('delivery_failed');
        }
        status.dataset.state = 'success';
        status.textContent = usingTurnstile ? strings[lang].turnstileSuccess : strings[lang].formSuccess;
        lastSuccessAt = Date.now();
        bookingForm.reset();
        if (captchaMode === 'turnstile') {
          turnstileToken = '';
          try { if (window.turnstile && turnstileWidget !== null) window.turnstile.reset(turnstileWidget); } catch (_) {}
        } else if (window.hcaptcha && captchaBox) {
          try { window.hcaptcha.reset(); } catch (_) { /* Widget may already be unmounted. */ }
        }
      } catch (_error) {
        const issue = _error?.message === 'booked' ? strings[lang].formBooked
          : _error?.message === 'rate_limited' ? strings[lang].formSlowDown
          : strings[lang].formFailure;
        showFormIssue(issue);
        if (captchaMode === 'turnstile') {
          turnstileToken = '';
          try { if (window.turnstile && turnstileWidget !== null) window.turnstile.reset(turnstileWidget); } catch (_) {}
        } else if (window.hcaptcha && captchaBox) {
          try { window.hcaptcha.reset(); } catch (_) { /* Allow manual retry. */ }
        }
      } finally {
        clearTimeout(timeoutId);
        submitButton.disabled = false;
        if (submitText) submitText.textContent = strings[lang].formGenerate;
      }
    });
  }

  const dateInput = choose('event-date');
  const today = new Date();
  const y = today.getFullYear(),m = String(today.getMonth()+1).padStart(2,'0'),d = String(today.getDate()).padStart(2,'0');
  dateInput.min = `${y}-${m}-${d}`;
  choose('year').textContent = String(new Date().getFullYear());
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('js-ready');
    const observer = new IntersectionObserver((entries) => {for (const entry of entries) {if (entry.isIntersecting) {entry.target.classList.add('visible');observer.unobserve(entry.target);}}},{threshold:.08,rootMargin:'0px 0px 45px 0px'});
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }
})();
