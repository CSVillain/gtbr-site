import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

function buildWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, '#8f5737ff');
  gradient.addColorStop(0.5, '#d6a983ff');
  gradient.addColorStop(1, '#966042ff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    const height = canvas.height * 0.35 + Math.sin(i * 0.5) * 8;
    const alpha = 0.08 + Math.random() * 0.14;
    ctx.strokeStyle = `rgba(66, 32, 14, ${alpha})`;
    ctx.lineWidth = 2 + Math.random() * 1.8;
    ctx.moveTo(0, height);
    ctx.lineTo(canvas.width, height + Math.random() * 4 - 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.5, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWoodMaterial() {
  return new THREE.MeshPhysicalMaterial({
    map: buildWoodTexture(),
    color: 0x8b5a2b,
    roughness: 0.1,
    metalness: 0.08,
  });
}

export function createChromeMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 0.5,
    clearcoatRoughness: 0.08,
    reflectivity: 0.5,
  });
}

export function createWaterMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0x081c34,
    metalness: 0.00,
    roughness: 0.22,
    clearcoat: 0.55,
    clearcoatRoughness: 0.35,
    transmission: 0.3,
    transparent: true,
    opacity: 1.0,
    emissive: 0x060f20,
    emissiveIntensity: 0.5,
    side: THREE.DoubleSide,
  });
}
