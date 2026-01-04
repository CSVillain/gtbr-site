import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

const DROP_DURATION = 0.55;
const RUN_DURATION = 5.1;
const PROGRESS_POWER = 1.9;
const TRACK_CLEARANCE = 0.18;
const GRAVITY = new THREE.Vector3(0, -9.8, 0);
const UP = new THREE.Vector3(0, 1, 0);

export class Sequence {
  constructor({ ball, spline, splash, oceanHeight, ballRadius }) {
    this.ball = ball;
    this.spline = spline;
    this.splash = splash;
    this.oceanHeight = oceanHeight;
    this.ballRadius = ballRadius;

    this.state = 'idle';
    this.runProgress = 0;
    this.runStarted = false;
    this.dropTimer = 0;
    this.flightVelocity = new THREE.Vector3();
    this.axis = new THREE.Vector3();
    this.tangent = new THREE.Vector3();
    this.lastPosition = new THREE.Vector3();
    this.runElapsed = 0;
    this.binormal = new THREE.Vector3();
    this.contactNormal = new THREE.Vector3(0, 1, 0);

    this.overlay = document.getElementById('fade-overlay');
    this.title = document.getElementById('gtbr-text');
    this.overlay.style.backgroundColor = 'rgba(0,0,0,0)';
    this.title.style.opacity = '0';

    const startPoint = this.spline.getPointAt(0);
    this.ball.position.copy(startPoint).add(new THREE.Vector3(0, this.ballRadius + 0.04, 0));
    this.ball.quaternion.identity();

    this.handleStart = this.handleStart.bind(this);
    window.addEventListener('pointerdown', this.handleStart);

    this.splashTimer = 0;
    this.outroTimer = 0;
  }

  handleStart() {
    if (this.state !== 'idle') return;
    window.removeEventListener('pointerdown', this.handleStart);
    this.startRun();
  }

  startRun() {
    this.state = 'run';
    this.runProgress = 0;
    this.runStarted = false;
    this.dropTimer = 0;
    this.runElapsed = 0;
    this.ball.visible = true;
    const startPoint = this.spline.getPointAt(0);
    this.ball.position.copy(startPoint).add(new THREE.Vector3(0, this.ballRadius + 0.04, 0));
    this.ball.quaternion.identity();
    this.lastPosition.copy(this.ball.position);
  }

  update(delta) {
    this.splash.update(delta);
    if (this.state === 'run') this.updateRun(delta);
    else if (this.state === 'flight') this.updateFlight(delta);
    else if (this.state === 'splash') this.updateSplash(delta);
    else if (this.state === 'outro') this.updateOutro(delta);
  }

  updateRun(delta) {
    if (this.dropTimer < DROP_DURATION) {
      this.dropTimer = Math.min(DROP_DURATION, this.dropTimer + delta);
      const t = this.dropTimer / DROP_DURATION;
      const start = this.spline.getPointAt(0);
      const dropHeight = this.ballRadius + 0.08;
      this.ball.position.copy(start).add(new THREE.Vector3(0, dropHeight * (1 - THREE.MathUtils.smoothstep(t, 0, 1)), 0));
      return;
    }

    if (!this.runStarted) {
      this.runStarted = true;
      this.runElapsed = 0;
      this.lastPosition.copy(this.ball.position);
    }

    this.runElapsed += delta;
    const normalized = THREE.MathUtils.clamp(this.runElapsed / RUN_DURATION, 0, 1);
    this.runProgress = Math.min(1, Math.pow(normalized, PROGRESS_POWER));

    this.tangent.copy(this.spline.getTangentAt(this.runProgress)).normalize();
    this.binormal.crossVectors(this.tangent, UP);
    if (this.binormal.lengthSq() < 1e-4) {
      this.binormal.set(0, 0, 1);
    }
    this.contactNormal.crossVectors(this.binormal, this.tangent).normalize();
    const point = this.spline.getPointAt(this.runProgress);
    const clearance = this.ballRadius + TRACK_CLEARANCE;
    this.ball.position.copy(point).addScaledVector(this.contactNormal, clearance);

    const travel = point.distanceTo(this.lastPosition);
    if (travel > 1e-5) {
        this.axis.crossVectors(this.contactNormal, this.tangent).normalize();
      if (this.axis.lengthSq() > 1e-4) {
        const angle = travel / this.ballRadius;
        const rotation = new THREE.Quaternion().setFromAxisAngle(this.axis, angle);
        this.ball.quaternion.multiplyQuaternions(rotation, this.ball.quaternion);
      }
    }
    this.lastPosition.copy(point);

    if (normalized >= 1) {
      this.transitionToFlight();
    }
  }

  transitionToFlight() {
    this.state = 'flight';
    this.flightVelocity.copy(this.spline.getTangentAt(1)).normalize().multiplyScalar(6.2);
    this.flightVelocity.y += 1.8;
  }

  updateFlight(delta) {
    this.flightVelocity.addScaledVector(GRAVITY, delta);
    const step = this.flightVelocity.clone().multiplyScalar(delta);
    this.ball.position.add(step);

    const travel = step.length();
    if (travel > 1e-5) {
      this.axis.crossVectors(this.flightVelocity, UP).normalize();
      if (this.axis.lengthSq() > 1e-4) {
        const angle = travel / this.ballRadius;
        const rotation = new THREE.Quaternion().setFromAxisAngle(this.axis, angle);
        this.ball.quaternion.multiplyQuaternions(rotation, this.ball.quaternion);
      }
    }

    if (this.ball.position.y <= this.oceanHeight + this.ballRadius * 0.4) {
      this.ball.position.y = this.oceanHeight + this.ballRadius * 0.4;
      this.transitionToSplash();
    }
  }

  transitionToSplash() {
    this.state = 'splash';
    this.splash.trigger(this.ball.position);
    this.ball.visible = false;
    this.splashTimer = 0;
  }

  updateSplash(delta) {
    this.splashTimer += delta;
    const alpha = THREE.MathUtils.lerp(0.2, 0.7, THREE.MathUtils.clamp(this.splashTimer / 1.2, 0, 1));
    this.overlay.style.backgroundColor = `rgba(0,0,0,${alpha})`;
    if (this.splashTimer > 1.4) {
      this.state = 'outro';
      this.outroTimer = 0;
    }
  }

  updateOutro(delta) {
    this.outroTimer += delta;
    const fade = THREE.MathUtils.clamp((this.outroTimer - 0.3) / 1.5, 0, 1);
    const fadeAlpha = THREE.MathUtils.clamp(0.6 + fade * 0.3, 0, 1);
    this.overlay.style.backgroundColor = `rgba(0,0,0,${fadeAlpha})`;
    this.title.style.opacity = `${fade}`;
  }
}
