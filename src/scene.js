import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

export function buildScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x03050a);

  const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(10, 10, 20);
  camera.lookAt(9, 2, 5);

  const ambient = new THREE.HemisphereLight(0xfaf3e3, 0x05090d, 3);
  scene.add(ambient);

  const warmSpot = new THREE.SpotLight(0xffdab0, 3.2, 24, Math.PI / 6, 0.2, 2);
  warmSpot.position.set(2, 5, 3.8);
  warmSpot.target.position.set(1, 0, -0.5);
  warmSpot.angle = Math.PI / 6;
  warmSpot.penumbra = 0.45;
  scene.add(warmSpot);
  scene.add(warmSpot.target);

  const coolSpot = new THREE.SpotLight(0xaed4ff, 2.4, 26, Math.PI / 5, 0.4, 2);
  coolSpot.position.set(-4.1, 4.3, -1.6);
  coolSpot.target.position.set(0, -0.1, -1.8);
  scene.add(coolSpot);
  scene.add(coolSpot.target);

  const fill = new THREE.DirectionalLight(0xaad0ff, 1);
  fill.position.set(-1.8, 1.5, 2.5);
  fill.target.position.set(0, 0, -1);
  scene.add(fill);
  scene.add(fill.target);

  const rim = new THREE.DirectionalLight(0xffe2b8, 0.9);
  rim.position.set(2.5, 3.2, -1.8);
  rim.target.position.set(1, 0.3, -1);
  scene.add(rim);
  scene.add(rim.target);

  const keyPoint = new THREE.PointLight(0xf0f6ff, 1.4, 18, 2);
  keyPoint.position.set(0.8, 2.7, 2);
  scene.add(keyPoint);

  const ambientPool = new THREE.PointLight(0x7fc4ff, 0.8, 12, 2);
  ambientPool.position.set(2.2, -0.3, 0.7);
  scene.add(ambientPool);

  return { scene, camera };
}
