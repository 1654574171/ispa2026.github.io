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
        <div class="share-content share-hero-content">
          <p class="share-kicker">THE ${esc(data.meta.edition).toUpperCase()} IEEE INTERNATIONAL SYMPOSIUM</p>
          <h1 id="hero-title">IEEE<br><span>ISPA</span> 2026</h1>
          <p class="share-hero-name">The 24th IEEE International Symposium<br>on Parallel and Distributed Processing<br>with Applications</p>
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
          <h2 id="about-title">Introduction</h2>
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
    const splitYear = (label) => {
      const match = String(label).match(/^(.*?)\s*(\d{4})$/);
      return match ? { when: match[1], year: match[2] } : { when: label, year: '' };
    };
    return `
      <section class="share-slide share-slide--blue" id="dates" aria-labelledby="dates-title">
        <div class="share-content">
          <p class="share-kicker">Dates</p>
          <h2 id="dates-title">Important Dates</h2>
          <div class="share-dates">
            ${data.deadlines.map((item) => {
              const { when, year } = splitYear(item.dateLabel);
              return `<div class="share-date ${item.tone === 'primary' ? 'is-primary' : ''}"><time>${esc(when)}${year ? `<span class="share-date-year">${esc(year)}</span>` : ''}</time><span>${esc(item.title)}</span></div>`;
            }).join('')}
          </div>
        </div>
      </section>`;
  }

  function tracksSlide() {
    return `
      <section class="share-slide share-slide--ink" id="tracks" aria-labelledby="tracks-title">
        <div class="share-content share-tracks-content">
          <p class="share-kicker">CALL FOR PAPERS</p>
          <h2 id="tracks-title">Tracks and topics</h2>
          <div class="share-tracks-overview" data-tracks-overview>
            ${data.tracks.map((track, index) => `
              <div class="share-track-item">
                <button type="button" class="share-track-card" data-track-index="${index}" aria-expanded="false" aria-controls="track-topics-${index}">
                  <span class="share-track-no">${esc(track.number)}</span>
                  <h3>${esc(track.title)}</h3>
                  <p>${esc(track.summary)}</p>
                  <span class="share-track-open"><span data-track-open-text>View topics</span> <span aria-hidden="true">+</span></span>
                </button>
                <div class="share-track-topics" id="track-topics-${index}" data-track-topics hidden>
                  <ul class="share-topic-list">${track.topics.map((topic) => `<li>${esc(topic)}</li>`).join('')}</ul>
                </div>
              </div>`).join('')}
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
    <button class="share-audio-toggle" type="button" data-audio-toggle aria-label="Mute background music" aria-pressed="true" title="Mute background music"><span aria-hidden="true">♫</span></button>
    <audio data-background-music src="assets/music.mp3" loop preload="auto"></audio>
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
    audioToggle.setAttribute('aria-pressed', String(playing));
    audioToggle.setAttribute('aria-label', playing ? 'Mute background music' : 'Play background music');
    audioToggle.title = playing ? 'Mute background music' : 'Play background music';
  }

  // 浏览器自动播放受限时：在首次用户手势时恢复播放（点按钮本身除外，交给按钮处理）
  const unlock = (event) => {
    if (event.target && event.target.closest && event.target.closest('[data-audio-toggle]')) return;
    if (backgroundMusic.paused) {
      backgroundMusic.play().then(() => {
        setMusicState(true);
        detachUnlock();
      }).catch(() => {});
    }
  };
  const detachUnlock = () => {
    ['pointerdown', 'touchstart', 'keydown'].forEach((type) => window.removeEventListener(type, unlock));
  };
  ['pointerdown', 'touchstart', 'keydown'].forEach((type) => window.addEventListener(type, unlock, { passive: true }));

  // 一进入即为开启状态：自动尝试播放背景音乐
  setMusicState(true);
  backgroundMusic.play().then(() => {
    setMusicState(true);
    detachUnlock();
  }).catch(() => setMusicState(false));

  audioToggle.addEventListener('click', () => {
    detachUnlock();
    if (backgroundMusic.paused) {
      backgroundMusic.play().then(() => setMusicState(true)).catch(() => setMusicState(false));
    } else {
      backgroundMusic.pause();
      setMusicState(false);
    }
  });

  // Track 卡片 → 在卡片内部下方展开/收起 topics（互斥手风琴）
  const overview = document.querySelector('[data-tracks-overview]');
  const trackCards = [...document.querySelectorAll('[data-track-index]')];
  let openTrackIndex = -1;

  function setOpenCard(index) {
    openTrackIndex = index;
    trackCards.forEach((card, cardIndex) => {
      const open = cardIndex === index;
      card.setAttribute('aria-expanded', open ? 'true' : 'false');
      card.parentElement.querySelector('[data-track-topics]').hidden = !open;
      const openText = card.querySelector('[data-track-open-text]');
      if (openText) openText.textContent = open ? 'Hide topics' : 'View topics';
    });
  }

  if (overview && trackCards.length) {
    trackCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        setOpenCard(openTrackIndex === index ? -1 : index);
      });
    });
  }
})();
