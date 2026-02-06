const siteHeader = document.querySelector('.site-header');
const reveals = Array.from(document.querySelectorAll('.reveal'));
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const yearEl = document.getElementById('year');
const orbCanvas = document.getElementById('hero-orb-canvas');
const principleButtons = Array.from(document.querySelectorAll('.hero-principle'));
const canObserve = typeof window !== 'undefined' && 'IntersectionObserver' in window;
const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const updateHeaderState = () => {
  if (!siteHeader) {
    return;
  }
  siteHeader.classList.toggle('is-solid', window.scrollY > 44);
};

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

if (!canObserve) {
  reveals.forEach((el) => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    {
      threshold: 0.06,
      rootMargin: '0px 0px -6% 0px'
    }
  );

  reveals.forEach((el, idx) => {
    el.style.transitionDelay = `${Math.min(idx * 35, 260)}ms`;
    revealObserver.observe(el);
  });

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('is-current', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { threshold: 0.45 }
  );

  navSections.forEach((section) => navObserver.observe(section));
}

if (orbCanvas) {
  const ctx = orbCanvas.getContext('2d');
  if (ctx) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const NODE_COUNT = 1200;
    const AMBIENT_COUNT = 260;
    const RING_COUNT = 90;
    const NEIGHBORS_PER_NODE = 5;

    const principles = [
      { id: 'clarity', color: '#63f5ff', direction: { x: -0.58, y: 0.33, z: 0.74 } },
      { id: 'consistency', color: '#4f8dff', direction: { x: 0.5, y: 0.35, z: 0.72 } },
      { id: 'quality', color: '#9f7bff', direction: { x: -0.45, y: -0.35, z: 0.82 } },
      { id: 'simplicity', color: '#59e0a8', direction: { x: 0.38, y: -0.5, z: 0.78 } },
      { id: 'logic', color: '#ff9b5f', direction: { x: -0.06, y: 0.86, z: 0.5 } }
    ];

    let width = 0;
    let height = 0;
    let radius = 0;
    let start = performance.now();
    let rafId = 0;
    let rotationX = 0.36;
    let rotationY = 0.48;
    let targetX = rotationX;
    let targetY = rotationY;
    let activePrincipleId = null;
    let pinnedPrincipleId = null;
    let lastFrameMs = start;

    const nodes = [];
    const edges = [];
    const ambient = [];
    const rings = [];
    let receptorEnergy = new Float32Array(0);
    const pathways = principles.map((p) => ({
      ...p,
      nodeIndices: new Set(),
      edgeIndices: [],
      focus: { x: 0, y: 0, z: 1 },
      emitAccumulator: 0
    }));
    const pathwaySignals = new Map(pathways.map((path) => [path.id, []]));

    const rand = (a, b) => a + Math.random() * (b - a);

    const seededNoise = (i, salt) => {
      const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    const normalize = (v) => {
      const len = Math.hypot(v.x, v.y, v.z) || 1;
      return { x: v.x / len, y: v.y / len, z: v.z / len };
    };

    const toRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const rotatePoint = (x, y, z, ax, ay) => {
      const cosy = Math.cos(ay);
      const siny = Math.sin(ay);
      const nx = x * cosy - z * siny;
      const nz = x * siny + z * cosy;

      const cosx = Math.cos(ax);
      const sinx = Math.sin(ax);
      const ny = y * cosx - nz * sinx;
      const zz = y * sinx + nz * cosx;

      return { x: nx, y: ny, z: zz };
    };

    const project = (p) => {
      const depth = radius * 3.9;
      const scale = depth / (depth - p.z);
      return {
        x: p.x * scale + width * 0.5,
        y: p.y * scale + height * 0.5,
        z: p.z,
        s: scale
      };
    };

    const createBrainNode = (i) => {
      const t = (i + 0.5) / NODE_COUNT;
      const inc = Math.PI * (3 - Math.sqrt(5));
      const y0 = 1 - 2 * t;
      const r0 = Math.sqrt(Math.max(0, 1 - y0 * y0));
      const phi = i * inc;

      let x = Math.cos(phi) * r0;
      let y = y0;
      let z = Math.sin(phi) * r0;

      const wrinkleA = Math.sin(phi * 3.7 + y * 4.8) * 0.07;
      const wrinkleB = Math.sin(phi * 9.6 - y * 3.1) * 0.035;
      const lobeSpread = 1.12 + 0.18 * (1 - y * y);
      const frontBulge = 1 + Math.max(0, z) * 0.22;
      const lowerFlatten = 1 - Math.max(0, -y) * 0.14;

      x *= lobeSpread;
      y *= 1.06 * lowerFlatten;
      z *= 0.83 * frontBulge;

      const fissure = Math.exp(-(x * x) / 0.025) * (0.32 + Math.max(0, z) * 0.14);
      if (Math.abs(x) < 0.09 && z > -0.2) {
        x += x >= 0 ? fissure : -fissure;
      }

      const shell = 0.82 + seededNoise(i, 0.71) * 0.16 + wrinkleA + wrinkleB;
      return {
        x: x * shell,
        y: y * shell,
        z: z * shell,
        cortical: Math.abs(wrinkleA) + Math.abs(wrinkleB)
      };
    };

    const initNodes = () => {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i += 1) {
        const node = createBrainNode(i);
        const nearFissure = Math.abs(node.x) < 0.075 && node.z > -0.18;
        if (nearFissure && Math.random() < 0.62) {
          continue;
        }
        nodes.push(node);
      }
      receptorEnergy = new Float32Array(nodes.length);
    };

    const initAmbient = () => {
      ambient.length = 0;
      for (let i = 0; i < AMBIENT_COUNT; i += 1) {
        ambient.push({
          x: rand(0.05, 0.95),
          y: rand(0.08, 0.95),
          r: rand(0.4, 1.8),
          a: rand(0.12, 0.65)
        });
      }
    };

    const initRings = () => {
      rings.length = 0;
      for (let i = 0; i < RING_COUNT; i += 1) {
        rings.push({
          scale: rand(0.72, 1.12),
          tilt: rand(-0.8, 0.8),
          speed: rand(0.06, 0.16),
          seed: rand(0, Math.PI * 2)
        });
      }
    };

    const initEdges = () => {
      edges.length = 0;
      const seen = new Set();
      for (let i = 0; i < nodes.length; i += 1) {
        const nearest = [];
        for (let j = 0; j < nodes.length; j += 1) {
          if (i === j) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dz = nodes[i].z - nodes[j].z;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 > 0.112) continue;

          if (nearest.length < NEIGHBORS_PER_NODE) {
            nearest.push({ j, d2 });
            nearest.sort((a, b) => a.d2 - b.d2);
          } else if (d2 < nearest[nearest.length - 1].d2) {
            nearest[nearest.length - 1] = { j, d2 };
            nearest.sort((a, b) => a.d2 - b.d2);
          }
        }

        nearest.forEach((n) => {
          const a = Math.min(i, n.j);
          const b = Math.max(i, n.j);
          const key = `${a}:${b}`;
          if (!seen.has(key)) {
            seen.add(key);
            edges.push({ a, b, d2: n.d2 });
          }
        });
      }
    };

    const initPathways = () => {
      pathways.forEach((path, pathIndex) => {
        path.nodeIndices.clear();
        path.edgeIndices.length = 0;
        path.emitAccumulator = rand(0, 1);
        const signals = pathwaySignals.get(path.id);
        if (signals) {
          signals.length = 0;
        }

        const dir = normalize(path.direction);
        let fx = 0;
        let fy = 0;
        let fz = 0;

        nodes.forEach((node, i) => {
          const dot = node.x * dir.x + node.y * dir.y + node.z * dir.z;
          const ridge = node.cortical;
          const noise = seededNoise(i, 0.33 + pathIndex);
          const strength = dot * 0.87 + ridge * 0.42 + noise * 0.24;
          if (strength > 0.54 || (dot > 0.44 && ridge > 0.05 && noise > 0.48)) {
            path.nodeIndices.add(i);
            fx += node.x;
            fy += node.y;
            fz += node.z;
          }
        });

        edges.forEach((edge, index) => {
          if (path.nodeIndices.has(edge.a) && path.nodeIndices.has(edge.b)) {
            path.edgeIndices.push(index);
          }
        });

        if (path.nodeIndices.size > 0) {
          path.focus = normalize({ x: fx, y: fy, z: fz });
        }
      });
    };

    const spawnSignal = (path) => {
      if (path.edgeIndices.length === 0) {
        return;
      }
      const edgeIndex = path.edgeIndices[Math.floor(Math.random() * path.edgeIndices.length)];
      const signals = pathwaySignals.get(path.id);
      if (!signals) {
        return;
      }
      signals.push({
        edgeIndex,
        progress: Math.random() * 0.2,
        speed: rand(0.55, 1.5),
        life: rand(0.7, 1.55),
        size: rand(1.4, 2.8)
      });
    };

    const setActivePrinciple = (id, pinned = false) => {
      activePrincipleId = id;
      if (pinned) {
        pinnedPrincipleId = id;
      }

      principleButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.principle === activePrincipleId);
      });

      const pathway = pathways.find((p) => p.id === activePrincipleId);
      if (pathway) {
        targetY = Math.atan2(pathway.focus.x, pathway.focus.z);
        targetX = -Math.asin(Math.max(-1, Math.min(1, pathway.focus.y))) * 0.9;
      }

      if (prefersReducedMotion) {
        drawFrame(performance.now());
      }
    };

    const clearActiveIfNotPinned = () => {
      if (pinnedPrincipleId) {
        return;
      }
      activePrincipleId = null;
      principleButtons.forEach((button) => button.classList.remove('is-active'));
      if (prefersReducedMotion) {
        drawFrame(performance.now());
      }
    };

    principleButtons.forEach((button) => {
      const id = button.dataset.principle;
      button.addEventListener('mouseenter', () => {
        pinnedPrincipleId = null;
        setActivePrinciple(id);
      });
      button.addEventListener('mouseleave', clearActiveIfNotPinned);
      button.addEventListener('focus', () => setActivePrinciple(id));
      button.addEventListener('blur', clearActiveIfNotPinned);
      button.addEventListener('click', () => {
        if (pinnedPrincipleId === id) {
          pinnedPrincipleId = null;
          clearActiveIfNotPinned();
          return;
        }
        setActivePrinciple(id, true);
      });
    });

    const resize = () => {
      const rect = orbCanvas.getBoundingClientRect();
      width = Math.max(10, Math.floor(rect.width));
      height = Math.max(10, Math.floor(rect.height));
      orbCanvas.width = Math.floor(width * dpr);
      orbCanvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width, height) * 0.34;
      if (prefersReducedMotion) {
        drawFrame(performance.now());
      }
    };

    const drawFrame = (timeMs) => {
      const dt = Math.min(0.05, Math.max(0.001, (timeMs - lastFrameMs) * 0.001));
      lastFrameMs = timeMs;
      const t = (timeMs - start) * 0.001;
      ctx.clearRect(0, 0, width, height);

      if (!activePrincipleId && !pinnedPrincipleId) {
        targetY = prefersReducedMotion ? 0.48 : 0.46 + Math.sin(t * 0.18) * 0.6;
        targetX = prefersReducedMotion ? 0.34 : 0.34 + Math.sin(t * 0.14) * 0.11;
      }

      rotationX += (targetX - rotationX) * 0.05;
      rotationY += (targetY - rotationY) * 0.05;

      const bgGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        radius * 0.12,
        width * 0.5,
        height * 0.5,
        radius * 1.86
      );
      bgGlow.addColorStop(0, 'rgba(18, 54, 138, 0.34)');
      bgGlow.addColorStop(0.55, 'rgba(10, 26, 66, 0.2)');
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      for (const p of ambient) {
        ctx.globalAlpha = p.a;
        ctx.fillStyle = '#74c8ff';
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const rotated = nodes.map((node) => {
        const raw = rotatePoint(node.x * radius, node.y * radius, node.z * radius, rotationX, rotationY);
        return { raw, p: project(raw), cortical: node.cortical };
      });

      if (!prefersReducedMotion) {
        for (let i = 0; i < receptorEnergy.length; i += 1) {
          receptorEnergy[i] *= Math.max(0.0, 1 - dt * 2.4);
        }
      }

      const silhouette = ctx.createRadialGradient(width * 0.5, height * 0.52, radius * 0.3, width * 0.5, height * 0.52, radius * 1.08);
      silhouette.addColorStop(0, 'rgba(6, 16, 40, 0.08)');
      silhouette.addColorStop(1, 'rgba(3, 6, 12, 0.58)');
      ctx.fillStyle = silhouette;
      ctx.beginPath();
      ctx.ellipse(width * 0.5, height * 0.52, radius * 1.12, radius * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();

      edges.forEach((edge) => {
        const a = rotated[edge.a].p;
        const b = rotated[edge.b].p;
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > radius * 0.22) return;
        const buzz = prefersReducedMotion ? 0.6 : 0.45 + Math.sin(t * 16 + edge.a * 0.07 + edge.b * 0.11) * 0.35;
        const alpha = (1 - dist / (radius * 0.22)) * (0.03 + Math.max(0, buzz) * 0.09);
        if (alpha < 0.02) return;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(78, 170, 255, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.55 + Math.max(0, buzz) * 0.22;
        ctx.stroke();

        if (!prefersReducedMotion && buzz > 0.72) {
          const sparkT = 0.45 + Math.sin(t * 9 + edge.a * 0.23 + edge.b * 0.17) * 0.1;
          const sx = a.x + (b.x - a.x) * sparkT;
          const sy = a.y + (b.y - a.y) * sparkT;
          ctx.beginPath();
          ctx.arc(sx, sy, 0.7 + buzz * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(132, 208, 255, ${(0.08 + (buzz - 0.7) * 0.2).toFixed(3)})`;
          ctx.fill();
        }
      });

      pathways.forEach((path) => {
        const isActive = activePrincipleId === path.id || pinnedPrincipleId === path.id;
        const emphasis = activePrincipleId || pinnedPrincipleId ? (isActive ? 1 : 0.2) : 0.6;
        const baseAlpha = 0.028 + emphasis * 0.16;
        const pulseRate = isActive ? 12 : (activePrincipleId || pinnedPrincipleId ? 2.2 : 5.2);

        if (!prefersReducedMotion) {
          path.emitAccumulator += dt * pulseRate;
          while (path.emitAccumulator >= 1) {
            spawnSignal(path);
            path.emitAccumulator -= 1;
          }
        }

        path.edgeIndices.forEach((edgeIndex) => {
          const edge = edges[edgeIndex];
          const a = rotated[edge.a].p;
          const b = rotated[edge.b].p;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > radius * 0.3) return;
          const wave = prefersReducedMotion ? 0.7 : 0.45 + Math.sin(t * 9.4 + edgeIndex * 0.27) * 0.33;
          const alpha = (1 - dist / (radius * 0.3)) * baseAlpha * wave;
          if (alpha < 0.02) return;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = toRgba(path.color, alpha.toFixed(3));
          ctx.lineWidth = isActive ? 1.18 : 0.82;
          ctx.stroke();
        });
      });

      pathways.forEach((path) => {
        const signals = pathwaySignals.get(path.id);
        if (!signals || signals.length === 0) {
          return;
        }
        const isActive = activePrincipleId === path.id || pinnedPrincipleId === path.id;
        const visibility = activePrincipleId || pinnedPrincipleId ? (isActive ? 1 : 0.3) : 0.72;

        for (let i = signals.length - 1; i >= 0; i -= 1) {
          const signal = signals[i];
          const edge = edges[signal.edgeIndex];
          const a = rotated[edge.a].p;
          const b = rotated[edge.b].p;

          signal.progress += dt * signal.speed;
          signal.life -= dt;

          if (signal.life <= 0 || signal.progress >= 1.08) {
            signals.splice(i, 1);
            continue;
          }

          const p = Math.max(0, Math.min(1, signal.progress));
          const x = a.x + (b.x - a.x) * p;
          const y = a.y + (b.y - a.y) * p;

          if (!prefersReducedMotion) {
            const nearSource = Math.max(0, 0.12 - p) / 0.12;
            const nearTarget = Math.max(0, p - 0.88) / 0.12;
            receptorEnergy[edge.a] = Math.min(1.15, receptorEnergy[edge.a] + nearSource * 0.34);
            receptorEnergy[edge.b] = Math.min(1.15, receptorEnergy[edge.b] + nearTarget * 0.34);
          }

          const trailP = Math.max(0, p - 0.08);
          const trailX = a.x + (b.x - a.x) * trailP;
          const trailY = a.y + (b.y - a.y) * trailP;
          ctx.beginPath();
          ctx.moveTo(trailX, trailY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = toRgba(path.color, (0.2 + visibility * 0.42).toFixed(3));
          ctx.lineWidth = 1.2 + visibility * 0.9;
          ctx.stroke();

          const glowRadius = signal.size + visibility * 1.4;
          const dotGlow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius * 2.5);
          dotGlow.addColorStop(0, toRgba(path.color, (0.85 * visibility).toFixed(3)));
          dotGlow.addColorStop(1, toRgba(path.color, '0'));
          ctx.fillStyle = dotGlow;
          ctx.beginPath();
          ctx.arc(x, y, glowRadius * 2.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = toRgba(path.color, (0.45 + visibility * 0.5).toFixed(3));
          ctx.beginPath();
          ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      rotated.forEach((node, i) => {
        const p = node.p;
        const depth = (node.raw.z + radius) / (radius * 2);
        const corticalGlow = node.cortical * 1.6;
        const receptor = receptorEnergy[i] || 0;
        const receptorFlicker = prefersReducedMotion ? 0 : (0.5 + Math.sin(t * 8 + i * 0.11) * 0.5) * receptor;
        let pointColor = 'rgba(132, 188, 255, 0.4)';
        let boost = 0;

        pathways.forEach((path) => {
          if (!path.nodeIndices.has(i)) return;
          const isActive = activePrincipleId === path.id || pinnedPrincipleId === path.id;
          const gain = activePrincipleId || pinnedPrincipleId ? (isActive ? 0.9 : 0.2) : 0.52;
          boost = Math.max(boost, gain);
          pointColor = isActive ? toRgba(path.color, (0.22 + gain * 0.68).toFixed(3)) : pointColor;
        });

        const size = 0.56 + p.s * 0.52 + corticalGlow + boost * 0.7 + receptorFlicker * 1.1;
        const alpha = Math.min(0.98, 0.11 + depth * 0.38 + boost * 0.34 + corticalGlow * 0.2 + receptorFlicker * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        if (pointColor.startsWith('rgba')) {
          ctx.fillStyle = pointColor;
        } else {
          ctx.fillStyle = toRgba(pointColor, alpha.toFixed(3));
        }
        ctx.fill();

        if (receptorFlicker > 0.08) {
          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3.2);
          halo.addColorStop(0, `rgba(192, 228, 255, ${(0.32 + receptorFlicker * 0.2).toFixed(3)})`);
          halo.addColorStop(1, 'rgba(192, 228, 255, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      const fissureGradient = ctx.createLinearGradient(width * 0.5, height * 0.18, width * 0.5, height * 0.84);
      fissureGradient.addColorStop(0, 'rgba(134, 193, 255, 0.04)');
      fissureGradient.addColorStop(0.45, 'rgba(70, 130, 200, 0.2)');
      fissureGradient.addColorStop(1, 'rgba(18, 34, 58, 0.08)');
      ctx.strokeStyle = fissureGradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, height * 0.2);
      ctx.lineTo(width * 0.5, height * 0.82);
      ctx.stroke();

      for (let i = 0; i < rings.length; i += 1) {
        const ring = rings[i];
        const wobble = prefersReducedMotion ? 0 : Math.sin(t * ring.speed + ring.seed) * 0.03;
        const rx = radius * (ring.scale + wobble);
        const ry = radius * 0.29 * (ring.scale + wobble * 0.6);
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.53, rx, ry, ring.tilt + rotationY * 0.22, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 ? 'rgba(98, 174, 255, 0.05)' : 'rgba(122, 236, 230, 0.04)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    };

    const loop = (now) => {
      drawFrame(now);
      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(loop);
      }
    };

    initNodes();
    initAmbient();
    initRings();
    initEdges();
    initPathways();
    resize();

    setActivePrinciple('logic');

    drawFrame(start);
    if (!prefersReducedMotion) {
      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('beforeunload', () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    });
  }
}
