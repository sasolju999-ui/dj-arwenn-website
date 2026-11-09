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
 * It intentionally does NOT delete or release calendar events.
 */
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

  if (body.action === 'assess') {
    // Read ONLY the single owner's shared calendar. Never send event contents
    // (names, notes, guests, medical details or location) to the Worker.
    var parts = body.date.split('-').map(Number);
    var checkDay = new Date(parts[0], parts[1] - 1, parts[2], 12);
    try {
      var events = CalendarApp.getDefaultCalendar().getEventsForDay(checkDay);
      var otherCount = 0, djEvent = false, freeSaturday = false;
      for (var j = 0; j < events.length; j++) {
        var title = events[j].getTitle();
        if (/DJ Arwenn/i.test(title)) { djEvent = true; continue; }
        if (/Sašo\s*[–-]\s*(dopoldanska|popoldanska)/i.test(title) ||
            /Lara\s*[–-]\s*(dopoldanska|popoldanska)/i.test(title)) continue;
        if (/Sašo\s*[–-]\s*prosta sobota/i.test(title)) {
          freeSaturday = true;
          continue;
        }
        otherCount++;
      }
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, status: 'assessment',
        other_count: Math.min(otherCount, 1000),
        dj_event: djEvent, free_saturday: freeSaturday
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (_) {
      console.error('Private calendar assessment unavailable; no details logged');
      return output_(false, 'calendar_unavailable');
    }
  }
  if (body.action !== 'book') return output_(false, 'invalid_action');

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return output_(false, 'busy');
  try {
    var date = String(body.date);
    var parts = date.split('-').map(Number);
    // Use local midday to avoid timezone shifts at midnight/DST transitions.
    var day = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
    var calendar = CalendarApp.getDefaultCalendar();
    var existing = calendar.getEventsForDay(day);
    for (var i = 0; i < existing.length; i++) {
      // Do not adopt, modify, or duplicate manually created DJ events.
      if (/DJ Arwenn/i.test(existing[i].getTitle())) return output_(true, 'already_exists');
    }
    var event = calendar.createAllDayEvent(
      '🎧 DJ Arwenn – rezerviran nastop',
      day,
      {
        description: 'Potrjena zasedenost DJ Arwenn. Ura in kraj se dopolnita pozneje. Nastop praviloma po 16:00.',
        guests: 'larapececnik@gmail.com',
        sendInvites: true
      }
    );
    event.setGuestsCanModify(true);
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
