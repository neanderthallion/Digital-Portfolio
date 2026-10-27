# Luong Minh Anh · Digital Portfolio

Build specification for a one-page scholarship portfolio. Source of truth for copy is `Minh_Anh_DP_Content.docx` (version of 27 Oct 2026). This README restates that copy so the build can run from this file alone.

**Decisions locked with the student (27 Oct 2026)**

| Topic | Decision |
|---|---|
| Structure | One scrolling page, 5 sections, project details open in pop-ups. Each pop-up has its own shareable hash link (`#vtec`). This hash link is the project "detail view". No other pages |
| Project cards | Image + project name. On hover or keyboard focus, a panel slides up from the bottom, blurs the image behind it and shows a one-line description |
| Visual direction | Dark x-ray / wireframe base (Design inspo 1–3) with the bolder type, spacing and layout polish of an agency site (David Bragg landing page). One vivid accent colour |

---

## A. Project goal and audience

**Goal** · Show scholarship and admissions assessors, in under one minute, what Minh Anh has done for Data Science × Health Science, with evidence and links.

**Targets** · Data Science programmes at NUS, NTU, HKU (also CUHK, HKUST, Vietnamese universities). One general version for all schools.

**Intake** · Undergraduate admission and merit scholarships, 2027 intake (2027–2028).

**Audience**

| Who | What they need | What the site gives them |
|---|---|---|
| Scholarship assessors | Fast proof of ability, leadership, impact | Scores and awards in one band, numbers on every project |
| Admissions readers who already read the personal statement | Evidence, not the essay again | Project pop-ups with role, actions, results, links |
| Faculty reviewers (Data Science) | Real technical and research work | Research pop-up, DS-in-the-making, GitHub links |

**Role of this site** · The personal statement explains why she chose the field. The website shows what she has done, with evidence and links. It does not repeat the essay.

---

## B. Student narrative and desired impression

**Theme line** · Turning numbers into better health decisions.

**Core narrative (the loop the site should make visible)**

```
Notice a real problem among peers  →  Build something for it  →  Measure whether it works
(stress, poor sleep at exam time)     (BewellNest, Slumbering)     (sleep study, DS models)
```

**Strongest evidence, in order of weight**

1. **Research** · Lead researcher on a ~400-student sleep survey plus an 8-week mindfulness pilot, with consent and assent procedures and an honest "what it can't show" section
2. **Leadership at scale** · VTEC President, ~50 members over two campuses, 200+ SPARKMIND attendees, over VND 70 million in sponsorship
3. **Sustained health initiative** · Founded The Mindful Odyssey and BewellNest, Top 100 of about 5,000 initiatives two years running
4. **Technical practice** · Health-related models on public data (Random Forest, XGBoost, SHAP, t-tests), plus three self-built apps released on GitHub
5. **Academics** · SAT 1590, AP Statistics 5, AP Calculus AB 5, Mathematics 9.9, Hanoi Math Olympiad Third Prize

**Differentiators**

- Research honesty · states limits openly (small pilot, self-report, no comparison group). Rare at high-school level and valued by DS faculty
- Honest AI use · says she uses AI as a learning aid and checks generated code critically
- Health focus that runs through club work, apps and research, not just one project

**Desired impression in 10 seconds** · "A health-minded data student who leads, builds and measures."

**Mapping to assessor criteria**

| Criterion | Where it shows |
|---|---|
| Leadership | VTEC, The Mindful Odyssey (cards, pop-ups, About copy) |
| Impact | Results rows with numbers in every pop-up |
| Innovation | Innovation section + Research pop-up, Slumbering, Petite, Gesture-game |
| Commitment to Data Science | Theme line, DS-in-the-making, Research, AP Statistics 5, About copy ("I hope to become a health data scientist") |
| Contribution to the target university | help Vietnamese students explore the university through outreach activities, help organize health-data hackathons that brings students from different faculties |

**Weak spots to manage (no copy change without student approval)**

- Petite and Gesture-game are not health-related. They sit last in the grid (order already set in the doc), which is correct
- Current research at Youth Science Journal appears only in the Journey appendix (date unconfirmed) and nowhere on the page. Strong DS evidence, worth adding to About highlights once the date is confirmed → **[Date: Sep/2026-Present. Keep the card there, details will be added later]**

---

## C. Site map and routes

One route `/`. Sections are anchors. Pop-ups are hash routes on the same page.

```
/  (single page)
├── #top            Hero
├── #about          About
├── #projects       Projects (6 cards)
│     ├── #vtec               pop-up
│     ├── #mindful-odyssey    pop-up
│     ├── #slumbering         pop-up
│     ├── #ds-in-the-making   pop-up
│     ├── #petite             pop-up
│     └── #gesture-game       pop-up
├── #innovation     Innovation (research teaser)
│     └── #research           pop-up
└── #contact        Contact
```

**Hash routing rules**

| Situation | Behaviour |
|---|---|
| Visitor loads `/#vtec` | Page renders, scrolls behind to `#projects`, VTEC pop-up opens |
| Visitor opens a card | URL updates to `#slug` with `history.pushState` |
| Visitor closes a pop-up | URL returns to `#projects` (or `#innovation` for `#research`) with `history.replaceState` |
| Browser Back while pop-up is open | Pop-up closes, page stays where it was |
| Prev / Next inside a pop-up | URL updates with `replaceState` (so Back does not step through every project) |
| Unknown hash (`#abc`) | Ignore, show page top, no error |
| JavaScript disabled | Cards link to the matching `<article id="slug">` rendered at the end of the page, so content stays reachable |

Section names stay as in the doc. "Innovation" is kept as a separate section because the research study is her strongest single piece of evidence and needs its own space.

---

## D. Global navigation and footer

### Top bar

| Item | Target | Behaviour |
|---|---|---|
| Name mark "Minh Anh" (text, left) | `#top` | Smooth scroll to top |
| About | `#about` | Smooth scroll |
| Projects | `#projects` | Smooth scroll |
| Innovation | `#innovation` | Smooth scroll |
| Contact | `#contact` | Smooth scroll |
| Résumé (outlined button, right) | `https://drive.google.com/file/d/1zlk9EUQMgGN87sJZzcWSU6_PHZECiSQi/view?usp=sharing` | Opens PDF in new tab.

- Sticky at top, height 64px desktop / 56px mobile, background `--bg` at 85% opacity with backdrop blur, 1px bottom line `--line`
- Active section highlighted with accent underline, set by `IntersectionObserver`. Active link gets `aria-current="location"`
- Scroll offset so section headings are never hidden under the bar (`scroll-margin-top` = bar height + 16px)
- Below 768px · items collapse into a "Menu" button that opens a full-screen panel. Panel closes on link click, Esc, or the close button. Focus moves into the panel and returns to the Menu button on close
- First focusable element on the page is a "Skip to content" link

### Footer

The doc does not define a footer. Keep it minimal and use only approved items.

- Left · "Luong Minh Anh" · `anhlm1208@gmail.com` (mailto)
- Right · "Back to top" → `#top`
- Optional · GitHub profile link (https://github.com/neanderthallion)
- Small mono line · "Updated [CONTENT NEEDED · publish date]"

---

## E. Design direction

**One-line brief** · A clean, confident agency site with a scientific x-ray skin. Dark canvas, thin line grids, small mono data labels, one vivid accent, large bold type.

**Take from Design inspo 1–3 (direction only, never copy)**

- Near-black background
- Thin hairline grids, circles and crosshair corner marks framing images
- Small monospace labels that read like data annotations (`P/01`, `n ≈ 400`, `8 wks`)
- Black-and-white imagery feel, with colour used sparingly

**Take from the David Bragg landing page (layout polish, never copy)**

- Very large display headline in the hero
- Generous spacing and a clear 12-column grid
- Section labels in small caps at the left edge (`01 / ABOUT`)
- Strong contrast between big headings and small supporting text

**Not used** · Warren Mennen page (light theme with red, does not fit the direction). Fantasy, scrapbook or fine-art styling. Stock imagery. 3D blobs.

**Readability rule** · The inspo images are posters. On this site, body text is at least 16px with high contrast, and the mono style is for short labels only, never paragraphs.

**Decorative layer** · Built only with CSS and inline SVG (grids, circles, crosshairs, connector lines). No decorative image files. Any text placed in annotations must be approved copy (for example "SAT 1590", "n ≈ 400"). No made-up labels.

**Photo treatment** · Proof photos stay in natural colour inside pop-ups. On cards, an optional light grayscale (max 40%) that returns to full colour on hover is allowed. Never alter charts.

---

## F. Colour and typography placeholders

All values are placeholders. Swap freely, but re-check contrast.

### Colour tokens (dark theme only)

| Token | Value | Use | Contrast on `--bg` |
|---|---|---|---|
| `--bg` | `#0B0B0D` | Page background | · |
| `--surface` | `#16161A` | Cards, pop-up panel | · |
| `--text` | `#F2F1EC` | Headings, body | 17.4 : 1 |
| `--text-muted` | `#A3A39C` | Secondary text, labels | 7.8 : 1 |
| `--accent` | `#FF6A3D` | Links, active nav, buttons, focus ring, key numbers | 6.9 : 1 |
| `--on-accent` | `#0B0B0D` | Text on accent buttons | 6.9 : 1 |
| `--line` | `rgba(242,241,236,0.12)` | Decorative grid lines | decorative only |
| `--line-strong` | `#6E6E75` | Borders that carry meaning (card edge, inputs) | 3.9 : 1 |
| `--overlay` | `rgba(11,11,13,0.72)` | Card hover panel behind text | · |

- One accent only. No gradients across the whole page
- Never put `--text-muted` on top of a photo

### Typography

| Role | Placeholder font | Size (desktop → mobile) | Notes |
|---|---|---|---|
| Display (name, section headings) | Space Grotesk 600–700 | 96–120px → 44–56px (`clamp`) | Tight line-height 1.0, letter-spacing −0.02em |
| Headings (pop-up title, h3) | Space Grotesk 600 | 32–40px → 26–30px | |
| Body | Inter 400 | 18px → 16px | Line-height 1.6, max width 68ch |
| Labels / annotations | JetBrains Mono 500 | 13px → 12px | Uppercase, letter-spacing 0.06em, labels only |
| Big numbers (key facts) | Space Grotesk 600 | 56px → 40px | Accent colour |

Load from Google Fonts with `font-display: swap`. Max 2 weights per family.

---

## G. Reusable components

| Component | Used in | Spec |
|---|---|---|
| `SectionLabel` | Every section | Mono label at left, e.g. `02 / ABOUT`, thin rule after it |
| `Button` | Hero, About, Innovation, Contact, pop-ups | Primary = accent fill + `--on-accent` text. Secondary = 1px `--line-strong` outline. Min height 44px. External links show ↗ and visually hidden "(opens in new tab)" |
| `Chip` | About score chips | Pill, 1px border, mono label + value, wraps freely |
| `HighlightItem` | About highlights | Mono index (`A/01`) + award text, hairline divider between items |
| `ImageFrame` | Hero portrait, Innovation chart, pop-up images | Image inside thin border with SVG crosshair corners. Fixed aspect ratio to stop layout shift. Built-in loading and error states (see M) |
| `ProjectCard` | Projects grid | See section I |
| `StatBlock` | Innovation key facts | Big accent number + mono caption |
| `Modal` (pop-up) | 7 pop-ups | Native `<dialog>`. See section I |
| `DetailRow` | Inside pop-ups | Label (mono, left column) + content (right column). Content split on "·" becomes a bullet list. Numbered steps stay numbered |
| `LinkGroup` | Pop-ups | Row of secondary buttons. Missing links are hidden, never shown as dead buttons |
| `GridDecor` | Hero, section backgrounds | Inline SVG hairlines, circles, crosshairs. `aria-hidden="true"` |

---

## H. Page-by-page build specification

All website copy below is final, approved copy from the doc. Use it **verbatim** unless listed in "Approved copy edits" (section N).

### 1 · Hero (`#top`)

**Purpose** · Who she is and the theme, in one screen.

**Layout (desktop)** · 12-column grid, min-height 100svh minus nav. Columns 1–7 text, columns 8–12 portrait in `ImageFrame`. `GridDecor` circles behind the portrait, a connector line from the frame to a mono annotation.

| Order | Element | Copy |
|---|---|---|
| 1 | Mono label | `DATA SCIENCE × HEALTH SCIENCE` |
| 2 | `h1` (display) | Luong Minh Anh |
| 3 | Tagline (mono) | Data Science × Health Science · High school class of 2027 · Hanoi, Vietnam |
| 4 | Theme line (large body, 28–36px) | Turning numbers into better health decisions. |
| 5 | Primary button | See my projects → `#projects` |
| 6 | Secondary button | Email me → `mailto:anhlm1208@gmail.com` |
| 7 | Portrait | IMG 1 · `Portrait.jpg` |


### 2 · About (`#about`)

**Purpose** · Short human introduction, scores and top awards. No essay story.

**Layout (desktop)** · Left 5 columns heading + copy. Right 7 columns score chips, then highlights list, then buttons.

| Element | Copy |
|---|---|
| `SectionLabel` | `01 / ABOUT` |
| `h2` | Hi, I'm Minh Anh |
| Copy | I'm a Grade 12 student at Vinschool Times City High School in Hanoi, Vietnam. I'm interested in questions that connect data, technology, and people. At school, I lead VTEC, our technology club, and The Mindful Odyssey, a student well-being initiative. My projects often begin with something I notice in everyday life. I'm still developing my programming skills and use AI as a tool while learning to build and evaluate solutions. I hope to become a health data scientist. |

**Score chips (one chip each, in this order)**

| Label | Value |
|---|---|
| GPA | 9.7 (Grade 10) |
| GPA | 9.8 (Grade 11) |
| Mathematics | 9.9 |
| SAT | 1590 |
| IELTS | 8.0 |
| AP Calculus AB | 5 |
| AP Statistics | 5 |
| AP Computer Science A | 4 |
| Now taking | AP Calculus BC and AP Biology |

**Highlights (list, in this order)**

1. Third Prize, Hanoi Mathematical Olympiad (Group A), 2026–2027 · **[date: Sep 2026]**
2. First Prize (Week 1) and Second Prize (Month 2), Road to Mount Olympia 2026, VTV
3. Outstanding Student of the Capital City, 2025–2026
4. Top 100 of about 5,000, Vinschool Well-being Initiatives, two years running

**Buttons**

| Label | Target | Behaviour |
|---|---|---|
| Download my résumé | `https://drive.google.com/file/d/1zlk9EUQMgGN87sJZzcWSU6_PHZECiSQi/view?usp=sharing`
| View certificates | `https://drive.google.com/drive/folders/1wkFEKFKIk01diXATGUh1ES5cgARjeWfG?usp=sharing` | New tab, ↗ icon. Check the folder is set to "Anyone with the link can view" |

### 3 · Projects (`#projects`)

**Purpose** · Hub of 6 cards. Click opens the pop-up.

| Element | Copy |
|---|---|
| `SectionLabel` | `02 / PROJECTS` |
| `h2` | Projects |
| Subheading | Clubs I lead and apps I build. Click a card to see the details. |

**Cards (this order)** · full card rules in section I.

| # | Card name | Card image | Hover description | Opens |
|---|---|---|---|---|
| P/01 | VTEC | IMG 3 · `Sparkmind.jpg` | A community of tech enthusiasts, creating value through technology | `#vtec` |
| P/02 | The Mindful Odyssey | IMG 5 · `BewellNest.jpg` | A wellbeing initiative that delivers consistent support for students | `#mindful-odyssey` |
| P/03 | Slumbering | IMG 6 · **[CONTENT NEEDED · image]** | A supportive sleep-habit app that helps track goals and plays sounds | `#slumbering` |
| P/04 | DS-in-the-making | IMG 7 · `Insomnia.png` | Practice models linking everyday habits and health outcomes | `#ds-in-the-making` |
| P/05 | Petite | IMG 8 · `Petite.png` (cropped) | A desktop companion that makes reminders harder to ignore | `#petite` |
| P/06 | Gesture-game | IMG 9 · **[CONTENT NEEDED · image]** | An input system letting users play games using hand gestures | `#gesture-game` |

### 4 · Innovation (`#innovation`)

**Purpose** · Research teaser. Button opens the Research pop-up.

**Layout (desktop)** · Left 6 columns question, copy, stat blocks, button. Right 6 columns IMG 2 in `ImageFrame` with mono caption.

| Element | Copy |
|---|---|
| `SectionLabel` | `03 / INNOVATION` |
| `h2` | How well do students sleep, and what role might mindfulness play? |
| Copy | For my first research study, I surveyed students across my school and ran an eight-week pilot with BewellNest members. The study examines sleep patterns and explores whether a weekly mindfulness programme may be associated with changes in self-reported sleep. The paper is planned for November 2026. |
| Stat block 1 | **~400** · students surveyed (approved text · "About 400 students surveyed") |
| Stat block 2 | **~20** · pilot participants (approved text · "Around 20 pilot participants") |
| Stat block 3 | **8** · weeks |
| Button (primary) | View the study → opens `#research` |
| Image | IMG 2 · `Sample Distribution.png` |

- Screen readers must hear the full approved wording ("About 400 students surveyed"). Put it in visually hidden text next to the big number
- "Planned for November 2026" goes out of date soon. Update this line and add the paper link once published

### 5 · Contact (`#contact`)

**Purpose** · Clear last step.

| Element | Copy |
|---|---|
| `SectionLabel` | `04 / CONTACT` |
| `h2` | Say hello |
| Copy | Thanks for visiting. If you'd like to learn more about a project or its process, I'd be happy to share more. |
| Button (primary, large) | Email me → `mailto:anhlm1208@gmail.com` |
| References | Mr. Hoang Minh Co, Vice Principal, Vinschool Times City High School · v.cohm@vinschool.edu.vn · Mrs. Do Thi Hoa, Teacher, School Psychology Office, Vinschool Times City Secondary and High School · v.hoadt21@vinschool.edu.vn |

- References block is behind a config flag `SHOW_REFERENCES = false`. Publish only after both teachers agree
- No contact form (avoids a backend and spam). Email button only

### Not on the page

- Journey timeline (kept in the doc appendix for a possible later "View Journey" link)
- Skill bars, emojis, testimonials, quotes

---

## I. Project hub and project detail rules

### ProjectCard

**Content** · Image + project name + mono index (`P/01`). The hover description lives in the DOM at all times.

**Markup**

```html
<a class="card" href="#vtec" aria-haspopup="dialog" aria-describedby="vtec-desc">
  <img src="…" alt="" width="…" height="…" loading="lazy">
  <span class="card__index" aria-hidden="true">P/01</span>
  <h3 class="card__title">VTEC</h3>
  <p class="card__desc" id="vtec-desc">Developing a community of tech enthusiasts, …</p>
</a>
```

- Whole card is one link. Card image alt is empty (`alt=""`) because the name already labels the link. Full alt text is used on the same image inside the pop-up
- Aspect ratio 4:3, `object-fit: cover`, rounded corners 4px max, 1px `--line-strong` border

**Hover / focus overlay (student's spec)**

| Step | Desktop hover or `:focus-visible` |
|---|---|
| 1 | Card lifts 4px, border turns accent |
| 2 | Panel slides up from bottom (translateY 100% → 0), 280ms ease-out |
| 3 | Image behind panel blurs (`backdrop-filter: blur(8px)`) under `--overlay` tint |
| 4 | Panel shows card name + description in `--text` |
| Leave | Reverse, 200ms |

- Text sits on a solid `--overlay` layer so contrast stays at least 4.5 : 1 even if blur is unsupported (fallback is the tint alone)
- **Touch devices** (`@media (hover: none)`) · no hover exists, so show the description as a static line under the card name, always visible. Tap opens the pop-up
- **Reduced motion** · no slide and no lift. Panel fades in (opacity only, 120ms) or appears instantly

**Grid** · 3 columns ≥1024px, 2 columns 640–1023px, 1 column <640px. Gap 24px (16px mobile).

### Pop-up (Modal)

**Element** · native `<dialog>` opened with `showModal()`. Heading is the dialog's accessible name (`aria-labelledby`).

**Order inside every pop-up**

1. Top bar (sticky inside dialog) · Close (X) · Previous · Next · counter `2 / 6`
2. Main image (`ImageFrame`, max-height 60vh, natural aspect)
3. Title (`h2`)
4. Role and dates (mono)
5. Shared app introduction (only Slumbering, DS-in-the-making, Petite, Gesture-game)
6. `DetailRow`s in the order listed for that project
7. `LinkGroup`

**Behaviour**

| Action | Result |
|---|---|
| Close X, Esc, click on backdrop | Close |
| Page behind | Does not scroll (`overflow: hidden` on `<html>` while open) |
| Long content | Scrolls inside the dialog |
| Mobile (<640px) | Full screen, top bar stays fixed |
| Previous / Next | Moves through the 6 projects in grid order, wraps around. Arrow keys ← → also work when focus is not in text |
| Research pop-up | Opened from Innovation. Previous / Next hidden (not part of the project set) |
| Focus | On open, focus moves to the dialog heading. Focus stays inside. On close, focus returns to the card or button that opened it |
| Share | Each pop-up has its own hash URL |

**Shared app introduction** (shown at the top of the 4 app pop-ups)

> I build small, self-directed apps around problems I notice or interests I want to explore. Using AI as a learning and development aid has taught me to define the problem, shape a solution, and check generated code critically.

### Pop-up content (approved copy, verbatim)

Lists separated by "·" in the doc render as bullets.

#### `#research` · Sleep Study and BewellNest Pilot

| Row | Copy |
|---|---|
| Image (top) | IMG 2 · `Sample Distribution.png` (before and after the second round) |
| Question | How well do students sleep, and what role might mindfulness play? |
| Why it matters | Members of my mindfulness club reported sleeping better, but I had not collected evidence to examine that impression. I found that research on adolescent sleep and mindfulness practice in Vietnam was limited, which led me to investigate sleep patterns at my school and pilot a regular mindfulness programme. |
| Who it helps | Vinschool students · Secondary and high school students in Vietnam, especially those who struggle with sleep · The wider research field, which has little evidence on Vietnamese adolescents |
| What I did | 1. Reviewed existing studies to identify a research gap and refine the research question · 2. Drafted a research proposal and protocol for a survey and quasi-experimental pilot · 3. Prepared the questionnaire, parent consent form, and student assent form · 4. Surveyed approximately 400 students, then sampled one additional class per grade to address an initial imbalance toward younger students and girls · 5. Ran an eight-week pilot with around 20 BewellNest members, part of The Mindful Odyssey · 6. Cleaned the data and compared patterns by grade and gender |
| What it can show | How common self-reported sleep concerns are among students at my school |
| What it can't show | Whether BewellNest caused any change, because the pilot is small, sleep is self-reported, and there is no comparison group |
| Role | Lead researcher, working with one teammate under the supervision of the School Psychology Office |
| Skills | Research-question development · Survey design · Consent and assent procedures · Data cleaning · Descriptive analysis and subgroup comparisons |
| Lesson | Convincing evidence depends more on research design than on the amount of data. |
| Links | **[CONTENT NEEDED · paper link, Nov 2026]** |

Design note · show "What it can show" and "What it can't show" side by side (two columns desktop, stacked mobile). This honesty is a differentiator and should be easy to spot.

#### `#vtec` · VTEC (Vinschool Technology Club)

| Row | Copy |
|---|---|
| Image (top) | IMG 3 · `Sparkmind.jpg` |
| Role and dates | Member of the Expertise Department, Sep 2024–Jun 2025 · President, Jun 2025–present |
| Why | VTEC is a student-led technology club at Vinschool. I joined to help build a community where students can explore technology together and turn what they learn into practical projects. |
| What I did | Judged the VinSTEM robotics challenge and led the VinSTEAM Innovations competition · Helped expand the club to The Harmony campus · Drafted the plan and co-developed content for REINVINTECH, an AI competition focused on well-being · Coordinated with teachers, sponsors, and vendors to deliver SPARKMIND Festival, featuring AI, robotics, and drones |
| Results | Around 50 members aged 15–17 across two campuses · Nearly 100 registrations for REINVINTECH, with eight teams completing working products · More than 200 SPARKMIND attendees and over VND 70 million in sponsorship · 150+ VinSTEM participants · 20+ teams in VinSTEAM Innovations · Around 10 former REINVINTECH candidates later applied to join VTEC |
| Skills | Project planning · Team coordination · Event delivery · Stakeholder communication · Sponsorship coordination |
| Lesson | Start with the goal everyone shares, then work toward a practical compromise. |
| Second image (after Results) | IMG 4 · `REINVINTECH.JPG` |
| Links | **[CONTENT NEEDED · VTEC fanpage or event post]** |

#### `#mindful-odyssey` · The Mindful Odyssey and BewellNest

| Row | Copy |
|---|---|
| Image (top) | IMG 5 · `BewellNest.jpg` (consent from students shown, or faces blurred) |
| Role and dates | Founder and leader, Dec 2024–present |
| Why | During exam periods, I saw friends struggling with stress and poor sleep, but there was no regular space at school to practise simple coping strategies together. |
| What I did | Co-led a stress-management workshop with a classmate · Started BewellNest with the School Psychology Office, offering weekly 30-minute sessions with light movement, games, and open conversation · Created content for BewellActs, a short daily physical-activity challenge · Began a sleep study to understand student sleep patterns and explore the BewellNest pilot (see Innovation) |
| Results | 30 workshop attendees, with 90% rating the session above 8/10 · 20–25 students at a typical BewellNest session · BewellActs reached dozens of students daily · Ranked in the Top 100 out of approximately 5,000 initiatives in Vinschool Well-being Initiatives in two consecutive years |
| Skills | Initiative design · Student engagement · Workshop facilitation · Collaboration with school support staff · Communicating well-being ideas |
| Lesson | A single event raises awareness. Long-term habits need a consistent space to grow. |
| Links | **[CONTENT NEEDED · school post or certificate]** |

- "(see Innovation)" becomes an in-dialog link that closes this pop-up and opens `#research`

#### `#slumbering` · Slumbering

| Row | Copy |
|---|---|
| Image (top) | IMG 6 · three screens in one image (goals, check-in, Journey) **[CONTENT NEEDED · image]** |
| Role and dates | Designed and built independently with AI assistance, Jun–Aug 2026 |
| Why | Many students know what healthy sleep habits look like but find it difficult to follow them consistently. I wanted to design a tool that makes small changes easier to practise without turning missed goals into a source of guilt. |
| What it does | An Android app in Vietnamese · Set small nightly goals for bedtime, winding down, or relaxation · Check in each morning · Track streaks and recent nights on the Journey screen · Earn seven badges · View bedtime charts · Play eight sleep sounds · Set three reminders · Keep all data on the device |
| Design choices | A missed goal counts as feedback for the next night · Sound files download on first use to keep the app small · After feedback raised questions about the scientific basis and the number of features, I simplified the first version · Each feature has its own screen, and a short onboarding makes the app easier to understand |
| Results | Shared publicly and updated in response to user feedback · Tried by several BewellNest members and other students |
| Skills | Designing for a specific user group · Simplifying features from feedback · App development with AI assistance · Publishing a release |
| Lesson | A smaller set of clearly explained features can be more useful than a crowded app. |
| Links | GitHub → `https://github.com/neanderthallion/Slumbering_v2` · Download APK → `https://github.com/neanderthallion/Slumbering_v2/releases/tag/Slumbering_v2.1.2` |

#### `#ds-in-the-making` · DS-in-the-making

| Row | Copy |
|---|---|
| Image (top) | IMG 7 · `Insomnia.png` (SHAP chart of what drives insomnia) |
| Role and dates | Self-directed projects with AI assistance, Jun 2026–present |
| Why | Before analysing my own survey data, I wanted to practise connecting everyday habits with health-related outcomes using public datasets. |
| What I did | Obesity dataset · Trained a Random Forest classifier to predict obesity level and evaluated it with five-fold cross-validation · Sleep and lifestyle dataset · Used SHAP with a Random Forest classifier to examine features linked to insomnia and sleep apnea · Sleep debt and screen-time dataset · Modelled how pre-bedtime screen time relates to REM sleep · Used t-tests to explore whether a blue-light filter was linked to less next-day fatigue among high-brightness phone users · Compared XGBoost and Random Forest models for predicting next-day fatigue |
| Results | Obesity · about 90% accuracy · Insomnia · a ranked chart of the most influential features · REM sleep · a broad trend, but not reliable for individual predictions · Blue-light filter · a line chart comparing fatigue with the filter on and off · Fatigue · the XGBoost model reached R² ≈ 0.83, explaining about 83% of the variation in next-day fatigue in this dataset |
| Skills | Data cleaning · Classification and regression models · Cross-validation · Explaining models with SHAP · t-tests |
| Lesson | Public datasets often arrive tidy. Real survey responses need much more careful cleaning. |
| Links | GitHub → `https://github.com/neanderthallion/DS-in-the-making` |

**Rendering rule for this pop-up** · "What I did" and "Results" use "·" both as list separator and between dataset name and detail. Do not split blindly. Render as grouped lists.

| Group (dataset) | What I did | Result |
|---|---|---|
| Obesity dataset | Trained a Random Forest classifier to predict obesity level and evaluated it with five-fold cross-validation | About 90% accuracy |
| Sleep and lifestyle dataset | Used SHAP with a Random Forest classifier to examine features linked to insomnia and sleep apnea | A ranked chart of the most influential features |
| Sleep debt and screen-time dataset | Modelled how pre-bedtime screen time relates to REM sleep | A broad trend, but not reliable for individual predictions |
| | Used t-tests to explore whether a blue-light filter was linked to less next-day fatigue among high-brightness phone users | A line chart comparing fatigue with the filter on and off |
| | Compared XGBoost and Random Forest models for predicting next-day fatigue | The XGBoost model reached R² ≈ 0.83, explaining about 83% of the variation in next-day fatigue in this dataset |

> Check with student · the grouping of the last two items under "Sleep debt and screen-time dataset" is inferred from order in the doc → **[CONFIRMED]**

#### `#petite` · Petite

| Row | Copy |
|---|---|
| Image (top) | IMG 8 · `Petite.png` (cropped to the cat and speech bubble, Pokémon sprites removed) |
| Role and dates | Designed and built independently with AI assistance, Jul 2026 |
| Vision | A lightweight reminder tool dressed as a desktop pet. It is noticeable enough to prompt action and friendly enough to feel less intrusive. |
| What it does | A pixel-art cat or dog appears on a Windows desktop with a speech bubble · Customize pets and reminder categories · Set rules for each reminder, including its message, frequency, and active days · Choose OK or Snooze to dismiss or delay a reminder · Runs in the background while keeping all data on the computer |
| Design aim | Make reminders pleasant to notice, so taking action feels easier. |
| Results | Released on GitHub · I still use Petite to manage my own reminders |
| Skills | User-focused design · Customizable reminder logic · Desktop app development with AI assistance |
| Lesson | A simple tool can be useful when it addresses a specific, everyday problem. |
| Links | GitHub → `https://github.com/neanderthallion/Petite/releases` |

#### `#gesture-game` · Gesture-game

| Row | Copy |
|---|---|
| Image (top) | IMG 9 · short demo GIF **[CONTENT NEEDED · image]** |
| Role and dates | Self-directed project, Aug 2026 |
| Why | I wanted to explore a playful, practical use for real-time hand tracking. |
| What it does | A webcam tracks hand movements and maps selected gestures to keyboard inputs, letting users play games such as Subway Surfers without touching the keyboard. |
| Tools used | Python · OpenCV for the camera feed and image processing · MediaPipe for hand tracking · PyAutoGUI to send keyboard inputs |
| Results | A working gesture-controlled input system that maps detected hand movements to directional keys. |
| Skills | Real-time hand tracking · Mapping gestures to keyboard input · Combining several Python libraries |
| Lesson | A familiar technology becomes more interesting when it is applied to a clear, practical use. |
| Links | GitHub → `https://github.com/neanderthallion/Gesture-game` · **[CONTENT NEEDED · demo video]** |

---

## J. Image and asset map

Source folder · `DP_Assets/Images/`. Use these file names exactly as the source. The build may output optimised copies (WebP + JPG/PNG fallback, `srcset` at 480 / 960 / 1440w) with web-safe names, recorded in the "Output name" column. Every photo under 500 KB after compression.

| ID | Source file | Size now | Role | Used in | Action before build | Output name |
|---|---|---|---|---|---|---|
| IMG 1 | `Portrait.jpg` | 139 KB | Portrait | Hero | None | `portrait` |
| IMG 2 | `Sample Distribution.png` | 29 KB | Proof image (chart) | Innovation section + Research pop-up top | Re-export as a clean chart with Before and After side by side, no spreadsheet grid | `sample-distribution` |
| IMG 3 | `Sparkmind.jpg` | 145 KB | Card image + proof image | VTEC card + VTEC pop-up top | None | `sparkmind` |
| IMG 4 | `REINVINTECH.JPG` | 4.7 MB | Proof image | VTEC pop-up (after Results) | Compress to under 500 KB | `reinvintech` |
| IMG 5 | `BewellNest.jpg` | 4.6 MB | Card image + proof image | Mindful Odyssey card + pop-up top | Compress to under 500 KB · consent from students shown, or blur faces | `bewellnest` |
| IMG 6 | **[CONTENT NEEDED · image]** | · | Card image + proof image | Slumbering card + pop-up top | Three screens in one image (goals, check-in, Journey) | `slumbering` |
| IMG 7 | `Insomnia.png` | 132 KB | Card image + proof image (chart) | DS-in-the-making card + pop-up top | For the card, crop to the top-ranked bars so it reads at small size. Pop-up shows the full chart | `insomnia-shap` |
| IMG 8 | `Petite.png` | 156 KB | Card image + proof image | Petite card + pop-up top | Crop to the cat and speech bubble, remove the Pokémon sprites | `petite` |
| IMG 9 | **[CONTENT NEEDED · image]** | · | Card image + proof image | Gesture-game card + pop-up top | Short demo. Convert GIF to muted looping MP4/WebM + still poster frame | `gesture-game` |
| Decor | none (CSS / inline SVG) | · | Decorative | Hero, section backgrounds, image frames | Built in code, `aria-hidden="true"` | · |

**Not published** · `DP_Design/Design inspo 1–3.jpg`, `David Bragg Landing Page.webp`, `Warren Mennen Landing Page.webp`. Reference only.

### Alt-text guidance

- Describe what the image shows and why it matters, in one sentence, under 125 characters
- Use only facts from the doc. Do not guess names, numbers or places that the doc does not state
- Charts · state the chart type and what it compares. Key numbers are already in the text, so do not repeat them all
- Card images use `alt=""` (the card link name covers them). Pop-up and section images use full alt text
- Decorative SVG uses `aria-hidden="true"`

| ID | Draft alt text |
|---|---|
| IMG 1 | Portrait of Luong Minh Anh |
| IMG 2 | Bar chart of the survey sample by grade and gender, before and after the second sampling round |
| IMG 3 | Main stage at the SPARKMIND Festival, delivered by VTEC |
| IMG 4 | REINVINTECH ceremony |
| IMG 5 | Students at a BewellNest session |
| IMG 6 | Three Slumbering app screens showing nightly goals, morning check-in and the Journey screen |
| IMG 7 | SHAP chart ranking the features most linked to insomnia in a public sleep and lifestyle dataset |
| IMG 8 | Petite, a pixel-art pet with a reminder speech bubble on a Windows desktop |
| IMG 9 | Demo of Gesture-game, where hand movements in front of a webcam control a game |

---

## K. Interactions and motion

**Principle** · Motion confirms an action or guides the eye. Nothing moves on its own for more than a moment.

| Interaction | Default | Reduced motion (`prefers-reduced-motion: reduce`) |
|---|---|---|
| Nav link click | Smooth scroll | Instant jump (`scroll-behavior: auto`) |
| Active nav state | Underline slides to the active item, 200ms | Underline swaps instantly |
| Hero load | Name, tagline, theme, buttons fade up 12px, 60ms stagger, total under 600ms | Shown at once |
| Section reveal | Fade up 16px, once per section, 300ms | Shown at once |
| Card hover / focus | Lift 4px + panel slides up + blur (see I) | Opacity fade only, no lift |
| Pop-up open | Backdrop fade + panel fade and scale 0.98 → 1, 200ms | Fade only, 100ms |
| Pop-up Prev / Next | Content cross-fade 150ms | Instant swap |
| Gesture-game demo | Plays muted, loops, has pause button | Shows still poster with a Play button |
| Button hover | Background or border colour change, 150ms | Same (colour change is not motion) |

**Never** · parallax, scroll-jacking, custom cursors, auto-rotating carousels, looping background animation, sound.

---

## L. Responsive behaviour

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | 1 column, 16px side gutter. Nav → Menu button. Hero · label, name, tagline, theme line, buttons full width, portrait below at 80% width. Chips wrap. Cards 1 column with description always visible. Pop-ups full screen. Stat blocks stack |
| Tablet | 640–1023px | 2-column card grid, 24px gutter. Hero text and portrait stack (portrait right-aligned, 60% width). About heading above content. Innovation chart below text. Pop-up 90vw, max 720px |
| Desktop | 1024–1439px | 12-column grid, 32px gutter, container max 1200px. Layouts as in section H. 3-column card grid. Pop-up max 880px wide |
| Wide | ≥ 1440px | Container max 1280px, centred. Decorative grid extends to full width, content does not |

- Display type uses `clamp()` so the name never breaks mid-word. "Luong Minh Anh" may wrap onto two lines on mobile
- No horizontal scroll at any width down to 320px
- Touch targets at least 44 × 44px
- Test at 360, 390, 768, 1024, 1280, 1440px, and in landscape on mobile (pop-up top bar must stay usable at short heights)

---

## M. Accessibility and usability

**Target** · WCAG 2.2 AA.

**Structure**

- `<html lang="en">`
- Landmarks · `<header>`, `<nav>`, `<main>`, `<footer>`. Each section is a `<section>` with an `h2`
- One `h1` (her name). Pop-up titles are `h2` inside the dialog
- Skip link to `<main>`

**Keyboard**

- Every action works by keyboard (nav, cards, pop-up, Prev / Next, links)
- Visible focus on everything · 2px `--accent` outline, 3px offset. Never `outline: none` without a replacement
- Tab order follows visual order
- Pop-up traps focus and returns it on close (native `<dialog>` handles most of this. Test it)

**Contrast and colour**

- Body text ≥ 4.5 : 1, large text ≥ 3 : 1, meaningful borders and icons ≥ 3 : 1 (palette in F passes)
- Card overlay text tested against the lightest image under it
- No meaning carried by colour alone (active nav also has an underline)

**Content**

- Body text ≥ 16px, line length ≤ 68ch, line-height ≥ 1.5
- Page reflows at 400% zoom / 320px width without loss
- Links say where they go ("GitHub", "Download APK"), never "click here"
- External links announce "(opens in new tab)"
- Big numbers in stat blocks have the full approved wording for screen readers

**Loading and error states**

| Case | Behaviour |
|---|---|
| Image loading | `ImageFrame` shows `--surface` fill with a faint line grid. Width and height set so nothing jumps |
| Image fails | Frame keeps its size, shows a small mono label "Image unavailable" + the alt text. No broken-image icon |
| Hero image | `loading="eager"`, `fetchpriority="high"`. All others `loading="lazy"` |
| Fonts slow | System font fallback with matched metrics (`size-adjust`) to limit layout shift |
| Video fails or is blocked | Show poster image + link to GitHub |
| Missing link ([CONTENT NEEDED]) | Button not rendered at all |
| Missing image ([CONTENT NEEDED]) | Dev build shows a labelled placeholder. **Production build fails** until it is supplied (see N) |
| Deep link to unknown hash | Ignored, page loads normally |
| JavaScript off | All content readable. Pop-up content appears as articles at page end, cards link to them |

---

## N. Technical and content-integrity rules

### Stack (recommended)

- Static site · plain HTML, CSS and vanilla JS (or Vite for bundling). No framework needed for one page
- All copy in one data file (`content/site.json`) so wording changes never touch layout code
- Hosting · **[CONTENT NEEDED · host and domain]** (GitHub Pages, Netlify or Vercel all fit)
- Performance targets · Lighthouse Performance ≥ 90, Accessibility 100, Best Practices ≥ 95 on mobile. Total page weight under 2.5 MB on first load
- Meta · title "Luong Minh Anh · Data Science × Health Science", description = theme line, Open Graph image = portrait or a clean title card (no invented text)
- `robots` · Allow search engine indexing

### Content integrity

1. Copy comes only from `Minh_Anh_DP_Content.docx`. Use it verbatim
2. Never invent facts, metrics, roles, quotes, dates, partnerships, awards, links or outcomes
3. Missing items stay as `[CONTENT NEEDED · …]` in `site.json`
4. `[CONFIRM WITH STUDENT]` items are built with the current approved text until the student confirms a change
5. Teacher emails stay hidden (`SHOW_REFERENCES = false`) until both teachers agree
6. AI-use statements stay exactly as written (they are an honesty signal)
7. Journey appendix is not built

**Approved copy edits (applied in this README)**

| Where | Doc text | Site text | Reason |
|---|---|---|---|
| Slumbering card description | "plays sleep sound" | "plays sleep sounds" | Grammar |

All other wording is unchanged.

**Open items before launch**

| Item | Status |
|---|---|
| Research paper link (Nov 2026) | [CONTENT NEEDED] |
| VTEC fanpage or event post | [CONTENT NEEDED] |
| Mindful Odyssey school post or certificate | [CONTENT NEEDED] |
| IMG 6 Slumbering screens | [CONTENT NEEDED] |
| IMG 9 Gesture-game demo | [CONTENT NEEDED] |
| Gesture-game demo video | [CONTENT NEEDED] |
| Host, domain, publish date | [CONTENT NEEDED] |
| Compress IMG 4 and IMG 5, crop IMG 8, re-export IMG 2 | To do |
| BewellNest photo consent or face blur | To do |
| Teachers' consent to publish emails | To do |

### Build checks (automate)

- Fail the production build if `CONTENT NEEDED` appears in the output HTML
- Link check · every external link returns 200 (Google Drive folder must be public-view)
- Image check · every `<img>` has `alt`, `width`, `height`. No file over 500 KB
- `axe` or Lighthouse accessibility run with 0 violations
- HTML validates

---

## O. Final quality criteria

| Test | Pass when |
|---|---|
| 10-second test | A first-time viewer can say her name, field (Data Science × Health Science) and one strong fact without scrolling past About |
| 60-second test | A viewer can name her two leadership roles, the research study and at least one number per project |
| Evidence trace | Every claim on the site matches a line in the content doc |
| Hub works | All 6 cards open the right pop-up. Prev / Next cycles correctly. Each hash link opens the right pop-up when pasted in a new tab |
| Keyboard-only run | Whole site usable with Tab, Shift+Tab, Enter, Esc, arrow keys. Focus always visible |
| Screen reader run (NVDA or VoiceOver) | Headings, card names, dialog titles and stat wording read correctly |
| Reduced motion | No slide, lift, parallax or autoplay with the setting on |
| Mobile | No horizontal scroll at 320px. Pop-ups full screen. Card descriptions visible without hover |
| Performance | Lighthouse targets in N met on mobile |
| Integrity | No `[CONTENT NEEDED]` text, no broken links, no unconsented faces, teacher emails hidden unless approved |
| Look | Reads as a polished, modern agency portfolio with a scientific edge. Not a poster, not a template, not cluttered |

---

## Do not

- Do not invent facts, numbers, roles, dates, quotes, awards, partners, links or outcomes. Use `[CONTENT NEEDED]`
- Do not ship broken, empty or placeholder links. Hide the button until the link exists
- Do not use generic stock photos, AI-generated people or decorative image files
- Do not add clutter · no skill bars, emojis, Journey timeline, testimonials, extra sections or extra pages
- Do not use low-contrast text, mono font for paragraphs, or body text under 16px
- Do not add excessive animation · no parallax, scroll-jacking, custom cursors, autoplay carousels or looping effects
- Do not copy Design inspo 1–3, the David Bragg page or any other designer's layout, artwork or code. Use them as direction only
- Do not publish teacher emails or identifiable student faces without consent
