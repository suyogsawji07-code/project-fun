document.addEventListener('DOMContentLoaded', () => {
  /* ---- active nav link ---- */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* ---- floating particles ---- */
  const pWrap = document.getElementById('particles');
  if (pWrap) {
    const emojis = window.PARTICLE_EMOJIS || ['✨','💫','🌟','🎈','🎊'];
    for (let i = 0; i < 16; i++) {
      const el = document.createElement('div');
      const isDot = Math.random() > 0.6;
      el.className = isDot ? 'dot-particle' : 'particle';
      if (!isDot) el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = Math.random() * 100 + 'vw';
      el.style.animationDuration = (12 + Math.random() * 14) + 's';
      el.style.animationDelay = (Math.random() * 14) + 's';
      if (!isDot) el.style.fontSize = (16 + Math.random() * 16) + 'px';
      pWrap.appendChild(el);
    }
  }

  /* ---- cursor glow (desktop only) ---- */
  const glow = document.getElementById('cursor-glow');
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  /* ---- scroll reveal ---- */
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
  }, { threshold: 0.12 });
  reveals.forEach(r => obs.observe(r));

  /* ---- typewriter ---- */
  document.querySelectorAll('[data-typewriter]').forEach(el => {
    const text = el.getAttribute('data-typewriter');
    el.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    let i = 0;
    function type() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        el.appendChild(cursor);
        i++;
        setTimeout(type, 45);
      }
    }
    type();
  });

  /* ---- button ripple ---- */
  document.querySelectorAll('.btn, .challenge-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.style.position = 'relative';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---- friendship challenge voting ---- */
  document.querySelectorAll('.challenge-card').forEach(card => {
    const btns = card.querySelectorAll('.challenge-btn');
    const result = card.querySelector('.challenge-result');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('picked'));
        btn.classList.add('picked');
        if (result) result.textContent = btn.getAttribute('data-result') || '';
      });
    });
  });

  initConfetti();
  initFireworks();
});

/* ================= CONFETTI ================= */
function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  let particles = [];
  const colors = ['#FF7A59', '#FFC857', '#2EC4B6', '#9D8CFF', '#FF6FA5'];
  window.burstConfetti = function () {
    for (let i = 0; i < 180; i++) {
      particles.push({
        x: canvas.width / 2, y: canvas.height,
        vx: (Math.random() - 0.5) * 15, vy: -Math.random() * 19 - 6,
        size: 5 + Math.random() * 6, color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360, vr: (Math.random() - 0.5) * 10, life: 100 + Math.random() * 60
      });
    }
  };
  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.rot += p.vr; p.life--;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
    particles = particles.filter(p => p.life > 0 && p.y < canvas.height + 50);
    requestAnimationFrame(animate);
  })();
}

/* ================= FIREWORKS ================= */
function initFireworks() {
  const canvas = document.getElementById('fx-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  let sparks = [];
  const colors = ['#FF7A59', '#FFC857', '#2EC4B6', '#9D8CFF', '#FF6FA5', '#ffffff'];

  function launch(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = 34;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;
      sparks.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        color, life: 60 + Math.random() * 20
      });
    }
  }
  window.launchFireworks = function (n = 5) {
    let count = 0;
    const interval = setInterval(() => {
      launch(canvas.width * (0.2 + Math.random() * 0.6), canvas.height * (0.15 + Math.random() * 0.35));
      count++;
      if (count >= n) clearInterval(interval);
    }, 350);
  };
  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks.forEach(s => {
      s.x += s.vx; s.y += s.vy; s.vy += 0.04; s.life--;
      ctx.globalAlpha = Math.max(s.life / 80, 0);
      ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(s.x, s.y, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    });
    sparks = sparks.filter(s => s.life > 0);
    requestAnimationFrame(animate);
  })();
}

function toggleFlip(card) { card.classList.toggle('flipped'); }
