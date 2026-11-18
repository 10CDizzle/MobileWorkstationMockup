# Casework — demand-validation landing page

A single-page site for an idea: a rugged rolling case of desk equipment (two monitors, a
universal USB-C dock, full-size keyboard, mouse, power strip, cables) shipped to a
traveling consultant's hotel for a flat monthly fee. The page exists to find out whether
anyone wants that and what they would pay — it collects email signups and
willingness-to-pay answers into a Google Sheet, and sells nothing. Plain HTML, CSS and
vanilla JavaScript: no frameworks, no build step, no dependencies to install.

```
/
├── index.html        the landing page
├── privacy.html      plain-language privacy page
├── 404.html          self-contained (styles inlined on purpose — see below)
├── css/styles.css
├── js/config.js      brand, prices, Google Form ids, analytics toggle — edit this one
├── js/main.js        form submit, plan preselect, UTM capture, copy-link, scroll effects
├── assets/           favicon + Open Graph image, SVG source and PNG export
├── .nojekyll         tells GitHub Pages to serve the files as-is
└── README.md
```

---

## 1. Run it locally

Any static server works. From this folder:

```bash
python -m http.server 8000      # or: python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

Opening `index.html` directly from the filesystem also works — every path in the page is
relative. The one difference is the clipboard: on `file://` the copy-link button falls
back to an older copy mechanism, and some browsers block it entirely.

---

## 2. Deploy to GitHub Pages

1. Create a new repository on GitHub (public, so Pages is free).
2. Push this folder to it:

   ```bash
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin master
   ```

3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, then branch
   **`master`** (whichever branch you actually pushed) and folder **`/ (root)`**. Save.
5. Wait a minute or two, then visit `https://<user>.github.io/<repo>/`.

**Social preview URLs:** `og:url`, `og:image`, `twitter:image` and `canonical` in
`index.html` are absolute, pointing at
`https://10cdizzle.github.io/MobileWorkstationMockup/`. They have to be absolute —
LinkedIn, Facebook and Slack do not resolve relative image paths, and a relative one means
no preview card. **If the site moves to a custom domain, update those four tags**, then
re-scrape the page in LinkedIn's Post Inspector so the old card is flushed.

**Paths:** every reference in the page (`css/styles.css`, `assets/og-image.png`,
`privacy.html`) is relative, so the site works unchanged at a repo subpath like
`/casework-landing/` as well as at a domain root. Keep it that way — a leading slash
(`/css/styles.css`) would break the subpath deployment.

The two deliberate exceptions are in `404.html`, which GitHub Pages serves for unknown
URLs at *any* depth: its CSS is inlined and its favicon link is absolute, because a
relative path would resolve against the wrong folder. A small script rewrites its "Back
to Casework" link to the correct repo subpath when it runs on `github.io`.

`.nojekyll` is an empty file that stops GitHub from running the files through Jekyll.
Leave it in place.

---

## 3. Custom domain (optional)

1. Create a file named `CNAME` in this folder containing only your domain:

   ```
   casework.co
   ```

2. At your DNS provider:
   - **Apex domain** (`casework.co`) — four `A` records pointing to
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (and the matching `AAAA` records if you want IPv6).
   - **Subdomain** (`www.casework.co`) — one `CNAME` record pointing to
     `<user>.github.io`.
3. Back in **Settings → Pages**, enter the domain and tick **Enforce HTTPS** once the
   certificate is issued.
4. Update `contactEmail` in `js/config.js` and the `hello@casework.co` addresses in
   `index.html` and `privacy.html` to match the new domain.

---

## 4. Connecting your Google Form

The page posts directly to a Google Form, which writes every response to a Google Sheet.
There is no backend and nothing to host. **Until you do this, submissions go nowhere** —
the page will still show its success state locally, because a cross-origin form post is
opaque by design and the browser never tells us whether Google accepted it.

### Fastest path: run the setup script

`tools/create-form.gs` builds the form, creates the response sheet, links them, and
prints the pre-filled URL with every entry id. Open <https://script.google.com>, start a
new project, paste the file in, run `createCaseworkForm`, approve the permission prompt,
and read the Execution log. Then skip to step **d** below.

Use it rather than clicking the form together by hand: several answer strings contain an
en dash (`1-4` is really `1–4`), an em dash (`Occasional — $79/mo`) or a curly apostrophe
(`I’m self-employed`), and typing those manually produces ASCII lookalikes that Google
accepts but never matches, so the answer is dropped without an error.

### a. Build the form by hand (if you skipped the script)

Create a form at <https://forms.google.com> with these questions, in this order. The
answer options must match the text below **character for character**, including the em
dashes in the plan names, or Google silently drops the answer.

| # | Question | Type | Options | Required |
|---|---|---|---|---|
| 1 | Email | Short answer | — | Yes |
| 2 | First name | Short answer | — | No |
| 3 | Role | Dropdown | Management consultant · IT/tech consultant · Audit/accounting · Sales/sales engineering · Other | No |
| 4 | Nights in hotels per month | Dropdown | 1–4 · 5–9 · 10–15 · 16+ | Yes |
| 5 | Would your employer reimburse this? | Dropdown | Yes · Probably · No · I'm self-employed | No |
| 6 | Which plan would you pick? | Multiple choice | Occasional — $79/mo · Road Warrior — $149/mo · Pay per trip — $35/stay · None at these prices | Yes |
| 7 | What would you pay per month? | Dropdown | Under $50 · $50–99 · $100–149 · $150–199 · $200+ | No |
| 8 | Your setup must-haves | Checkboxes | Two monitors · One large/ultrawide monitor · Mechanical/full keyboard · Webcam + light · Laptop stand · Mac-specific dock | No |
| 9 | Anything else? | Paragraph | — | No |
| 10 | Source | Short answer | — | No |
| 11 | Plan clicked | Short answer | — | No |

> Mark questions 1, 4 and 6 required *in Google Forms too*. The page enforces them in the
> browser, but Google rejects a submission that is missing a question it requires, so the
> two must agree.

### b. Link it to a Sheet

In the form, open **Responses → Link to Sheets → Create a new spreadsheet**.

### c. Read the entry ids

1. In the form editor, open the **⋮** menu (top right) → **Get pre-filled link**.
2. Fill in a dummy answer for *every* question, including Source and Plan clicked.
3. Click **Get link**, then **Copy link**.
4. Paste it somewhere you can read it. It looks like:

   ```
   https://docs.google.com/forms/d/e/1FAIpQLSd.../viewform?usp=pp_url
     &entry.1234567890=test@example.com
     &entry.987654321=Alex
     ...
   ```

5. The long string between `/d/e/` and `/viewform` is your **form id**. Each
   `entry.NNNNNNNNN` is the id of the question whose dummy answer follows it.

### d. Paste them into `js/config.js`

```js
googleForm: {
  formId: '1FAIpQLSd...',
  entries: {
    email:       'entry.1234567890',
    firstName:   'entry.987654321',
    role:        'entry....',
    nights:      'entry....',
    reimburse:   'entry....',
    plan:        'entry....',
    wtp:         'entry....',
    mustHaves:   'entry....',
    notes:       'entry....',
    utmSource:   'entry....',   // question 10
    planClicked: 'entry....'    // question 11
  }
}
```

`js/main.js` stamps these onto the form fields at load, so this file is the only place the
ids need to exist. (The same values are also written into the `name` attributes in
`index.html` as the no-JavaScript fallback — if you care about visitors with JS disabled,
find-and-replace the `entry.1000000001`-style placeholders there as well.)

### e. Test it

1. Reload the page, fill the form in, submit.
2. Check the linked Sheet for the row.
3. Submit once more with a `?utm_source=test` on the URL and confirm the Source column
   fills in.

If nothing arrives: the form id is wrong, a required Google question is missing from the
page, or an option's text does not match exactly. The browser cannot see the error, so
check those three first.

### Spam

A honeypot field (`company_website`) sits off-screen in the form. People never see it;
bots fill it in. When it has a value the submission is dropped silently and the visitor
still sees the thank-you state. It is never sent to Google.

---

## 5. Changing the brand name, tagline and prices

**Prices** live in `js/config.js` only:

```js
plans: {
  roadwarrior: { price: '$149', period: '/mo', formValue: 'Road Warrior — $149/mo' }
}
```

`price` and `period` overwrite what is printed in the pricing cards and the form's plan
options at load. `formValue` is what gets recorded in the Sheet — **if you change a price,
update `formValue` here and the matching option text in the Google Form together**, or
that answer stops recording.

**Brand name and tagline:** update `brand`, `tagline` and `contactEmail` in
`js/config.js`, then find-and-replace the visible text:

```bash
# macOS / Linux
grep -rl 'Casework' index.html privacy.html 404.html | xargs sed -i '' 's/Casework/NewName/g'
sed -i '' 's/casework\.co/newname.co/g' index.html privacy.html

# Windows PowerShell
Get-ChildItem index.html, privacy.html, 404.html |
  ForEach-Object { (Get-Content $_) -replace 'Casework', 'NewName' | Set-Content $_ }
```

The name appears in: the `<title>` and meta/Open Graph tags, the header and footer
wordmarks, the comparison table's last column, and `assets/og-image.svg` (re-export the
PNG afterwards — see §7).

**Colours** are CSS custom properties at the top of `css/styles.css`, in `:root` and again
in the `prefers-color-scheme: dark` block. Changing `--accent` restyles buttons, ticks,
latches and illustration highlights everywhere.

---

## 6. Sharing with tracking

Add a parameter to the URL and it lands in the Source column of the Sheet:

| Where you post it | Link |
|---|---|
| LinkedIn post | `https://10cdizzle.github.io/MobileWorkstationMockup/?utm_source=linkedin` |
| Reddit comment | `https://10cdizzle.github.io/MobileWorkstationMockup/?utm_source=reddit` |
| Slack / forwarded to a friend | `https://10cdizzle.github.io/MobileWorkstationMockup/?ref=friend` |
| A specific campaign | `?utm_source=linkedin&utm_campaign=dec-post` → recorded as `linkedin / dec-post` |

Visits with no parameter are recorded as `direct`. The copy-link button on the thank-you
screen hands people a `?ref=friend` link automatically, so referrals are separable from
your own posts.

The **Plan clicked** column fills in only when someone arrives at the form by clicking a
pricing card's "Reserve this plan" button — it tells you what caught their eye, which is
not always what they end up selecting.

---

## 7. Re-exporting the images

`assets/og-image.svg` and `assets/favicon.svg` are the sources; the `.png` files beside
them are exports (1200×630 and 96×96). Social networks and older browsers need the PNGs.
After editing an SVG, re-export with whatever you have — any vector editor, an online SVG
to PNG converter, or headless Chrome:

```bash
# serve the folder first (python -m http.server 8000), then:
chrome --headless --screenshot=og.png --window-size=1200,630 \
  http://localhost:8000/assets/og-image.svg
```

Keep the dimensions: Open Graph previews are cropped to 1200×630.

---

## 8. Reading the results

In the linked Sheet, the questions worth crossing are **plan choice**, **nights per
month** and **reimbursable**. One pivot does most of the work:

1. Select the response range → **Insert → Pivot table**.
2. **Rows:** `Nights in hotels per month`.
3. **Columns:** `Which plan would you pick?`.
4. **Values:** `Email`, summarised by **COUNTA**.
5. **Filter:** `Would your employer reimburse this?` — look at `Yes` + `Probably` on their
   own, then at everyone.

What you are looking for:

- **Road Warrior picked by people doing 10+ nights** is the signal the subscription works.
  The same people picking *Pay per trip* means the monthly price is above what the
  travel actually justifies.
- **"None at these prices" concentrated in one nights bucket** tells you where the price
  breaks, not that the idea fails.
- Compare **plan choice** against **what would you pay per month** — people routinely pick
  a plan and then name a lower number. The gap is your real ceiling.
- **Reimbursable = Yes** changes the whole picture: if most of your interest is expensed,
  the price ceiling is the firm's policy, not the individual's wallet.
- Sort by **Source** to see which channel brings people who pick a paid plan rather than
  which brings the most signups.

Anything under a couple of dozen responses is a conversation starter, not evidence. The
free-text answers in *Anything else?* are usually worth more than the counts at this
stage.
