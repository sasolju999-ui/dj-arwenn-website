/* DJ Arwenn — private single-date availability check. Never guess that a date is available. */
(() => {
  'use strict';
  const get = id => document.getElementById(id);
  const box = get('preveri-termin');
  const dateInput = get('availability-date');
  const action = get('availability-button');
  const result = get('availability-result');
  const continueLink = get('availability-continue');
  const formDate = get('event-date');
  if (!box || !dateInput || !action || !result || !continueLink || !formDate) return;

  const english = () => document.documentElement.lang === 'en';
  const messages = {
    booked: ['TERMIN JE ŽE ZASEDEN. Za ta datum ne sprejemam novih rezervacij. Izberi drug datum.', 'DATE ALREADY BOOKED. I am not accepting new bookings for this date. Please choose another date.'],
    enquiries_open: ['TERMIN JE PREDVIDOMA PROST. Za ta datum sprejemam povpraševanja. Rezervacijo dokončno potrdim osebno.', 'DATE APPEARS AVAILABLE. I am accepting enquiries for this date. I will confirm the booking personally.'],
    unknown: ['Termina trenutno ni mogoče samodejno preveriti. Poskusi pozneje ali mi piši prek Messengerja.', 'Automatic date checking is currently unavailable. Try again later or contact me via Messenger.'],
    rate_limited: ['Preveč preverjanj v kratkem času. Poskusi pozneje ali mi piši prek Messengerja.', 'Too many date checks. Please try again later or contact me via Messenger.'],
    loading: ['PREVERJAM ...', 'CHECKING ...'],
    button: ['PREVERI TERMIN', 'CHECK DATE']
  };
  const label = key => messages[key][english() ? 1 : 0];
  const cache = new Map();
  let requestNumber = 0;

  function reset() {
    requestNumber++;
    result.hidden = true;
    continueLink.hidden = true;
    action.disabled = false;
    action.textContent = label('button');
  }

  function show(status, selectedDate) {
    result.hidden = false;
    result.dataset.status = status;
    result.textContent = label(status);
    continueLink.hidden = status !== 'enquiries_open';
    if (status === 'enquiries_open' && selectedDate) formDate.value = selectedDate;
  }

  async function lookup(date, options = {}) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'unknown';
    const saved = cache.get(date);
    // Form submission requires a fresh check, not the 45-second UI cache.
    if (!options.fresh && saved && Date.now() < saved.until) return saved.status;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ date }),
        cache: 'no-store',
        signal: controller.signal
      });
      const payload = await response.json().catch(() => null);
      if (response.status === 429 || payload?.reason === 'rate_limited') return 'rate_limited';
      if (!response.ok || !payload) return 'unknown';
      if (payload.status !== 'booked' && payload.status !== 'enquiries_open') return 'unknown';
      cache.set(date, { status: payload.status, until: Date.now() + 45000 });
      return payload.status;
    } catch (_) {
      return 'unknown';
    } finally {
      clearTimeout(timeout);
    }
  }

  async function check() {
    if (action.disabled || !dateInput.reportValidity()) return;
    const chosen = dateInput.value;
    const id = ++requestNumber;
    action.disabled = true;
    action.textContent = label('loading');
    result.hidden = true;
    continueLink.hidden = true;
    try {
      const status = await lookup(chosen);
      if (id === requestNumber && dateInput.value === chosen) show(status, chosen);
    } finally {
      if (id === requestNumber) {
        action.disabled = false;
        action.textContent = label('button');
      }
    }
  }

  dateInput.addEventListener('change', reset);
  dateInput.addEventListener('input', reset);
  action.addEventListener('click', check);
  continueLink.addEventListener('click', () => { formDate.value = dateInput.value; });
  document.addEventListener('arwenn:languagechanged', () => {
    if (!action.disabled) action.textContent = label('button');
    if (!result.hidden && messages[result.dataset.status]) result.textContent = label(result.dataset.status);
  });
  const nowParts = new Intl.DateTimeFormat('en-CA', {year:'numeric', month:'2-digit', day:'2-digit', timeZone:'Europe/Ljubljana'}).formatToParts(new Date());
  const fields = Object.fromEntries(nowParts.map(part => [part.type, part.value]));
  dateInput.min = fields.year + '-' + fields.month + '-' + fields.day;
  formDate.min = dateInput.min;
  // On small screens the fixed CTA must not cover the booking form.
  const bookingCard = box.closest('.inquiry-card');
  if (bookingCard && 'IntersectionObserver' in window) {
    const visibility = new IntersectionObserver(entries => {
      document.body.classList.toggle('booking-in-view', entries[0].isIntersecting);
    }, { threshold: 0, rootMargin: '0px 0px -55px 0px' });
    visibility.observe(bookingCard);
  }
  window.DJArwennAvailability = { lookup };
})();
