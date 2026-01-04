import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { createWoodMaterial, createChromeMaterial } from './materials.js';

const BALL_RADIUS = 0.25;
const TRACK_WIDTH = 0.2;
const TRACK_THICKNESS = 0.01;

export function createRun() {
  const nodes = buildSpiralNodes();
  const spline = new THREE.CatmullRomCurve3(nodes, false, 'catmullrom', 0.5);

  const plankShape = new THREE.Shape();
  plankShape.moveTo(-TRACK_WIDTH / 2, 0);
  plankShape.lineTo(TRACK_WIDTH / 2, 0);
  plankShape.lineTo(TRACK_WIDTH / 2, -TRACK_THICKNESS);
  plankShape.lineTo(-TRACK_WIDTH / 2, -TRACK_THICKNESS);
  plankShape.closePath();

  const trackGeometry = new THREE.ExtrudeGeometry(plankShape, {
    steps: 400,
    bevelEnabled: false,
    extrudePath: spline,
  });
  const track = new THREE.Mesh(trackGeometry, createWoodMaterial());
  track.castShadow = false;
  track.receiveShadow = true;

  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x0d1014, metalness: 0.4, roughness: 0.8 });
  const frameBase = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.16, 2.4), frameMaterial);
  frameBase.position.set(1.1, 0.02, 0.1);

  const runGroup = new THREE.Group();
  runGroup.add(track, frameBase);

  const ballMaterial = createChromeMaterial();
  const ball = new THREE.Mesh(new THREE.SphereGeometry(BALL_RADIUS, 64, 64), ballMaterial);
  const startPoint = spline.getPointAt(0);
  ball.position.copy(startPoint).add(new THREE.Vector3(0, BALL_RADIUS + 0.04, 0));


  return { group: runGroup, spline, ball, ballRadius: BALL_RADIUS };
}

function buildSpiralNodes() {
  const nodes = [];
  const turns = 3;
  const pointsPerTurn = 60;
  const totalPoints = turns * pointsPerTurn;
  const radius = 1.4;
  const startHeight = 3.2;
  const dropHeight = 2.6;
  const centerOffset = new THREE.Vector3(-0.2, 0, 0.45);

  for (let i = 0; i <= totalPoints; i++) {
    const t = i / totalPoints;
    const angle = t * turns * Math.PI * 2;
    const height = startHeight - t * dropHeight;
    const radial = radius + Math.sin(angle * 2.4) * 0.08;
    const x = Math.cos(angle) * radial;
    const z = Math.sin(angle) * radial;
    nodes.push(new THREE.Vector3(x, height, z).add(centerOffset));
  }

  const rampBase = nodes[nodes.length - 1].clone();
  const rampOffsets = [
    new THREE.Vector3(0.4, 0.15, 0.1),
    new THREE.Vector3(0.85, 0.35, 0.25),
    new THREE.Vector3(1.35, 0.6, 0.5),
    new THREE.Vector3(1.75, 0.85, 0.75),
  ];

  let lastRampPoint = rampBase.clone();
  for (const offset of rampOffsets) {
    lastRampPoint = lastRampPoint.clone().add(offset);
    nodes.push(lastRampPoint);
  }

  return nodes;
}
