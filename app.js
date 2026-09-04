(function () {
  'use strict';

  const data = window.CONFERENCE_DATA;
  if (!data) {
    document.getElementById('app').innerHTML = '<p class="noscript">Conference data failed to load.</p>';
    return;
  }

  const esc = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const externalAttrs = 'target="_blank" rel="noreferrer noopener"';
  const button = (label, href, variant = 'primary', external = false, customLabel = label) => `
    <a class="action-button ${variant}" href="${esc(href)}" ${external ? externalAttrs : ''} aria-label="${esc(customLabel)}">
      <span>${esc(label)}</span><span class="arrow" aria-hidden="true">↗</span>
    </a>`;

  const sectionHeading = (eyebrow, title, intro = '') => `
    <p class="eyebrow">${esc(eyebrow)}</p>
    <h2 class="section-title">${title}</h2>
    ${intro ? `<p class="section-intro">${esc(intro)}</p>` : ''}`;

  const navLinks = [
    ['About', '#about'],
    ['Dates', '#dates'],
    ['Tracks', '#tracks'],
    ['Chairs', '#chairs'],
    ['Submission', '#submission'],
    ['Congress', '#congress'],
  ];

  function venueArtwork() {
    return `
      <div class="venue-art reveal" role="img" aria-label="Kuala Lumpur skyline and Petronas Twin Towers">
        <div class="city-photo">
          <img src="assets/kuala-lumpur-petronas.jpg" alt="Kuala Lumpur skyline at dusk">
          <div class="city-gradient"></div>
          <div class="venue-label"><strong>Kuala Lumpur</strong><span>Petronas Twin Towers · Host city for ISPA 2026</span></div>
        </div>
      </div>`;
  }

  function header() {
    return `
      <header class="site-header" id="site-header">
        <div class="header-inner">
          <a class="brand" href="#top" aria-label="ISPA 2026 home">
            <span class="brand-mark">IEEE</span><span>ISPA <span class="brand-accent">2026</span></span>
          </a>
          <nav class="desktop-nav" aria-label="Primary">
            ${navLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}
            <a class="nav-cta" href="${data.meta.edasUrl}" ${externalAttrs}>Submit Paper ↗</a>
          </nav>
          <button class="menu-button" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-menu">
            <span class="menu-icon" aria-hidden="true"><span></span></span>
          </button>
        </div>
      </header>
      <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
        <nav aria-label="Mobile navigation">
          ${navLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}
          <a class="menu-cta" href="${data.meta.edasUrl}" ${externalAttrs}>Submit Paper</a>
        </nav>
      </div>`;
  }

  function hero() {
    return `
      <section class="hero section" id="top" aria-labelledby="hero-title">
        <div class="section-inner hero-grid">
          <div class="hero-copy">
            <span class="hero-edition">The ${esc(data.meta.edition)} edition · IEEE</span>
            <h1 id="hero-title">IEEE <span class="accent">ISPA</span> 2026</h1>
            <p class="hero-full-name">${esc(data.meta.fullName)}</p>
            <div class="hero-meta" aria-label="Conference details">
              <div class="meta-item"><span class="meta-icon" aria-hidden="true">▦</span><span>${esc(data.meta.dateLong)}</span></div>
              <div class="meta-item"><span class="meta-icon" aria-hidden="true">⌖</span><span>${esc(data.meta.city)}, ${esc(data.meta.country)}</span></div>
            </div>
            <div class="hero-actions">
              ${button('Submit Paper', data.meta.edasUrl, 'primary', true)}
              ${button('Explore Conference', '#about', 'secondary', false)}
            </div>
          </div>
          <div>
            ${venueArtwork()}
             <div class="hero-scroll" aria-hidden="true"><span class="scroll-pill"></span><span>Scroll to explore</span></div>
          </div>
        </div>
      </section>`;
  }

  function about() {
    return `
      <section class="section about" id="about" aria-labelledby="about-title">
        <div class="section-inner about-layout">
          <div class="about-copy reveal">
            <p class="eyebrow">About ISPA</p>
            <h2 class="section-title" id="about-title">Where scalable systems meet real-world intelligence.</h2>
            <p class="section-intro">${esc(data.meta.introduction)}</p>
          </div>
          <div class="stats-grid reveal" aria-label="Conference highlights">
            <div class="stat"><span class="stat-value">24th</span><span class="stat-label">Edition</span></div>
            <div class="stat"><span class="stat-value">${esc(data.meta.since)}</span><span class="stat-label">Since</span></div>
            <div class="stat"><span class="stat-value">IEEE</span><span class="stat-label">Xplore &amp; EI</span></div>
          </div>
        </div>
      </section>`;
  }

  function dates() {
    return `
      <section class="section dates" id="dates" aria-labelledby="dates-title">
        <div class="section-inner dates-layout">
          <div class="reveal">
            <p class="eyebrow">Important Dates</p>
            <h2 class="section-title" id="dates-title">Keep the key moments in view.</h2>
            <p class="section-intro"></p>
          </div>
          <div class="timeline reveal">
            ${data.deadlines.map((item) => {
              const toneClass = item.tone === 'conference' ? 'is-conference' : item.tone === 'primary' ? 'is-primary' : '';
              const testAttr = item.tone === 'conference' ? ' data-emphasis="strong" data-testid="conference-date"' : '';
              return `<div class="timeline-item ${toneClass}"${testAttr}><span class="timeline-date">${esc(item.dateLabel)}</span><span class="timeline-title">${esc(item.title)}</span></div>`;
            }).join('')}
          </div>
        </div>
      </section>`;
  }

  function trackSection(track, index) {
    const visibleCount = 6;
    const visible = track.topics.slice(0, visibleCount);
    return `
      <section class="section track-section" data-track="${esc(track.number)}" aria-labelledby="track-${esc(track.number)}-title">
        <div class="section-inner track-layout">
          <div class="track-number reveal" aria-hidden="true">${esc(track.number)}</div>
          <div class="reveal">
            <p class="track-kicker">Track ${esc(track.number)}</p>
            <h3 class="track-title" id="track-${esc(track.number)}-title">${esc(track.title)}</h3>
            <p class="track-summary">${esc(track.summary)}</p>
            <ul class="topic-list" data-topic-list>
              ${visible.map((topic) => `<li>${esc(topic)}</li>`).join('')}
            </ul>
            ${track.topics.length > visibleCount ? `<button class="track-toggle" type="button" data-track-toggle data-track-index="${index}" aria-expanded="false">Explore Track</button>` : ''}
          </div>
        </div>
      </section>`;
  }

  function tracks() {
    return `
      <section class="section tracks-intro" id="tracks" aria-labelledby="tracks-title">
        <div class="section-inner reveal">
          ${sectionHeading('Tracks & Topics', 'Four tracks.<br>One broad systems community.', '')}
        </div>
      </section>
      ${data.tracks.map(trackSection).join('')}`;
  }

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  }

  function chairCards(group) {
    return group.members.map((member) => `
      <article class="chair-card">
        ${member.photo
          ? `<img class="chair-portrait" src="${esc(member.photo)}" alt="Portrait of ${esc(member.name)}" loading="lazy">`
          : `<div class="portrait-placeholder" role="img" aria-label="Portrait placeholder for ${esc(member.name)}">
              <span class="portrait-initials" aria-hidden="true">${esc(initials(member.name))}</span>
            </div>`}
        <div>
          <h3 class="chair-name">${esc(member.name)}</h3>
          <p class="chair-institution">${esc(member.institution)}</p>
          <p class="chair-country">${esc(member.country)}</p>
        </div>
      </article>`).join('');
  }

  function chairs() {
    return `
      <section class="section chairs" id="chairs" aria-labelledby="chairs-title">
        <div class="section-inner">
          <div class="chairs-head reveal">
            <div>${sectionHeading('Conference Leadership', 'Meet the people shaping ISPA 2026.')}</div>
          </div>
          <div class="chair-sections">
            ${data.chairGroups.map((group) => `
              <section class="chair-group reveal">
                <p class="eyebrow">${esc(group.label)}</p>
                <div class="chair-grid">${chairCards(group)}</div>
              </section>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function submission() {
    return `
      <section class="section submission" id="submission" aria-labelledby="submission-title">
        <div class="section-inner submission-layout">
          <div class="reveal">
            ${sectionHeading('Paper Submission', 'A clear path from manuscript to submission.', 'Regular papers follow the IEEE Computer Society Proceedings Format and undergo a single-blind peer review process.')}
            <div class="submission-facts">
              <div class="submission-fact"><strong>${esc(data.submission.format)}</strong><span>Required paper format</span></div>
              <div class="submission-fact"><strong>${esc(data.submission.review)}</strong><span>Review model</span></div>
              <div class="submission-fact"><strong>${esc(data.submission.complimentaryPages)} + ${esc(data.submission.extraPages)} page policy</strong><span>Regular paper with optional purchased extra pages</span></div>
            </div>
            <div style="margin-top:26px">${button('Submit via EDAS', data.meta.edasUrl, 'primary', true)}</div>
          </div>
          <div class="page-policy reveal">
            <span class="eyebrow">Regular Paper</span>
            <div class="page-policy-big"><span>${esc(data.submission.complimentaryPages)}</span><span class="plus">+ ${esc(data.submission.extraPages)}</span></div>
            <p class="page-policy-caption"><strong>8 complimentary pages</strong>, with up to 2 additional pages available for purchase. <strong>Maximum 10 pages</strong>.</p>
          </div>
        </div>
      </section>`;
  }

  function publication() {
    return `
      <section class="section publication" aria-labelledby="publication-title">
        <div class="section-inner">
          <div class="reveal">${sectionHeading('Publication', 'Built for research visibility.', 'Accepted papers will be published by the IEEE Computer Society Press and submitted to IEEE Xplore and EI.')}</div>
          <div class="publication-grid reveal">
            ${data.publication.map((item, index) => `<article class="publication-card"><span class="pub-index">0${index + 1}</span><h3>${esc(item.label)}</h3><p>${esc(item.detail)}</p></article>`).join('')}
          </div>
          <p class="publication-note reveal">Distinguished papers presented at the conference, after further revision, will be invited for submission to a special issue.</p>
        </div>
      </section>`;
  }

  function specialIssues() {
    return `
      <section class="section special-issues" aria-labelledby="issues-title">
        <div class="section-inner">
          <div class="reveal">${sectionHeading('Special Issues', 'Selected pathways for extended research.')}</div>
          <div class="issue-scroller reveal">
            ${data.specialIssues.map((issue) => `<article class="issue-card"><span class="issue-journal">${esc(issue.journal)}</span><h3>${esc(issue.title)}</h3><a class="issue-link" href="${esc(issue.url)}" ${externalAttrs} aria-label="View special issue — ${esc(issue.journal)}">View special issue ↗</a></article>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function congress() {
    return `
      <section class="section congress" id="congress" aria-labelledby="congress-title">
        <div class="section-inner reveal">
          <p class="eyebrow">Part of</p>
          <h2 class="congress-title" id="congress-title">IEEE AI<br><span class="outline">for Science</span><br>Congress 2026</h2>
          <div class="congress-list" aria-label="Co-located conferences">${data.congress.map((item) => `<span class="congress-pill">${esc(item)}</span>`).join('')}</div>
        </div>
      </section>`;
  }

  function sponsors() {
    return `
      <section class="section sponsors" aria-labelledby="support-title">
        <div class="section-inner">
          <div class="reveal">${sectionHeading('Community & Support', 'The organizations behind the event.', '')}</div>
          <div class="logo-group reveal">
            <p class="logo-group-title" id="support-title">Sponsored and supported by</p>
            <div class="logo-grid">${data.sponsors.map(({ name, logo }) => `<div class="logo-placeholder supporter-logo"><img src="${esc(logo)}" alt="${esc(name)} logo" loading="lazy"></div>`).join('')}</div>
          </div>
          <div class="logo-group reveal">
            <p class="logo-group-title">Organizers</p>
            <div class="logo-grid organizer-grid">${data.organizers.map(({ name, logo }) => `<div class="logo-placeholder organizer-logo"><img src="${esc(logo)}" alt="${esc(name)} logo" loading="lazy"></div>`).join('')}</div>
          </div>
        </div>
      </section>`;
  }

  function finalCTA() {
    return `
      <section class="final-cta" aria-labelledby="join-title">
        <div class="section-inner">
          <div class="final-card reveal">
            <p class="eyebrow">Kuala Lumpur · December 2026</p>
            <h2 id="join-title">Ready to join ISPA 2026?</h2>
            <div class="final-actions">
              ${button('Submit Paper', data.meta.edasUrl, 'primary', true)}
              ${button('Visit Official Website', data.meta.officialUrl, 'secondary', true)}
            </div>
          </div>
          <footer class="footer">
            <div><strong>IEEE ISPA 2026</strong><br>${esc(data.meta.city)}, ${esc(data.meta.country)} · ${esc(data.meta.dateLong)}</div>
            <div class="footer-links"><a href="${data.meta.officialUrl}" ${externalAttrs}>Official website</a><a href="${data.meta.edasUrl}" ${externalAttrs}>EDAS</a></div>
          </footer>
        </div>
      </section>`;
  }

  function setupScrollArrow() {
    const arrow=document.createElement('button');
    arrow.className='scroll-next';
    arrow.textContent='↓';
    arrow.setAttribute('aria-label','Scroll to next section');
    document.body.appendChild(arrow);

    const sections=[...document.querySelectorAll('main > section')];

    const updateArrow=()=>{
      const current=window.scrollY + window.innerHeight * 0.35;
      let index=0;
      sections.forEach((section,i)=>{
        if(section.offsetTop <= current) index=i;
      });
      arrow.dataset.current=index;
      arrow.hidden=index >= sections.length-1;
    };

    arrow.onclick=()=>{
      const current=window.scrollY + window.innerHeight * 0.35;
      let index=0;
      sections.forEach((section,i)=>{
        if(section.offsetTop <= current) index=i;
      });
      const next=sections[index+1];
      if(next){
        next.scrollIntoView({behavior:'smooth', block:'start'});
      }
    };

    window.addEventListener('scroll', updateArrow, {passive:true});
    updateArrow();
  }

  document.getElementById('app').innerHTML = `
    ${header()}
    <main id="main">
      ${hero()}
      ${about()}
      ${dates()}
      ${tracks()}
      ${chairs()}
      ${submission()}
      ${publication()}
      ${specialIssues()}
      ${congress()}
      ${sponsors()}
      ${finalCTA()}
    </main>`;

  setupScrollArrow();

  const headerEl = document.getElementById('site-header');
  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  const setMenu = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileMenu.setAttribute('aria-hidden', String(!open));
    mobileMenu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };

  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });

  window.addEventListener('scroll', () => headerEl.classList.toggle('is-scrolled', window.scrollY > 18), { passive: true });

  document.querySelectorAll('[data-track-toggle]').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const index = Number(toggle.dataset.trackIndex);
      const track = data.tracks[index];
      const container = toggle.closest('[data-track]');
      const list = container.querySelector('[data-topic-list]');
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      const topics = expanded ? track.topics.slice(0, 6) : track.topics;
      list.innerHTML = topics.map((topic) => `<li>${esc(topic)}</li>`).join('');
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.textContent = expanded ? 'Explore Track' : 'Show Less';
    });
  });


  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
})();
