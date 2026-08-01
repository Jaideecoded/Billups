document.addEventListener('DOMContentLoaded', () => {
  const tracks = {
    mixed: 'audio/mixed-demo.mp3',
    raw:   'audio/raw-demo.mp3'
  };

  const btnMixed = document.getElementById('btnMixed');
  const btnRaw   = document.getElementById('btnRaw');
  const mainPlayer = document.getElementById('mainPlayer');
  const audioSource = document.getElementById('audioSource');
  const currentTrackLabel = document.getElementById('currentTrackLabel');
  const errorMsg = document.getElementById('errorMsg');
  const fallbackNotice = document.getElementById('fallbackNotice');
  const statusDot = document.getElementById('statusDot');

  if (!mainPlayer || !audioSource || !btnMixed || !btnRaw) return;

  // Helper to set active button styles
  function setActiveButton(track) {
    if (track === 'mixed') {
      btnMixed.classList.add('active');
      btnRaw.classList.remove('active');
    } else {
      btnRaw.classList.add('active');
      btnMixed.classList.remove('active');
    }
  }

  // Update UI status
  function setStatus(text, isError = false) {
    if (statusDot) statusDot.style.color = isError ? '#ff6b35' : 'var(--accent)';
    if (errorMsg) {
      if (isError) { errorMsg.style.display = 'inline-block'; errorMsg.textContent = text; }
      else { errorMsg.style.display = 'none'; errorMsg.textContent = ''; }
    }
  }

  // Check whether a file exists (HEAD request)
  async function fileExists(url) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  // Switch the player to the selected track
  async function switchTrack(trackKey) {
    const url = tracks[trackKey];

    setActiveButton(trackKey);
    currentTrackLabel.textContent = trackKey === 'mixed' ? 'Mixed & Mastered' : 'Raw Recording';
    setStatus('Checking track...', false);

    const exists = await fileExists(url);

    if (!exists) {
      // Show fallback and do not attempt to play missing file
      fallbackNotice.style.display = 'block';
      setStatus('Track not found: ' + url, true);
      return;
    }

    fallbackNotice.style.display = 'none';
    setStatus('Loading...', false);

    // Update source and reload player
    // If the <source> element is present, update it; otherwise update audio.src
    if (audioSource) {
      audioSource.src = url;
      // Force the audio element to reload sources
      try {
        mainPlayer.pause();
        mainPlayer.load();
        // Try to play automatically (may be blocked by browser autoplay policy)
        const p = mainPlayer.play();
        if (p && p.catch) p.catch(() => { /* autoplay blocked, that's fine */ });
      } catch (err) {
        // ignore
      }
    } else {
      mainPlayer.src = url;
      try { mainPlayer.load(); mainPlayer.play(); } catch (e) {}
    }

    setStatus('Playing: ' + (trackKey === 'mixed' ? 'Mixed & Mastered' : 'Raw Recording'));
  }

  // Attach handlers
  btnMixed.addEventListener('click', (e) => { e.preventDefault(); switchTrack('mixed'); });
  btnRaw.addEventListener('click', (e) => { e.preventDefault(); switchTrack('raw'); });

  // If the player triggers an error, show message
  mainPlayer.addEventListener('error', (ev) => {
    setStatus('Playback error (see console)', true);
    console.warn('Audio element error', ev);
  });

  // On page load try to use the current source and verify files
  (async () => {
    // If the page already points at mixed-demo by default, verify it exists
    const defaultSrc = audioSource ? audioSource.src : mainPlayer.src;
    // Convert to relative URL if needed
    const relMixed = tracks.mixed;
    const relRaw = tracks.raw;

    const mixedExists = await fileExists(relMixed);
    const rawExists = await fileExists(relRaw);

    if (!mixedExists && !rawExists) {
      // No custom tracks present — show fallback but still leave whatever the page has
      fallbackNotice.style.display = 'block';
      setStatus('No demo files found on server', true);
    } else {
      // Prefer mixed if exists
      if (mixedExists) {
        switchTrack('mixed');
      } else {
        switchTrack('raw');
      }
    }
  })();

});
