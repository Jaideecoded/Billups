document.addEventListener('DOMContentLoaded', () => {
  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Live counter
  const countEl = document.getElementById('sessionCount');
  if (countEl) {
    countEl.textContent = 8 + Math.floor(new Date().getDate() * 0.7);
  }

  // Portfolio tabs
  document.querySelectorAll('.portfolio-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.portfolio-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.portfolio-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab + '-portfolio').classList.add('active');
    });
  });

  // Audio Crossfade
  const raw = document.getElementById('audioRaw');
  const mixed = document.getElementById('audioMixed');
  const slider = document.getElementById('crossfadeSlider');
  const label = document.getElementById('crossfadeLabel');
  const playBtn = document.getElementById('playPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const status = document.getElementById('audioStatus');

  if (raw && mixed && slider) {
    const RAW_URL = 'https://jaideecoded.github.io/Billups/raw-demo.mp3';
    const MIXED_URL = 'https://jaideecoded.github.io/Billups/mixed-demo.mp3';

    raw.src = RAW_URL;
    mixed.src = MIXED_URL;
    raw.volume = 0.5;
    mixed.volume = 0.5;

    let playing = false;

    function updateCrossfade() {
      const v = slider.value / 100;
      mixed.volume = v;
      raw.volume = 1 - v;
      label.textContent = Math.round((1 - v) * 100) + '% Raw  /  ' + Math.round(v * 100) + '% Mixed';
    }

    slider.addEventListener('input', updateCrossfade);

    playBtn.addEventListener('click', () => {
      if (playing) {
        raw.pause();
        mixed.pause();
        playing = false;
        playBtn.innerHTML = '▶ Play';
        status.textContent = 'Paused';
      } else {
        mixed.currentTime = raw.currentTime;
        Promise.all([raw.play(), mixed.play()]).then(() => {
          playing = true;
          playBtn.innerHTML = '⏸ Pause';
          status.textContent = 'Playing – drag the slider to compare';
        }).catch(() => {
          status.textContent = 'Tap Play again (browser blocked autoplay)';
        });
      }
    });

    resetBtn.addEventListener('click', () => {
      raw.pause();
      mixed.pause();
      raw.currentTime = 0;
      mixed.currentTime = 0;
      playing = false;
      playBtn.innerHTML = '▶ Play';
      slider.value = 50;
      updateCrossfade();
      status.textContent = 'Ready – drag the slider to compare';
    });

    updateCrossfade();
  }
});
