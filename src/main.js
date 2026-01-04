import { createRenderer, resizeRenderer } from './renderer.js';
import { buildScene } from './scene.js';
import { createRun } from './run.js';
import { createOcean } from './ocean.js';
import { createSplash } from './splash.js';
import { Sequence } from './sequence.js';

const container = document.getElementById('app');
const renderer = createRenderer();
container.appendChild(renderer.domElement);

const { scene, camera } = buildScene();
const run = createRun();
const ocean = createOcean();
const splash = createSplash(scene);

scene.add(ocean.mesh, run.group, run.ball);

const sequence = new Sequence({
  ball: run.ball,
  spline: run.spline,
  splash,
  oceanHeight: ocean.height,
  ballRadius: run.ballRadius,
});

window.addEventListener('resize', () => resizeRenderer(renderer, camera));

let lastTime = 0;
const loop = (time) => {
  const seconds = time * 0.001;
  const delta = Math.min(0.06, Math.max(0, seconds - lastTime));
  lastTime = seconds;

  ocean.update(delta);
  sequence.update(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
