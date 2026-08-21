import * as THREE from "three";

export interface CollisionAtom {
  id: number;
  molecule: "A" | "B";
  isCenter: boolean;
  color: THREE.Color;
  radius: number;
  position: THREE.Vector3;
}

export interface CollisionBond {
  startIdx: number;
  endIdx: number;
  molecule: "A" | "B";
  stretch: number; // 1.0 is normal, increases pre-collision, breaks post-collision
  active: boolean;
}

export interface CollisionState {
  atoms: CollisionAtom[];
  bonds: CollisionBond[];
  sparks: {
    position: THREE.Vector3;
    color: THREE.Color;
    size: number;
    opacity: number;
  }[];
  flashIntensity: number; // For rendering a full-screen or local bright white flash
  cameraShake: number;    // Amplitude of camera shake
}

// Seeded random number generator
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const COLLISION_FRAME = 225;
const START_FRAME = 200;

// Local coordinates for Molecule A (Ring - benzene like, 7 atoms)
const localAtomsA: { isCenter: boolean; pos: THREE.Vector3 }[] = [
  { isCenter: true, pos: new THREE.Vector3(0, 0, 0) }
];
for (let j = 0; j < 6; j++) {
  const theta = (j * Math.PI * 2) / 6;
  const radius = 1.25;
  localAtomsA.push({
    isCenter: false,
    pos: new THREE.Vector3(radius * Math.cos(theta), radius * Math.sin(theta), 0)
  });
}

// Local coordinates for Molecule B (Tetrahedral - 5 atoms)
const localAtomsB: { isCenter: boolean; pos: THREE.Vector3 }[] = [
  { isCenter: true, pos: new THREE.Vector3(0, 0, 0) },
  { isCenter: false, pos: new THREE.Vector3(0.9, 0.9, 0.9) },
  { isCenter: false, pos: new THREE.Vector3(-0.9, -0.9, 0.9) },
  { isCenter: false, pos: new THREE.Vector3(-0.9, 0.9, -0.9) },
  { isCenter: false, pos: new THREE.Vector3(0.9, -0.9, -0.9) }
];

export function getCollisionState(frame: number): CollisionState {
  const state: CollisionState = {
    atoms: [],
    bonds: [],
    sparks: [],
    flashIntensity: 0,
    cameraShake: 0
  };

  const colorCyan = new THREE.Color("#00f2fe");
  const colorGold = new THREE.Color("#ffb300");

  // Timings
  const dt = 1 / 30;

  // 1. Molecule centers and velocities before collision
  // Molecule A starts at left, flying right-down
  const startPosA = new THREE.Vector3(-9.0, 1.4, 0.0);
  const endPosA = new THREE.Vector3(0.0, 0.0, 0.0);
  const velA = new THREE.Vector3().subVectors(endPosA, startPosA).multiplyScalar(1 / ((COLLISION_FRAME - START_FRAME) * dt));

  // Molecule B starts at right, flying left-up
  const startPosB = new THREE.Vector3(9.0, -1.4, 0.0);
  const endPosB = new THREE.Vector3(0.0, 0.0, 0.0);
  const velB = new THREE.Vector3().subVectors(endPosB, startPosB).multiplyScalar(1 / ((COLLISION_FRAME - START_FRAME) * dt));

  // If before collision, molecules travel linearly towards the center
  if (frame < COLLISION_FRAME) {
    const progress = Math.max(0, (frame - START_FRAME) / (COLLISION_FRAME - START_FRAME));
    const centerA = new THREE.Vector3().lerpVectors(startPosA, endPosA, progress);
    const centerB = new THREE.Vector3().lerpVectors(startPosB, endPosB, progress);

    // Dynamic rotation of molecules during flight
    const rotAngleA = progress * Math.PI * 1.5;
    const rotAngleB = -progress * Math.PI * 1.2;

    const eulerA = new THREE.Euler(0, 0, rotAngleA);
    const eulerB = new THREE.Euler(progress * 0.5, rotAngleB, 0);

    // Place Molecule A atoms
    localAtomsA.forEach((la, idx) => {
      const pos = la.pos.clone().applyEuler(eulerA).add(centerA);
      state.atoms.push({
        id: idx,
        molecule: "A",
        isCenter: la.isCenter,
        color: colorCyan,
        radius: la.isCenter ? 0.55 : 0.38,
        position: pos
      });
    });

    // Place Molecule B atoms
    localAtomsB.forEach((la, idx) => {
      const pos = la.pos.clone().applyEuler(eulerB).add(centerB);
      state.atoms.push({
        id: localAtomsA.length + idx,
        molecule: "B",
        isCenter: la.isCenter,
        color: colorGold,
        radius: la.isCenter ? 0.60 : 0.42,
        position: pos
      });
    });

    // Setup A bonds
    // Central to ring
    for (let j = 1; j <= 6; j++) {
      state.bonds.push({ startIdx: 0, endIdx: j, molecule: "A", stretch: 1.0, active: true });
    }
    // Ring adjacent
    for (let j = 1; j <= 6; j++) {
      const next = j === 6 ? 1 : j + 1;
      state.bonds.push({ startIdx: j, endIdx: next, molecule: "A", stretch: 1.0, active: true });
    }

    // Setup B bonds
    const offsetB = localAtomsA.length;
    // Central to outer
    for (let j = 1; j <= 4; j++) {
      state.bonds.push({ startIdx: offsetB, endIdx: offsetB + j, molecule: "B", stretch: 1.0, active: true });
    }
    // Outer connections
    state.bonds.push({ startIdx: offsetB + 1, endIdx: offsetB + 2, molecule: "B", stretch: 1.0, active: true });
    state.bonds.push({ startIdx: offsetB + 2, endIdx: offsetB + 3, molecule: "B", stretch: 1.0, active: true });
    state.bonds.push({ startIdx: offsetB + 3, endIdx: offsetB + 1, molecule: "B", stretch: 1.0, active: true });
    state.bonds.push({ startIdx: offsetB + 1, endIdx: offsetB + 4, molecule: "B", stretch: 1.0, active: true });
    state.bonds.push({ startIdx: offsetB + 2, endIdx: offsetB + 4, molecule: "B", stretch: 1.0, active: true });
    state.bonds.push({ startIdx: offsetB + 3, endIdx: offsetB + 4, molecule: "B", stretch: 1.0, active: true });

    // Handle tiny pre-collision bond stretching (frame 220 to 224)
    if (frame >= COLLISION_FRAME - 5) {
      const stretchRatio = 1.0 + (frame - (COLLISION_FRAME - 5)) * 0.08;
      state.bonds.forEach(b => {
        b.stretch = stretchRatio;
      });
      // Add slight camera shake pre-collision
      state.cameraShake = (frame - (COLLISION_FRAME - 5)) * 0.04;
    }
  } else {
    // 2. Post-Collision Simulation (frame >= 225)
    const tPost = (frame - COLLISION_FRAME) * dt; // time since collision in seconds
    const drag = 1.6; // Air resistance on fragments
    
    // Set flash intensity and camera shake
    state.flashIntensity = Math.exp(-tPost * 8.0); // Bright flash that decays extremely fast
    state.cameraShake = Math.exp(-tPost * 3.5) * 1.5; // Strong shake on impact that dampens

    // Calculate positions of atoms after colliding
    // We assume they break apart with conservation of momentum and an added radial explosion force
    const centerAAtCollision = endPosA;
    const centerBAtCollision = endPosB;

    const rotAngleAAtCollision = Math.PI * 1.5;
    const rotAngleBAtCollision = -Math.PI * 1.2;

    const eulerA = new THREE.Euler(0, 0, rotAngleAAtCollision);
    const eulerB = new THREE.Euler(1.0 * 0.5, rotAngleBAtCollision, 0);

    // Initial position of each atom at the exact moment of collision
    const positionsAtCollision: THREE.Vector3[] = [];
    localAtomsA.forEach(la => {
      positionsAtCollision.push(la.pos.clone().applyEuler(eulerA).add(centerAAtCollision));
    });
    localAtomsB.forEach(la => {
      positionsAtCollision.push(la.pos.clone().applyEuler(eulerB).add(centerBAtCollision));
    });

    // Determine post-collision velocity vector for each atom
    const initialVelocities: THREE.Vector3[] = [];

    // Molecule A atoms
    localAtomsA.forEach((la, idx) => {
      // Base incoming velocity
      const v = velA.clone();
      
      // Add explosive radial expansion velocity from center of Molecule A
      const radialDir = la.isCenter 
        ? new THREE.Vector3(-1.0, 0.5, 0.5).normalize() 
        : la.pos.clone().applyEuler(eulerA).normalize();
      
      const expSpeed = la.isCenter ? 3.5 : 11.5;
      v.addScaledVector(radialDir, expSpeed);

      // Add a bit of random scatter to break perfect symmetry
      const seedVal = idx * 12.3;
      v.x += (seededRandom(seedVal) * 2 - 1) * 2.5;
      v.y += (seededRandom(seedVal + 1) * 2 - 1) * 2.5;
      v.z += (seededRandom(seedVal + 2) * 2 - 1) * 2.5;

      initialVelocities.push(v);
    });

    // Molecule B atoms
    localAtomsB.forEach((la, idx) => {
      // Base incoming velocity
      const v = velB.clone();
      
      // Radial direction
      const radialDir = la.isCenter 
        ? new THREE.Vector3(1.0, -0.5, -0.5).normalize() 
        : la.pos.clone().applyEuler(eulerB).normalize();
      
      const expSpeed = la.isCenter ? 4.0 : 13.0;
      v.addScaledVector(radialDir, expSpeed);

      // Random scatter
      const seedVal = (localAtomsA.length + idx) * 15.7;
      v.x += (seededRandom(seedVal) * 2 - 1) * 2.5;
      v.y += (seededRandom(seedVal + 1) * 2 - 1) * 2.5;
      v.z += (seededRandom(seedVal + 2) * 2 - 1) * 2.5;

      initialVelocities.push(v);
    });

    // Calculate integrated positions using viscous drag:
    // v(t) = v0 * exp(-drag * t)
    // x(t) = x0 + v0 * (1 - exp(-drag * t)) / drag
    const decayFactor = (1.0 - Math.exp(-drag * tPost)) / drag;

    // Place Molecule A atoms
    localAtomsA.forEach((la, idx) => {
      const pos0 = positionsAtCollision[idx];
      const v0 = initialVelocities[idx];
      const currentPos = pos0.clone().addScaledVector(v0, decayFactor);

      state.atoms.push({
        id: idx,
        molecule: "A",
        isCenter: la.isCenter,
        color: colorCyan,
        radius: la.isCenter ? 0.55 : 0.38,
        position: currentPos
      });
    });

    // Place Molecule B atoms
    const offsetB = localAtomsA.length;
    localAtomsB.forEach((la, idx) => {
      const pos0 = positionsAtCollision[offsetB + idx];
      const v0 = initialVelocities[offsetB + idx];
      const currentPos = pos0.clone().addScaledVector(v0, decayFactor);

      state.atoms.push({
        id: offsetB + idx,
        molecule: "B",
        isCenter: la.isCenter,
        color: colorGold,
        radius: la.isCenter ? 0.60 : 0.42,
        position: currentPos
      });
    });

    // Bonds are severed post collision. However, to make the breaking look dramatic,
    // we render bonds stretching and then dissolving over the first 3 frames after collision.
    const bondFadeFrames = 3;
    const framesPostCollision = frame - COLLISION_FRAME;
    const bondActive = framesPostCollision < bondFadeFrames;
    const bondStretch = 1.0 + framesPostCollision * 0.4;

    // Add A bonds (dissolving)
    for (let j = 1; j <= 6; j++) {
      state.bonds.push({ startIdx: 0, endIdx: j, molecule: "A", stretch: bondStretch, active: bondActive });
    }
    for (let j = 1; j <= 6; j++) {
      const next = j === 6 ? 1 : j + 1;
      state.bonds.push({ startIdx: j, endIdx: next, molecule: "A", stretch: bondStretch, active: bondActive });
    }

    // Add B bonds (dissolving)
    for (let j = 1; j <= 4; j++) {
      state.bonds.push({ startIdx: offsetB, endIdx: offsetB + j, molecule: "B", stretch: bondStretch, active: bondActive });
    }
    state.bonds.push({ startIdx: offsetB + 1, endIdx: offsetB + 2, molecule: "B", stretch: bondStretch, active: bondActive });
    state.bonds.push({ startIdx: offsetB + 2, endIdx: offsetB + 3, molecule: "B", stretch: bondStretch, active: bondActive });
    state.bonds.push({ startIdx: offsetB + 3, endIdx: offsetB + 1, molecule: "B", stretch: bondStretch, active: bondActive });
    state.bonds.push({ startIdx: offsetB + 1, endIdx: offsetB + 4, molecule: "B", stretch: bondStretch, active: bondActive });
    state.bonds.push({ startIdx: offsetB + 2, endIdx: offsetB + 4, molecule: "B", stretch: bondStretch, active: bondActive });
    state.bonds.push({ startIdx: offsetB + 3, endIdx: offsetB + 4, molecule: "B", stretch: bondStretch, active: bondActive });

    // 3. Generate Energy Sparks
    // We spawn 380 sparks at the origin on collision, flying outwards
    const sparkCount = 380;
    const sparkDrag = 2.4; // Sparks slow down faster than atoms
    const sparkDecayFactor = (1.0 - Math.exp(-sparkDrag * tPost)) / sparkDrag;

    const sparkColorCyan = new THREE.Color("#00f2fe");
    const sparkColorGold = new THREE.Color("#ffb300");
    const sparkColorRed = new THREE.Color("#ff3300");
    const sparkColorWhite = new THREE.Color("#ffffff");

    for (let j = 0; j < sparkCount; j++) {
      // Deterministic initial velocity
      const sparkSeed = j * 37.1;
      const speed = 7.0 + seededRandom(sparkSeed) * 22.0;

      // Spherical distribution
      const theta = seededRandom(sparkSeed + 1) * Math.PI * 2;
      const phi = Math.acos(seededRandom(sparkSeed + 2) * 2 - 1);
      
      const vx = Math.sin(phi) * Math.cos(theta) * speed;
      const vy = Math.sin(phi) * Math.sin(theta) * speed;
      const vz = Math.cos(phi) * speed;

      // Calculate current position
      const sparkPos = new THREE.Vector3(
        vx * sparkDecayFactor,
        vy * sparkDecayFactor,
        vz * sparkDecayFactor
      );

      // Determine spark color based on elapsed time since collision
      let color = sparkColorWhite;
      if (tPost < 0.18) {
        // White-hot transitioning to Cyan/Gold mix
        const mixRatio = tPost / 0.18;
        const targetColor = (j % 2 === 0) ? sparkColorCyan : sparkColorGold;
        color = new THREE.Color().lerpColors(sparkColorWhite, targetColor, mixRatio);
      } else if (tPost < 0.5) {
        // Cyan/Gold transitioning to pure Gold/Orange
        const mixRatio = (tPost - 0.18) / 0.32;
        const srcColor = (j % 2 === 0) ? sparkColorCyan : sparkColorGold;
        const targetColor = sparkColorGold.clone().add(sparkColorRed).multiplyScalar(0.5); // Orange
        color = new THREE.Color().lerpColors(srcColor, targetColor, mixRatio);
      } else {
        // Decaying to dark Red
        const mixRatio = Math.min(1.0, (tPost - 0.5) / 1.5);
        const srcColor = sparkColorGold.clone().add(sparkColorRed).multiplyScalar(0.5);
        color = new THREE.Color().lerpColors(srcColor, sparkColorRed, mixRatio);
      }

      // Size decays over time
      const baseSize = 0.15 + seededRandom(sparkSeed + 3) * 0.25;
      const size = Math.max(0.01, baseSize * Math.exp(-tPost * 1.8));

      // Opacity fades out towards the end of the video
      // The video ends at frame 300 (tPost = 2.5s)
      const opacity = Math.max(0, 1.0 - (tPost / 2.3));

      state.sparks.push({
        position: sparkPos,
        color,
        size,
        opacity
      });
    }
  }

  return state;
}
