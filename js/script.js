document.addEventListener('DOMContentLoaded', () => {
    // Header scroll + equalizer bars
    const header = document.getElementById('header');
    const eqBars = document.getElementById('eqBars');
    if (eqBars) {
        for (let i = 0; i < 8; i++) {
            const bar = document.createElement('div');
            bar.className = 'eq-bar';
            eqBars.appendChild(bar);
        }
    }
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });

    // Portfolio tabs
    document.querySelectorAll('.portfolio-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.portfolio-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.portfolio-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.tab + '-portfolio');
            if (target) target.classList.add('active');
        });
    });

    // Calculator
    const projectGoal = document.getElementById('projectGoal');
    const beatStatus = document.getElementById('beatStatus');
    const mixStatus = document.getElementById('mixStatus');
    const hoursSelect = document.getElementById('hoursSelect');
    const hoursGroup = document.getElementById('hoursGroup');
    const beatGroup = document.getElementById('beatGroup');
    const mixGroup = document.getElementById('mixGroup');
    const resultEl = document.getElementById('calculatorResult');

    function updateCalculator() {
        const goal = projectGoal.value;
        const beats = beatStatus.value;
        const mix = mixStatus.value;
        const hours = parseInt(hoursSelect.value, 10) || 3;

        let rec = '',
            price = '',
            desc = '',
            duration = '',
            includes = [],
            extras = [],
            session = 'custom',
            btnText = 'Book This Package';

        if (goal === 'single') {
            rec = 'Quick Session';
            price = '£80';
            desc = 'Best for recording 1–2 singles with an engineer';
            duration = '3 hours studio time';
            includes = ['Professional engineer', 'Recording', 'Industry equipment'];
            session = 'quick-session';
            btnText = 'Book Quick Session';
        } else if (goal === 'ep') {
            rec = 'Half Day Package';
            price = '£140';
            desc = 'Ideal for an EP (3–4 songs)';
            duration = '5 hours studio time';
            includes = ['Professional engineer', 'Recording + basic mixing', 'Up to 4 songs'];
            session = 'half-day';
            btnText = 'Book Half Day';
        } else if (goal === 'project') {
            rec = 'Full Day Project';
            price = '£240';
            desc = 'Best for complete projects (5+ songs)';
            duration = '10 hours studio time';
            includes = ['Professional engineer', 'Full production support', 'Up to 8 songs', 'Priority support'];
            session = 'full-day';
            btnText = 'Book Full Day';
        } else if (goal === 'mixing') {
            rec = 'Full Mix & Master';
            price = 'From £60';
            desc = 'Professional mix and master only — no studio time needed';
            duration = 'Remote / offline service';
            includes = ['Full mix', 'Mastering', 'Handled by Dsoul'];
            session = 'custom';
            btnText = 'Enquire about Mix & Master';
        } else if (goal === 'hourly') {
            const total = hours * 30;
            rec = 'Hourly with Engineer';
            price = '£' + total;
            desc = hours + ' hour' + (hours > 1 ? 's' : '') + ' with a professional engineer';
            duration = hours + ' × £30/hour = £' + total;
            includes = ['Professional engineer', 'Recording assistance', 'Full equipment access', hours + ' hour' + (
                hours > 1 ? 's' : '') + ' studio time'];
            session = 'hourly-engineer';
            btnText = 'Book ' + hours + ' Hour' + (hours > 1 ? 's' : '');
        } else if (goal === 'dry') {
            const total = hours * 10;
            rec = 'Dry Hire';
            price = '£' + total;
            desc = hours + ' hour' + (hours > 1 ? 's' : '') + ' studio space only — you self-engineer';
            duration = hours + ' × £10/hour = £' + total;
            includes = ['Studio room access', 'Use of equipment', 'No engineer included', hours + ' hour' + (
                hours > 1 ? 's' : '') + ' studio time'];
            session = 'dry-hire';
            btnText = 'Book ' + hours + ' Hour' + (hours > 1 ? 's' : '') + ' Dry Hire';
        }

        if (goal !== 'mixing' && goal !== 'dry') {
            if (beats === 'no') {
                extras.push('Custom beat production: <strong>£120</strong> each');
                if (goal !== 'hourly') {
                    const base = parseInt(price.replace(/\D/g, ''), 10) || 0;
                    if (base) price = 'From £' + (base + 120);
                }
            } else if (beats === 'some') {
                extras.push('Extra custom beats available at <strong>£120</strong> each');
            }
        }
        if (mix === 'yes' && goal !== 'mixing') {
            extras.push('Full Mix &amp; Master: <strong>from £60</strong>');
            if (goal !== 'hourly' && goal !== 'dry') {
                const nums = price.match(/\d+/);
                if (nums) price = 'From £' + (parseInt(nums[0], 10) + 60);
            }
        }

        const note = (extras.length || mix === 'yes' || beats === 'no') ?
            '<p style="margin-top:0.75rem;font-size:0.9rem;color:var(--text-muted);">Final price depends on exact needs — we’ll confirm everything when you book.</p>' :
            '';

        resultEl.innerHTML = `
              <div class="result-title">RECOMMENDED: ${rec}</div>
              <div class="result-price">${price}</div>
              <div class="result-desc">${desc}</div>
              <p><i class="fas fa-clock"></i> ${duration}</p>
              ${includes.map(i => `<p><i class="fas fa-check"></i> ${i}</p>`).join('')}
              ${extras.map(e => `<p><i class="fas fa-plus"></i> ${e}</p>`).join('')}
              ${note}
              <a href="#contact" class="btn calc-book" style="margin-top:1.25rem;"
                 data-session="${session}"
                 data-hours="${(goal === 'hourly' || goal === 'dry') ? hours : ''}"
                 data-summary="${rec} — ${price}${(goal === 'hourly' || goal === 'dry') ? ' (' + hours + 'h)' : ''}">${btnText}</a>
            `;

        const bookBtn = resultEl.querySelector('.calc-book');
        if (bookBtn) {
            bookBtn.addEventListener('click', function() {
                const sel = document.getElementById('session-type');
                const msg = document.getElementById('message');
                const s = this.dataset.session || 'custom';
                const h = this.dataset.hours || '';
                const summary = this.dataset.summary || '';
                if (sel) {
                    if ((s === 'hourly-engineer' || s === 'dry-hire') && h) {
                        const label = s === 'dry-hire' ?
                            `Dry Hire — ${h} hour${h > 1 ? 's' : ''} (£${h * 10})` :
                            `Hourly with Engineer — ${h} hour${h > 1 ? 's' : ''} (£${h * 30})`;
                        let opt = sel.querySelector('option[data-calc="1"]');
                        if (!opt) {
                            opt = document.createElement('option');
                            opt.dataset.calc = '1';
                            sel.appendChild(opt);
                        }
                        opt.value = s + '-' + h + 'h';
                        opt.textContent = label;
                        sel.value = opt.value;
                    } else {
                        sel.value = s;
                    }
                }
                if (msg) {
                    const line = 'Calculator selection: ' + summary;
                    if (msg.value.startsWith('Calculator selection:')) {
                        const rest = msg.value.split('\n').slice(1).join('\n').replace(/^\n/, '');
                        msg.value = line + (rest ? '\n' + rest : '');
                    } else if (!msg.value.trim()) {
                        msg.value = line;
                    } else if (!msg.value.includes('Calculator selection:')) {
                        msg.value = line + '\n\n' + msg.value;
                    }
                }
            });
        }
    }

    function toggleSecondary() {
        const goal = projectGoal.value;
        const hide = (goal === 'dry' || goal === 'mixing');
        if (beatGroup) beatGroup.style.display = hide ? 'none' : '';
        if (mixGroup) mixGroup.style.display = (goal === 'mixing' || goal === 'dry') ? 'none' : '';
        if (hoursGroup) hoursGroup.style.display = (goal === 'hourly' || goal === 'dry') ? '' : 'none';
    }

    [projectGoal, beatStatus, mixStatus, hoursSelect].forEach(el => {
        if (el) el.addEventListener('change', () => { toggleSecondary();
            updateCalculator(); });
    });
    toggleSecondary();
    updateCalculator();

    // Pricing card → form preselect
    document.querySelectorAll('.tier .btn[data-session]').forEach(btn => {
        btn.addEventListener('click', () => {
            const sel = document.getElementById('session-type');
            if (sel && btn.dataset.session) sel.value = btn.dataset.session;
        });
    });

    // Live counter
    function updateCounter() {
        const el = document.getElementById('sessionCount');
        if (el) el.textContent = 8 + Math.floor(new Date().getDate() * 0.8);
    }
    updateCounter();
    setInterval(updateCounter, 3600000);

    // Year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = header.offsetHeight;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });

    // Logo hover
    const logo = document.getElementById('mainLogo');
    if (logo) {
        logo.addEventListener('mouseenter', () => logo.style.transform = 'rotateY(180deg) scale(1.05)');
        logo.addEventListener('mouseleave', () => logo.style.transform = 'rotateY(0) scale(1)');
    }

    // Gallery
    const galleryGrid = document.getElementById('galleryGrid');
    const photoFiles = [
        'C2530.00_00_01_02.Still003.jpg',
        'C2530.00_00_01_04.Still005.jpg',
        'C2530.00_00_01_08.Still009.jpg',
        'C2530.00_00_01_09.Still010.jpg',
        'C2530.00_00_01_10.Still011.jpg',
        'C2530.00_00_01_12.Still013.jpg',
        'C2530.00_00_01_19.Still020.jpg'
    ];

    if (galleryGrid) {
        let loaded = 0;
        const images = [];
        photoFiles.forEach((file, i) => {
            const img = new Image();
            img.onload = () => {
                images[i] = { src: file, ok: true };
                loaded++;
                if (loaded === photoFiles.length) renderGallery();
            };
            img.onerror = () => {
                images[i] = { src: file, ok: false };
                loaded++;
                if (loaded === photoFiles.length) renderGallery();
            };
            img.src = file;
        });

        setTimeout(() => {
            if (loaded === 0) {
                galleryGrid.innerHTML = `
                    <div class="gallery-placeholder">
                      <i class="fas fa-camera"></i>
                      <h3 style="color:var(--white);margin-bottom:0.75rem;">Add Your Studio Photos</h3>
                      <p style="color:var(--text);max-width:480px;margin:0 auto;">Place these files in the same folder as this HTML (or update the paths in the script):</p>
                      <p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.75rem;">${photoFiles.join(', ')}</p>
                    </div>`;
            }
        }, 2800);

        function renderGallery() {
            const ok = images.filter(i => i && i.ok);
            if (!ok.length) {
                galleryGrid.innerHTML = `
                      <div class="gallery-placeholder">
                        <i class="fas fa-camera"></i>
                        <h3 style="color:var(--white);margin-bottom:0.75rem;">Could not load images</h3>
                        <p style="color:var(--text);">Make sure the image files are present and the paths are correct.</p>
                      </div>`;
                return;
            }
            galleryGrid.innerHTML = '';
            ok.slice(0, 6).forEach(item => {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.innerHTML = `<img src="${item.src}" alt="Studio photo" loading="lazy" />`;
                div.addEventListener('click', () => openLightbox(item.src));
                galleryGrid.appendChild(div);
            });
            if (ok.length > 6) {
                const more = document.createElement('div');
                more.className = 'gallery-item';
                more.style.cssText =
                    'display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(45deg,var(--purple),var(--purple-mid));color:var(--accent);font-weight:700;';
                more.innerHTML =
                    `<i class="fas fa-images" style="font-size:2.5rem;margin-bottom:0.75rem;"></i>+${ok.length - 6} more<br><span style="font-size:0.9rem;opacity:0.8;">View all</span>`;
                galleryGrid.appendChild(more);
            }
        }

        function openLightbox(src) {
            const lb = document.createElement('div');
            lb.className = 'lightbox';
            lb.innerHTML =
                `<img src="${src}" alt="Studio photo" /><button type="button" class="lightbox-close" aria-label="Close">×</button>`;
            document.body.appendChild(lb);
            const close = () => lb.remove();
            lb.querySelector('.lightbox-close').addEventListener('click', close);
            lb.addEventListener('click', e => { if (e.target === lb) close(); });
            document.addEventListener('keydown', function esc(e) {
                if (e.key === 'Escape') { close();
                    document.removeEventListener('keydown', esc); }
            });
        }
    }

    // Date min = today
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
        const t = new Date();
        dateInput.min = t.toISOString().slice(0, 10);
    }

    // Form UI feedback
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', function() {
            const btn = this.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = '✅ Sent!';
                btn.style.background = '#25D366';
                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.disabled = false;
                    btn.style.background = '';
                    this.reset();
                }, 2800);
            }, 1400);
        });
    }

    // Audio crossfade
    (function() {
        const raw = document.getElementById('audioRaw');
        const mixed = document.getElementById('audioMixed');
        const slider = document.getElementById('crossfadeSlider');
        const label = document.getElementById('crossfadeLabel');
        const playBtn = document.getElementById('playPauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        if (!raw || !mixed || !slider || !playBtn) return;

        const RAW_URL = 'https://jaideecoded.github.io/Billups/raw-demo.mp3';
        const MIXED_URL = 'https://jaideecoded.github.io/Billups/mixed-demo.mp3';

        raw.src = RAW_URL;
        mixed.src = MIXED_URL;
        raw.load();
        mixed.load();
        raw.volume = 0.5;
        mixed.volume = 0.5;

        let playing = false;

        function setStatus(text, isError) {
            if (statusDot) {
                statusDot.textContent = isError ? '✖' : (playing ? '▶' : '●');
                statusDot.style.color = isError ? 'var(--orange)' : '';
            }
            if (statusText) statusText.textContent = text || '';
        }

        function updateCrossfade() {
            const v = parseInt(slider.value, 10) / 100;
            mixed.volume = v;
            raw.volume = 1 - v;
            if (label) label.textContent = Math.round((1 - v) * 100) + '% Raw  /  ' + Math.round(v * 100) +
                '% Mixed';
        }

        slider.addEventListener('input', updateCrossfade);

        playBtn.addEventListener('click', () => {
            if (playing) {
                raw.pause();
                mixed.pause();
                playing = false;
                playBtn.innerHTML = '▶ Play';
                setStatus('Paused');
            } else {
                mixed.currentTime = raw.currentTime;
                Promise.all([raw.play(), mixed.play()]).then(() => {
                    playing = true;
                    playBtn.innerHTML = '⏸ Pause';
                    setStatus('Playing – drag the slider to compare');
                }).catch(() => setStatus('Tap Play again (browser blocked autoplay)', true));
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
            setStatus('Ready – drag the slider to compare');
        });

        raw.addEventListener('ended', () => {
            mixed.pause();
            playing = false;
            playBtn.innerHTML = '▶ Play';
            setStatus('Finished');
        });

        setInterval(() => {
            if (playing && Math.abs(raw.currentTime - mixed.currentTime) > 0.15) {
                mixed.currentTime = raw.currentTime;
            }
        }, 280);

        raw.addEventListener('error', () => setStatus('Raw track could not be loaded', true));
        mixed.addEventListener('error', () => setStatus('Mixed track could not be loaded', true));

        updateCrossfade();
        setStatus('Ready – drag the slider to compare');
    })();
});
