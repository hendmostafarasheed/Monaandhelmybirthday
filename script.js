const cover = document.getElementById('coverScreen');
    const invite = document.getElementById('inviteScreen');
    const openButton = document.getElementById('openInvitation');
    const music = document.getElementById('birthdayMusic');
    const soundToggle = document.getElementById('soundToggle');
    const canvas = document.getElementById('glitterCanvas');
    const ctx = canvas.getContext('2d');
    let flakes = [], animationId = null, opened = false;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      flakes = Array.from({length: Math.min(180, Math.floor(window.innerWidth / 4))}, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -window.innerHeight,
        r: Math.random() * 2.4 + 0.5,
        vy: Math.random() * 2.1 + 0.8,
        vx: (Math.random() - 0.5) * 0.8,
        alpha: Math.random() * 0.7 + 0.25,
        twinkle: Math.random() * 0.06 + 0.01
      }));
    }
    function drawGlitter() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const f of flakes) {
        f.x += f.vx; f.y += f.vy; f.alpha += (Math.random() - 0.5) * f.twinkle;
        if (f.y > window.innerHeight + 5) { f.y = -5; f.x = Math.random() * window.innerWidth; }
        if (f.x < -5) f.x = window.innerWidth + 5;
        if (f.x > window.innerWidth + 5) f.x = -5;
        ctx.globalAlpha = Math.max(0.15, Math.min(1, f.alpha));
        ctx.fillStyle = Math.random() > 0.18 ? '#ffd66e' : '#fff1c4';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        if (f.r > 1.8) {
          ctx.strokeStyle = '#fff0bd'; ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(f.x - f.r*2, f.y); ctx.lineTo(f.x + f.r*2, f.y);
          ctx.moveTo(f.x, f.y - f.r*2); ctx.lineTo(f.x, f.y + f.r*2); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(drawGlitter);
    }
    function startGlitter() {
      canvas.hidden = false;
      resizeCanvas();
      if (animationId) cancelAnimationFrame(animationId);
      drawGlitter();
    }
    openButton.addEventListener('click', async () => {
      if (opened) return;
      opened = true;
      cover.classList.remove('active');
      invite.classList.add('active');
      soundToggle.hidden = false;
      startGlitter();
      try {
        music.volume = 0.75;
        await music.play();
        soundToggle.textContent = '♫ Pause music';
      } catch (e) {
        soundToggle.textContent = '♫ Play music';
      }
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
    soundToggle.addEventListener('click', async () => {
      if (music.paused) {
        try { await music.play(); soundToggle.textContent = '♫ Pause music'; }
        catch (e) { soundToggle.textContent = '♫ Play music'; }
      } else {
        music.pause();
        soundToggle.textContent = '♫ Play music';
      }
    });
    window.addEventListener('resize', () => { if (opened) resizeCanvas(); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && animationId) cancelAnimationFrame(animationId);
      else if (opened && !document.hidden) drawGlitter();
    });
