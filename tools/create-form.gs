/**
 * Casework — one-shot Google Form setup.
 *
 * Creates the waitlist form with the exact questions the landing page posts,
 * creates a response spreadsheet, links them, and logs the pre-filled URL that
 * contains every entry.NNNNNNNNN id.
 *
 * HOW TO RUN
 *   1. Go to https://script.google.com and start a new project.
 *   2. Replace the contents of Code.gs with this file.
 *   3. Run > Run function > createCaseworkForm. Approve the permission prompt
 *      (it needs Forms and Sheets access on your own account).
 *   4. Open View > Logs (or the Execution log) and copy all three URLs it prints.
 *
 * WHY A SCRIPT INSTEAD OF CLICKING
 *   Several answer strings contain typographic characters that must match the
 *   landing page byte for byte or Google silently discards that answer:
 *     en dash    1–4, 5–9, 10–15, $50–99, $100–149, $150–199
 *     em dash    Occasional — $79/mo, Road Warrior — $149/mo, Pay per trip — $35/stay
 *     curly apostrophe   I’m self-employed
 *   Typing those by hand produces ASCII hyphens and straight quotes instead.
 *
 * This file is a setup tool, not part of the site. Delete it once the form exists.
 */

function createCaseworkForm() {
  var form = FormApp.create('Casework waitlist');

  form.setDescription(
    'Casework ships a case of desk equipment — two monitors, a dock, a full-size ' +
    'keyboard and mouse — to your hotel before you check in. We are pre-launch and ' +
    'deciding whether to build it. Nothing is charged and nothing is for sale yet.'
  );

  // The page collects the email itself, and the form has to accept responses from
  // people who are not signed in to Google.
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(false);
  form.setProgressBar(false);

  // Workspace accounts only; harmless to skip on a personal account.
  try { form.setRequireLogin(false); } catch (e) {}

  // ---------------------------------------------------------------- questions
  // Order matters only for readability; the page matches on entry id.

  var email = form.addTextItem()
    .setTitle('Email')
    .setRequired(true);
  email.setValidation(
    FormApp.createTextValidation().requireTextIsEmail().build()
  );

  var firstName = form.addTextItem()
    .setTitle('First name');

  var role = form.addListItem()
    .setTitle('Role')
    .setChoiceValues([
      'Management consultant',
      'IT/tech consultant',
      'Audit/accounting',
      'Sales/sales engineering',
      'Other'
    ]);

  var nights = form.addListItem()
    .setTitle('Nights in hotels per month')
    .setChoiceValues(['1–4', '5–9', '10–15', '16+'])
    .setRequired(true);

  var reimburse = form.addListItem()
    .setTitle('Would your employer reimburse this?')
    .setChoiceValues(['Yes', 'Probably', 'No', 'I’m self-employed']);

  var plan = form.addMultipleChoiceItem()
    .setTitle('Which plan would you pick?')
    .setChoiceValues([
      'Occasional — $79/mo',
      'Road Warrior — $149/mo',
      'Pay per trip — $35/stay',
      'None at these prices'
    ])
    .setRequired(true);

  var wtp = form.addListItem()
    .setTitle('What would you pay per month?')
    .setChoiceValues([
      'Under $50',
      '$50–99',
      '$100–149',
      '$150–199',
      '$200+'
    ]);

  var mustHaves = form.addCheckboxItem()
    .setTitle('Your setup must-haves')
    .setChoiceValues([
      'Two monitors',
      'One large/ultrawide monitor',
      'Mechanical/full keyboard',
      'Webcam + light',
      'Laptop stand',
      'Mac-specific dock'
    ]);

  var notes = form.addParagraphTextItem()
    .setTitle('Anything else?');

  // Filled in by the page, not by the visitor.
  var source = form.addTextItem()
    .setTitle('Source')
    .setHelpText('Filled in automatically from the link that brought the visitor here.');

  var planClicked = form.addTextItem()
    .setTitle('Plan clicked')
    .setHelpText('Filled in automatically when a visitor clicks a pricing card.');

  // ------------------------------------------------------- response spreadsheet
  var sheet = SpreadsheetApp.create('Casework waitlist — responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // Newer forms need an explicit publish step; older ones do not have the method.
  try { form.setPublished(true); } catch (e) {}

  // ------------------------------------------------- pre-filled link (entry ids)
  // Each dummy answer is distinctive so every entry id can be matched to its
  // question without guessing.
  var response = form.createResponse();
  response = response.withItemResponse(email.createResponse('dummy-email@example.com'));
  response = response.withItemResponse(firstName.createResponse('DUMMYFIRSTNAME'));
  response = response.withItemResponse(role.createResponse('Management consultant'));
  response = response.withItemResponse(nights.createResponse('5–9'));
  response = response.withItemResponse(reimburse.createResponse('Probably'));
  response = response.withItemResponse(plan.createResponse('Road Warrior — $149/mo'));
  response = response.withItemResponse(wtp.createResponse('$100–149'));
  response = response.withItemResponse(mustHaves.createResponse(['Two monitors']));
  response = response.withItemResponse(notes.createResponse('DUMMYNOTES'));
  response = response.withItemResponse(source.createResponse('DUMMYSOURCE'));
  response = response.withItemResponse(planClicked.createResponse('DUMMYPLANCLICKED'));

  var out = [
    '',
    '==================== COPY EVERYTHING BELOW ====================',
    '',
    'PREFILLED URL (contains the form id and all 11 entry ids):',
    response.toPrefilledUrl(),
    '',
    'LIVE FORM URL:',
    form.getPublishedUrl(),
    '',
    'EDIT FORM URL:',
    form.getEditUrl(),
    '',
    'RESPONSE SHEET URL:',
    sheet.getUrl(),
    '',
    '==============================================================='
  ].join('\n');

  Logger.log(out);
  return out;
}
