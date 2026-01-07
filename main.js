// GTBR Canvas Landing 

(() => {
  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d", { alpha: true });

  const DPR = Math.min(2, window.devicePixelRatio || 1);

  function resize() {
    const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    canvas.width = Math.floor(vw * DPR);
    canvas.height = Math.floor(vh * DPR);
    canvas.style.width = vw + "px";
    canvas.style.height = vh + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener("resize", resize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", resize);
    window.visualViewport.addEventListener("scroll", resize);
  }
  resize();

  // ------------------------------------------------------------
  // World/layout constants (tuned to the approved mockup layout)
  // ------------------------------------------------------------
  const W = () => (window.visualViewport ? window.visualViewport.width : window.innerWidth);
  const H = () => (window.visualViewport ? window.visualViewport.height : window.innerHeight);

  // Scene framing: run sits upper-left to mid; ocean occupies lower third.
  const waterY = () => Math.round(H() * 0.62);
  const runY = () => Math.round(H() * 0.34);
  const runX0 = 0;              // world-space start of run
  const runLen = 3000;            // world-space length
  const runThickness = 36;
  const railHeight = 10;
  const grooveInset = 6;

  const ballR = 26;
  const g = 2400;                 // px/s^2 (tuned for “portfolio” pace)
  const rollDamp = 0.992;         // mild damping
  const airDamp = 0.998;

  // Camera pan: linear follow with clamp; only moves during run/flight.
  const cam = { x: 0 };
  const camMin = () => 0;
  const camMax = () => Math.max(0, (runX0 + runLen) - (W() - 780));

  // Timeline
  const state = {
    started: false,
    done: false,
    phase: "idle", // idle|drop|roll|launch|splash|fade|title
    t: 0,
    last: performance.now(),
    fade: 0,
    titleAlpha: 0
  };

  // Ball
  const ball = {
    x: runX0 + 90,
    y: runY() - 120,
    vx: 0,
    vy: 0,
    spin: 1,
    alpha: 1
  };

  // Path-progress model for roll phase (monotonic; prevents rollback/stall)
  let u = 0;           // 0..1 progress along run
  let uSpeed = 10;      // progress speed (units per second)

  // Splash particles
  const splash = {
    active: false,
    t: 100,
    x: 0,
    y: 0,
    drops: [],
    bubbles: []
  };

  // Ocean animation offsets + cached waterline position
  const ocean = {
    phase: 0,
    offset: 0,
    highlightDrift: 0,
    sheenShift: 0,
    y: waterY(),
    spray: [],
    sprayTimer: 0
  };

  const title = {
    bubbles: [],
    timer: 0,
    emitPoints: []
  };

  // ------------------------------------------------------------
  // Track curve (the “designed” run profile)
  // ------------------------------------------------------------
  // A smooth curve with a gentle dip then a long flat that ends in a ramp.
  // y = runY + profile(xNorm)*amplitude
  function profile(xn) {
    // xn: 0..1
    // Start slightly higher, dip mid, flatten, then ramp up at the end.
    const dip = 2 * Math.exp(-Math.pow((xn - 0.5) / 0.8, 2));
    const settle = 0.10 * Math.exp(-Math.pow((xn - 0.75) / 0.25, 2));
    const start = -4 * Math.exp(-Math.pow((xn - 0.10) / 0.22, 2));
    const ramp = 0 * smoothstep(0.90, .10, xn) * smoothstep(.10, 1.0, xn);
    return start + dip + settle + ramp;
  }

  function trackY(x) {
    const xn = clamp((x - runX0) / runLen, -10, 1);
    const amp = 100;
    return runY() + profile(xn) * amp;
  }

  function trackSlope(x) {
    const eps = 10.0;
    const y1 = trackY(x - eps);
    const y2 = trackY(x + eps);
    return (y2 - y1) / (2 * eps); // dy/dx
  }

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function randBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  // ------------------------------------------------------------
  // Rendering helpers (procedural illustration style)
  // ------------------------------------------------------------
  function drawBackground() {
    // The CSS already paints the gradient; we add a subtle vignette.
    ctx.save();
    const w = W(), h = H();
    const vg = ctx.createRadialGradient(w * 0.35, h * 0.42, 200, w * 0.5, h * 0.55, Math.max(w, h));
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function woodColorRamp() {
    // Warm wood palette similar to mockup
    return {
      top: "#c98a4e",
      mid: "#b87943",
      low: "#8a5631",
      edge: "#6b3f24",
      highlight: "rgba(255,240,210,0.35)"
    };
  }

  function drawWoodRun() {
    ctx.save();
    ctx.translate(-cam.x, 0);

    // Build a thick ribbon along the curve (top surface) + underside support block.
    const w = woodColorRamp();

    // Support block under the left portion (matches the mockup “plinth” feel)
    const supportW = 20;
    const supportH = 92;
    const supportX = runX0 - 24;
    const supportY = trackY(runX0 + 60) + 34;
    roundRect(ctx, supportX, supportY, supportW, supportH, 10);
    const sg = ctx.createLinearGradient(supportX, supportY, supportX, supportY + supportH);
    sg.addColorStop(0, "#5b3422");
    sg.addColorStop(1, "#3a241a");
    ctx.fillStyle = sg;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Top surface ribbon
    const topPath = new Path2D();
    const bottomPath = new Path2D();

    const steps = 220;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = runX0 + t * runLen;
      const y = trackY(x);

      const nx = 0;
      const ny = 1; // side-on, thickness goes downward in screen space

      const yTop = y;
      const yBot = y + runThickness;

      if (i === 0) {
        topPath.moveTo(x, yTop);
        bottomPath.moveTo(x, yBot);
      } else {
        topPath.lineTo(x, yTop);
        bottomPath.lineTo(x, yBot);
      }
    }

    // Close shape (bottom back to start)
    const shape = new Path2D();
    shape.addPath(topPath);
    // reverse bottom
    const steps2 = 220;
    for (let i = steps2; i >= 0; i--) {
      const t = i / steps2;
      const x = runX0 + t * runLen;
      const y = trackY(x) + runThickness;
      shape.lineTo(x, y);
    }
    shape.closePath();

    const g1 = ctx.createLinearGradient(runX0, runY() - 60, runX0, runY() + 140);
    g1.addColorStop(0, w.top);
    g1.addColorStop(0.55, w.mid);
    g1.addColorStop(1, w.low);

    ctx.fillStyle = g1;
    ctx.fill(shape);

    // Top bevel highlight
    ctx.strokeStyle = "rgba(255,240,220,0.55)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.stroke(topPath);

    // Lower edge
    ctx.strokeStyle = "rgba(20,10,5,0.35)";
    ctx.lineWidth = 3;
    ctx.stroke(bottomPath);

    // Subtle wood grain lines along the run
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    for (let i = 0; i < 28; i++) {
      const jitter = (i - 14) * 0.7;
      ctx.beginPath();
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = runX0 + t * runLen;
        const y = trackY(x) + runThickness * 0.55 + jitter * 0.6 + Math.sin((t * 6.2 + i) * 2.4) * 0.9;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = i % 3 === 0 ? "rgba(60,28,12,0.42)" : "rgba(120,70,40,0.35)";
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Rails (thin line + inner shadow to suggest groove)
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = runX0 + t * runLen;
      const y = trackY(x) + grooveInset + 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.restore();
  }

  function drawOcean(dt) {
    const y0 = waterY();
    ocean.y = y0;

    updateOcean(dt);
    drawOceanBase(y0);
    drawOceanSwells();
    drawOceanHighlights();
    drawOceanSheen();
    drawOceanSpray();
  }

  function updateOcean(dt) {
    const w = W();
    const driftPeriod = 2000;
    ocean.phase += dt * 0.9;
    ocean.offset = (ocean.offset + dt * 220) % driftPeriod;
    ocean.highlightDrift = (ocean.highlightDrift + dt * 160) % 1600;
    ocean.sheenShift = (ocean.sheenShift + dt * 110) % 1200;
    ocean.sprayTimer += dt;

    if (ocean.sprayTimer > 0.12) {
      ocean.sprayTimer -= 0.12;
      emitOceanSpray(randBetween(0, w), ocean.y + randBetween(6, 14), 2);
    }

    updateSprayParticles(dt);
  }

  function drawOceanBase(y0) {
    const w = W();
    const h = H();
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y0, w, h - y0);
    ctx.clip();

    // Deep body: static weight with a vertical depth gradient
    const grad = ctx.createLinearGradient(0, y0, 0, h);
    grad.addColorStop(0.00, "#041125");
    grad.addColorStop(0.45, "#03132f");
    grad.addColorStop(1.00, "#010309");
    ctx.fillStyle = grad;
    ctx.fillRect(0, y0, w, h - y0);

    const glows = [
      { x: w * 0.25, y: y0 + 30, r: w * 0.65, alpha: 0.12 },
      { x: w * 0.75, y: y0 + 70, r: w * 0.9, alpha: 0.08 }
    ];
    for (const glow of glows) {
      const rg = ctx.createRadialGradient(glow.x, glow.y, glow.r * 0.2, glow.x, glow.y, glow.r);
      rg.addColorStop(0, `rgba(48,92,150,${glow.alpha})`);
      rg.addColorStop(1, "rgba(2,5,12,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, y0, w, h - y0);
    }

    ctx.restore();
  }

  function drawOceanSwells() {
    const w = W();
    const pad = 220;
    const baseY = ocean.y + 12;
    const bands = [
      { offset: -6, amp: 26, secondary: 10, freq: 0.006, speed: 0.4, alpha: 0.32, depth: 20 },
      { offset: 16, amp: 20, secondary: 12, freq: 0.005, speed: 0.32, alpha: 0.26, depth: 30 },
      { offset: 30, amp: 14, secondary: 8, freq: 0.004, speed: 0.28, alpha: 0.2, depth: 42 }
    ];

    for (let i = 0; i < bands.length; i++) {
      const band = bands[i];
      const drift = ocean.offset * band.speed;
      const start = -pad;
      const end = w + pad;
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(start, baseY + band.offset + band.depth);
      for (let x = start; x <= end; x += 16) {
        const waveX = x + drift;
        const nx = waveX * band.freq + ocean.phase * 0.9 + i * 1.3;
        const y =
          baseY +
          band.offset +
          Math.sin(nx) * band.amp +
          Math.sin(nx * 0.6) * band.secondary;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(end, baseY + band.offset + band.depth + 8);
      ctx.lineTo(start, baseY + band.offset + band.depth + 8);
      ctx.closePath();
      ctx.fillStyle = `rgba(14,28,62,${band.alpha})`;
      ctx.fill();
      ctx.restore();
    }
  }

  // Specular highlights: thin, faster phase cues that reinforce sheen
  function drawOceanHighlights() {
    const w = W();
    const pad = 180;
    const start = -pad;
    const end = w + pad;
    const drift = ocean.highlightDrift;
    ctx.save();
    ctx.strokeStyle = "rgba(180,220,255,0.28)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();

    for (let x = start; x <= end; x += 8) {
      const waveX = x + drift;
      const y =
        ocean.y +
        Math.sin(waveX * 0.02 + ocean.phase * 1.6) * 2.2 +
        Math.cos(waveX * 0.012 + ocean.phase * 0.8) * 1.2 +
        4;
      if (x === start) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();

    ctx.lineWidth = 0.9;
    ctx.strokeStyle = "rgba(220,238,255,0.16)";
    ctx.beginPath();
    for (let x = start; x <= end; x += 12) {
      const waveX = x + drift * 0.6;
      const y = ocean.y + Math.sin(waveX * 0.022 + ocean.phase) * 1.6 + 5;
      if (x === start) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawOceanSheen() {
    const w = W();
    const pad = 160;
    const start = -pad;
    const end = w + pad;
    const drift = ocean.sheenShift;
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    for (let x = start; x <= end; x += 12) {
      const waveX = x + drift;
      const y = ocean.y + 3 + Math.sin(waveX * 0.016 + ocean.phase * 0.6) * 2.6;
      if (x === start) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(end, ocean.y + 24);
    ctx.lineTo(start, ocean.y + 24);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawOceanSpray() {
    if (!ocean.spray.length) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const p of ocean.spray) {
      ctx.globalAlpha = p.alpha * 0.6;
      ctx.fillStyle = "rgba(235,244,255,0.8)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r * 1.2, p.r * 0.4, p.tilt, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function updateSprayParticles(dt) {
    for (let i = ocean.spray.length - 1; i >= 0; i--) {
      const p = ocean.spray[i];
      p.life -= dt;
      if (p.life <= 0) {
        ocean.spray.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 18 * dt;
      p.alpha = clamp(p.life / p.maxLife, 0, 1);
    }
  }

  function emitOceanSpray(x, y, count = 6, spread = 60, vertical = 18, speed = 80) {
    for (let i = 0; i < count; i++) {
      const vx = (Math.random() - 0.5) * 28;
      const vy = -speed * (0.6 + Math.random() * 0.4);
      const life = 0.6 + Math.random() * 0.5;
      ocean.spray.push({
        x: x + (Math.random() - 0.5) * spread,
        y: y + Math.random() * vertical,
        vx,
        vy,
        r: 0.9 + Math.random() * 1.3,
        life,
        maxLife: life,
        tilt: randBetween(-0.35, 0.35),
        alpha: 1
      });
    }
  }

  function drawBall() {
    ctx.save();
    ctx.translate(-cam.x, 0);

    const x = ball.x;
    const y = ball.y;
    const r = ballR;
    const alpha = typeof ball.alpha === "number" ? ball.alpha : 1;
    ctx.globalAlpha = alpha;

    const yTrack = trackY(x);
    const distToTrack = Math.abs(y - (yTrack - r));
    const verticalGap = Math.max(0, y - yTrack);
    // Shadow sticks to the run while rolling, then detaches and fades as the ball lifts off.
    let shadowAlpha = 0;
    let shadowY = yTrack + 18;

    if (state.phase === "roll") {
      const closeness = clamp(1 - distToTrack / 140, 0, 1);
      shadowAlpha = closeness * 0.32;
      shadowY = yTrack + 18;
    } else if (["launch", "splash", "sink"].includes(state.phase)) {
      const falloff = clamp(1 - verticalGap / 260, 0, 1);
      shadowAlpha = falloff * 0.22;
      shadowY = yTrack + 18 + Math.min(verticalGap * 0.45, 120);
    }

    if (shadowAlpha > 0) {
      ctx.beginPath();
      ctx.ellipse(x + 12, shadowY, r * 1.1, r * 0.35, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${shadowAlpha})`;
      ctx.fill();
    }

    const speedNorm = clamp(Math.abs(ball.vx) / 980, 0, 1);
    const spinRange = r * 0.45;
    const rawOffset = ball.spin * spinRange;
    const wrappedOffset = ((rawOffset % (r * 2)) + r * 2) % (r * 2) - r;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    // Chrome gradient scrolled by spin and wrapped to avoid visible seams.
    const env = ctx.createLinearGradient(
      0,
      y - r + wrappedOffset,
      0,
      y + r + wrappedOffset
    );
    env.addColorStop(0.00, "#fdfefe");
    env.addColorStop(0.18, "#d8dee6");
    env.addColorStop(0.36, "#6c7486");
    env.addColorStop(0.52, "#0f141c");
    env.addColorStop(0.68, "#3d4956");
    env.addColorStop(0.88, "#ccd5dd");
    env.addColorStop(1.00, "#f7f9fb");
    ctx.fillStyle = env;
    ctx.fill();

    ctx.strokeStyle = `rgba(255,255,255,${0.2 + speedNorm * 0.3})`;
    ctx.lineWidth = 1.6 + speedNorm;
    ctx.stroke();

    // Horizon band keeps the chrome silhouette grounded
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.12, r * 0.95, r * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fill();

    // Clipped spec highlight for the shimmering chrome rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalAlpha = alpha * (0.65 + speedNorm * 0.12);
    ctx.beginPath();
    ctx.ellipse(
      x - r * 0.35,
      y - r * 0.45 - speedNorm * 2,
      r * 0.42,
      r * 0.27,
      -0.45,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }


  function drawSplash(dt) {
    const hasBubbles = splash.bubbles.some(b => b.life > 0);
    if (!splash.active && !hasBubbles) return;

    ctx.save();
    ctx.translate(-cam.x, 0);

    const x = splash.x;
    const y = splash.y;

    if (splash.active) {
      const life = 0.8;
      splash.t += dt;
      const p = clamp(1 - splash.t / life, 0, 1);
      const ease = p * p;

      // --- Dominant vertical plume ---
      ctx.globalAlpha = 0.9 * ease;
      ctx.beginPath();
      ctx.moveTo(x - 18, y + 4);
      ctx.quadraticCurveTo(x - 6, y - 78 * (1 - p), x, y - 96 * (1 - p));
      ctx.quadraticCurveTo(x + 6, y - 78 * (1 - p), x + 18, y + 4);
      ctx.closePath();
      ctx.fillStyle = "rgba(168, 199, 219, 0.95)";
      ctx.fill();

      // --- Crown rim ---
      ctx.globalAlpha = 0.7 * ease;
      ctx.strokeStyle = "rgba(210,235,255,0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y + 6, 28 * (1 - p), Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();

      // --- Accent droplets ---
      ctx.globalAlpha = 0.9 * ease;
      for (const d of splash.drops) {
        d.life -= dt;
        if (d.life <= 0) continue;

        d.vy += 1200 * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;

        const a = clamp(d.life / 0.6, 0, 1);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235,248,255,${a})`;
        ctx.fill();
      }

      if (splash.t > life) splash.active = false;
    }

    // --- Rising air bubbles ---
    ctx.globalAlpha = 0.5;
    for (const b of splash.bubbles) {
      if (b.life <= 0) continue;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(200,235,255,0.8)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }


  function drawGTBR() {
    const w = W(), h = H();
    if (state.titleAlpha <= 0) return;
    ctx.save();
    drawUnderwaterBackdrop();
    drawUnderwaterRays();
    drawUnderwaterSurfaceWaves();
    drawTitleBubbles();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const text = "GTBR";
    const words = ["Get", "The", "Basics", "Right"];
    const spacing = 100;
    const total = (text.length - 0) * spacing;
    const cx = w * 0.50;
    const cy = h * 0.50;
    const hold = 0.6;
    const stagger = 0.55;
    const rise = Math.max(260, h * 0.75);
    ctx.font = "300 100px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";

    for (let i = 0; i < text.length; i++) {
      const t = clamp((state.t - hold - i * stagger) / 1.5, 0, 1);
      const ease = t * t * (3 - 2 * t);
      const x = cx - total / 2 + i * spacing;
      const baseAlpha = state.titleAlpha * (t > 0 ? 0 : 1);
      if (baseAlpha > 0.01) {
        ctx.globalAlpha = baseAlpha;
        ctx.fillStyle = "rgba(230,237,247,0.92)";
        ctx.fillText(text[i], x, cy);
      }

      if (t > 0) {
        const y = cy - ease * rise;
        ctx.save();
        ctx.globalAlpha = state.titleAlpha * (0.35 + ease * 0.65);
        ctx.fillStyle = "rgba(230,237,247,0.96)";
        const letterWidth = ctx.measureText(text[i]).width;
        ctx.textAlign = "left";
        ctx.fillText(words[i], x - letterWidth / 2, y);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function drawUnderwaterBackdrop() {
    const w = W();
    const h = H();
    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "rgba(16,46,86,0.55)");
    grad.addColorStop(0.45, "rgba(6,22,46,0.75)");
    grad.addColorStop(1, "rgba(2,8,18,0.9)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const glow = ctx.createRadialGradient(w * 0.5, h * 0.18, 80, w * 0.5, h * 0.2, w * 0.7);
    glow.addColorStop(0, "rgba(90,150,210,0.18)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    const vignette = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.2, w * 0.5, h * 0.55, Math.max(w, h));
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function drawUnderwaterRays() {
    const w = W();
    const h = H();
    const t = state.t;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 4; i++) {
      const x = w * (0.15 + i * 0.22) + Math.sin(t * 0.2 + i) * 40;
      const ray = ctx.createLinearGradient(x, 0, x + 120, h);
      ray.addColorStop(0, "rgba(120,170,220,0.18)");
      ray.addColorStop(0.5, "rgba(80,130,200,0.06)");
      ray.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = ray;
      ctx.fillRect(x - 120, 0, 240, h);
    }
    ctx.restore();
  }

  function drawUnderwaterSurfaceWaves() {
    const w = W();
    const h = H();
    const y0 = h * 0.18;
    const pad = 140;
    const t = state.t;
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "rgba(110,165,220,0.25)";
    ctx.beginPath();
    ctx.moveTo(-pad, y0);
    for (let x = -pad; x <= w + pad; x += 10) {
      const nx = x * 0.02 + t * 0.6;
      const y = y0 + Math.sin(nx) * 6 + Math.sin(nx * 0.6 + t) * 3;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w + pad, y0 + 60);
    ctx.lineTo(-pad, y0 + 60);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = "rgba(190,225,255,0.22)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let x = -pad; x <= w + pad; x += 8) {
      const nx = x * 0.03 + t * 0.9;
      const y = y0 + 8 + Math.sin(nx) * 2.6 + Math.sin(nx * 0.4 + t * 0.6) * 1.4;
      if (x === -pad) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawTitleBubbles() {
    if (!title.bubbles.length) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const b of title.bubbles) {
      ctx.globalAlpha = b.alpha;
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, b.r * 1.1, b.r * 1.6, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(190,220,255,0.7)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  function applyFadeOverlay() {
    if (state.fade <= 0) return;
    ctx.save();
    ctx.globalAlpha = state.fade;
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W(), H());
    ctx.restore();
  }

  function roundRect(c, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.arcTo(x + w, y, x + w, y + h, rr);
    c.arcTo(x + w, y + h, x, y + h, rr);
    c.arcTo(x, y + h, x, y, rr);
    c.arcTo(x, y, x + w, y, rr);
    c.closePath();
  }

  // ------------------------------------------------------------
  // Motion model (deterministic “physics-ish”)
  // ------------------------------------------------------------
  function startSequence() {
    if (state.started) return;
    state.started = true;
    document.body.classList.add("started");
    state.phase = "drop";

    // Reset ball at start, above run
    ball.x = runX0 + 120;
    ball.y = trackY(ball.x) - 260;
    ball.vx = 0;
    ball.vy = 0;
    ball.spin = 0;
    ball.alpha = 1;
    u = 0;          // start of run
    uSpeed = -1;     // will be set when ball lands

    // Reset camera
    cam.x = clamp(ball.x - W() * 0, camMin(), camMax());
  }

  function resetSequence() {
    state.started = false;
    state.done = false;
    state.phase = "idle";
    state.t = 0;
    state.fade = 0;
    state.titleAlpha = 0;
    splash.active = false;
    splash.t = 100;
    splash.drops.length = 0;
    splash.bubbles.length = 0;
    title.bubbles.length = 0;
    title.timer = 0;
    title.emitPoints.length = 0;
    ball.x = runX0 + 50;
    ball.y = trackY(ball.x) - (ballR - grooveInset);
    ball.vx = 0;
    ball.vy = 0;
    ball.spin = 0;
    ball.alpha = 1;
    u = 0;
    uSpeed = 10;
    cam.x = -1;
  }

  function step(dt) {
    state.t += dt;

    if (!state.started || state.done) return;

    updateBubbles(dt);

    const yRun = trackY(ball.x) - (ballR - grooveInset);

    if (state.phase === "drop") {
      ball.vy += g * dt;
      ball.y += ball.vy * dt;

      // Land on run
      if (ball.y >= yRun) {
        ball.y = yRun;
        ball.vy = 0;
        // Start forward progress along the run (monotonic)
        uSpeed = 0.1;     // tweak 0.14–0.24 for pace
        state.phase = "roll";
      }
    }

    else if (state.phase === "roll") {
      // Monotonic progress along the run: u can increase, never decrease
      // Use slope to modulate speed (more downhill = faster), but do not allow reversal.

      const x = runX0 + u * runLen;
      const slope = trackSlope(x);

      // Convert slope into a gentle speed modulation
      // downhill (negative slope) -> increase speed; uphill -> reduce, but never reverse
      const downhillBoost = clamp((-slope) * 1.8, 0.1, 0.9); // tuned for stability
      uSpeed += downhillBoost * dt * 1.6;

      // Damping on uSpeed (keeps it from exploding)
      uSpeed *= Math.pow(0.996, dt * 60);

      // Minimum forward progress to guarantee completion (still looks like “slowing”, never stalls)
      uSpeed = Math.max(uSpeed, 0.10);

      // Advance progress (monotonic)
      u = clamp(u + uSpeed * dt, 0, 1);

      // Update ball position from u
      ball.x = runX0 + u * runLen;
      ball.y = trackY(ball.x) - (ballR - grooveInset);

      // Derive a forward x-velocity for launch + spin (approx)
      ball.vx = uSpeed * runLen; // px/s
      ball.spin += (ball.vx / (ballR * 2.2)) * dt;

      // End of run -> launch
      const endU = (runLen - 36) / runLen;
      if (u >= endU) {
        u = endU;
        ball.x = runX0 + u * runLen;

        const s = trackSlope(ball.x);
        const ang = Math.atan2(s * 0.9, 1);
        const speed = Math.max(520, Math.min(980, Math.abs(ball.vx) + 520));

        ball.vx = Math.cos(ang) * speed;
        ball.vy = Math.sin(ang) * speed * 0.85 - 180;
        state.phase = "launch";
      }
    }

    else if (state.phase === "launch") {
      ball.vy += g * dt;
      ball.vx *= Math.pow(airDamp, dt * 60);
      ball.vy *= Math.pow(airDamp, dt * 60);
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      // impact water
      if (ball.y >= waterY() + 18) {
        ball.y = waterY() + 18;
        ball.vx *= 0.35;      // water drag
        ball.vy = 120;        // downward entry velocity
        triggerSplash(ball.x, waterY() + 10);
        spawnBubbles(ball.x, waterY() + 18);
        state.phase = "splash";
        state.t = 0;
      }
    }

    else if (state.phase === "splash") {
      if (state.t > 0.5) {
        state.phase = "sink";
        state.t = 0;
        ball.alpha = 1;
      }
    }

    else if (state.phase === "sink") {
      ball.vy += 280 * dt;
      ball.vx *= 0.92;
      ball.y += ball.vy * dt;
      ball.x += ball.vx * dt;

      ball.alpha = clamp(1 - state.t / 1.4, 0, 1);

      if (state.t > 1.4) {
        state.phase = "fade";
        state.t = 0;
      }
    }

    else if (state.phase === "fade") {
      state.fade = clamp(state.fade + dt * 1.25, 0, 1);
      if (state.fade >= 1) {
        state.phase = "title";
        state.t = 0;
        title.bubbles.length = 0;
        title.timer = 0;
        title.emitPoints.length = 0;
      }
    }

    else if (state.phase === "title") {
      state.titleAlpha = clamp(state.titleAlpha + dt * 1.4, 0, 1);
      updateTitleEmitPoints();
      updateTitleBubbles(dt);
      if (state.t > 5.0) {
        state.done = true;
      }
    }

    // Camera follow: linear, restrained, only during roll/launch
    if (state.phase === "roll" || state.phase === "launch") {
      const target = clamp(ball.x - W() * 0.28, camMin(), camMax());
      // linear-ish follow (no cinematic easing)
      cam.x += (target - cam.x) * clamp(dt * 3.2, 0, 1);
    }
  }

  function triggerSplash(x, y) {
    splash.active = true;
    splash.t = 0;
    splash.x = x;
    splash.y = y;
    splash.drops.length = 0;

    const forwardBias = ball.vx * 0.25;
    const n = 8;
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (0.25 + 0.5 * (i / (n - 1)));
      const sp = 380 + Math.random() * 220;
      splash.drops.push({
        x,
        y,
        vx: Math.cos(a) * sp + forwardBias,
        vy: -Math.sin(a) * sp - 240,
        life: 0.45 + Math.random() * 0.15,
        r: 2 + Math.random() * 1.5
      });
    }

    const splashX = x - cam.x;
    emitOceanSpray(splashX, ocean.y + 6, 18, 64, 28, 150);
  }

  function spawnBubbles(x, y) {
    splash.bubbles.length = 0;

    const n = 14;
    for (let i = 0; i < n; i++) {
      splash.bubbles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + Math.random() * 8,
        r: 2 + Math.random() * 2,
        vy: -40 - Math.random() * 40,
        life: 0.8 + Math.random() * 0.4
      });
    }
  }

  function updateBubbles(dt) {
    for (const b of splash.bubbles) {
      if (b.life <= 0) continue;
      b.life -= dt;
      b.y += b.vy * dt;
    }
  }

  function updateTitleEmitPoints() {
    const w = W(), h = H();
    const text = "GTBR";
    const words = ["Get", "The", "Basics", "Right"];
    const spacing = 100;
    const total = (text.length - 0) * spacing;
    const cx = w * 0.50;
    const cy = h * 0.50;
    const hold = 0.6;
    const stagger = 0.55;
    const rise = Math.max(260, h * 0.75);
    title.emitPoints.length = 0;

    ctx.save();
    ctx.font = "300 100px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    for (let i = 0; i < text.length; i++) {
      const t = clamp((state.t - hold - i * stagger) / 1.5, 0, 1);
      if (t <= 0) continue;
      const ease = t * t * (3 - 2 * t);
      const x = cx - total / 2 + i * spacing;
      const y = cy - ease * rise;
      const letterWidth = ctx.measureText(text[i]).width;
      const wordWidth = ctx.measureText(words[i]).width;
      const center = x - letterWidth / 2 + wordWidth / 2;
      title.emitPoints.push({ x: center, y });
    }
    ctx.restore();
  }

  function updateTitleBubbles(dt) {
    const w = W();
    const h = H();
    title.timer += dt;
    if (title.timer > 0.04) {
      title.timer -= 0.04;
      const life = 1.4 + Math.random() * 0.8;
      title.bubbles.push({
        x: Math.random() * w,
        y: h + 20 + Math.random() * 40,
        r: 2 + Math.random() * 2.5,
        vy: -30 - Math.random() * 40,
        life,
        maxLife: life,
        alpha: 0.4 + Math.random() * 0.3
      });
    }
    for (const point of title.emitPoints) {
      if (Math.random() < dt * 18) {
        const life = 1.0 + Math.random() * 0.8;
        title.bubbles.push({
          x: point.x + (Math.random() - 0.5) * 100,
          y: point.y + 26 + Math.random() * 24,
          r: 1.6 + Math.random() * 2.4,
          vy: -36 - Math.random() * 46,
          life,
          maxLife: life,
          alpha: 0.55 + Math.random() * 0.3
        });
      }
    }
    for (let i = title.bubbles.length - 1; i >= 0; i--) {
      const b = title.bubbles[i];
      b.life -= dt;
      if (b.life <= 0 || b.y < -40) {
        title.bubbles.splice(i, 1);
        continue;
      }
      b.y += b.vy * dt;
      b.x += (Math.sin(b.y * 0.02) * 6 + (Math.random() - 0.5) * 4) * dt;
      b.alpha = clamp(b.life / b.maxLife, 0, 1) * 0.7;
    }
  }

  // ------------------------------------------------------------
  // Main loop
  // ------------------------------------------------------------
  function render(dt) {
    ctx.clearRect(0, 0, W(), H());

    // base background handled by CSS; add vignette layer
    drawBackground();

    // ocean sits beneath the timber run
    drawOcean(dt);
    drawWoodRun();

    // ball and splash
    if (!state.done) {
      drawBall();
      drawSplash(dt);
    }

    // fade + title
    applyFadeOverlay();
    drawGTBR();
  }

  function tick(now) {
    const dt = Math.min(0.033, (now - state.last) / 1000);
    state.last = now;

    // Ocean motion handled during drawOcean

    // Step simulation
    step(dt);

    // Keep ball “parked” in idle state (at start on run)
    if (!state.started) {
      ball.x = runX0 + 50;
      ball.y = trackY(ball.x) - (ballR - grooveInset);
      cam.x = -1;
    }

    render(dt);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Interaction
  canvas.addEventListener("pointerdown", () => {
    if (state.done) {
      resetSequence();
      return;
    }
    startSequence();
  }, { passive: true });

})();
