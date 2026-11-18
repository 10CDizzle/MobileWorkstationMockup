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
  // Connected 2026-11-18. Responses land in the linked sheet
  // "Casework waitlist — responses". If you change a plan's price above, change the
  // matching option text in the Google Form too, or that answer stops recording.
  googleForm: {
    // The long string between /d/e/ and /viewform in your form's public URL.
    formId: '1FAIpQLScd6hPG8Sum3jXaVzDySdPYegB8hP236U-xew6VWVDrNeYn-w',

    entries: {
      email:        'entry.1767198026',
      firstName:    'entry.1282133057',
      role:         'entry.2129245737',
      nights:       'entry.1497820674',
      reimburse:    'entry.1810272216',
      plan:         'entry.887924708',
      wtp:          'entry.822559115',
      mustHaves:    'entry.1167526847',
      notes:        'entry.66185553',
      utmSource:    'entry.1883342330',
      planClicked:  'entry.1386583279'
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
