import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

export function createSplash(scene) {
  const count = 64;
  const positions = new Float32Array(count * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xe4f0ff,
    transparent: true,
    opacity: 1,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  points.visible = false;
  scene.add(points);

  const rippleGeometry = new THREE.RingGeometry(0.3, 0.36, 64);
  rippleGeometry.rotateX(-Math.PI / 2);
  const rippleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
  });
  const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
  ripple.visible = false;
  scene.add(ripple);

  const velocities = Array.from({ length: count }, () => new THREE.Vector3());
  const tempVec = new THREE.Vector3();
  let timer = 0;
  let active = false;

  return {
    trigger(position) {
      timer = 0;
      active = true;
      points.visible = true;
      ripple.visible = true;
      ripple.position.copy(position);
      ripple.scale.setScalar(1);
      ripple.material.opacity = 0.8;
      const attribute = geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        attribute.array[idx] = position.x;
        attribute.array[idx + 1] = position.y;
        attribute.array[idx + 2] = position.z;
        const theta = Math.random() * Math.PI * 2;
        const spread = 0.6 + Math.random() * 0.5;
        velocities[i].set(Math.cos(theta) * spread, 1.2 + Math.random() * 0.9, Math.sin(theta) * spread * 0.5);
      }
      attribute.needsUpdate = true;
    },
    update(delta) {
      if (!active) return;
      timer += delta;
      const attribute = geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        velocities[i].y += -9 * delta;
        attribute.array[idx] += velocities[i].x * delta;
        attribute.array[idx + 1] += velocities[i].y * delta;
        attribute.array[idx + 2] += velocities[i].z * delta;
      }
      attribute.needsUpdate = true;
      points.material.opacity = Math.max(0, 1 - timer * 1);
      ripple.scale.setScalar(1 + timer * 3);
      ripple.material.opacity = Math.max(0, 0.8 - timer * 0.5);
      if (timer > 1.6) {
        points.visible = false;
        ripple.visible = false;
        active = false;
      }
    },
  };
}
