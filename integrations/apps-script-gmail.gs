/**
 * DJ Arwenn - Google Apps Script Gmail delivery endpoint.
 *
 * Deploy as Web App: Execute as "Me", access "Anyone".
 * Save the matching random ENQUIRY_BRIDGE_TOKEN only in Script Properties,
 * never directly in code. The public URL alone must not grant email access.
 *
 * Script Property:
 *   ENQUIRY_BRIDGE_TOKEN = same long random secret as Cloudflare Worker
 *
 * Gmail delivery is limited by the Google account's Apps Script quotas.
 */

function doPost(e) {
  var properties = PropertiesService.getScriptProperties();
  var expected = properties.getProperty('ENQUIRY_BRIDGE_TOKEN');
  if (!expected || expected.length < 32) return result_(false);

  var raw = e && e.postData && e.postData.contents;
  if (!raw || raw.length > 9000) return result_(false);
  var body;
  try { body = JSON.parse(raw); } catch (err) { return result_(false); }
  if (!body || !secureMatch_(String(body.bridgeToken || ''), expected)) return result_(false);

  var name = field_(body.name, 100);
  var email = field_(body.email, 150);
  var phone = field_(body.phone, 40);
  var eventType = field_(body.eventType, 100);
  var eventDate = field_(body.eventDate, 10);
  var location = field_(body.location, 80);
  var notes = field_(body.notes, 1500);
  if (!name || !email || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
      phone === null || !eventType || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate || '') ||
      !location || notes === null) return result_(false);

  // Avoid attacker-supplied recipients, dynamic destinations and HTML output.
  var recipient = Session.getEffectiveUser().getEmail();
  if (!recipient) return result_(false);

  var lines = [
    'DJ Arwenn - novo povpraševanje',
    '',
    'Ime: ' + name,
    'E-pošta: ' + email,
    'Telefon: ' + (phone || '-'),
    'Vrsta dogodka: ' + eventType,
    'Datum: ' + eventDate,
    'Kraj: ' + location,
    'Sporočilo: ' + (notes || '-'),
    '',
    'To sporočilo je bilo preverjeno s Cloudflare Turnstile.'
  ];
  try {
    MailApp.sendEmail({
      to: recipient,
      subject: 'DJ Arwenn | Novo povpraševanje za nastop',
      body: lines.join('\n'),
      name: 'DJ Arwenn - spletna stran',
      replyTo: email
    });
    return result_(true);
  } catch (err) {
    console.error('Mail delivery failed');
    return result_(false);
  }
}

function field_(value, maxLength) {
  return typeof value === 'string' && value.length <= maxLength ? value.trim() : null;
}

function secureMatch_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function result_(ok) {
  return ContentService.createTextOutput(JSON.stringify({ ok: Boolean(ok) }))
    .setMimeType(ContentService.MimeType.JSON);
}
