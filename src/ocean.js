import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { createWaterMaterial } from './materials.js';

export function createOcean() {
  const geometry = new THREE.PlaneGeometry(80, 80, 200, 200);
  const material = createWaterMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 2.5;
  mesh.receiveShadow = false;
  mesh.renderOrder = 0;

  const basePositions = geometry.attributes.position.array.slice();
  let time = 0;

  const update = (delta) => {
    time += delta * 0.6;
    const positions = geometry.attributes.position;
    const array = positions.array;
    for (let i = 0; i < positions.count; i++) {
      const idx = i * 3;
      const x = basePositions[idx];
      const z = basePositions[idx + 2];
      array[idx + 1] =
        mesh.position.y +
        Math.sin(x * 0.25 + time) * 0.14 +
        Math.cos(z * 0.28 + time * 1.1) * 0.08;
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  };

  return { mesh, update, height: mesh.position.y };
}
