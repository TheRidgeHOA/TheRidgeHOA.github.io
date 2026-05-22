# The Ridge-Heath HOA — Site Maintainer's Guide

> **Last updated:** 2026-05-22 — added Fees & Dues page, HOA Docs restructure,
> reading-copy PDFs, and `_reconstruction/` staging folder.

This is the source repository for **heathridgehoa.com**, the official website of
The Ridge-Heath Homeowners Association in Heath, Texas. The site is built with
[Jekyll](https://jekyllrb.com/) and hosted on
[GitHub Pages](https://pages.github.com/) using a custom domain. GitHub builds
and publishes the site automatically every time you push to the default branch —
no manual build step, no separate hosting account to manage.

---

## Table of Contents

1. [How publishing works](#how-publishing-works)
2. [Project structure](#project-structure)
3. [Common content edits](#common-content-edits)
   - [Officers](#officers)
   - [Fees & Dues](#fees--dues)
   - [HOA documents](#hoa-documents)
   - [Local Info links](#local-info-links)
   - [Gallery photos](#gallery-photos)
   - [Navigation](#navigation)
4. [Reading-copy PDFs and `_reconstruction/`](#reading-copy-pdfs-and-_reconstruction)
5. [Dormant content (site.yml)](#dormant-content-siteyml)
6. [Editing page text vs. data](#editing-page-text-vs-data)
7. [Known follow-ups](#known-follow-ups)
8. [Local preview (optional)](#local-preview-optional)

---

## How publishing works

1. Edit a file (see recipes below).
2. Commit and push to the default branch (`main` or `master`).
3. GitHub Pages detects the push, runs Jekyll, and the live site at
   **heathridgehoa.com** reflects the change within about a minute.

The `CNAME` file in the repo root tells GitHub Pages to serve the site at
`heathridgehoa.com`. Do not delete or rename that file.

There is no `_site/` folder to commit — GitHub Pages builds that on its own
servers. The `.gitignore` already excludes it.

---

## Project structure

```
_config.yml            — Site-wide settings (title, URL, defaults)
Gemfile                — Ruby gem list for optional local preview
CNAME                  — Custom domain declaration for GitHub Pages

_data/                 — All editable content lives here (YAML files)
  navigation.yml       — Top-nav links
  officers.yml         — Board members and their roles / emails
  documents.yml        — HOA document list, split into two groups (see below)
  fees.yml             — Dollar amounts and dates for the Fees & Dues page
  links.yml            — Local Info page links, grouped by category
  gallery.yml          — Homepage photo gallery entries
  site.yml             — Dormant content (email, meeting info, dues)

_layouts/              — Page templates (rarely need editing)
  default.html         — Base HTML shell (head + header + footer + JS)
  home.html            — Homepage: full hero image above content
  page.html            — Interior pages: slim banner above content

_includes/             — Reusable HTML snippets (rarely need editing)
  head.html            — <head> element with meta tags
  header.html          — Site header and navigation bar
  footer.html          — Site footer
  doc-card.html        — Document card: reading-copy + original-scan links
  doc-link.html        — Legacy single-link document component (still present)
  external-link.html   — External link component (opens in new tab)

assets/
  css/styles.css       — All site styles (custom properties, no framework)
  js/main.js           — Minimal JS (email-reveal button)
  favicon.svg          — Browser tab icon
  images/              — hero.jpg and gallery photos
  documents/           — PDF files served for download
    *-reading-copy.pdf — Clean, searchable re-typeset versions (see below)
    *.pdf              — Original recorded scans (authoritative)

_reconstruction/       — Staging folder for reading-copy work; Jekyll does NOT
                         publish this folder (underscore prefix). See the
                         "Reading-copy PDFs" section below.

index.html             — Homepage (front matter + prose sections)
officers.html          — Officers page
fees.html              — Fees & Dues page (data driven from _data/fees.yml)
hoa-docs-and-information.html  — HOA Documents page
local-info-links.html  — Local Info page
terms.html             — Terms of Use page
```

---

## Common content edits

All routine edits are made to files inside `_data/`. Each file is plain YAML —
indentation matters, and string values with special characters should be wrapped
in double quotes.

### Officers

**File:** `_data/officers.yml`

Each entry is a list item. Fields:

| Field | Required | Description |
|-------|----------|-------------|
| `name` | yes | Full name |
| `role` | yes | Title or description |
| `email_user` | no | Part of email address before `@` |
| `email_domain` | no | Part of email address after `@` |

**Add an officer:**

```yaml
- name: "Jane Smith"
  role: "Board Member"
```

**Add an officer with a contact email:**

```yaml
- name: "Jane Smith"
  role: "Board Member"
  email_user: "jsmith"
  email_domain: "example.com"
```

When both `email_user` and `email_domain` are present, the Officers page shows
a "Click to reveal email" button. JavaScript assembles the `mailto:` link only
when the visitor clicks — the full address is never written into the page HTML,
which protects it from automated spam scrapers.

**Remove an officer:** Delete the entire `- name: ...` block for that person.

**Reorder officers:** Cut and paste list items into the desired order. The page
renders them top to bottom in the order listed here.

---

### Fees & Dues

**File:** `_data/fees.yml`

This file holds every dollar figure and date shown on `fees.html` in one
place. Edit the values between the quotes, save, and push — the page
rebuilds automatically.

| Key | What it controls |
|-----|-----------------|
| `annual_dues_amount` | Annual dues figure (include the `$`) |
| `annual_dues_per` | Unit label after the figure (e.g. `"lot, per year"`) |
| `dues_due_date` | Date dues are due |
| `dues_delinquent_date` | Date an unpaid account becomes delinquent |
| `admin_fee_initial` | One-time administrative fee when dues first go delinquent |
| `admin_fee_monthly` | Recurring administrative fee for each further month delinquent |
| `transfer_fee_amount` | One-time ownership transfer fee |

Example — to update annual dues for a new year:

```yaml
annual_dues_amount:   "$650.00"
dues_due_date:        "January 1, 2027"
dues_delinquent_date: "February 1, 2027"
```

The bottom section of `fees.html` also shows three document cards that
deep-link into the relevant sections of the Declaration of Covenants and the
Fining Policy. Those links use PDF named destinations (e.g.
`#nameddest=article-5`) and are hardcoded in `fees.html` — they do not come
from `fees.yml`. See [Reading-copy PDFs](#reading-copy-pdfs-and-_reconstruction)
for background on named destinations.

---

### HOA documents

**File:** `_data/documents.yml`

The file is organised into two **groups**: `Governing Documents` and
`Corporate Records`. Each group has a `name`, a `description`, and a
`documents` list. Each document entry has four fields:

| Field | Description |
|-------|-------------|
| `title` | Display name shown as the card heading |
| `reading_copy` | Path to the clean, searchable re-typeset PDF |
| `original` | Path to the original recorded scan |
| `summary` | One-sentence description shown under the title |

Each card is rendered by `_includes/doc-card.html`, which produces a
"Reading copy (searchable)" primary link and an "Original scan" secondary
link side by side.

**Add a document to an existing group:**

```yaml
- name: "Governing Documents"
  documents:
    # ... existing entries ...
    - title: "2025 Amendment"
      reading_copy: "/assets/documents/2025-amendment-reading-copy.pdf"
      original:     "/assets/documents/2025-amendment.pdf"
      summary: >-
        Board-adopted amendment to Article IX adopted March 2025.
```

Put both PDFs in `assets/documents/` first. If you only have the original
scan and have not yet produced a reading copy, you can temporarily use the
same path for both fields.

**Add a new group:**

```yaml
- name: "My New Group"
  description: "What these documents are and who needs them."
  documents:
    - title: "..."
      reading_copy: "..."
      original:     "..."
      summary:      "..."
```

**Remove a document:** Delete its `- title: ...` block. **Remove a group:**
Delete the entire `- name: ...` block including its `documents` list.

---

### Local Info links

**File:** `_data/links.yml`

Links are grouped by category. To add a link to an existing category, append
it inside that category's `links:` block:

```yaml
- category: "Utilities"
  links:
    - name: "Oncor (Electric)"
      url: "https://www.oncor.com/"
    # ... existing entries above or below
```

To add a new category, append a new block at the bottom of the file:

```yaml
- category: "Schools"
  links:
    - name: "Heath High School"
      url: "https://www.rockwallisd.org/heath-high-school"
```

All links open in a new tab automatically — no extra configuration needed.

---

### Gallery photos

**File:** `_data/gallery.yml`

**Step 1:** Copy the image into `assets/images/`. Recommended: JPEG, roughly
600 × 400 px or larger (the grid crops to 3:2).

**Step 2:** Add an entry:

```yaml
- image: "/assets/images/my-photo.jpg"
  alt: "Brief description for screen readers"
  caption: "Short caption shown under the photo"
```

To remove a photo, delete its entry (and optionally delete the image file).
Order here is left-to-right display order on the homepage gallery.

---

### Navigation

**File:** `_data/navigation.yml`

The `.html` extensions in the `url` values are intentional — the live site
serves those exact URLs and changing them would break bookmarks and any
inbound links. Only edit this file if you add a new page or rename one.

To reorder nav items, cut and paste the entries. To add a nav link to a new
page you have created:

```yaml
- title: "New Page"
  url: "/new-page.html"
```

---

## Reading-copy PDFs and `_reconstruction/`

### What a reading copy is

Each document in `assets/documents/` exists in two forms:

- **`*-reading-copy.pdf`** — a clean, re-typeset version reconstructed from
  the scanned original. It has a text layer (so it is searchable and
  copy-pasteable), a clickable table of contents, PDF bookmarks, and named
  destinations for deep-linking.
- **`*.pdf`** (no suffix) — the original recorded scan. This is the
  authoritative document. The reading copy is provided purely for
  readability and searchability. In any conflict, the original controls.

Seven documents currently have reading copies:

| Reading copy | Original |
|---|---|
| `restrictions-covenants-reading-copy.pdf` | `restrictions-covenants.pdf` |
| `by-laws-reading-copy.pdf` | `by-laws.pdf` |
| `by-law-amendments-reading-copy.pdf` | `by-law-amendments.pdf` |
| `arc-project-application-reading-copy.pdf` | `arc-project-application.pdf` |
| `by-laws-section-I-reading-copy.pdf` | `by-laws-section-I.pdf` |
| `by-laws-section-II-reading-copy.pdf` | `by-laws-section-II.pdf` |
| `by-laws-section-III-V-reading-copy.pdf` | `by-laws-section-III-V.pdf` |

### Deep-linking with named destinations

The reading-copy PDFs contain PDF named destinations — stable anchors that
survive pagination changes. A link like:

```
/assets/documents/restrictions-covenants-reading-copy.pdf#nameddest=article-5
```

opens the PDF directly at Article V regardless of what page number it falls
on. The `fees.html` document cards use this technique. Named destinations
follow the pattern `article-N`, `section-N-N`, `part-II`, etc.; the exact
anchors for each document are listed in its `*-RECONSTRUCTION-NOTES.md`
inside `_reconstruction/`.

### The `_reconstruction/` staging folder

**Jekyll does not publish this folder** — the underscore prefix tells Jekyll
to skip it entirely, so none of the working files are ever served to visitors.

The folder contains the source and tooling for every reading-copy PDF:

| Pattern | Description |
|---|---|
| `*-clean-text.html` | The corrected, structured HTML source for the PDF. Editing this file is how you fix a typo or update content in a reading copy. |
| `*-verification.html` | Side-by-side proofing report: original scan image vs. OCR text, with flagged-page notes. Open in a browser for human review. |
| `*-RECONSTRUCTION-NOTES.md` | Per-document notes covering source provenance, structural decisions, OCR corrections made, and confidence assessment. |
| `*-page-images/` | JPEG renders of the original scan pages, embedded by the verification report. |
| Build scripts (`build_pdf.py`, `build_verification.py`, `render_pages.py`, and per-document variants) | Python scripts that convert the clean-text HTML to a PDF and regenerate the verification report. |

`RECONSTRUCTION-NOTES.md` (no document prefix) covers the covenant
reconstruction specifically and is the most detailed example of the format.

### Regenerating a reading copy

If you need to correct text in a reading copy (e.g. a typo was found after
the fact):

1. Edit the appropriate `*-clean-text.html` in `_reconstruction/`.
2. Run its build script (e.g. `python build_pdf.py` from `_reconstruction/`).
   The script uses Chrome headless and PyMuPDF; see the Notes file for tool
   versions.
3. Copy the resulting `*-reconstructed.pdf` to `assets/documents/` with the
   correct `-reading-copy.pdf` filename (the build script may name it
   differently — rename as needed).
4. Commit and push the updated PDF.

The original scan in `assets/documents/` is never modified.

---

## Dormant content (site.yml)

**File:** `_data/site.yml`

This file holds content that the HOA has not yet published. All values are
currently empty (`""`). Each one is wrapped in an `{% if %}` guard in the
relevant page template, so nothing blank ever renders — the site looks
complete regardless of what is filled in.

**To activate a section: fill in the value, save, and push. That's it.**
The matching section appears automatically on the next build.

### contact_email

```yaml
contact_email: "board@heathridgehoa.com"
```

Effect: a contact email link appears in the site footer and in the "Contact
Us" section of the Terms page (section 9).

### annual_meeting_info and annual_meeting_date

```yaml
annual_meeting_info: "The annual meeting is held each fall at the CRA."
annual_meeting_date: "Saturday, October 18, 2025, 10:00 AM"
```

Effect: an "Annual Meeting" callout section appears on the homepage.
`annual_meeting_date` is optional — set only `annual_meeting_info` if you
don't have a date yet.

### dues_info and dues_amount

```yaml
dues_info: "Annual dues are billed each January and are due by March 1."
dues_amount: "$450 per year"
```

Effect: a "Dues & Assessments" callout section appears on the HOA Docs page.
`dues_amount` is optional.

To hide a section again later, set the value back to `""`.

---

## Editing page text vs. data

The distinction between the two edit paths:

| What you want to change | Where to edit |
|-------------------------|---------------|
| Officer names, roles, emails | `_data/officers.yml` |
| Annual dues amount, dates, fees | `_data/fees.yml` |
| Document list (titles, groups, summaries) | `_data/documents.yml` |
| Local Info links | `_data/links.yml` |
| Gallery photos | `_data/gallery.yml` |
| Navigation order | `_data/navigation.yml` |
| Contact email, meeting info, dues callout | `_data/site.yml` |
| Homepage prose (community overview, amenities text) | `index.html` (below the `---` front matter block) |
| Officers page prose note at bottom | `officers.html` |
| Fees & Dues page prose / document cards | `fees.html` |
| HOA Docs page intro paragraph | `hoa-docs-and-information.html` |
| Local Info page intro paragraph | `local-info-links.html` |
| Terms of Use legal text | `terms.html` |
| Page title or subtitle in the banner | The `title:` / `subtitle:` fields in each page's front matter (the `---` block at the top of the `.html` file) |
| Text or structure inside a reading-copy PDF | Edit `_reconstruction/*-clean-text.html`, re-run the build script, copy the output to `assets/documents/` (see above) |

The five `.html` files at the repo root are Jekyll pages, not static HTML.
Each begins with a YAML front matter block (between the `---` delimiters)
followed by HTML content. Both parts are plain text — edit them in any text
editor or directly in the GitHub web UI.

---

## Known follow-ups

These items were identified during the reconstruction work and are not yet
resolved:

- **Covenant §9.36 status unconfirmed.** The 2004 Fining Policy document
  (`by-law-amendments.pdf`) includes a homeowner ballot for a proposed
  periodic-mowing covenant that would have added Section 9.36 to the
  Declaration of Covenants. Whether that ballot passed and whether Section
  9.36 was ever formally recorded has not been confirmed. Until confirmed,
  the reconstruction treats it as a proposed amendment only. Check with the
  Rockwall County Clerk or HOA legal counsel before citing §9.36 as adopted.

- **Inconsistent entity names in the original instruments.** The governing
  documents use several different names for the association and the
  subdivision ("The Ridge-Heath," "The Ridge Subdivision," "Ridge-Heath
  Homeowners Association," etc.). These variations originate in the recorded
  instruments themselves and are reproduced faithfully in the reading copies
  rather than silently harmonised. If the legal name of the HOA or
  subdivision needs to be confirmed, refer to the Articles of Incorporation
  and the recorded Declaration.

---

## Local preview (optional)

GitHub Pages builds automatically on push, so a local preview is optional.
It is useful if you are making several changes at once and want to see them
before publishing.

**Prerequisites:** Ruby (2.7 or later) and Bundler. On Windows the
[RubyInstaller](https://rubyinstaller.org/) with DevKit is the easiest path.

```bash
# First time only — installs Jekyll and dependencies
bundle install

# Start the local server
bundle exec jekyll serve
```

Then open `http://localhost:4000` in a browser. The server watches for file
changes and rebuilds automatically. Press `Ctrl+C` to stop it.

The `github-pages` gem in the Gemfile pins Jekyll to the same version GitHub
Pages uses, so a local preview matches the live build.
