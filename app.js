(function () {
  'use strict';

  const data = window.CONFERENCE_DATA;
  const app = document.getElementById('app');
  if (!data || !app) return;

  const esc = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
  const external = 'target="_blank" rel="noreferrer noopener"';
  const chairSlides = [
    { id: 'chairs-general-program', label: 'General & Program Chairs', groups: data.chairGroups.slice(0, 2) },
    { id: 'chairs-vice-local', label: 'Vice & Local Chairs', groups: data.chairGroups.slice(2, 4) },
    { id: 'chairs-workshop-publicity', label: 'Workshop & Publicity Chairs', groups: data.chairGroups.slice(4, 6) },
    { id: 'chairs-publication-web', label: 'Publication & Web Chairs', groups: data.chairGroups.slice(6, 8) },
    { id: 'chairs-steering', label: 'Steering Committee', groups: data.chairGroups.slice(8, 9) },
  ];
  const slides = [
    ['top', 'Overview'], ['about', 'Why ISPA'], ['dates', 'Dates'], ['tracks', 'Tracks'],
    ...chairSlides.map((group) => [group.id, group.label]),
    ['submission', 'Submit'], ['support', 'Connect'],
  ];

  const action = (label, href, tone = 'light') => `
    <a class="share-action share-action--${tone}" href="${esc(href)}" ${external}>${esc(label)} <span aria-hidden="true">→</span></a>`;

  function introSlide() {
    return `
      <section class="share-slide share-slide--hero" id="top" aria-labelledby="hero-title">
        <div class="share-city" aria-hidden="true"><img src="assets/kuala-lumpur-petronas.jpg" alt=""></div>
        <audio data-background-music src="assets/music.mp3" loop preload="metadata"></audio>
        <button class="share-audio-toggle" type="button" data-audio-toggle aria-label="Play background music" aria-pressed="false" title="Play background music"><span aria-hidden="true">♫</span></button>
        <div class="share-content share-hero-content">
          <p class="share-kicker">THE ${esc(data.meta.edition).toUpperCase()} IEEE INTERNATIONAL SYMPOSIUM</p>
          <h1 id="hero-title">IEEE<br><span>ISPA</span> 2026</h1>
          <p class="share-hero-name">${esc(data.meta.fullName)}</p>
          <div class="share-hero-meta"><span>${esc(data.meta.dateShort)}</span><span>${esc(data.meta.city)}, ${esc(data.meta.country)}</span></div>
          <p class="share-swipe-hint">Swipe up to explore <span aria-hidden="true">↓</span></p>
        </div>
      </section>`;
  }

  function aboutSlide() {
    return `
      <section class="share-slide share-slide--paper" id="about" aria-labelledby="about-title">
        <div class="share-content share-center-content">
          <p class="share-kicker">WHY ISPA 2026</p>
          <h2 id="about-title">Systems research<br>that moves <em>forward.</em></h2>
          <p class="share-lead">${esc(data.meta.introduction)}</p>
          <div class="share-stats" aria-label="Conference highlights">
            <div><strong>24<sup>th</sup></strong><span>edition</span></div>
            <div><strong>${esc(data.meta.since)}</strong><span>since</span></div>
            <div><strong>IEEE</strong><span>Xplore &amp; EI</span></div>
          </div>
        </div>
      </section>`;
  }

  function datesSlide() {
    return `
      <section class="share-slide share-slide--blue" id="dates" aria-labelledby="dates-title">
        <div class="share-content">
          <p class="share-kicker">SAVE THE DATES</p>
          <h2 id="dates-title">Your next<br><em>deadline.</em></h2>
          <div class="share-dates">
            ${data.deadlines.map((item) => `<div class="share-date ${item.tone === 'primary' ? 'is-primary' : ''}"><time>${esc(item.dateLabel)}</time><span>${esc(item.title)}</span></div>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function tracksSlide() {
    return `
      <section class="share-slide share-slide--ink" id="tracks" aria-labelledby="tracks-title">
        <div class="share-content">
          <p class="share-kicker">CALL FOR PAPERS</p>
          <h2 id="tracks-title">Four tracks.<br><em>One community.</em></h2>
          <div class="share-tracks">
            ${data.tracks.map((track) => `<article><span>${esc(track.number)}</span><h3>${esc(track.title)}</h3><p>${esc(track.summary)}</p></article>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function chairSlide(group, index) {
    return `
      <section class="share-slide share-slide--chairs share-chair-slide" id="${esc(group.id)}" aria-labelledby="${esc(group.id)}-title">
        <div class="share-content share-chairs-content">
          <div class="share-chairs-heading"><p class="share-kicker">CONFERENCE LEADERSHIP · ${String(index + 1).padStart(2, '0')} / ${String(chairSlides.length).padStart(2, '0')}</p><h2 class="share-chair-title" id="${esc(group.id)}-title">${esc(group.label)}</h2></div>
          <div class="share-chair-groups">
            ${group.groups.map((category) => `<section class="share-chair-category" aria-label="${esc(category.label)}"><h3>${esc(category.label)}</h3><div class="share-chair-grid share-chair-grid--${category.members.length}">${category.members.map((chair) => `<article class="share-chair-card"><img class="share-chair-photo${chair.photoFit === 'contain' ? ' share-chair-photo--contain' : ''}" src="${esc(chair.photo)}" alt="Portrait of ${esc(chair.name)}" loading="lazy"><h3>${esc(chair.name)}</h3><p>${esc(chair.institution)}</p></article>`).join('')}</div></section>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function submissionSlide() {
    return `
      <section class="share-slide share-slide--signal" id="submission" aria-labelledby="submission-title">
        <div class="share-content share-center-content">
          <p class="share-kicker">PAPER SUBMISSION</p>
          <h2 id="submission-title">Bring your<br><em>best work.</em></h2>
          <div class="share-submission-facts">
            <div><strong>${esc(data.submission.format)}</strong><span>required format</span></div>
            <div><strong>${esc(data.submission.review)}</strong><span>review model</span></div>
            <div><strong>${esc(data.submission.complimentaryPages)} + ${esc(data.submission.extraPages)}</strong><span>maximum 10 pages</span></div>
          </div>
          ${action('Submit via EDAS', data.meta.edasUrl, 'dark')}
        </div>
      </section>`;
  }

  function supportSlide() {
    return `
      <section class="share-slide share-slide--final" id="support" aria-labelledby="support-title">
        <div class="share-content share-final-content">
          <p class="share-kicker">KUALA LUMPUR · DECEMBER 2026</p>
          <h2 id="support-title">See you<br>at <em>ISPA.</em></h2>
          <div class="share-actions">${action('Submit via EDAS', data.meta.edasUrl, 'light')}${action('Official website', data.meta.officialUrl, 'outline')}</div>
          <div class="share-logo-wrap" aria-label="Sponsors and organizers">
            ${[...data.sponsors, ...data.organizers].map(({ name, logo }) => `<div><img src="${esc(logo)}" alt="${esc(name)} logo" loading="lazy"></div>`).join('')}
          </div>
        </div>
      </section>`;
  }

  app.innerHTML = `
    <main class="share-deck" id="main" data-active-slide="top" tabindex="0" aria-label="IEEE ISPA 2026 share deck">
      ${introSlide()}${aboutSlide()}${datesSlide()}${tracksSlide()}${chairSlides.map(chairSlide).join('')}${submissionSlide()}${supportSlide()}
    </main>
    <nav class="share-progress" aria-label="Share deck sections">
      ${slides.map(([id, label], index) => `<button type="button" data-slide-target="${id}" aria-label="Go to ${label}" aria-current="${index === 0 ? 'step' : 'false'}"><span>${String(index + 1).padStart(2, '0')}</span></button>`).join('')}
    </nav>`;

  const deck = document.querySelector('.share-deck');
  const slideElements = [...deck.querySelectorAll('.share-slide')];
  const progressButtons = [...document.querySelectorAll('[data-slide-target]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const audioToggle = document.querySelector('[data-audio-toggle]');
  const backgroundMusic = document.querySelector('[data-background-music]');
  let activeIndex = 0;
  let scrollFrame = 0;
  let musicIsPlaying = false;

  backgroundMusic.volume = 0.08;

  function activate(index, shouldScroll) {
    activeIndex = Math.max(0, Math.min(index, slideElements.length - 1));
    const activeSlide = slideElements[activeIndex];
    deck.dataset.activeSlide = activeSlide.id;
    progressButtons.forEach((button, buttonIndex) => button.setAttribute('aria-current', buttonIndex === activeIndex ? 'step' : 'false'));
    if (shouldScroll) activeSlide.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  progressButtons.forEach((button, index) => button.addEventListener('click', () => activate(index, true)));
  deck.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const midpoint = deck.scrollTop + deck.clientHeight / 2;
      const nextIndex = slideElements.findIndex((slide, index) => {
        const next = slideElements[index + 1];
        return !next || midpoint < next.offsetTop;
      });
      if (nextIndex !== -1 && nextIndex !== activeIndex) activate(nextIndex, false);
    });
  }, { passive: true });
  deck.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp'].includes(event.key)) return;
    event.preventDefault();
    activate(activeIndex + (['ArrowDown', 'PageDown'].includes(event.key) ? 1 : -1), true);
  });

  function setMusicState(playing) {
    musicIsPlaying = playing;
    audioToggle.setAttribute('aria-pressed', String(playing));
    audioToggle.setAttribute('aria-label', playing ? 'Mute background music' : 'Play background music');
    audioToggle.title = playing ? 'Mute background music' : 'Play background music';
  }

  audioToggle.addEventListener('click', async () => {
    if (!musicIsPlaying) {
      try {
        await backgroundMusic.play();
        setMusicState(true);
      } catch {
        setMusicState(false);
      }
      return;
    }

    backgroundMusic.pause();
    setMusicState(false);
  });
})();
