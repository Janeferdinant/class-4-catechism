import test from 'node:test';
import assert from 'node:assert/strict';

test('MotionGraphicsEngine 3D tilt calculation and particle simulation', async () => {
  const { MotionGraphicsEngine } = await import('../src/components/MotionGraphicsEngine.js');
  const engine = new MotionGraphicsEngine();

  // Test 3D tilt calculation
  const mockRect = { left: 100, top: 100, width: 400, height: 300 };
  
  // Center point -> 0 tilt
  const centerTilt = engine.calculateTilt(300, 250, mockRect, 20);
  assert.equal(Math.round(centerTilt.rotateX), 0);
  assert.equal(Math.round(centerTilt.rotateY), 0);

  // Top-left cursor -> positive rotateX, negative rotateY
  const topLeftTilt = engine.calculateTilt(100, 100, mockRect, 20);
  assert.ok(topLeftTilt.rotateX > 0);
  assert.ok(topLeftTilt.rotateY < 0);

  // Particle simulation creation
  const particles = engine.createParticleBatch(30, 800, 600);
  assert.equal(particles.length, 30);
  assert.ok(particles[0].x >= 0 && particles[0].x <= 800);
  assert.ok(particles[0].y >= 0 && particles[0].y <= 600);
  assert.ok(particles[0].radius > 0);
  assert.ok(particles[0].color);

  // Simulation tick updates positions
  const initialY = particles[0].y;
  engine.tickParticles(particles, 800, 600);
  assert.notEqual(particles[0].y, initialY);
});
