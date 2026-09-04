# ISPA 2026 Mobile Conference Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, mobile-first, frontend-only IEEE ISPA 2026 conference landing page that turns the supplied CFP into a spacious editorial browsing experience.

**Architecture:** Implement a single-page React + TypeScript application with structured conference data, focused section components, and a token-driven CSS system. Keep interactions lightweight and local: anchor navigation, menu drawer, track disclosure, chair-role browsing, IntersectionObserver reveal motion, and external links only. The page must remain fully usable without JavaScript-only scroll hijacking and must respect reduced-motion preferences.

**Tech Stack:** Dependency-free HTML5, CSS custom properties, modern JavaScript, Node built-in tests, Python Playwright/Chromium, CSS animations/IntersectionObserver.

> **Execution note (2026-09-03):** The runtime cannot resolve `registry.npmjs.org`, so the approved visual/product design is implemented as a zero-dependency HTML/CSS/JavaScript site rather than React/Vite. This preserves the mobile-first architecture, structured data, progressive disclosure, accessibility, and motion requirements while making the artifact directly runnable without package installation. Automated checks use Node's built-in test runner and Python Playwright against the system Chromium.

**Spec:** `docs/superpowers/specs/2026-09-03-ispa2026-mobile-conference-site-design.md`

## Global Constraints

- Primary design width is 390–430 px; mobile is the source of truth.
- Visual direction is Premium Minimal Academic: ivory/light gray background, deep navy type, IEEE blue accents, restrained shadows, no cyberpunk/neon aesthetic.
- Core density rule: one screen, one dominant idea.
- Chair portraits use neutral placeholders only; do not fabricate real-person likenesses.
- Sponsor/organizer marks use labeled placeholders unless official assets are supplied.
- Conference content must match the supplied ISPA 2026 CFP and must not invent unsupported facts.
- No backend, authentication, payment, CMS, program scheduler, search, or live announcements.
- All controls must be keyboard accessible, have visible focus states, and not depend on hover alone.
- Respect `prefers-reduced-motion`.
- External submission URL: `https://edas.info/N35627`.
- Official conference URL: `https://ieee-ai-for-science.org/2026/ispa/`.

---

### Task 1: Project foundation and conference data model

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `vite.config.ts`
- Create: `vitest.setup.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/types.ts`
- Create: `src/data/conference.ts`
- Test: `src/data/conference.test.ts`

**Interfaces:**
- Produces: `conference: ConferenceData` exported from `src/data/conference.ts`.
- Produces: types `ConferenceData`, `Deadline`, `Track`, `ChairGroup`, `SpecialIssue` from `src/types.ts`.
- Later tasks consume `conference` as the sole source for conference text and lists.

- [ ] **Step 1: Add package/tooling configuration**

Create a Vite React TypeScript package with scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview"
  }
}
```

Use runtime dependencies `react` and `react-dom`; use development dependencies `@vitejs/plugin-react`, `typescript`, `vite`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event`.

- [ ] **Step 2: Write the failing conference-data test**

Create `src/data/conference.test.ts` with assertions that define the exact content shape:

```ts
import { describe, expect, it } from 'vitest';
import { conference } from './conference';

describe('conference data', () => {
  it('keeps the six CFP deadlines in chronological display order', () => {
    expect(conference.deadlines.map((item) => item.dateLabel)).toEqual([
      '15 AUG 2026',
      '30 SEP 2026',
      '30 OCT 2026',
      '30 NOV 2026',
      '30 NOV 2026',
      '27–30 DEC 2026',
    ]);
  });

  it('contains the four CFP tracks', () => {
    expect(conference.tracks.map((track) => track.title)).toEqual([
      'Systems & Architectures',
      'Technologies & Tools',
      'Applications & Services',
      'Security & Block-chain',
    ]);
  });

  it('keeps every chair category from the CFP', () => {
    expect(conference.chairGroups.map((group) => group.label)).toEqual([
      'General Chairs',
      'Program Chairs',
      'Program Vice-Chairs',
      'Local Chairs',
      'Workshop / Special Session Chairs',
      'Publicity Chairs',
      'Publication Chairs',
      'Web Chairs',
      'Steering Committee',
    ]);
  });
});
```

- [ ] **Step 3: Run the data test and verify RED**

Run:

```bash
npm test -- src/data/conference.test.ts
```

Expected: FAIL because `src/data/conference.ts` does not exist yet.

- [ ] **Step 4: Implement typed conference content**

Create the types and `conference` object. Populate:
- metadata: IEEE ISPA 2026, 24th edition, Kuala Lumpur, Malaysia, 27–30 December 2026;
- all six deadlines;
- all four tracks with the exact CFP topic strings;
- all nine chair/committee groups and members from the approved spec;
- submission rule: regular paper up to 8 complimentary pages + 2 purchasable pages, maximum 10;
- publication labels: IEEE Computer Society Press, IEEE Xplore, EI;
- four special issues with their CFP titles and URLs;
- co-located conferences: ISPA, BDCloud, SocialCom, SustainCom, SpaCCS;
- external EDAS and official-site URLs.

- [ ] **Step 5: Run data tests and build type-check**

Run:

```bash
npm test -- src/data/conference.test.ts
npm run build
```

Expected: all tests PASS and TypeScript build succeeds.

- [ ] **Step 6: Commit**

```bash
git add package.json tsconfig*.json vite.config.ts vitest.setup.ts index.html src/main.tsx src/types.ts src/data

git commit -m "chore: scaffold ISPA 2026 conference site"
```

---

### Task 2: Shared visual system, header, hero, and responsive shell

**Files:**
- Create: `src/App.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/components/ActionButton.tsx`
- Create: `src/components/SectionHeading.tsx`
- Create: `src/components/SiteHeader.tsx`
- Create: `src/components/HeroSection.tsx`
- Create: `src/components/VenueArtwork.tsx`
- Test: `src/components/HeroSection.test.tsx`
- Test: `src/components/SiteHeader.test.tsx`

**Interfaces:**
- `ActionButton({ href, children, variant, external })` renders an accessible anchor CTA.
- `SectionHeading({ eyebrow, title, intro?, inverse? })` provides consistent editorial section hierarchy.
- `SiteHeader` renders navigation anchors and a mobile menu.
- `HeroSection` consumes `conference.meta` and external URLs.
- `VenueArtwork` is a local CSS/SVG-inspired abstract Kuala Lumpur destination visual; it does not depict a specific copyrighted photograph.

- [ ] **Step 1: Write failing hero-content test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HeroSection } from './HeroSection';

describe('HeroSection', () => {
  it('shows the conference identity, date, location, and submission action', () => {
    render(<HeroSection />);
    expect(screen.getByRole('heading', { name: /IEEE ISPA 2026/i })).toBeInTheDocument();
    expect(screen.getByText(/27–30 December 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Kuala Lumpur, Malaysia/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Submit Paper/i })).toHaveAttribute('href', 'https://edas.info/N35627');
  });
});
```

- [ ] **Step 2: Run hero test and verify RED**

Run `npm test -- src/components/HeroSection.test.tsx`.

Expected: FAIL because `HeroSection` is missing.

- [ ] **Step 3: Implement tokens, shell, shared components, and hero**

Define CSS variables exactly around the approved system:

```css
:root {
  --bg-main: #f8fafc;
  --bg-paper: #ffffff;
  --bg-soft: #f1f5f9;
  --text-primary: #0b234a;
  --text-secondary: #526079;
  --ieee-blue: #0066b3;
  --accent-blue: #0b72e7;
  --line: rgba(11, 35, 74, 0.12);
  --radius-lg: 30px;
  --radius-md: 20px;
  --content-max: 1180px;
}
```

Implement a spacious hero with:
- compact sticky header;
- `THE 24TH EDITION` eyebrow;
- large `IEEE ISPA 2026` title;
- full conference name;
- date/location metadata;
- primary and secondary CTA;
- abstract destination artwork using CSS gradients and an inline decorative SVG skyline silhouette;
- small scroll cue.

- [ ] **Step 4: Write failing mobile menu test**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from './SiteHeader';

describe('SiteHeader', () => {
  it('opens the mobile navigation and exposes section anchors', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(screen.getByRole('button', { name: /Open navigation/i }));
    expect(screen.getByRole('link', { name: 'Dates' })).toHaveAttribute('href', '#dates');
    expect(screen.getByRole('link', { name: 'Chairs' })).toHaveAttribute('href', '#chairs');
  });
});
```

- [ ] **Step 5: Run header test and verify RED**

Run `npm test -- src/components/SiteHeader.test.tsx`.

Expected: FAIL until menu behavior exists.

- [ ] **Step 6: Implement mobile menu behavior and responsive desktop navigation**

Use button state plus an overlay panel; add `aria-expanded`, `aria-controls`, Escape-key dismissal, and focus-visible styles. On desktop, render the same anchors inline.

- [ ] **Step 7: Run task tests and build**

Run:

```bash
npm test -- src/components/HeroSection.test.tsx src/components/SiteHeader.test.tsx
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx src/styles src/components/ActionButton.tsx src/components/SectionHeading.tsx src/components/SiteHeader.tsx src/components/HeroSection.tsx src/components/VenueArtwork.tsx src/components/*.test.tsx

git commit -m "feat: build minimal academic hero and navigation"
```

---

### Task 3: About, important dates, and track disclosure sections

**Files:**
- Create: `src/components/AboutSection.tsx`
- Create: `src/components/DatesTimeline.tsx`
- Create: `src/components/TrackSection.tsx`
- Create: `src/components/TracksSection.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/DatesTimeline.test.tsx`
- Test: `src/components/TrackSection.test.tsx`

**Interfaces:**
- `DatesTimeline` consumes `conference.deadlines`.
- `TrackSection({ track })` consumes a `Track`; initially shows up to six topics and toggles the complete list.
- `TracksSection` maps the four conference tracks to `TrackSection` blocks with alternating editorial composition.

- [ ] **Step 1: Write failing deadlines test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DatesTimeline } from './DatesTimeline';

describe('DatesTimeline', () => {
  it('renders every CFP deadline and emphasizes the conference date', () => {
    render(<DatesTimeline />);
    expect(screen.getByText('Workshop Proposal Due')).toBeInTheDocument();
    expect(screen.getByText('Camera-ready Submission Due')).toBeInTheDocument();
    expect(screen.getByText('27–30 DEC 2026')).toBeInTheDocument();
    expect(screen.getByTestId('conference-date')).toHaveAttribute('data-emphasis', 'strong');
  });
});
```

- [ ] **Step 2: Run deadlines test and verify RED**

Run `npm test -- src/components/DatesTimeline.test.tsx`.

Expected: FAIL because component is missing.

- [ ] **Step 3: Implement About and Dates sections**

Use the approved concise introduction and three stat blocks (`24th / Edition`, `2003 / Since`, `IEEE / Xplore & EI`). Dates use an ordered vertical timeline, oversized date typography, thin blue rule, and strongest accent on 27–30 December.

- [ ] **Step 4: Write failing track-disclosure test**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { conference } from '../data/conference';
import { TrackSection } from './TrackSection';

describe('TrackSection', () => {
  it('progressively reveals the complete topic list', async () => {
    const user = userEvent.setup();
    const track = conference.tracks[1];
    render(<TrackSection track={track} />);
    expect(screen.queryByText('Generative AI, agents, and world model')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Explore Track/i }));
    expect(screen.getByText('Generative AI, agents, and world model')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Show Less/i })).toHaveAttribute('aria-expanded', 'true');
  });
});
```

- [ ] **Step 5: Run track test and verify RED**

Run `npm test -- src/components/TrackSection.test.tsx`.

Expected: FAIL because disclosure does not exist.

- [ ] **Step 6: Implement four spacious track sections**

Rules:
- full-width editorial blocks, not card-grid CFP boxes;
- large `01`–`04` numerals;
- no more than six visible topics before expansion;
- clean single-column disclosure on mobile;
- alternating soft-background and white sections;
- Track 04 may use a deeper navy mini-panel only as an accent, not a neon effect.

- [ ] **Step 7: Run tests and build**

Run:

```bash
npm test -- src/components/DatesTimeline.test.tsx src/components/TrackSection.test.tsx
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx src/components/AboutSection.tsx src/components/DatesTimeline.tsx src/components/TrackSection.tsx src/components/TracksSection.tsx src/components/*.test.tsx

git commit -m "feat: add conference story dates and track explorer"
```

---

### Task 4: Chairs and committee browsing

**Files:**
- Create: `src/components/PortraitPlaceholder.tsx`
- Create: `src/components/ChairCard.tsx`
- Create: `src/components/ChairsSection.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/ChairsSection.test.tsx`

**Interfaces:**
- `PortraitPlaceholder({ name })` derives initials from the supplied name and exposes decorative/neutral accessibility text without implying a likeness.
- `ChairCard({ member })` renders placeholder, name, institution, and country text.
- `ChairsSection` renders role tabs/buttons and the active group; the first role is `General Chairs`.

- [ ] **Step 1: Write failing chair-group test**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ChairsSection } from './ChairsSection';

describe('ChairsSection', () => {
  it('lets visitors switch role groups without crowding all people into one viewport', async () => {
    const user = userEvent.setup();
    render(<ChairsSection />);
    expect(screen.getByText('Geyong Min')).toBeInTheDocument();
    expect(screen.queryByText('Huazhong Liu')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Program Chairs' }));
    expect(screen.getByText('Huazhong Liu')).toBeInTheDocument();
    expect(screen.getByText('Rong Gu')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run chair test and verify RED**

Run `npm test -- src/components/ChairsSection.test.tsx`.

Expected: FAIL because the section is missing.

- [ ] **Step 3: Implement chair role selector and portrait placeholders**

Use horizontal, scrollable role chips on mobile with `aria-pressed`; render 1–2 cards per row depending on viewport. Portraits use a quiet gradient field, initials, and `Portrait placeholder for <name>` accessible label. No stock or generated face imagery.

- [ ] **Step 4: Run chair test and build**

Run:

```bash
npm test -- src/components/ChairsSection.test.tsx
npm run build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/PortraitPlaceholder.tsx src/components/ChairCard.tsx src/components/ChairsSection.tsx src/components/ChairsSection.test.tsx

git commit -m "feat: add spacious chair and committee browser"
```

---

### Task 5: Submission, publication, special issues, congress, sponsors, and closing CTA

**Files:**
- Create: `src/components/SubmissionSection.tsx`
- Create: `src/components/PublicationSection.tsx`
- Create: `src/components/SpecialIssuesSection.tsx`
- Create: `src/components/CongressSection.tsx`
- Create: `src/components/SponsorsSection.tsx`
- Create: `src/components/FinalCTA.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/SubmissionSection.test.tsx`
- Test: `src/components/SpecialIssuesSection.test.tsx`

**Interfaces:**
- `SubmissionSection` exposes EDAS link and only the unambiguous regular-paper page rule.
- `SpecialIssuesSection` maps four externally linked issues from `conference.specialIssues`.
- `SponsorsSection` uses text logo placeholders only.
- `FinalCTA` repeats EDAS and official-site actions.

- [ ] **Step 1: Write failing submission-summary test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SubmissionSection } from './SubmissionSection';

describe('SubmissionSection', () => {
  it('shows the unambiguous regular-paper policy and EDAS link', () => {
    render(<SubmissionSection />);
    expect(screen.getByText(/8 complimentary pages/i)).toBeInTheDocument();
    expect(screen.getByText(/Maximum 10 pages/i)).toBeInTheDocument();
    expect(screen.getByText(/Single-blind peer review/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Submit via EDAS/i })).toHaveAttribute('href', 'https://edas.info/N35627');
  });
});
```

- [ ] **Step 2: Run submission test and verify RED**

Run `npm test -- src/components/SubmissionSection.test.tsx`.

Expected: FAIL because section is missing.

- [ ] **Step 3: Implement submission and publication sections**

Submission displays a large `8 + 2` motif, a concise explanation, IEEE Computer Society Proceedings Format, single-blind peer review, and EDAS CTA. Publication uses three concise cards for IEEE Computer Society Press, IEEE Xplore, and EI plus the distinguished-paper invitation note.

- [ ] **Step 4: Write failing special-issues test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SpecialIssuesSection } from './SpecialIssuesSection';

describe('SpecialIssuesSection', () => {
  it('renders all four CFP special issues as external links', () => {
    render(<SpecialIssuesSection />);
    expect(screen.getAllByRole('link', { name: /View special issue/i })).toHaveLength(4);
    expect(screen.getByText('Journal of Systems Architecture')).toBeInTheDocument();
    expect(screen.getByText('Computer Standards & Interfaces')).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Run special-issues test and verify RED**

Run `npm test -- src/components/SpecialIssuesSection.test.tsx`.

Expected: FAIL because section is missing.

- [ ] **Step 6: Implement special issues, congress break, sponsors, and final CTA**

Congress section uses a deep navy background with editorial white type and the five co-located conference names. Sponsor/organizer section uses simple named placeholders rather than invented marks. Final CTA returns to an ivory background and includes `Submit Paper` plus `Visit Official Website`.

- [ ] **Step 7: Run tests and build**

Run:

```bash
npm test -- src/components/SubmissionSection.test.tsx src/components/SpecialIssuesSection.test.tsx
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx src/components/SubmissionSection.tsx src/components/PublicationSection.tsx src/components/SpecialIssuesSection.tsx src/components/CongressSection.tsx src/components/SponsorsSection.tsx src/components/FinalCTA.tsx src/components/*.test.tsx

git commit -m "feat: complete submission publication and closing content"
```

---

### Task 6: Scroll reveal, navigation polish, reduced motion, and final responsive QA

**Files:**
- Create: `src/hooks/useReveal.ts`
- Create: `src/components/Reveal.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/global.css`
- Modify: section components to wrap major content blocks in `Reveal`
- Test: `src/components/AppAccessibility.test.tsx`

**Interfaces:**
- `useReveal(options?)` returns `{ ref, visible }` and uses IntersectionObserver when available.
- `Reveal({ children, className? })` applies `.reveal` and `.is-visible`; with reduced motion, CSS removes transform/transition.

- [ ] **Step 1: Write failing accessibility/navigation test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('conference page accessibility', () => {
  it('exposes landmark navigation and section anchors', () => {
    render(<App />);
    expect(screen.getByRole('navigation', { name: /Primary/i })).toBeInTheDocument();
    expect(document.querySelector('#about')).not.toBeNull();
    expect(document.querySelector('#dates')).not.toBeNull();
    expect(document.querySelector('#tracks')).not.toBeNull();
    expect(document.querySelector('#chairs')).not.toBeNull();
    expect(document.querySelector('#submission')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run accessibility test and verify RED if any landmarks/anchors are missing**

Run `npm test -- src/components/AppAccessibility.test.tsx`.

Expected: FAIL on any missing required landmark or ID; if a requirement already passes, extend the test to the next missing required behavior before implementing it.

- [ ] **Step 3: Implement reveal helper and final interaction polish**

Use IntersectionObserver with threshold around `0.15`; if unavailable, render visible immediately. Add smooth anchor scrolling only when reduced-motion is not requested. Ensure menu links close the mobile drawer after activation. Add section scroll-margin for sticky header.

- [ ] **Step 4: Add responsive CSS QA rules**

Verify and adjust at these widths:
- 390 px: one-column source-of-truth layout;
- 430 px: comfortable mobile spacing;
- 768 px: wider cards/stat grouping without density increase;
- 1024 px: desktop header and two-column editorial compositions where appropriate;
- 1440 px: capped content width, no stretched text lines.

Do not create a desktop-only dense portal.

- [ ] **Step 5: Run full automated verification**

Run:

```bash
npm test
npm run build
```

Expected: all tests PASS, zero TypeScript errors, production build succeeds.

- [ ] **Step 6: Run static output smoke check**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

In a separate shell, verify the server responds:

```bash
curl -I http://127.0.0.1:5173/
```

Expected: HTTP 200 response.

- [ ] **Step 7: Commit final polish**

```bash
git add src

git commit -m "feat: polish responsive motion and accessibility"
```

---

## Final Verification Checklist

- [ ] Hero shows conference identity, date, location, and submission CTA immediately.
- [ ] About section uses concise CFP-derived positioning and three editorial stat blocks.
- [ ] Important Dates shows all six CFP dates and strongly emphasizes the conference date.
- [ ] Four tracks are individually spacious and expandable.
- [ ] Chair sections contain all nine CFP groups with neutral portrait placeholders.
- [ ] Submission section does not invent or reinterpret the ambiguous secondary page-policy wording.
- [ ] All four special issues are present with external links.
- [ ] AI for Science Congress section lists ISPA, BDCloud, SocialCom, SustainCom, and SpaCCS.
- [ ] Sponsor/organizer visuals are placeholders only unless official assets are provided.
- [ ] Mobile layout feels intentionally sparse at 390–430 px.
- [ ] Desktop layout remains editorial and capped, not dense.
- [ ] Keyboard focus is visible and mobile menu is accessible.
- [ ] Reduced-motion preference disables nonessential animation.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
