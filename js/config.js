/* ==========================================================================
   Casework — site configuration
   Everything you are likely to change lives in this one file.
   See README.md for step-by-step instructions.
   ========================================================================== */

window.CASEWORK_CONFIG = {

  /* ---------------------------------------------------------------- brand */
  // Renaming: change these, then find-and-replace "Casework" in the HTML files.
  // (README → "Changing brand name, tagline, prices")
  brand: 'Casework',
  tagline: 'Your desk, wherever you check in.',
  contactEmail: 'hello@casework.co',

  /* --------------------------------------------------------------- pricing */
  // These overwrite the prices printed in index.html at page load, so you can
  // change pricing here without touching markup. Keep `formValue` identical to
  // the matching answer text in your Google Form, or responses won't record.
  plans: {
    occasional: {
      price: '$79',
      period: '/mo',
      formValue: 'Occasional — $79/mo'
    },
    roadwarrior: {
      price: '$149',
      period: '/mo',
      formValue: 'Road Warrior — $149/mo'
    },
    pertrip: {
      price: '$35',
      period: '/stay',
      formValue: 'Pay per trip — $35/stay'
    }
  },

  /* ----------------------------------------------------------- google form */
  // 1. Build the form (questions + order are listed in the README).
  // 2. Responses → Link to Sheets.
  // 3. ⋮ → Get pre-filled link → fill dummy answers → Copy link → read the
  //    entry.XXXXXXXXX numbers out of the URL.
  // 4. Paste the form ID and each entry ID below.
  //
  // Until you do, the IDs below are placeholders and submissions will fail
  // silently against Google (the page still shows its success state locally).
  googleForm: {
    // The long string between /d/e/ and /viewform in your form's public URL.
    formId: 'REPLACE_WITH_FORM_ID',

    entries: {
      email:        'entry.1000000001',
      firstName:    'entry.1000000002',
      role:         'entry.1000000003',
      nights:       'entry.1000000004',
      reimburse:    'entry.1000000005',
      plan:         'entry.1000000006',
      wtp:          'entry.1000000007',
      mustHaves:    'entry.1000000008',
      notes:        'entry.1000000009',
      utmSource:    'entry.1000000010',
      planClicked:  'entry.1000000011'
    }
  },

  /* ------------------------------------------------------------- analytics */
  // Off by default. To enable a privacy-friendly GoatCounter counter, set
  // `enabled: true` and paste your site code (the xxxx in xxxx.goatcounter.com).
  analytics: {
    enabled: false,
    goatCounterCode: ''
  }
};
