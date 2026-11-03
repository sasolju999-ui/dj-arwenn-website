/* DJ Arwenn — one-date check, no public availability calendar or booking list. */
(() => {
  'use strict';
  const get = id => document.getElementById(id);
  const box = get('availability-check');
  const dateInput = get('availability-date');
  const action = get('availability-button');
  const result = get('availability-result');
  const continueLink = get('availability-continue');
  const formDate = get('event-date');
  if (!box || !dateInput || !action || !result || !continueLink || !formDate) return;
  const english = () => document.documentElement.lang === 'en';
  const translated = (sl, en) => english() ? en : sl;
  const cache = new Map();
  const results = {
    booked: [
      'Za izbrani datum trenutno ne sprejemam novih rezervacij. Izberi drug datum.',
      'I am not taking new bookings for this date. Please choose another date.'
    ],
    enquiries_open: [
      'Za ta datum sprejemam povpraševanja. Pošlji mi podatke o dogodku; termin dokončno potrdim osebno.',
      'I am accepting enquiries for this date. Tell me about your event; I will confirm the booking personally.'
    ],
    unknown: [
      'Zasedenosti trenutno ne morem samodejno preveriti. Pošlji povpraševanje in termin ti osebno potrdim.',
      'Automatic availability is temporarily unavailable. Send an enquiry and I will confirm the date personally.'
    ],
    loading: ['PREVERJAM ...', 'CHECKING ...'],
    button: ['PREVERI TERMIN', 'CHECK DATE']
  };
  const labels = key => results[key][english() ? 1 : 0];
  function show(status) {
    result.hidden = false;
    result.dataset.status = status;
    result.textContent = labels(status);
    continueLink.hidden = status === 'booked';
    if (status !== 'booked' && dateInput.value) formDate.value = dateInput.value;
  }
  async function lookup(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'unknown';
    const saved = cache.get(date);
    if (saved && Date.now() < saved.until) return saved.status;
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
      if (!response.ok) return 'unknown';
      const body = await response.json();
      const status = body?.status;
      if (status !== 'booked' && status !== 'enquiries_open') return 'unknown';
      cache.set(date, { status, until: Date.now() + 45 * 1000 });
      return status;
    } catch (_) {
      return 'unknown';
    } finally {
      clearTimeout(timeout);
    }
  }
  async function check() {
    if (action.disabled) return;
    if (!dateInput.reportValidity()) return;
    action.disabled = true;
    action.textContent = labels('loading');
    result.hidden = true;
    continueLink.hidden = true;
    try {
      show(await lookup(dateInput.value));
    } finally {
      action.disabled = false;
      action.textContent = labels('button');
    }
  }
  dateInput.addEventListener('change', () => {
    result.hidden = true;
    continueLink.hidden = true;
  });
  action.addEventListener('click', check);
  continueLink.addEventListener('click', () => {
    formDate.value = dateInput.value;
  });
  document.addEventListener('arwenn:languagechanged', () => {
    action.textContent = labels('button');
    if (!result.hidden && ['booked','enquiries_open','unknown'].includes(result.dataset.status)) {
      result.textContent = labels(result.dataset.status);
    }
  });
  const min = new Date();
  const y = min.getFullYear(), m = String(min.getMonth() + 1).padStart(2, '0');
  const d = String(min.getDate()).padStart(2, '0');
  dateInput.min = [y,m,d].join('-');
  // Always fall back to the normal enquiry flow if the private backend
  // is not connected, unavailable, or the visitor hits their rate limit.
  window.DJArwennAvailability = { lookup };
})();
