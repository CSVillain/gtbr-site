const siteHeader = document.querySelector('.site-header');
const reveals = Array.from(document.querySelectorAll('.reveal'));
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const yearEl = document.getElementById('year');
const orbCanvas = document.getElementById('hero-orb-canvas');
const principleTabs = Array.from(document.querySelectorAll('.principle-tab'));
const principlePanel = document.querySelector('.principle-panel');
const principlePanelTitle = document.getElementById('principle-panel-title');
const principlePanelSummary = document.getElementById('principle-panel-summary');
const principlePanelList = document.getElementById('principle-panel-list');
const principlesSection = document.getElementById('architecture');
const heroFinalWord = document.getElementById('hero-final-word');
const canObserve = typeof window !== 'undefined' && 'IntersectionObserver' in window;
const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

const getHeaderOffset = () => {
  if (!siteHeader) {
    return 0;
  }
  return Math.ceil(siteHeader.getBoundingClientRect().height) + 8;
};

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const pickRandomWords = (pool, count) => {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
};

const animateHeroFinalWord = async () => {
  if (!heroFinalWord) {
    return;
  }

  if (prefersReducedMotion) {
    heroFinalWord.textContent = 'right';
    heroFinalWord.classList.remove('is-wrong', 'is-fading');
    heroFinalWord.classList.add('is-correct');
    return;
  }

  const incorrectPool = [
    'wrong',
    'rough',
    'messy',
    'random',
    'static',
    'broken',
    'rushed',
    'blurry',
    'chaos',
    'noisy',
    'flawed',
    'shaky'
  ];

  const sequence = [...pickRandomWords(incorrectPool, 3), 'right'];

  for (let i = 0; i < sequence.length; i += 1) {
    const word = sequence[i];
    const isFinal = i === sequence.length - 1;
    heroFinalWord.classList.remove('is-wrong', 'is-fading', 'is-correct', 'is-flaring');
    heroFinalWord.textContent = '';

    for (let c = 0; c < word.length; c += 1) {
      heroFinalWord.textContent += word[c];
      await sleep(84);
    }

    if (isFinal) {
      heroFinalWord.classList.add('is-correct');
      if (!prefersReducedMotion) {
        heroFinalWord.classList.add('is-flaring');
        window.setTimeout(() => {
          heroFinalWord.classList.remove('is-flaring');
        }, 760);
      }
      return;
    }

    heroFinalWord.classList.add('is-wrong');
    await sleep(440);
    heroFinalWord.classList.add('is-fading');
    await sleep(300);
  }
};

void animateHeroFinalWord();

const defaultPrincipleId = 'logic';
let principlesInView = false;

const renderPrinciplePanel = (id) => {
  if (!principlePanel || !principlePanelTitle || !principlePanelSummary || !principlePanelList) {
    return;
  }
  const sourceButton = principleTabs.find((button) => button.dataset.principle === id);
  if (!sourceButton) {
    return;
  }
  const titleText = sourceButton.textContent ? sourceButton.textContent.trim() : id;
  const summaryText = sourceButton.dataset.summary || '';
  const bulletText = sourceButton.dataset.bullets || '';
  const bullets = bulletText.split('|').map((item) => item.trim()).filter(Boolean);

  principlePanel.dataset.principle = id;
  principlePanelTitle.textContent = titleText;
  principlePanelSummary.textContent = summaryText;
  principlePanelList.innerHTML = bullets.map((item) => `<li>${item}</li>`).join('');
};

const updateHeaderState = () => {
  if (!siteHeader) {
    return;
  }
  siteHeader.classList.toggle('is-solid', window.scrollY > 44);
};

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) {
      return;
    }
    const target = document.querySelector(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });

    if (history.replaceState) {
      history.replaceState(null, '', href);
    }
  });
});

if (!canObserve) {
  reveals.forEach((el) => el.classList.add('is-visible'));
  principlesInView = Boolean(principlesSection);
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
    {
      threshold: 0.4,
      rootMargin: `-${getHeaderOffset()}px 0px -52% 0px`
    }
  );

  navSections.forEach((section) => navObserver.observe(section));

  if (principlesSection) {
    const principlesObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          principlesInView = entry.isIntersecting;
        });
      },
      {
        threshold: 0.22,
        rootMargin: '-14% 0px -24% 0px'
      }
    );
    principlesObserver.observe(principlesSection);
  }
}

if (orbCanvas) {
  const ctx = orbCanvas.getContext('2d');
  if (ctx) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const getNetworkProfile = (viewportWidth) => {
      if (prefersReducedMotion) {
        return {
          nodeCount: viewportWidth < 700 ? 540 : 760,
          ambientCount: viewportWidth < 700 ? 90 : 130,
          ringCount: viewportWidth < 700 ? 24 : 36,
          neighborsPerNode: 4,
          ambientRate: 0
        };
      }
      if (viewportWidth < 700) {
        return {
          nodeCount: 900,
          ambientCount: 160,
          ringCount: 40,
          neighborsPerNode: 4,
          ambientRate: 5.5
        };
      }
      if (viewportWidth < 1100) {
        return {
          nodeCount: 1180,
          ambientCount: 210,
          ringCount: 62,
          neighborsPerNode: 5,
          ambientRate: 8.2
        };
      }
      return {
        nodeCount: 1450,
        ambientCount: 260,
        ringCount: 90,
        neighborsPerNode: 5,
        ambientRate: 10
      };
    };
    let profile = getNetworkProfile(window.innerWidth);
    let NODE_COUNT = profile.nodeCount;
    let AMBIENT_COUNT = profile.ambientCount;
    let RING_COUNT = profile.ringCount;
    let NEIGHBORS_PER_NODE = profile.neighborsPerNode;

    const principles = [
      { id: 'logic', color: '#ffd166', direction: { x: -0.06, y: 0.86, z: 0.5 } },
      { id: 'clarity', color: '#4dd2ff', direction: { x: -0.58, y: 0.33, z: 0.74 } },
      { id: 'scale', color: '#7c5cff', direction: { x: 0.5, y: 0.35, z: 0.72 } },
      { id: 'growth', color: '#ff5fc7', direction: { x: -0.45, y: -0.35, z: 0.82 } },
      { id: 'value', color: '#39e39a', direction: { x: 0.38, y: -0.5, z: 0.78 } },
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
    let focusStrength = 0;
    let activePrincipleId = null;
    let pinnedPrincipleId = null;
    let selectedPrincipleId = defaultPrincipleId;
    let lastFrameMs = start;
    let ambientEmitAccumulator = 0;

    const nodes = [];
    const edges = [];
    const ambient = [];
    const rings = [];
    const ambientSignals = [];
    let receptorEnergy = new Float32Array(0);
    let synapseFlareEnergy = new Float32Array(0);
    const pathways = principles.map((p) => ({
      ...p,
      nodeIndices: new Set(),
      edgeIndices: [],
      focus: { x: 0, y: 0, z: 1 },
      emitAccumulator: 0,
      energy: 0.46,
      targetEnergy: 0.46,
      burstCooldown: 0
    }));
    const pathwaySignals = new Map(pathways.map((path) => [path.id, []]));

    const getEffectiveFocusPrincipleId = () => (
      principlesInView ? selectedPrincipleId : null
    );

    const updatePrincipleTabState = () => {
      principleTabs.forEach((tab) => {
        const isSelected = tab.dataset.principle === selectedPrincipleId;
        tab.classList.toggle('is-active', isSelected);
        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        tab.setAttribute('tabindex', isSelected ? '0' : '-1');
      });
    };

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

    const pseudoNoise = (seedA, seedB) => {
      const n = Math.sin(seedA * 127.1 + seedB * 311.7) * 43758.5453;
      return n - Math.floor(n);
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
      synapseFlareEnergy = new Float32Array(nodes.length);
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
        speed: rand(0.45, 1.2 + path.energy * 0.9),
        life: rand(0.65, 1.25 + path.energy * 0.75),
        size: rand(1, 2 + path.energy * 1.15),
        seed: Math.random() * 1000,
        jitterAmp: rand(0.3, 1.1),
        polarity: Math.random() > 0.5 ? 1 : -1
      });
    };

    const spawnAmbientSignal = () => {
      if (edges.length === 0) {
        return;
      }
      const edgeIndex = Math.floor(Math.random() * edges.length);
      ambientSignals.push({
        edgeIndex,
        progress: Math.random() * 0.35,
        speed: rand(0.2, 0.52),
        life: rand(0.7, 1.45),
        size: rand(0.7, 1.4),
        seed: Math.random() * 1000,
        jitterAmp: rand(0.2, 0.7)
      });
    };

    const setActivePrinciple = (id, pinned = false) => {
      selectedPrincipleId = id;
      activePrincipleId = id;
      if (pinned) {
        pinnedPrincipleId = id;
      } else {
        pinnedPrincipleId = id;
      }
      renderPrinciplePanel(id);
      if (principlePanel) {
        principlePanel.setAttribute('aria-labelledby', `principle-tab-${id}`);
      }
      updatePrincipleTabState();

      const pathway = pathways.find((p) => p.id === activePrincipleId);
      if (pathway && principlesInView) {
        focusStrength = 1;
        targetY = Math.atan2(pathway.focus.x, pathway.focus.z);
        targetX = -Math.asin(Math.max(-1, Math.min(1, pathway.focus.y))) * 0.9;
      }

      if (prefersReducedMotion) {
        drawFrame(performance.now());
      }
    };

    const selectTabByIndex = (idx, moveFocus = false) => {
      if (!principleTabs.length) {
        return;
      }
      const bounded = ((idx % principleTabs.length) + principleTabs.length) % principleTabs.length;
      const tab = principleTabs[bounded];
      const id = tab.dataset.principle;
      if (!id) {
        return;
      }
      setActivePrinciple(id, true);
      if (moveFocus) {
        tab.focus();
      }
    };

    principleTabs.forEach((tab, index) => {
      const id = tab.dataset.principle;
      tab.addEventListener('click', () => setActivePrinciple(id, true));
      tab.addEventListener('focus', () => setActivePrinciple(id, true));
      tab.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          selectTabByIndex(index + 1, true);
          return;
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          selectTabByIndex(index - 1, true);
          return;
        }
        if (event.key === 'Home') {
          event.preventDefault();
          selectTabByIndex(0, true);
          return;
        }
        if (event.key === 'End') {
          event.preventDefault();
          selectTabByIndex(principleTabs.length - 1, true);
        }
      });
    });

    const resize = () => {
      const rect = orbCanvas.getBoundingClientRect();
      width = Math.max(10, Math.floor(rect.width));
      height = Math.max(10, Math.floor(rect.height));
      orbCanvas.width = Math.floor(width * dpr);
      orbCanvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width, height) * 0.46;

       const nextProfile = getNetworkProfile(width);
       const needsRebuild = nextProfile.nodeCount !== NODE_COUNT
         || nextProfile.neighborsPerNode !== NEIGHBORS_PER_NODE
         || nextProfile.ambientCount !== AMBIENT_COUNT
         || nextProfile.ringCount !== RING_COUNT;
       profile = nextProfile;
       NODE_COUNT = profile.nodeCount;
       AMBIENT_COUNT = profile.ambientCount;
       RING_COUNT = profile.ringCount;
       NEIGHBORS_PER_NODE = profile.neighborsPerNode;

       if (needsRebuild) {
         initNodes();
         initAmbient();
         initRings();
         initEdges();
         initPathways();
         ambientSignals.length = 0;
       }

      if (prefersReducedMotion) {
        drawFrame(performance.now());
      }
    };

    const drawFrame = (timeMs) => {
      const dt = Math.min(0.05, Math.max(0.001, (timeMs - lastFrameMs) * 0.001));
      lastFrameMs = timeMs;
      const t = (timeMs - start) * 0.001;
      const effectiveFocusPrincipleId = getEffectiveFocusPrincipleId();
      updatePrincipleTabState();
      ctx.clearRect(0, 0, width, height);

      if (!effectiveFocusPrincipleId) {
        targetY = prefersReducedMotion ? 0.48 : 0.46 + Math.sin(t * 0.18) * 0.6;
        targetX = prefersReducedMotion ? 0.34 : 0.34 + Math.sin(t * 0.14) * 0.11;
      } else if (!prefersReducedMotion) {
        const focusPath = pathways.find((p) => p.id === effectiveFocusPrincipleId);
        if (focusPath) {
          targetY = Math.atan2(focusPath.focus.x, focusPath.focus.z) + Math.sin(t * 0.42) * 0.002;
          targetX = (-Math.asin(Math.max(-1, Math.min(1, focusPath.focus.y))) * 0.9) + Math.cos(t * 0.34) * 0.0016;
        }
      }

      const hasFocus = Boolean(effectiveFocusPrincipleId);
      const focusTarget = hasFocus ? 1 : 0;
      focusStrength += (focusTarget - focusStrength) * 0.06;
      const cameraEase = 0.038 + focusStrength * 0.044;
      rotationX += (targetX - rotationX) * cameraEase;
      rotationY += (targetY - rotationY) * cameraEase;

      const bgGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        radius * 0.12,
        width * 0.5,
        height * 0.5,
        radius * 1.86
      );
      bgGlow.addColorStop(0, 'rgba(12, 18, 28, 0.22)');
      bgGlow.addColorStop(0.55, 'rgba(6, 10, 16, 0.14)');
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
          synapseFlareEnergy[i] *= Math.max(0.0, 1 - dt * 1.35);
        }
      }

      edges.forEach((edge) => {
        const a = rotated[edge.a].p;
        const b = rotated[edge.b].p;
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > radius * 0.22) return;
        const edgeDepth = ((rotated[edge.a].raw.z + rotated[edge.b].raw.z) * 0.5 + radius) / (radius * 2);
        const depthFactor = Math.max(0.18, 0.18 + edgeDepth * 0.92);
        const buzz = prefersReducedMotion ? 0.5 : 0.44 + Math.sin(t * 18.5 + edge.a * 0.09 + edge.b * 0.13) * 0.4;
        const alpha = (1 - dist / (radius * 0.22)) * (0.015 + Math.max(0, buzz) * 0.065) * depthFactor;
        if (alpha < 0.02) return;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(84, 192, 255, ${alpha.toFixed(3)})`;
        ctx.lineWidth = (0.35 + Math.max(0, buzz) * 0.22) * depthFactor;
        ctx.stroke();

        if (!prefersReducedMotion && buzz > 0.68) {
          const sparkT = 0.45 + Math.sin(t * 9 + edge.a * 0.23 + edge.b * 0.17) * 0.1;
          const sx = a.x + (b.x - a.x) * sparkT;
          const sy = a.y + (b.y - a.y) * sparkT;
          ctx.beginPath();
          ctx.arc(sx, sy, 0.55 + buzz * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(138, 225, 255, ${(0.06 + (buzz - 0.68) * 0.18).toFixed(3)})`;
          ctx.fill();
        }
      });

      if (!prefersReducedMotion) {
        ambientEmitAccumulator += dt * profile.ambientRate;
        while (ambientEmitAccumulator >= 1) {
          spawnAmbientSignal();
          ambientEmitAccumulator -= 1;
        }
      }

      for (let i = ambientSignals.length - 1; i >= 0; i -= 1) {
        const signal = ambientSignals[i];
        const edge = edges[signal.edgeIndex];
        if (!edge) {
          ambientSignals.splice(i, 1);
          continue;
        }

        const a = rotated[edge.a].p;
        const b = rotated[edge.b].p;
        signal.progress += dt * signal.speed;
        signal.life -= dt;

        if (signal.life <= 0 || signal.progress >= 1.02) {
          ambientSignals.splice(i, 1);
          continue;
        }

        const p = Math.max(0, Math.min(1, signal.progress));
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const jitter = Math.sin(t * 27 + signal.seed + p * 11) * signal.jitterAmp;
        const x = a.x + dx * p + nx * jitter;
        const y = a.y + dy * p + ny * jitter;
        const pulseAlpha = Math.max(0.08, signal.life * 0.34);

        ctx.globalCompositeOperation = 'lighter';
        const shimmer = ctx.createRadialGradient(x, y, 0, x, y, signal.size * 4.6);
        shimmer.addColorStop(0, `rgba(168, 255, 248, ${(pulseAlpha + 0.28).toFixed(3)})`);
        shimmer.addColorStop(1, 'rgba(120, 232, 255, 0)');
        ctx.fillStyle = shimmer;
        ctx.beginPath();
        ctx.arc(x, y, signal.size * 4.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, signal.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(178, 244, 255, ${(pulseAlpha + 0.28).toFixed(3)})`;
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }

      pathways.forEach((path) => {
        const isActive = path.id === effectiveFocusPrincipleId;
        path.targetEnergy = effectiveFocusPrincipleId ? (isActive ? 1 : 0.24) : 0.46;
        const decayRate = isActive ? 0.26 : 0.16;
        path.energy += (path.targetEnergy - path.energy) * decayRate;
        const emphasis = effectiveFocusPrincipleId ? (isActive ? 1 : 0.38) : 0.58;
        const baseAlpha = 0.02 + emphasis * 0.07 + path.energy * 0.09;
        const pulseRate = (2 + path.energy * 7) * (isActive ? 1.24 : 1);

        if (!prefersReducedMotion) {
          path.burstCooldown = Math.max(0, path.burstCooldown - dt);
          path.emitAccumulator += dt * pulseRate;
          if (isActive && path.burstCooldown === 0 && Math.random() < dt * 1.8) {
            const burstCount = 2 + Math.floor(Math.random() * 3);
            for (let b = 0; b < burstCount; b += 1) {
              spawnSignal(path);
            }
            path.burstCooldown = rand(0.18, 0.34);
          }
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
          const edgeDepth = ((rotated[edge.a].raw.z + rotated[edge.b].raw.z) * 0.5 + radius) / (radius * 2);
          const depthFactor = Math.max(0.25, 0.24 + edgeDepth * 0.9);
          const wave = prefersReducedMotion ? 0.7 : 0.45 + Math.sin(t * 9.4 + edgeIndex * 0.27) * 0.33;
          const alpha = (1 - dist / (radius * 0.3)) * baseAlpha * wave * depthFactor;
          if (alpha < 0.02) return;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = toRgba(path.color, alpha.toFixed(3));
          ctx.lineWidth = (isActive ? 1.06 : 0.72) * depthFactor;
          ctx.stroke();
        });
      });

      pathways.forEach((path) => {
        const signals = pathwaySignals.get(path.id);
        if (!signals || signals.length === 0) {
          return;
        }
        const isActive = path.id === effectiveFocusPrincipleId;
        const visibility = effectiveFocusPrincipleId ? (isActive ? 1 : 0.52) : 0.78;

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
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const segLen = Math.hypot(dx, dy) || 1;
          const txUnit = dx / segLen;
          const tyUnit = dy / segLen;
          const nxUnit = -tyUnit;
          const nyUnit = txUnit;
          const jitterWave = Math.sin(t * 28 + signal.seed * 0.7 + p * 8.2) * signal.jitterAmp * 0.36 * signal.polarity;
          const jitterNoise = (pseudoNoise(signal.seed + p * 21, t * 0.5) - 0.5) * 0.42;
          const jitter = jitterWave + jitterNoise;
          const x = a.x + dx * p + nxUnit * jitter;
          const y = a.y + dy * p + nyUnit * jitter;

          if (!prefersReducedMotion) {
            const nearSource = Math.max(0, 0.12 - p) / 0.12;
            const nearTarget = Math.max(0, p - 0.88) / 0.12;
            receptorEnergy[edge.a] = Math.min(1.15, receptorEnergy[edge.a] + nearSource * 0.34);
            receptorEnergy[edge.b] = Math.min(1.15, receptorEnergy[edge.b] + nearTarget * 0.34);
            synapseFlareEnergy[edge.a] = Math.min(1.2, Math.max(synapseFlareEnergy[edge.a], nearSource * 1.05));
            synapseFlareEnergy[edge.b] = Math.min(1.2, Math.max(synapseFlareEnergy[edge.b], nearTarget * 1.05));
          }
          const sparkEnergy = 0.35 + visibility * 0.85 + path.energy * 0.7;
          const conductionStart = Math.max(0, p - 0.018);
          const conductionEnd = Math.min(1, p + 0.022);
          const hx1 = a.x + dx * conductionStart;
          const hy1 = a.y + dy * conductionStart;
          const hx2 = a.x + dx * conductionEnd;
          const hy2 = a.y + dy * conductionEnd;

          ctx.globalCompositeOperation = 'lighter';
          const conduitGlow = ctx.createLinearGradient(hx1, hy1, hx2, hy2);
          conduitGlow.addColorStop(0, toRgba(path.color, (0.14 + visibility * 0.24).toFixed(3)));
          conduitGlow.addColorStop(0.45, toRgba(path.color, (0.28 + visibility * 0.44).toFixed(3)));
          conduitGlow.addColorStop(1, toRgba(path.color, (0.14 + visibility * 0.24).toFixed(3)));
          ctx.strokeStyle = conduitGlow;
          ctx.lineWidth = 1.2 + visibility * 0.8;
          ctx.beginPath();
          ctx.moveTo(hx1, hy1);
          ctx.lineTo(hx2, hy2);
          ctx.stroke();

          const glowRadius = signal.size + visibility * 1.45;
          const pulseAura = ctx.createRadialGradient(x, y, 0, x, y, glowRadius * 3.2);
          pulseAura.addColorStop(0, toRgba(path.color, (0.25 + visibility * 0.52).toFixed(3)));
          pulseAura.addColorStop(1, toRgba(path.color, '0'));
          ctx.fillStyle = pulseAura;
          ctx.beginPath();
          ctx.arc(x, y, glowRadius * 3.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = toRgba(path.color, (0.5 + visibility * 0.38).toFixed(3));
          ctx.beginPath();
          ctx.arc(x, y, glowRadius * 0.9, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.8, glowRadius * 0.36), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 248, 238, ${(0.62 + visibility * 0.34).toFixed(3)})`;
          ctx.fill();

          if (!prefersReducedMotion) {
            const microCount = Math.max(3, Math.floor(3 + sparkEnergy * 3.2));
            for (let s = 0; s < microCount; s += 1) {
              const seed = signal.seed + s * 9.1 + i * 0.3;
              const angle = pseudoNoise(seed, t * 0.8) * Math.PI * 2;
              const radiusOut = glowRadius * (0.75 + pseudoNoise(seed + 2.6, t) * 1.8);
              const px = x + Math.cos(angle) * radiusOut;
              const py = y + Math.sin(angle) * radiusOut;
              const pa = 0.1 + visibility * 0.28;
              ctx.beginPath();
              ctx.arc(px, py, 0.4 + pseudoNoise(seed + 1.1, t) * 0.8, 0, Math.PI * 2);
              ctx.fillStyle = toRgba(path.color, pa.toFixed(3));
              ctx.fill();
            }

          }

          ctx.globalCompositeOperation = 'source-over';
        }
      });

      rotated.forEach((node, i) => {
        const p = node.p;
        const depth = (node.raw.z + radius) / (radius * 2);
        const depthFog = Math.max(0.2, 0.24 + depth * 0.9);
        const corticalGlow = node.cortical * 1.6;
        const receptor = receptorEnergy[i] || 0;
        const synapseFlare = synapseFlareEnergy[i] || 0;
        const receptorFlicker = prefersReducedMotion ? 0 : (0.5 + Math.sin(t * 8 + i * 0.11) * 0.5) * receptor;
        let pointColor = 'rgba(132, 188, 255, 0.4)';
        let boost = 0;

        pathways.forEach((path) => {
          if (!path.nodeIndices.has(i)) return;
          const isActive = path.id === effectiveFocusPrincipleId;
          const gain = effectiveFocusPrincipleId ? (isActive ? 0.9 : 0.2) : 0.52;
          boost = Math.max(boost, gain);
          pointColor = isActive ? toRgba(path.color, (0.22 + gain * 0.68).toFixed(3)) : pointColor;
        });

        const size = (0.48 + p.s * 0.48 + corticalGlow + boost * 0.7 + receptorFlicker * 1.1) * depthFog;
        const alpha = Math.min(0.98, (0.09 + depth * 0.38 + boost * 0.34 + corticalGlow * 0.2 + receptorFlicker * 0.5) * depthFog);

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

        if (synapseFlare > 0.04) {
          const flareRadius = size * (2.6 + synapseFlare * 2.2);
          const synapseAura = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, flareRadius * 1.75);
          synapseAura.addColorStop(0, `rgba(255, 252, 242, ${(0.28 + synapseFlare * 0.32).toFixed(3)})`);
          synapseAura.addColorStop(0.2, `rgba(255, 226, 154, ${(0.24 + synapseFlare * 0.3).toFixed(3)})`);
          synapseAura.addColorStop(0.48, `rgba(255, 162, 84, ${(0.16 + synapseFlare * 0.22).toFixed(3)})`);
          synapseAura.addColorStop(0.78, `rgba(255, 90, 58, ${(0.1 + synapseFlare * 0.14).toFixed(3)})`);
          synapseAura.addColorStop(1, 'rgba(255, 76, 56, 0)');
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = synapseAura;
          ctx.beginPath();
          ctx.arc(p.x, p.y, flareRadius * 1.75, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.6, flareRadius * 0.16), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 252, 246, ${(0.34 + synapseFlare * 0.28).toFixed(3)})`;
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
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

    renderPrinciplePanel(defaultPrincipleId);
    updatePrincipleTabState();

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
