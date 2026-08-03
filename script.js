const $ = (selector) => document.querySelector(selector);

// A tap is required by modern browsers before unmuted music can play.
$('#enterButton').addEventListener('click', () => {
  const music = $('#bgMusic');
  music.volume = 0.45;
  music.play().catch(() => {});
  $('#curtain').classList.add('is-open');
});

// Reveal elements gently as the story is scrolled.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('show'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// A little falling-petal atmosphere.
const petals = $('#petals');
for (let i = 0; i < 24; i += 1) {
  const petal = document.createElement('i');
  petal.className = 'petal';
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty('--duration', `${8 + Math.random() * 10}s`);
  petal.style.setProperty('--delay', `${-Math.random() * 14}s`);
  petal.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
  petals.appendChild(petal);
}

// The music button plays a small original ambient chord; swap this out for your own audio file if you wish.
let audioContext; let musicTimer; let isPlaying = false;
function playAmbient() {
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  audioContext.resume();
  const playChord = () => {
    [220, 277.18, 329.63].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = frequency / (index === 2 ? 2 : 1);
      gain.gain.setValueAtTime(0, audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0.022, audioContext.currentTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 5.8);
      oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + 6);
    });
  };
  playChord(); musicTimer = setInterval(playChord, 6000);
}
if ($('#musicToggle')) $('#musicToggle').addEventListener('click', () => {
  const toggle = $('#musicToggle'); const label = $('#musicLabel');
  isPlaying = !isPlaying;
  if (isPlaying) { playAmbient(); toggle.classList.add('is-playing'); label.textContent = 'Pause our song'; }
  else { clearInterval(musicTimer); toggle.classList.remove('is-playing'); label.textContent = 'Play our song'; }
});

const noLines = ['Take all the time you need, my love.', 'I’ll be right here — always.', 'A little moment is completely okay.']; let noClicks = 0;
$('#noButton').addEventListener('click', () => { $('#noNote').textContent = noLines[noClicks % noLines.length]; noClicks += 1; });

const canvas = $('#fireworks'); const ctx = canvas.getContext('2d'); let particles = []; let animation;
function resizeCanvas() { canvas.width = window.innerWidth * devicePixelRatio; canvas.height = window.innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
resizeCanvas(); window.addEventListener('resize', resizeCanvas);
function burst(x, y) { const palette = ['#f3c576', '#e8959f', '#fff8f4', '#c781a3']; for (let i = 0; i < 75; i += 1) { const angle = Math.random() * Math.PI * 2; const speed = 1 + Math.random() * 5; particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 85 + Math.random() * 28, color: palette[i % palette.length] }); } }
function drawFireworks() { ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); particles = particles.filter((p) => p.life > 0); particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.035; p.life -= 1; ctx.globalAlpha = Math.max(p.life / 100, 0); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill(); }); if (particles.length) animation = requestAnimationFrame(drawFireworks); else ctx.globalAlpha = 1; }
function celebrate() { const points = [[.2,.28],[.78,.22],[.48,.38],[.27,.58],[.7,.62]]; points.forEach(([x,y], i) => setTimeout(() => { burst(innerWidth * x, innerHeight * y); drawFireworks(); }, i * 230)); }
$('#yesButton').addEventListener('click', () => { $('#celebration').classList.add('is-active'); $('#celebration').setAttribute('aria-hidden', 'false'); celebrate(); });
$('#celebration').addEventListener('click', () => { $('#celebration').classList.remove('is-active'); cancelAnimationFrame(animation); ctx.clearRect(0, 0, innerWidth, innerHeight); });
