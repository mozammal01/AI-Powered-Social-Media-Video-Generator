import * as THREE from "three";

export interface FluidParticle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: THREE.Color;
  radius: number;
  type: "cyan" | "gold" | "blue";
}

export interface FluidState {
  particles: FluidParticle[];
}

const CONTAINER_RADIUS = 8.0;
const PARTICLE_COUNT = 165;
const SMOOTHING_RADIUS = 1.0; // Distance for particle interaction
const REPULSION_FORCE = 160.0; // Repulsion constant
const COHESION_FORCE = 30.0;  // Attraction constant
const VISCOSITY = 4.5;        // Fluid viscosity (damping between neighbors)
const GRAVITY = -15.0;        // Downward gravity acceleration
const WORLD_DRAG = 0.8;       // Air resistance/damping
const RESTITUTION = 0.35;     // Container wall bounce energy retention
const WALL_FRICTION = 0.15;   // Friction along container wall
const BOND_THRESHOLD = 0.75;  // Max distance to draw a bond

// Seeded random number generator for deterministic initialization
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function getInitialFluidState(): FluidState {
  const particles: FluidParticle[] = [];
  
  // Define colors
  const colorCyan = new THREE.Color("#00f2fe");
  const colorGold = new THREE.Color("#ffb300");
  const colorBlue = new THREE.Color("#0072ff");

  let seed = 1234.56;
  
  // We want to create a clump of particles in the upper left area of the container
  const clumpCenter = new THREE.Vector3(-3.0, 3.5, 0.0);
  const clumpRadius = 2.4;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Generate point in sphere using rejection sampling
    let px = 0, py = 0, pz = 0;
    let d = 999;
    while (d > clumpRadius) {
      px = (seededRandom(seed++) * 2 - 1) * clumpRadius;
      py = (seededRandom(seed++) * 2 - 1) * clumpRadius;
      pz = (seededRandom(seed++) * 2 - 1) * clumpRadius;
      d = Math.sqrt(px * px + py * py + pz * pz);
    }

    const typeVal = i % 3;
    let color = colorCyan;
    let type: "cyan" | "gold" | "blue" = "cyan";
    
    if (typeVal === 1) {
      color = colorGold;
      type = "gold";
    } else if (typeVal === 2) {
      color = colorBlue;
      type = "blue";
    }

    // Initial velocity directed diagonally down-right with a bit of dispersion
    const vx = 4.5 + (seededRandom(seed++) * 2 - 1) * 1.5;
    const vy = -9.0 + (seededRandom(seed++) * 2 - 1) * 2.0;
    const vz = 0.0 + (seededRandom(seed++) * 2 - 1) * 1.5;

    particles.push({
      id: i,
      x: clumpCenter.x + px,
      y: clumpCenter.y + py,
      z: clumpCenter.z + pz,
      vx,
      vy,
      vz,
      color,
      radius: 0.25,
      type
    });
  }

  return { particles };
}

export function updateFluidPhysics(state: FluidState, dt: number): FluidState {
  const particles = state.particles.map(p => ({ ...p }));
  const n = particles.length;

  // Arrays to hold accelerations
  const ax = new Float32Array(n);
  const ay = new Float32Array(n);
  const az = new Float32Array(n);

  // 1. Calculate Pairwise Particle-Particle Forces (SPH-like repulsion/cohesion/viscosity)
  for (let i = 0; i < n; i++) {
    const pi = particles[i];
    
    // Add external forces (Gravity & Drag)
    ax[i] = -pi.vx * WORLD_DRAG;
    ay[i] = GRAVITY - pi.vy * WORLD_DRAG;
    az[i] = -pi.vz * WORLD_DRAG;

    // Small random Brownian motion
    const theta = seededRandom(pi.id * 1.7 + i) * Math.PI * 2;
    const phi = Math.acos(seededRandom(pi.id * 2.3 + i) * 2 - 1);
    const brownianScale = 1.2;
    ax[i] += Math.sin(phi) * Math.cos(theta) * brownianScale;
    ay[i] += Math.sin(phi) * Math.sin(theta) * brownianScale;
    az[i] += Math.cos(phi) * brownianScale;

    for (let j = i + 1; j < n; j++) {
      const pj = particles[j];

      const dx = pj.x - pi.x;
      const dy = pj.y - pi.y;
      const dz = pj.z - pi.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.0001; // Avoid divide by zero

      if (dist < SMOOTHING_RADIUS) {
        // Normal direction
        const nx = dx / dist;
        const ny = dy / dist;
        const nz = dz / dist;

        // Overlap ratio for pressure/repulsion
        const overlap = SMOOTHING_RADIUS - dist;

        // Repulsion (short range)
        // Strong force that keeps particles apart
        const fRep = REPULSION_FORCE * overlap * overlap;
        
        // Cohesion (attraction at medium range)
        // Attractive force that peaks inside the smoothing radius
        // Maximum attraction when dist is around 0.5 * SMOOTHING_RADIUS
        const fCoh = COHESION_FORCE * dist * (SMOOTHING_RADIUS - dist);
        
        const fNet = -fRep + fCoh;

        // Viscosity damping between neighbor velocities
        const rVz = pj.vz - pi.vz;
        const rVy = pj.vy - pi.vy;
        const rVx = pj.vx - pi.vx;
        
        // Damping force along relative velocity
        const vDamp = (SMOOTHING_RADIUS - dist) * VISCOSITY;
        const fVx = rVx * vDamp;
        const fVy = rVy * vDamp;
        const fVz = rVz * vDamp;

        // Apply forces to particle i (opposite to normal)
        ax[i] += nx * fNet + fVx;
        ay[i] += ny * fNet + fVy;
        az[i] += nz * fNet + fVz;

        // Apply equal and opposite forces to particle j
        ax[j] -= nx * fNet + fVx;
        ay[j] -= ny * fNet + fVy;
        az[j] -= nz * fNet + fVz;
      }
    }
  }

  // 2. Integrate Equations of Motion (Euler-Cromer)
  for (let i = 0; i < n; i++) {
    const p = particles[i];
    
    // Update velocity
    p.vx += ax[i] * dt;
    p.vy += ay[i] * dt;
    p.vz += az[i] * dt;

    // Update position
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.z += p.vz * dt;

    // 3. Container Sphere Boundary Collision
    const distFromCenter = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
    const limit = CONTAINER_RADIUS - p.radius;
    
    if (distFromCenter > limit) {
      // Normal vector
      const nx = p.x / distFromCenter;
      const ny = p.y / distFromCenter;
      const nz = p.z / distFromCenter;

      // Project back inside container
      p.x = nx * limit;
      p.y = ny * limit;
      p.z = nz * limit;

      // Component of velocity along normal
      const vNormal = p.vx * nx + p.vy * ny + p.vz * nz;

      // Only reflect if velocity is pointing outward
      if (vNormal > 0) {
        // Normal and tangential velocities
        const vNx = nx * vNormal;
        const vNy = ny * vNormal;
        const vNz = nz * vNormal;

        const vTx = p.vx - vNx;
        const vTy = p.vy - vNy;
        const vTz = p.vz - vNz;

        // Reflect normal component with restitution, apply friction to tangent
        p.vx = vTx * (1 - WALL_FRICTION) - vNx * RESTITUTION;
        p.vy = vTy * (1 - WALL_FRICTION) - vNy * RESTITUTION;
        p.vz = vTz * (1 - WALL_FRICTION) - vNz * RESTITUTION;
      }
    }
  }

  return { particles };
}

// Generates the line segment vertices for the dynamic molecular bonds
export function getFluidBonds(state: FluidState): Float32Array {
  const particles = state.particles;
  const n = particles.length;
  const points: number[] = [];

  for (let i = 0; i < n; i++) {
    const pi = particles[i];
    for (let j = i + 1; j < n; j++) {
      const pj = particles[j];
      const dx = pj.x - pi.x;
      const dy = pj.y - pi.y;
      const dz = pj.z - pi.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < BOND_THRESHOLD) {
        // Add segment endpoints
        points.push(pi.x, pi.y, pi.z);
        points.push(pj.x, pj.y, pj.z);
      }
    }
  }

  return new Float32Array(points);
}
