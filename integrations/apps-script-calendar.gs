/**
 * DJ Arwenn booking-to-calendar bridge (OPTIONAL).
 *
 * Deploy as a separate Google Apps Script web app:
 * Execute as: Me (Sašo); access: Anyone (endpoint is protected by secret).
 * Set project timezone to Europe/Ljubljana.
 * Script property BOOKING_CALENDAR_BRIDGE_TOKEN must match a unique Cloudflare
 * secret of the same name. Never copy secrets into this file or GitHub.
 *
 * Creates only explicitly owner-confirmed all-day bookings.
 * Existing same-day DJ Arwenn events are left untouched to avoid duplicates.
 * Cancellation deletes ONLY exactly one v2 event with both the private
 * script-property ID ledger and the managed description marker.
 * Older/manual bookings require human review and are never deleted automatically.
 * New action "availability" returns only whether an explicitly named
 * Calendar event blocks the date, never personal event details.
 */

/**
 * Only explicitly confirmed DJ bookings or intentionally closed booking
 * periods are website blocks. Never block for regular annual leave, Lara's
 * birthday, free Saturdays, work shifts, DJ marketing reminders, etc.
 */
function bookingBlockKind_(events) {
  var booked = false, closed = false;
  for (var i = 0; i < events.length; i++) {
    var title = String(events[i].getTitle() || '');
    if (/^\s*(?:🎧\s*)?DJ Arwenn\s*[–-]\s*rezerviran nastop(?:\s|$|[(:–-])/i.test(title)) booked = true;
    if (/^\s*(?:🔒\s*)?DJ Arwenn\s*[–-]\s*zapora rezervacij(?:\s|$|[(:–-])/i.test(title)) closed = true;
  }
  return closed ? 'closed' : booked ? 'dj' : '';
}


/** Versioned proof that this script created the event, not a human. */
var DJ_BRIDGE_MARKER_V2_ = '[DJ_ARWENN_BRIDGE_MANAGED_V2]';
function managedKey_(date) { return 'DJ_ARWENN_BRIDGE_MANAGED_EVENT_' + date; }

function djBookingTitle_(title) {
  return /^\s*(?:🎧\s*)?DJ Arwenn\s*[–-]\s*rezerviran nastop(?:\s|$|[(:–-])/i.test(String(title || ''));
}
function djClosureTitle_(title) {
  return /^\s*(?:🔒\s*)?DJ Arwenn\s*[–-]\s*zapora rezervacij(?:\s|$|[(:–-])/i.test(String(title || ''));
}
function localDate_(value) {
  var p = value.split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}
function isoDay_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}
function dateParts_(value) {
  var p = value.split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2], 12);
}
function auditDates_(first, days) {
  var start = localDate_(first);
  var end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + days);
  var events = CalendarApp.getDefaultCalendar().getEvents(start, end);
  var dates = [];
  for (var i = 0; i < days; i++) {
    var day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    var next = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
    var dj = false, closed = false;
    for (var j = 0; j < events.length; j++) {
      var item = events[j];
      if (!(item.getStartTime() < next && item.getEndTime() > day)) continue;
      var title = item.getTitle();
      if (djBookingTitle_(title)) dj = true;
      if (djClosureTitle_(title)) closed = true;
    }
    dates.push({date: isoDay_(day), dj: dj, closed: closed});
  }
  return dates;
}
function personalTiming_(events, day) {
  var otherCount = 0, before = 0, after = 0, allDay = 0;
  var cutoff = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 15);
  var freeSaturday = false;
  for (var j = 0; j < events.length; j++) {
    var item = events[j], title = item.getTitle();
    if (/DJ Arwenn/i.test(title)) continue;
    if (/Sašo\s*[–-]\s*(dopoldanska|popoldanska)/i.test(title) ||
        /Lara\s*[–-]\s*(dopoldanska|popoldanska)/i.test(title)) continue;
    if (/Sašo\s*[–-]\s*prosta sobota/i.test(title)) {
      freeSaturday = true;
      continue;
    }
    otherCount++;
    if (item.isAllDayEvent()) allDay++;
    else if (item.getEndTime() > cutoff) after++;
    else before++;
  }
  return {other_count: Math.min(otherCount,1000), before_15: Math.min(before,1000),
          after_15: Math.min(after,1000), all_day: Math.min(allDay,1000),
          free_saturday: freeSaturday};
}

function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var expected = props.getProperty('BOOKING_CALENDAR_BRIDGE_TOKEN');
  if (!expected || expected.length < 32) return output_(false, 'not_configured');
  var raw = e && e.postData && e.postData.contents;
  if (!raw || raw.length > 512) return output_(false, 'invalid_request');
  var body;
  try { body = JSON.parse(raw); } catch (_) { return output_(false, 'invalid_json'); }
  if (!body || typeof body !== 'object' ||
      !equals_(String(body.token || ''), expected)) return output_(false, 'forbidden');
  if (!dateValid_(body.date)) return output_(false, 'invalid_date');


  if (body.action === 'availability') {
    try {
      var bits = body.date.split('-').map(Number);
      var day = new Date(bits[0], bits[1] - 1, bits[2], 12);
      var events = CalendarApp.getDefaultCalendar().getEventsForDay(day);
      // Public API receives only a boolean, never the reason or calendar data.
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, status: 'availability', blocked: bookingBlockKind_(events) !== ''
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (_) {
      console.error('Calendar availability unavailable; no private data logged');
      return output_(false, 'calendar_unavailable');
    }
  }

  if (body.action === 'audit') {
    // Private per-day booleans only, bounded to 31 days. No event titles.
    if (!Number.isInteger(body.days) || body.days < 1 || body.days > 31) {
      return output_(false, 'invalid_range');
    }
    try {
      var results = auditDates_(body.date, body.days);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, status: 'audit', days: results
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (_) {
      console.error('Private booking audit unavailable; no details logged');
      return output_(false, 'calendar_unavailable');
    }
  }

  if (body.action === 'assess') {
    // Read ONLY the single owner's shared calendar. Never send event contents
    // (names, notes, guests, medical details or location) to the Worker.
    var parts = body.date.split('-').map(Number);
    var checkDay = new Date(parts[0], parts[1] - 1, parts[2], 12);
    try {
      var events = CalendarApp.getDefaultCalendar().getEventsForDay(checkDay);
      var personal = personalTiming_(events, checkDay);
      var djEvent = false;
      for (var j = 0; j < events.length; j++) {
        if (djBookingTitle_(events[j].getTitle())) djEvent = true;
      }
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, status: 'assessment',
        other_count: personal.other_count,
        before_15: personal.before_15, after_15: personal.after_15,
        all_day: personal.all_day,
        dj_event: djEvent, free_saturday: personal.free_saturday,
        booking_block: bookingBlockKind_(events) !== ''
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (_) {
      console.error('Private calendar assessment unavailable; no details logged');
      return output_(false, 'calendar_unavailable');
    }
  }
  if (body.action !== 'book' && body.action !== 'cancel') return output_(false, 'invalid_action');

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return output_(false, 'busy');
  try {
    var date = String(body.date);
    var parts = date.split('-').map(Number);
    // Use local midday to avoid timezone shifts at midnight/DST transitions.
    var day = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
    var calendar = CalendarApp.getDefaultCalendar();
    var existing = calendar.getEventsForDay(day);
    if (body.action === 'cancel') {
      // Never delete human-created events. Existing pre-v2 calendar bookings
      // require human review because their provenance cannot be established.
      var managed = [];
      var allDjBookings = 0;
      var ledgerId = props.getProperty(managedKey_(date));
      for (var k = 0; k < existing.length; k++) {
        var item = existing[k], title = item.getTitle();
        if (djClosureTitle_(title)) return output_(false, 'manual_review');
        if (!djBookingTitle_(title)) continue;
        allDjBookings++;
        if (ledgerId && item.getId() === ledgerId &&
            item.isAllDayEvent() &&
            String(item.getDescription() || '').indexOf(DJ_BRIDGE_MARKER_V2_) !== -1) {
          managed.push(item);
        }
      }
      if (allDjBookings > 0 && (allDjBookings !== 1 || managed.length !== 1)) {
        return output_(false, 'manual_review');
      }
      if (managed.length === 1) {
        managed[0].deleteEvent();
        props.deleteProperty(managedKey_(date));
      }
      // Re-read after mutation. D1 is released only if no Calendar block remains.
      var after = calendar.getEventsForDay(day);
      if (bookingBlockKind_(after) !== '') return output_(false, 'manual_review');
      return output_(true, managed.length === 1 ? 'cancelled' : 'clear');
    }

    for (var i = 0; i < existing.length; i++) {
      // Do not adopt, modify, or duplicate manually created DJ events.
      if (/DJ Arwenn/i.test(existing[i].getTitle())) return output_(true, 'already_exists');
    }
    var event = calendar.createAllDayEvent(
      '🎧 DJ Arwenn – rezerviran nastop',
      day,
      {
        description: 'Potrjena zasedenost DJ Arwenn. Ura in kraj se dopolnita pozneje. Nastop praviloma po 16:00.\n' + DJ_BRIDGE_MARKER_V2_,
        guests: 'larapececnik@gmail.com',
        sendInvites: true
      }
    );
    event.setGuestsCanModify(true);
    // Event description alone is not proof of ownership. Store the exact
    // Calendar event ID privately for cancellation, never in GitHub/D1.
    props.setProperty(managedKey_(date), event.getId());
    return output_(true, 'created');
  } catch (err) {
    console.error('Calendar sync failed; date and secrets omitted');
    return output_(false, 'calendar_unavailable');
  } finally {
    lock.releaseLock();
  }
}

function dateValid_(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  var parts = value.split('-').map(Number);
  var date = new Date(Date.UTC(parts[0], parts[1]-1, parts[2]));
  return !isNaN(date.getTime()) && date.toISOString().slice(0,10) === value;
}

function equals_(a,b) {
  if (a.length !== b.length) return false;
  var diff=0;
  for (var i=0;i<a.length;i++) diff |= a.charCodeAt(i)^b.charCodeAt(i);
  return diff===0;
}

function output_(ok, status) {
  return ContentService.createTextOutput(JSON.stringify({ok:Boolean(ok),status:status}))
    .setMimeType(ContentService.MimeType.JSON);
}
