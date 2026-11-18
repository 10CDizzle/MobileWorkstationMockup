#!/usr/bin/env python3
"""
Rename the site end to end.

A rename is not just a find-and-replace on the brand word: the Open Graph tags
carry absolute URLs, the contact address carries the domain, and the social image
has the wordmark baked into its SVG. This touches all of them and tells you what
is left to do by hand.

    # see what would change, without writing anything
    python tools/rename.py --name RoomRig --domain roomrig.com

    # actually do it
    python tools/rename.py --name RoomRig --domain roomrig.com --apply

    # also repoint the absolute social URLs at a new home
    python tools/rename.py --name RoomRig --domain roomrig.com \\
        --site-url https://roomrig.com/ --apply

Everything is tracked in git, so `git diff` reviews it and `git checkout .` undoes it.
"""
import argparse
import io
import os
import re
import sys

OLD_NAME = "Casework"
OLD_DOMAIN = "casework.co"
OLD_SITE_URL = "https://10cdizzle.github.io/MobileWorkstationMockup/"

TARGETS = [
    "index.html",
    "privacy.html",
    "404.html",
    "README.md",
    "js/config.js",
    "assets/og-image.svg",
    "tools/create-form.gs",
]


def main():
    ap = argparse.ArgumentParser(description="Rename the site.")
    ap.add_argument("--name", required=True, help='New brand name, e.g. "RoomRig"')
    ap.add_argument("--domain", required=True, help='New domain, e.g. "roomrig.com"')
    ap.add_argument("--site-url", help="New absolute site URL for og:/canonical tags")
    ap.add_argument("--apply", action="store_true", help="Write the changes")
    args = ap.parse_args()

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    total = 0
    missing = []

    for rel in TARGETS:
        path = os.path.join(root, rel)
        if not os.path.exists(path):
            missing.append(rel)
            continue

        text = io.open(path, encoding="utf-8").read()
        before = text

        text = text.replace(OLD_DOMAIN, args.domain)
        text = text.replace(OLD_NAME, args.name)
        text = text.replace(OLD_NAME.lower(), args.name.lower())
        if args.site_url:
            text = text.replace(OLD_SITE_URL, args.site_url)

        if text == before:
            print("  %-24s no change" % rel)
            continue

        changes = sum(
            before.count(tok)
            for tok in (OLD_NAME, OLD_DOMAIN)
        )
        total += changes
        print("  %-24s %d replacement(s)" % (rel, changes))

        if args.apply:
            io.open(path, "w", encoding="utf-8").write(text)

    if missing:
        print("\n  skipped (not found): %s" % ", ".join(missing))

    print("\n%s %d replacement(s) across %d files."
          % ("Applied" if args.apply else "Would apply", total, len(TARGETS) - len(missing)))

    if not args.apply:
        print("Re-run with --apply to write them.")
        return

    print("""
Still to do by hand:
  1. Re-export assets/og-image.png from the edited SVG (README section 7) --
     the wordmark is drawn into the image and the PNG is what social sites fetch.
  2. If the site moved, update og:url / og:image / twitter:image / canonical in
     index.html -- pass --site-url to do that automatically.
  3. The Google Form title still reads "%s waitlist" inside Google; rename it in
     the Forms UI if you care. The entry ids and the response sheet are unaffected.
  4. Rename the GitHub repo if you want a cleaner share link, then update the
     absolute URLs again.
""" % OLD_NAME)


if __name__ == "__main__":
    sys.exit(main())
