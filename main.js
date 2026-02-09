const siteHeader = document.querySelector('.site-header');
const projectCardsRoot = document.getElementById('project-cards');
const PROJECT_STACK_ICONS = {
  html: '<svg viewBox="0 0 24 24" role="presentation"><path d="M5 3h14l-1.2 15.2L12 21l-5.8-2.8L5 3Z" /></svg>',
  python: '<svg viewBox="0 0 24 24" role="presentation"><path d="M8 3h6a3 3 0 0 1 3 3v3H9a2 2 0 0 0-2 2v3H5V6a3 3 0 0 1 3-3Z" /><path d="M16 21h-6a3 3 0 0 1-3-3v-3h8a2 2 0 0 0 2-2v-3h2v8a3 3 0 0 1-3 3Z" /></svg>',
  tauri: '<svg viewBox="0 0 24 24" role="presentation"><path d="M12 3l8 14H4L12 3Z" /></svg>',
  svelte: '<svg viewBox="0 0 24 24" role="presentation"><path d="M16 5c-1-1.3-3.8-1.7-6-.8C7.9 5 7 6.5 7.3 8c.4 2 2.8 2.4 4.7 2.8 2.1.4 3.3.9 3.2 2.2-.2 2-3 2.5-4.9 2.2-1.5-.2-2.7-.8-3.4-1.7" /></svg>',
  css: '<svg viewBox="0 0 24 24" role="presentation"><path d="M5 4h3v16H5zM10.5 4h3v16h-3zM16 4h3v16h-3z" /></svg>',
  javascript: '<svg viewBox="0 0 24 24" role="presentation"><path d="M9 4c-1.5 0-2 1-2 2.2v2.1C7 9.5 6.5 10 5.3 10H4v4h1.3c1.2 0 1.7.5 1.7 1.7v2.1C7 19 7.5 20 9 20M15 4c1.5 0 2 1 2 2.2v2.1c0 1.2.5 1.7 1.7 1.7H20v4h-1.3c-1.2 0-1.7.5-1.7 1.7v2.1c0 1.2-.5 2.2-2 2.2" /></svg>',
  figma: '<svg viewBox="0 0 24 24" role="presentation"><path d="M9 3h6a3 3 0 0 1 0 6H9zM9 9h6a3 3 0 0 1 0 6H9zM9 15h3a3 3 0 1 1-3 3zM9 3v18" /></svg>',
  tokens: '<svg viewBox="0 0 24 24" role="presentation"><path d="M12 3l7 4v10l-7 4-7-4V7l7-4Z" /></svg>',
  llm: '<svg viewBox="0 0 24 24" role="presentation"><path d="M4 12h16M12 4v16" /></svg>',
  orchestration: '<svg viewBox="0 0 24 24" role="presentation"><path d="M6 6h4v4H6zM14 6h4v4h-4zM10 14h4v4h-4zM10 8h4M8 10v4M16 10v4" /></svg>',
  ai: '<svg viewBox="0 0 24 24" role="presentation"><path d="M5 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM9 9h2v6H9zM13 9h2.2a1.8 1.8 0 0 1 0 3.6H13zM13 12.6h2.4" /></svg>',
  shield: '<svg viewBox="0 0 24 24" role="presentation"><path d="M12 3l7 3v5c0 5-2.8 8-7 10-4.2-2-7-5-7-10V6zM9 12l2 2 4-4" /></svg>',
  strategy: '<svg viewBox="0 0 24 24" role="presentation"><path d="M4 6h10l-2.2 2.3L15 11.5l5-5L15 1.5 11.8 4.7 14 7H4zM4 18h10l-2.2-2.3L15 12.5l5 5-5 5-3.2-3.2L14 17H4z" /></svg>'
};
const PROJECT_GITHUB_ICON = '<svg viewBox="0 0 24 24" role="presentation"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.94-2.66c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.4 3.4 0 0 0 9 18.13V22" /></svg>';
const PROJECTS = [
  {
    id: 'cntlx',
    stage: 'dev',
    title: 'CNTLX',
    subheading: 'Intelligence Engine',
    summary: 'Desktop intelligence platform in active development, combining AI-assisted workflows, LLM-backed decision support, and structured pipeline orchestration for content operations.',
    objectives: [
      'Pipeline orchestration for ingestion, routing, scoring, and decision flows',
      'Living metadata governance across entities, events, and provenance',
      'Focus: AI-assisted throughput, quality control, and reliability'
    ],
    milestones: [
      { label: 'Design', value: 'Complete', state: 'complete' },
      { label: 'Development', value: 'In progress', state: 'progress' },
      { label: 'Production', value: 'Planned', state: 'planned' },
      { label: 'Documentation', value: 'Planned', state: 'planned' }
    ],
    stack: [
      { label: 'Python', icon: 'python' },
      { label: 'Tauri', icon: 'tauri' },
      { label: 'AI', icon: 'AI' },
      { label: 'Governance', icon: 'shield' }
    ],
    stackMeta: 'Python, Tauri, AI, Governance',
    statusText: 'Development',
    githubUrl: ''
  },
  {
    id: 'gtbr',
    stage: 'prod',
    title: 'GTBR',
    subheading: 'Web Experience',
    summary: 'Live portfolio site combining neural visuals, principles storytelling, and project case studies.',
    objectives: [
      'Clear narrative structure across sections',
      'Responsive interaction and motion system',
      'Focus: clarity, performance, and maintainability'
    ],
    milestones: [
      { label: 'Design', value: 'Complete', state: 'complete' },
      { label: 'Development', value: 'Complete', state: 'complete' },
      { label: 'Production', value: 'Complete', state: 'complete' },
      { label: 'Documentation', value: 'In progress', state: 'progress' }
    ],
    stack: [
      { label: 'HTML', icon: 'html' },
      { label: 'CSS', icon: 'css' },
      { label: 'JavaScript', icon: 'javascript' }
    ],
    stackMeta: 'HTML, CSS, JavaScript',
    statusText: 'Production',
    githubUrl: 'https://github.com/CSVillain/gtbr-site'
  },
  {
    id: 'knwlx',
    stage: 'design',
    title: 'KNWLX',
    subheading: 'Knowledge System',
    summary: 'Development strategy to evolve CNTLX into a broader Knowledge Intelligence platform for advanced strategic decisioning.',
    objectives: [
      'Define the strategic operating model beyond the CNTLX core',
      'Establish common standards for knowledge artifacts, pipelines, and integrations',
      'Shape a phased roadmap from concept to full deployment'
    ],
    milestones: [
      { label: 'Strategy', value: 'In progress', state: 'progress' },
      { label: 'Architecture', value: 'Planned', state: 'planned' },
      { label: 'Pilot', value: 'Planned', state: 'planned' },
      { label: 'Deployment', value: 'Planned', state: 'planned' }
    ],
    stack: [
      { label: 'AI', icon: 'AI' },
      { label: 'Governance', icon: 'shield' },
      { label: 'Strategy', icon: 'strategy' }
    ],
    stackMeta: 'Python, AI, governance, strategy',
    statusText: 'Design',
    githubUrl: ''
  }
];

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const renderProjectCards = () => {
  if (!projectCardsRoot) {
    return;
  }

  const cardsMarkup = PROJECTS.map((project) => {
    const stageLabel = project.statusText;
    const hasGithubLink = Boolean(project.githubUrl);
    const githubMarkup = hasGithubLink
      ? `<a class="module-icon-link" href="${escapeHtml(project.githubUrl)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" title="GitHub repository">${PROJECT_GITHUB_ICON}</a>`
      : `<span class="module-icon-link is-disabled" role="img" aria-label="GitHub repository unavailable" title="GitHub repository unavailable">${PROJECT_GITHUB_ICON}</span>`;
    const stackIcons = project.stack.map((item) => {
      const iconKey = String(item.icon || '').toLowerCase();
      const icon = PROJECT_STACK_ICONS[iconKey] || PROJECT_STACK_ICONS.llm;
      return `<li><span class="stack-icon stack-icon-${escapeHtml(iconKey)}" role="img" aria-label="${escapeHtml(item.label)}" title="${escapeHtml(item.label)}">${icon}</span></li>`;
    }).join('');

    const objectives = project.objectives.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    const milestones = project.milestones.map((step) => {
      const stateClass = step.state === 'complete' ? ' class="is-complete"' : step.state === 'progress' ? ' class="is-progress"' : '';
      return `<li${stateClass}><span>${escapeHtml(step.label)}</span><strong>${escapeHtml(step.value)}</strong></li>`;
    }).join('');

    return `
      <article class="module reveal" data-project="${escapeHtml(project.id)}" data-stage="${escapeHtml(project.stage)}">
        <div class="module-head">
          <div class="module-head-copy">
            <div class="module-title-row">
              <h3>${escapeHtml(project.title)}</h3>
            </div>
            <p class="module-sub">${escapeHtml(project.subheading)}</p>
          </div>
        </div>
        <div class="module-signal-row">
          <span class="module-neural-path" aria-hidden="true"></span>
          <span class="module-stage-label">${escapeHtml(stageLabel)}</span>
        </div>
        <div class="module-quick">
          ${githubMarkup}
          <ul class="module-stack-icons" aria-label="Tech stack">
            ${stackIcons}
          </ul>
        </div>
        <button class="module-select" type="button">Open project</button>
        <div class="module-detail">
          <p class="module-summary">${escapeHtml(project.summary)}</p>
          <div class="module-detail-grid">
            <section class="module-detail-block" aria-label="Objectives">
              <h4><svg viewBox="0 0 24 24" role="presentation"><path d="M4 12h16M12 4v16" /></svg>Objectives</h4>
              <ul class="module-list">${objectives}</ul>
            </section>
            <section class="module-detail-block" aria-label="Milestones">
              <h4><svg viewBox="0 0 24 24" role="presentation"><path d="M4 12h16M12 4v16" /></svg>Milestones</h4>
              <ul class="module-list module-list-steps">${milestones}</ul>
            </section>
          </div>
          <p class="module-detail-meta"><strong>Stack:</strong> ${escapeHtml(project.stackMeta)} <strong>Status:</strong> ${escapeHtml(project.statusText)}</p>
          <div class="module-links">
            <button class="module-back" type="button">Back to projects</button>
            <a class="module-command" href="#contact">GitHub</a>
            <a class="module-command" href="#contact">Full Case</a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  projectCardsRoot.innerHTML = cardsMarkup;
};

renderProjectCards();

const reveals = Array.from(document.querySelectorAll('.reveal'));
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const yearEl = document.getElementById('year');
const orbCanvas = document.getElementById('hero-orb-canvas');
const principleTabs = Array.from(document.querySelectorAll('.principle-tab'));
const principlePanel = document.querySelector('.principle-panel');
const principlePanelHeading = document.getElementById('principle-panel-heading');
const principlePanelSummary = document.getElementById('principle-panel-summary');
const principlePanelList = document.getElementById('principle-panel-list');
const workSection = document.getElementById('work');
const projectModules = Array.from(document.querySelectorAll('.work .module'));
const principlesSection = document.getElementById('architecture');
const principlesSignal = document.querySelector('.principles-signal');
const principlesSignalNodes = Array.from(document.querySelectorAll('.principles-signal-node'));
const heroSection = document.getElementById('hero');
const heroPrefixText = document.getElementById('hero-prefix-text');
const heroFinalWord = document.getElementById('hero-final-word');
const canObserve = typeof window !== 'undefined' && 'IntersectionObserver' in window;
const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;
const principleColorById = {
  logic: '#ffd166',
  clarity: '#4dd2ff',
  scale: '#7c5cff',
  growth: '#ff5fc7',
  value: '#39e39a'
};

const hexToRgbTuple = (hex) => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#') || hex.length !== 7) {
    return '114, 240, 207';
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const getHeaderOffset = () => {
  if (!siteHeader) {
    return 0;
  }
  return Math.ceil(siteHeader.getBoundingClientRect().height) + 8;
};
let activeSectionId = '';

const triggerSectionActivationEffect = (section) => {
  if (!section) {
    return;
  }
  const heading = section.querySelector('.section-heading');
  if (heading) {
    heading.classList.remove('is-activated');
    window.requestAnimationFrame(() => {
      heading.classList.add('is-activated');
      window.setTimeout(() => {
        heading.classList.remove('is-activated');
      }, 980);
    });
  }

  if (prefersReducedMotion) {
    return;
  }

  const existing = section.querySelector('.section-activation-signal');
  if (existing) {
    existing.remove();
  }

  const signal = document.createElement('span');
  signal.className = 'section-activation-signal';
  const tint = (section.id === 'architecture' && principleColorById.logic) || '#72f0cf';
  signal.style.setProperty('--section-activation-rgb', hexToRgbTuple(tint));
  section.appendChild(signal);
  window.setTimeout(() => {
    signal.remove();
  }, 1100);
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
  const prefix = heroPrefixText;
  const prefixCopy = 'get the basics ';

  if (prefersReducedMotion) {
    if (prefix) {
      prefix.classList.remove('is-typing');
      prefix.textContent = prefixCopy;
    }
    heroFinalWord.textContent = 'right';
    heroFinalWord.classList.remove('is-wrong', 'is-fading');
    heroFinalWord.classList.add('is-correct');
    return;
  }

  if (prefix) {
    prefix.textContent = '';
    prefix.classList.add('is-typing');
    for (let i = 0; i < prefixCopy.length; i += 1) {
      prefix.textContent += prefixCopy[i];
      await sleep(56);
    }
    await sleep(140);
    prefix.classList.remove('is-typing');
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

const defaultPrincipleId = null;
let principlesInView = false;
let principleRenderToken = 0;
let principleHeadingToken = 0;

const renderPrinciplePanel = (id) => {
  if (!principlePanel || !principlePanelSummary || !principlePanelList) {
    return;
  }
  const sourceButton = principleTabs.find((button) => button.dataset.principle === id);
  if (!sourceButton) {
    return;
  }
  const summaryText = sourceButton.dataset.summary || '';
  const bulletText = sourceButton.dataset.bullets || '';
  const bullets = bulletText.split('|').map((item) => item.trim()).filter(Boolean);
  const token = ++principleRenderToken;

  principlePanel.dataset.principle = id;
  principlePanel.classList.add('is-swapping');
  window.setTimeout(() => {
    if (token !== principleRenderToken) {
      return;
    }
    principlePanelSummary.textContent = summaryText;
    principlePanelList.innerHTML = bullets.map((item) => `<li>${item}</li>`).join('');
    principlePanel.classList.remove('is-swapping');
  }, 120);
};

const clearPrinciplePanel = () => {
  if (!principlePanel || !principlePanelSummary || !principlePanelList) {
    return;
  }
  principlePanel.dataset.principle = '';
  principlePanelSummary.textContent = '';
  principlePanelList.innerHTML = '';
  if (principlePanelHeading) {
    principlePanelHeading.textContent = '';
    principlePanelHeading.classList.remove('is-visible');
  }
  principlePanel.removeAttribute('aria-labelledby');
};

const getPrincipleLabel = (id) => {
  const sourceButton = principleTabs.find((button) => button.dataset.principle === id);
  if (!sourceButton) {
    return id;
  }
  return sourceButton.textContent ? sourceButton.textContent.trim() : id;
};

const updateHeaderState = () => {
  if (!siteHeader) {
    return;
  }
  siteHeader.classList.toggle('is-solid', window.scrollY > 44);
};

const updateCurrentNavLink = () => {
  if (!navLinks.length || !navSections.length) {
    return;
  }
  const activationY = getHeaderOffset() + (window.innerHeight * 0.26);
  let activeSection = null;

  navSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= activationY && rect.bottom > activationY) {
      activeSection = section;
    }
  });

  if (!activeSection) {
    activeSection = navSections.find((section) => section.getBoundingClientRect().top > activationY) || navSections[navSections.length - 1];
  }

  const activeId = activeSection ? `#${activeSection.id}` : '';
  navLinks.forEach((link) => {
    link.classList.toggle('is-current', link.getAttribute('href') === activeId);
  });

  if (activeSection && activeSection.id !== activeSectionId) {
    activeSectionId = activeSection.id;
    triggerSectionActivationEffect(activeSection);
  }
};

const updateHeroPrinciplesTransition = () => {
  if (!heroSection || !principlesSection) {
    return;
  }
  const principlesTop = principlesSection.getBoundingClientRect().top;
  const start = window.innerHeight * 0.96;
  const end = window.innerHeight * 0.2;
  const raw = (start - principlesTop) / (start - end);
  const progress = Math.max(0, Math.min(1, raw));

  document.documentElement.style.setProperty('--hero-principles-progress', progress.toFixed(3));
};

updateHeaderState();
updateCurrentNavLink();
window.addEventListener('scroll', updateHeaderState, { passive: true });
window.addEventListener('scroll', updateCurrentNavLink, { passive: true });
window.addEventListener('resize', updateCurrentNavLink, { passive: true });
updateHeroPrinciplesTransition();
window.addEventListener('scroll', updateHeroPrinciplesTransition, { passive: true });
window.addEventListener('resize', updateHeroPrinciplesTransition, { passive: true });

const scrollToNavDestination = (link, behavior = 'smooth', updateHash = true) => {
  const href = link.getAttribute('href');
  if (!href || !href.startsWith('#')) {
    return false;
  }
  const sectionTarget = document.querySelector(href);
  if (!sectionTarget) {
    return false;
  }

  const top = sectionTarget.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({
    top: Math.max(0, top),
    behavior
  });

  if (updateHash && history.replaceState) {
    history.replaceState(null, '', href);
  }
  return true;
};

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    scrollToNavDestination(link, prefersReducedMotion ? 'auto' : 'smooth', true);
  });
});

const applyHashNavigation = (behavior = 'auto') => {
  const hash = window.location.hash;
  if (!hash) {
    return;
  }
  const link = navLinks.find((item) => item.getAttribute('href') === hash);
  if (!link) {
    return;
  }
  scrollToNavDestination(link, behavior, false);
};

window.addEventListener('hashchange', () => {
  applyHashNavigation(prefersReducedMotion ? 'auto' : 'smooth');
});
window.setTimeout(() => {
  applyHashNavigation('auto');
}, 0);

if (workSection && projectModules.length) {
  const setSelectedProject = (selectedModule) => {
    const hasSelected = Boolean(selectedModule);
    workSection.classList.toggle('is-drilled', hasSelected);
    projectModules.forEach((module) => {
      const isSelected = module === selectedModule;
      module.classList.toggle('is-selected', isSelected);
      const selectButton = module.querySelector('.module-select');
      if (selectButton) {
        selectButton.setAttribute('aria-expanded', isSelected ? 'true' : 'false');
      }
    });
  };

  projectModules.forEach((module) => {
    const selectButton = module.querySelector('.module-select');
    const backButton = module.querySelector('.module-back');

    if (selectButton) {
      selectButton.addEventListener('click', () => {
        setSelectedProject(module);
        const top = workSection.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
        window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    }

    if (backButton) {
      backButton.addEventListener('click', () => {
        setSelectedProject(null);
      });
    }
  });

  setSelectedProject(null);
}

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
          nodeCount: 760,
          ambientCount: 110,
          ringCount: 28,
          neighborsPerNode: 4,
          ambientRate: 3.6
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
    let keyboardFocusTabIndex = 0;
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
        if (selectedPrincipleId) {
          tab.setAttribute('tabindex', isSelected ? '0' : '-1');
        } else {
          const tabIndex = principleTabs.indexOf(tab);
          tab.setAttribute('tabindex', tabIndex === keyboardFocusTabIndex ? '0' : '-1');
        }
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
      if (!id) {
        return;
      }
      const previousPrincipleId = selectedPrincipleId;
      const headingTransitionToken = ++principleHeadingToken;
      selectedPrincipleId = id;
      activePrincipleId = id;
      if (pinned) {
        pinnedPrincipleId = id;
      } else {
        pinnedPrincipleId = id;
      }
      if (principlePanel) {
        principlePanel.classList.add('is-swapping');
      }
      if (principlePanelSummary) {
        principlePanelSummary.textContent = '';
      }
      if (principlePanelList) {
        principlePanelList.innerHTML = '';
      }
      if (principlePanel) {
        principlePanel.setAttribute('aria-labelledby', `principle-tab-${id}`);
      }
      if (principlesSection) {
        const selectedIndex = principleTabs.findIndex((tab) => tab.dataset.principle === id);
        if (selectedIndex >= 0) {
          principlesSection.style.setProperty('--principle-index', String(selectedIndex));
        }
      }
      syncPrinciplesSignalMarker(id);
      const travelDuration = animatePrinciplesSignalTravel(previousPrincipleId, id);
      if (principlePanelHeading && !prefersReducedMotion) {
        principlePanelHeading.classList.remove('is-visible');
      }
      const revealDelay = (previousPrincipleId && previousPrincipleId !== id) ? Math.max(220, travelDuration - 100) : 90;
      window.setTimeout(() => {
        if (headingTransitionToken !== principleHeadingToken) {
          return;
        }
        revealPrincipleHeading(id);
      }, revealDelay);
      const contentDelay = revealDelay + (prefersReducedMotion ? 30 : 280);
      window.setTimeout(() => {
        if (headingTransitionToken !== principleHeadingToken) {
          return;
        }
        renderPrinciplePanel(id);
      }, contentDelay);
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
      keyboardFocusTabIndex = bounded;
      updatePrincipleTabState();
      if (moveFocus) {
        tab.focus();
      }
    };

    const syncPrinciplesSignalMarker = (id) => {
      if (!principlesSection || !principlesSignal || principlesSignalNodes.length === 0) {
        return;
      }
      const node = principlesSignalNodes.find((el) => el.dataset.principle === id);
      if (!node) {
        return;
      }
      const signalRect = principlesSignal.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const x = nodeRect.left - signalRect.left + (nodeRect.width * 0.5);
      principlesSection.style.setProperty('--principle-marker-x', `${x.toFixed(1)}px`);
      principlesSection.style.setProperty('--principle-selected', '1');
      principlesSignalNodes.forEach((signalNode) => {
        const isActive = signalNode.dataset.principle === id;
        signalNode.classList.toggle('is-active', isActive);
      });
    };

    const animatePrinciplesSignalTravel = (fromId, toId) => {
      if (prefersReducedMotion || !principlesSignal || !fromId || !toId || fromId === toId) {
        return 0;
      }
      const fromNode = principlesSignalNodes.find((el) => el.dataset.principle === fromId);
      const toNode = principlesSignalNodes.find((el) => el.dataset.principle === toId);
      if (!fromNode || !toNode) {
        return 0;
      }

      const signalRect = principlesSignal.getBoundingClientRect();
      const fromRect = fromNode.getBoundingClientRect();
      const toRect = toNode.getBoundingClientRect();
      const fromX = fromRect.left - signalRect.left + (fromRect.width * 0.5);
      const toX = toRect.left - signalRect.left + (toRect.width * 0.5);
      const left = Math.min(fromX, toX);
      const width = Math.max(10, Math.abs(toX - fromX));
      const start = fromX - left;
      const end = toX - left;

      const travel = document.createElement('span');
      travel.className = 'principles-signal-travel';
      travel.style.setProperty('--travel-left', `${left.toFixed(1)}px`);
      travel.style.setProperty('--travel-width', `${width.toFixed(1)}px`);
      travel.style.setProperty('--travel-start', `${start.toFixed(1)}px`);
      travel.style.setProperty('--travel-end', `${end.toFixed(1)}px`);
      travel.style.setProperty('--travel-rgb', hexToRgbTuple(principleColorById[toId]));

      for (let i = 0; i < 4; i += 1) {
        const spark = document.createElement('span');
        spark.className = 'principles-signal-travel-spark';
        spark.style.setProperty('--travel-start', `${start.toFixed(1)}px`);
        spark.style.setProperty('--travel-end', `${end.toFixed(1)}px`);
        spark.style.setProperty('--travel-rgb', hexToRgbTuple(principleColorById[toId]));
        spark.style.setProperty('--spark-y', `${(Math.random() - 0.5) * 7}px`);
        spark.style.animationDelay = `${(i * 55)}ms`;
        spark.style.animationDuration = `${430 + (Math.random() * 140)}ms`;
        travel.appendChild(spark);
      }

      principlesSignal.appendChild(travel);
      window.setTimeout(() => {
        travel.remove();
      }, 760);
      return 760;
    };

    const revealPrincipleHeading = (id) => {
      if (!principlePanelHeading) {
        return;
      }
      const label = getPrincipleLabel(id);
      principlePanelHeading.textContent = label;
      if (prefersReducedMotion || !principlesSignal || principlesSignalNodes.length === 0) {
        principlePanelHeading.classList.add('is-visible');
        return;
      }

      const node = principlesSignalNodes.find((el) => el.dataset.principle === id);
      if (!node) {
        principlePanelHeading.classList.add('is-visible');
        return;
      }

      const nodeRect = node.getBoundingClientRect();
      const headingRect = principlePanelHeading.getBoundingClientRect();
      const startX = nodeRect.left + (nodeRect.width * 0.5);
      const startY = nodeRect.top + (nodeRect.height * 0.5);
      const endX = headingRect.left + Math.min(headingRect.width * 0.28, 96);
      const endY = headingRect.top + (headingRect.height * 0.56);
      const ghost = document.createElement('span');

      ghost.className = 'principle-heading-ghost';
      ghost.textContent = label;
      ghost.style.left = `${startX.toFixed(1)}px`;
      ghost.style.top = `${startY.toFixed(1)}px`;
      ghost.style.setProperty('--travel-rgb', hexToRgbTuple(principleColorById[id]));
      document.body.appendChild(ghost);

      node.classList.add('is-launching');
      window.setTimeout(() => {
        node.classList.remove('is-launching');
      }, 240);

      ghost.animate(
        [
          {
            transform: 'translate(-50%, -50%) scale(0.72)',
            opacity: 0.98
          },
          {
            transform: `translate(calc(-50% + ${(endX - startX).toFixed(1)}px), calc(-50% + ${(endY - startY).toFixed(1)}px)) scale(1)`,
            opacity: 0
          }
        ],
        {
          duration: 440,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards'
        }
      ).onfinish = () => {
        ghost.remove();
      };

      window.setTimeout(() => {
        if (principlePanelHeading) {
          principlePanelHeading.classList.add('is-visible');
        }
      }, 150);
    };

    principleTabs.forEach((tab, index) => {
      const id = tab.dataset.principle;
      tab.addEventListener('click', () => setActivePrinciple(id, true));
      tab.addEventListener('focus', () => {
        keyboardFocusTabIndex = index;
        if (!selectedPrincipleId) {
          updatePrincipleTabState();
        }
      });
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
          return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActivePrinciple(id, true);
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
        const pulseAlpha = Math.max(0.06, signal.life * 0.28);

        ctx.globalCompositeOperation = 'lighter';
        const shimmer = ctx.createRadialGradient(x, y, 0, x, y, signal.size * 4.6);
        shimmer.addColorStop(0, `rgba(168, 255, 248, ${(pulseAlpha + 0.2).toFixed(3)})`);
        shimmer.addColorStop(1, 'rgba(120, 232, 255, 0)');
        ctx.fillStyle = shimmer;
        ctx.beginPath();
        ctx.arc(x, y, signal.size * 4.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, signal.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(178, 244, 255, ${(pulseAlpha + 0.18).toFixed(3)})`;
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
        const visibility = effectiveFocusPrincipleId ? (isActive ? 1 : 0.46) : 0.66;

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
          const sparkEnergy = 0.28 + visibility * 0.74 + path.energy * 0.58;
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
          ctx.lineWidth = 0.95 + visibility * 0.58;
          ctx.beginPath();
          ctx.moveTo(hx1, hy1);
          ctx.lineTo(hx2, hy2);
          ctx.stroke();

          const glowRadius = signal.size + visibility * 1.15;
          const pulseAura = ctx.createRadialGradient(x, y, 0, x, y, glowRadius * 3.2);
          pulseAura.addColorStop(0, toRgba(path.color, (0.18 + visibility * 0.4).toFixed(3)));
          pulseAura.addColorStop(1, toRgba(path.color, '0'));
          ctx.fillStyle = pulseAura;
          ctx.beginPath();
          ctx.arc(x, y, glowRadius * 3.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = toRgba(path.color, (0.36 + visibility * 0.28).toFixed(3));
          ctx.beginPath();
          ctx.arc(x, y, glowRadius * 0.9, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.8, glowRadius * 0.36), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 248, 238, ${(0.52 + visibility * 0.24).toFixed(3)})`;
          ctx.fill();

          if (!prefersReducedMotion) {
            const microCount = Math.max(2, Math.floor(2 + sparkEnergy * 2.2));
            for (let s = 0; s < microCount; s += 1) {
              const seed = signal.seed + s * 9.1 + i * 0.3;
              const angle = pseudoNoise(seed, t * 0.8) * Math.PI * 2;
              const radiusOut = glowRadius * (0.7 + pseudoNoise(seed + 2.6, t) * 1.35);
              const px = x + Math.cos(angle) * radiusOut;
              const py = y + Math.sin(angle) * radiusOut;
              const pa = 0.08 + visibility * 0.2;
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

    if (defaultPrincipleId) {
      renderPrinciplePanel(defaultPrincipleId);
      syncPrinciplesSignalMarker(defaultPrincipleId);
      if (principlePanelHeading) {
        principlePanelHeading.textContent = getPrincipleLabel(defaultPrincipleId);
        principlePanelHeading.classList.add('is-visible');
      }
    } else {
      clearPrinciplePanel();
      if (principlesSection) {
        principlesSection.style.setProperty('--principle-selected', '0');
      }
    }
    updatePrincipleTabState();

    drawFrame(start);
    if (!prefersReducedMotion) {
      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('resize', () => syncPrinciplesSignalMarker(selectedPrincipleId), { passive: true });
    window.addEventListener('beforeunload', () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    });
  }
}
