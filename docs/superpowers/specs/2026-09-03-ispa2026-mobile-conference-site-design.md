# ISPA 2026 Mobile Conference Site — Design Specification

Date: 2026-09-03
Status: Approved visual direction; implementation pending plan approval

## 1. Product Goal

Build a mobile-first promotional website for IEEE ISPA 2026 that is visually distinct from a conventional conference website and optimized for vertical browsing on phones.

The experience should feel premium, academic, restrained, and contemporary. It should present conference information in a sequence of spacious, single-purpose sections instead of reproducing the dense CFP-poster layout.

Primary audience:
- Prospective paper authors
- Academic researchers and students
- Program committee / conference participants
- Visitors evaluating conference scope, deadlines, chairs, and submission information

Primary actions:
- Understand what ISPA 2026 is
- See the most important dates quickly
- Explore the four tracks without information overload
- Browse conference chairs and committee roles
- Reach the paper submission entry point
- Reach the official conference website

## 2. Visual Direction

### 2.1 Style

Chosen direction: **Premium Minimal Academic**.

Visual references in spirit:
- Apple editorial/product landing pages
- IEEE institutional blue
- Contemporary academic publishing design

The site must not use a neon/cyberpunk aesthetic.

### 2.2 Palette

Approximate visual balance:
- 70% ivory white / warm off-white / very light gray
- 20% deep navy typography
- 10% IEEE blue accents

Suggested tokens:
- `--bg-main`: #F8FAFC / warm near-white
- `--bg-soft`: #F1F5F9
- `--text-primary`: #0B234A
- `--text-secondary`: #526079
- `--ieee-blue`: #0066B3
- `--accent-blue`: #0B72E7
- `--line`: rgba(11,35,74,0.12)

Avoid excessive gradients. Gradients may appear only as very soft atmospheric highlights.

### 2.3 Typography

Use a clean modern sans-serif stack. The design should rely on typography, whitespace, rhythm, and image scale rather than decorative effects.

Hierarchy:
- Hero title: oversized, bold, compact line-height
- Section labels: small uppercase / tracking
- Section titles: large editorial heading
- Body: comfortable 17–20 px mobile reading size
- Dates and track numbers: oversized display numerals

### 2.4 Shape Language

- Moderate corner radii, not bubbly UI
- Thin rules and restrained borders
- Soft shadows only where needed for image or floating card separation
- No heavy glassmorphism
- No thick framed boxes around every section

## 3. Responsive Strategy

### 3.1 Mobile First

Primary design width: 390–430 px.

The mobile layout is the source of truth. Desktop should adapt the same editorial system rather than becoming a separate dense conference portal.

### 3.2 Content Density

Core rule: **one screen, one dominant idea**.

A section should not attempt to expose all CFP information at once. Long data should be progressive-disclosure content where appropriate.

## 4. Information Architecture

Recommended vertical sequence:

1. Hero
2. About ISPA
3. Important Dates
4. Track 01 — Systems & Architectures
5. Track 02 — Technologies & Tools
6. Track 03 — Applications & Services
7. Track 04 — Security & Block-chain
8. Chairs & Committees
9. Paper Submission
10. Publication
11. Special Issues
12. IEEE AI for Science Congress 2026
13. Sponsors & Organizers
14. Final CTA / Footer

## 5. Section Design

### 5.1 Hero

Content:
- IEEE ISPA 2026
- The 24th IEEE International Symposium on Parallel and Distributed Processing with Applications
- Kuala Lumpur, Malaysia
- 27–30 December 2026
- Primary CTA: Submit Paper
- Secondary CTA: Explore Conference

Visual composition:
- White / ivory background
- Minimal IEEE-blue atmospheric curves or geometric motif
- Large conference title with strong editorial spacing
- Date and location displayed as concise metadata
- One large destination / Kuala Lumpur visual area with rounded corners
- Lightweight scroll indicator
- Minimal top bar with event mark and menu icon

Hero should not show sponsors, chair names, topic lists, or long introduction copy.

### 5.2 About ISPA

Purpose: explain conference positioning with minimum text.

Content summary:
ISPA 2026 is an international forum for original research on parallel, distributed, edge, cloud, and large-scale computing systems. Areas include multi-core and heterogeneous systems, P2P networks, AI computing architecture, blockchain security, big data analytics, and pervasive services.

Include three editorial stat blocks:
- 24th — Edition
- 2003 — Since
- IEEE — Xplore & EI

Do not place the full CFP introduction paragraph verbatim.

### 5.3 Important Dates

Use a spacious vertical timeline.

Dates:
- 15 Aug 2026 — Workshop Proposal Due
- 30 Sep 2026 — Regular Paper Due
- 30 Oct 2026 — Author Notification Due
- 30 Nov 2026 — Paper Registration Due
- 30 Nov 2026 — Camera-ready Submission Due
- 27–30 Dec 2026 — Conference Date

Mobile behavior:
- About two to three dates visible within a typical viewport
- Timeline reveals progressively on scroll
- Conference date receives the strongest visual emphasis

### 5.4 Tracks

Each track gets its own large section. Do not render four dense topic boxes together.

#### Track 01 — Systems & Architectures
Representative visible keywords:
- Cloud computing and data center technology
- Multi-cloud environments / federation / interoperability
- Energy management and green computing
- Wireless and mobile networks
- AI systems and architectures
- Distributed / parallel algorithms

#### Track 02 — Technologies & Tools
Representative visible keywords:
- Parallel and distributed computing paradigms
- Programming models for cloud services
- Code generation and optimization
- Compilers
- Middleware and tools
- Scheduling and resource management
- Reliability / fault tolerance / dependability
- Generative AI, agents, and world model

#### Track 03 — Applications & Services
Representative visible keywords:
- High-performance scientific and engineering computing
- Grid and cluster computing
- Pervasive and ubiquitous computing
- Databases / data mining / data management
- Big data and business analytics
- Scientific cloud systems and services
- Internet computing and web services
- LLM-powered parallel and distributed computing

#### Track 04 — Security & Block-chain
Representative visible keywords:
- Security in parallel AI systems
- Federated learning
- Blockchain applications and services
- Blockchain security and privacy
- Blockchain in cyber-physical systems
- Scalability issues in blockchain
- Blockchain in edge and cloud computing
- Decentralized blockchain-enabled AI systems

Interaction:
- Initially expose 5–8 representative topics
- `Explore Track` expands the complete topic list inline
- Expanded state remains clean and single-column on mobile

### 5.5 Chairs & Committees

Roles in the CFP:
- General Chairs
- Program Chairs
- Program Vice-Chairs
- Local Chairs
- Workshop / Special Session Chairs
- Publicity Chairs
- Publication Chairs
- Web Chairs
- Steering Committee

Portrait handling:
- No fabricated real-person photos
- Use a consistent dedicated portrait placeholder when no authorized portrait asset is provided
- Placeholder should use a neutral abstract silhouette / initials treatment, not a stock human photo

Card content:
- Portrait placeholder
- Name
- Institution
- Country / region where useful

Information density:
- One role group at a time
- 1–2 people visible comfortably per screen on mobile
- Horizontal carousel or vertically staggered cards may be used, but scrolling must remain natural and accessible

Chair data:

General Chairs:
- Geyong Min — University of Exeter, UK
- Nong Xiao — Sun Yat-sen University, China

Program Chairs:
- Huazhong Liu — Zhejiang Normal University, China
- Rong Gu — Nanjing University, China

Program Vice-Chairs:
- Jiawei Huang — Central South University, China
- Chubo Liu — Hunan University, China
- Minchen Yu — The Chinese University of Hong Kong, Shenzhen, China

Local Chairs:
- Azreen Azman — Universiti Putra Malaysia, Malaysia
- Xiangli Yang — Zhengzhou University, China

Workshop / Special Session Chairs:
- Shaojun Zou — Hainan University, China
- Zhou Zhou — Changsha University, China

Publicity Chairs:
- Yangbo Jiang — Zhejiang University of Finance & Economics, China
- Xun Shao — Toyohashi University of Technology, Japan

Publication Chairs:
- Zhicai Zhang — Hainan University, China
- Binbin Zhou — Hangzhou City University, China

Web Chairs:
- Ren Li — Hainan University, China
- Yongqin Zhang — Hainan University, China

Steering Committee:
- Minyi Guo — Shanghai Jiao Tong University, China
- Laurence T. Yang — Zhengzhou University, China
- Liang Zhao — Shenyang Aerospace University, China

### 5.6 Paper Submission

Use concise specification-style blocks instead of one dense paragraph.

Display:
- EDAS submission CTA
- IEEE Computer Society Proceedings Format
- Single-blind peer review
- Regular paper page policy
- IEEE Xplore / EI publication information

CFP page-policy wording is slightly ambiguous in parsed text for the second paper category. Therefore the UI must not silently reinterpret it. Until confirmed, show the unambiguous regular-paper rule prominently and keep any ambiguous secondary category wording out of the primary visual summary.

Regular paper summary:
- Up to 8 complimentary pages
- Up to 2 additional pages available for purchase
- Maximum 10 pages

### 5.7 Publication

Editorial summary cards:
- IEEE Computer Society Press
- IEEE Xplore
- EI
- Distinguished papers may be invited to special issues after further revision

### 5.8 Special Issues

Use four simple publication cards, not long URL text.

1. IEEE Transactions on Computational Social Systems
   - Cyber-Physical Intelligence: State-of-the-art, Perspectives, and Challenges

2. Journal of Systems Architecture
   - Security and Efficiency for LLM-Based Edge Intelligence

3. Big Data Mining and Analytics
   - High Performance Computing and Communications for Cyber-Physical-Social Big Data Mining and Analytics

4. Computer Standards & Interfaces
   - Security and Resilience of AI Agents in Digital Critical Infrastructures

Each card may expose an external-link action.

### 5.9 IEEE AI for Science Congress 2026

Make this a strong late-page visual break.

Display:
- `PART OF`
- `IEEE AI FOR SCIENCE CONGRESS 2026`
- ISPA
- BDCloud
- SocialCom
- SustainCom
- SpaCCS

This section can temporarily switch to a deep navy background for contrast before returning to a light footer.

### 5.10 Sponsors & Organizers

Keep this low-density.

- Sponsor logos should use actual supplied assets when available
- Do not recreate or invent trademarks
- Preserve official logo aspect ratios
- Organizers listed visually near footer

If exact image assets are unavailable during initial implementation, use named logo placeholders rather than fabricated marks.

### 5.11 Final CTA

Large clean closing block:

`Ready to join ISPA 2026?`

Actions:
- Submit Paper
- Visit Official Website

Footer:
- IEEE ISPA 2026
- Kuala Lumpur, Malaysia
- 27–30 December 2026
- minimal legal / copyright text

## 6. Interaction & Motion

Motion should be restrained and functional.

Use:
- Fade + subtle vertical reveal on section entry
- Timeline progress drawing
- Very mild image parallax
- Track-list expand / collapse
- Chair-category switching or natural scroll reveal
- Header changing from transparent/light to compact sticky state
- Soft button press / hover feedback

Avoid:
- Full-screen particle fields
- Constant looping motion
- 3D gimmicks
- Excessive glassmorphism
- Aggressive scroll hijacking

Respect `prefers-reduced-motion`.

## 7. Navigation

Mobile header:
- Compact conference mark / `ISPA 2026`
- Menu button

Menu anchors:
- About
- Dates
- Tracks
- Chairs
- Submission
- Venue / Congress

Primary CTA remains `Submit Paper`.

Desktop header may expose the same anchors horizontally.

## 8. Data & Content Model

Store conference content as structured local data rather than hard-coding every card into presentation components.

Suggested groups:
- conference metadata
- deadlines
- tracks and topics
- chair categories and members
- special issues
- congress co-located conferences
- sponsor / organizer assets

This makes future conference-year updates easier.

## 9. Accessibility

Requirements:
- Semantic headings
- Keyboard-accessible interactive controls
- Sufficient color contrast
- Visible focus states
- Accessible labels on icons
- Images require meaningful alt text
- Placeholder portraits must not imply a real likeness
- Reduced-motion support
- No interaction should depend only on hover

## 10. Implementation Architecture

Recommended implementation:
- React + Vite
- TypeScript
- CSS Modules or a small token-driven CSS architecture
- Lightweight animation library only if required; otherwise CSS + IntersectionObserver

Component boundaries:
- `SiteHeader`
- `HeroSection`
- `AboutSection`
- `DatesTimeline`
- `TrackSection`
- `ChairsSection`
- `SubmissionSection`
- `PublicationSection`
- `SpecialIssuesSection`
- `CongressSection`
- `SponsorsSection`
- `FinalCTA`
- shared `SectionHeading`, `ActionButton`, `PortraitPlaceholder`

No backend is required for the first version.

External actions:
- EDAS link opens externally
- Official website opens externally
- Special issue links open externally

## 11. Asset Strategy

Initial version:
- Use conference/location imagery that is either user-provided, properly sourced for prototype use, or a neutral generated/placeholder visual
- Chair portraits: placeholders only unless real images are supplied/authorized
- Sponsor logos: official supplied assets or labeled placeholders

No fabricated real-person likenesses.

## 12. Success Criteria

The build is successful when:
- It feels like a premium mobile event landing page rather than a CFP poster
- The first screen communicates conference name, date, location, and submission action immediately
- A phone user can understand deadlines without reading a dense table
- Tracks are easy to skim and expand
- Chair information is readable without crowding
- No single mobile viewport feels overloaded
- Visual system remains academically credible and IEEE-appropriate
- Desktop layout stays polished without compromising the mobile-first composition
- Content matches the supplied ISPA 2026 CFP and does not silently invent missing facts

## 13. Explicit Non-Goals for v1

Do not build:
- User accounts
- Registration / payment backend
- Paper submission backend
- CMS
- Full conference program scheduler
- Authentication
- Search
- Live announcements system

The first version is a high-fidelity, frontend-only promotional conference site.
