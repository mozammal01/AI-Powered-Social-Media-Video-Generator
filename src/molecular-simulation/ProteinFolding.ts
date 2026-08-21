import * as THREE from "three";

export interface ProteinState {
  residues: THREE.Vector3[];
  foldingProgress: number; // 0 to 1
  hBonds: { start: THREE.Vector3; end: THREE.Vector3; progress: number }[];
}

const RESIDUE_COUNT = 35;

// Define unfolded positions (A) - a gentle wavy helix along the X axis
function getUnfoldedPosition(i: number): THREE.Vector3 {
  const spacing = 0.55;
  const x = (i - RESIDUE_COUNT / 2) * spacing;
  const y = Math.sin(i * 0.8) * 0.7;
  const z = Math.cos(i * 0.8) * 0.7;
  return new THREE.Vector3(x, y, z);
}

// Define folded positions (B) - structured into Alpha Helix, Beta Sheet, and Loop
function getFoldedPosition(i: number): THREE.Vector3 {
  // Alpha-helix section (Residues 0 to 12)
  if (i <= 12) {
    const helixRadius = 0.9;
    const pitch = 0.28; // Helix translation along axis per index
    const angleStep = 1.35; // Rotation per index
    
    // Aligned along X/Y diagonal
    const t = i;
    const x = -4.2 + t * pitch * 0.8;
    const y = -1.5 + t * pitch * 0.6 + Math.sin(t * angleStep) * helixRadius;
    const z = 0.0 + Math.cos(t * angleStep) * helixRadius;
    return new THREE.Vector3(x, y, z);
  }
  
  // Beta-hairpin section (Residues 13 to 24)
  // Two antiparallel strands forming a hairpin loop
  if (i <= 24) {
    const t = i - 13; // 0 to 11
    
    if (t < 5) {
      // Strand 1 (going right-forward)
      const x = 0.5 + t * 0.55;
      const y = -0.5 + t * 0.2;
      const z = -0.6;
      return new THREE.Vector3(x, y, z);
    } else if (t === 5 || t === 6) {
      // Hairpin loop curve (around the turn)
      const theta = ((t - 5) / 2) * Math.PI + Math.PI / 4;
      const radius = 0.65;
      const x = 3.1 + Math.sin(theta) * radius;
      const y = 0.4 + Math.cos(theta) * radius;
      const z = -0.4;
      return new THREE.Vector3(x, y, z);
    } else {
      // Strand 2 (going left-backward, parallel to Strand 1)
      const k = 11 - t; // 0 to 4
      const x = 0.5 + k * 0.55;
      const y = 0.7 + k * 0.2;
      const z = -0.1;
      return new THREE.Vector3(x, y, z);
    }
  }

  // Random coil/loop section wrapping around (Residues 25 to 34)
  const t = i - 25; // 0 to 9
  // Wrap around towards the alpha-helix to create a compact globule
  const splinePoints = [
    new THREE.Vector3(0.5, 0.9, -0.1),
    new THREE.Vector3(-0.8, 1.2, 0.4),
    new THREE.Vector3(-2.2, 1.6, 0.2),
    new THREE.Vector3(-3.2, 0.8, -0.8),
    new THREE.Vector3(-2.0, -1.0, -1.2),
    new THREE.Vector3(-0.6, -1.5, -0.8),
    new THREE.Vector3(0.8, -1.8, -0.2),
    new THREE.Vector3(1.8, -1.2, 0.5),
    new THREE.Vector3(2.5, -0.5, 0.8),
    new THREE.Vector3(3.2, 0.2, 0.5)
  ];
  return splinePoints[t] || new THREE.Vector3(3, 0, 0);
}

// Generate the complete protein state at a specific frame
export function getProteinState(frame: number): ProteinState {
  const startFrame = 110;
  const endFrame = 180;
  
  // Calculate folding progress (u) from 0 to 1 with smooth S-curve
  let u = 0;
  if (frame > endFrame) {
    u = 1;
  } else if (frame >= startFrame) {
    const progress = (frame - startFrame) / (endFrame - startFrame);
    u = (1 - Math.cos(progress * Math.PI)) / 2; // Smooth sine ease
  }

  const residues: THREE.Vector3[] = [];
  
  for (let i = 0; i < RESIDUE_COUNT; i++) {
    const posA = getUnfoldedPosition(i);
    const posB = getFoldedPosition(i);
    
    // Smooth interpolation
    const currentPos = new THREE.Vector3().lerpVectors(posA, posB, u);
    
    // Thermal fluctuations (amplitude decreases slightly as structure folds/stabilizes)
    const wiggleAmp = 0.12 * (1.0 - u * 0.6);
    const timeScale = 0.15;
    const dx = Math.sin(frame * timeScale + i * 0.9) * wiggleAmp;
    const dy = Math.cos(frame * timeScale * 0.8 + i * 1.1) * wiggleAmp;
    const dz = Math.sin(frame * timeScale * 1.2 + i * 0.7) * wiggleAmp;
    
    currentPos.add(new THREE.Vector3(dx, dy, dz));
    residues.push(currentPos);
  }

  // Identify hydrogen bonds that form during folding
  // Defined by index pairs in the folded state, forming as u increases
  const potentialHBonds = [
    // Helix bonds (i to i+4)
    { a: 0, b: 4 }, { a: 1, b: 5 }, { a: 2, b: 6 }, { a: 3, b: 7 },
    { a: 4, b: 8 }, { a: 5, b: 9 }, { a: 6, b: 10 }, { a: 7, b: 11 }, { a: 8, b: 12 },
    // Beta-sheet bonds
    { a: 13, b: 24 }, { a: 15, b: 22 }, { a: 17, b: 20 }
  ];

  const hBonds: { start: THREE.Vector3; end: THREE.Vector3; progress: number }[] = [];
  potentialHBonds.forEach(bond => {
    const start = residues[bond.a];
    const end = residues[bond.b];
    const dist = start.distanceTo(end);
    
    // Hydrogen bonds form when atoms come close in 3D space
    // Standard H-bond distance is around 2.7 to 3.1 Angstroms.
    // In our scene coordinates, this triggers when distance falls below 1.5 units.
    if (dist < 1.5) {
      // Calculate how close the bond is to its ideal stabilized distance (say 1.0)
      const bondProgress = Math.min(1.0, (1.5 - dist) / 0.5);
      hBonds.push({
        start: start.clone(),
        end: end.clone(),
        progress: bondProgress
      });
    }
  });

  return { residues, foldingProgress: u, hBonds };
}

// Dynamically generate the helical ribbon mesh geometry for the Alpha-Helix (residues 0 to 12)
export function getAlphaHelixRibbon(residues: THREE.Vector3[], progress: number): THREE.BufferGeometry {
  const numResidues = 13;
  
  // 1. Create a smooth Catmull-Rom spline through the alpha-helix residues
  const curvePoints = residues.slice(0, numResidues);
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  
  const divisions = 80;
  const splinePoints = curve.getPoints(divisions);
  const tangents = splinePoints.map((_, idx) => curve.getTangentAt(idx / divisions));

  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // Ribbon dimensions
  const ribbonWidth = 0.42 * progress; // Scales up as folding stabilizes
  const helixOffsetRadius = 0.55 * progress;
  const helixFrequency = 4.8; // Number of twists

  let binormal = new THREE.Vector3();
  let normal = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  // 2. Generate double-sided strip vertices winding in a helix around the spline
  for (let i = 0; i <= divisions; i++) {
    const p = splinePoints[i];
    const t = tangents[i];
    const tRatio = i / divisions;

    // Calculate Frenet-like frame reference vectors
    binormal.crossVectors(t, up).normalize();
    if (binormal.lengthSq() < 0.001) {
      binormal.set(0, 0, 1).cross(t).normalize();
    }
    normal.crossVectors(binormal, t).normalize();

    // Create helical winding offset angle
    const angle = tRatio * Math.PI * 2 * helixFrequency;
    const radialX = Math.sin(angle) * helixOffsetRadius;
    const radialY = Math.cos(angle) * helixOffsetRadius;

    // Center point of ribbon
    const ribbonCenter = p.clone()
      .addScaledVector(binormal, radialX)
      .addScaledVector(normal, radialY);

    // Left and right edges of ribbon, aligned along the normal
    const leftVertex = ribbonCenter.clone().addScaledVector(binormal, ribbonWidth / 2);
    const rightVertex = ribbonCenter.clone().addScaledVector(binormal, -ribbonWidth / 2);

    vertices.push(leftVertex.x, leftVertex.y, leftVertex.z);
    vertices.push(rightVertex.x, rightVertex.y, rightVertex.z);

    // Assign normals (facing outwards from ribbon center)
    normals.push(normal.x, normal.y, normal.z);
    normals.push(normal.x, normal.y, normal.z);

    uvs.push(tRatio, 0);
    uvs.push(tRatio, 1);
  }

  // 3. Define indices for double-sided triangles
  for (let i = 0; i < divisions; i++) {
    const idx0 = i * 2;
    const idx1 = i * 2 + 1;
    const idx2 = (i + 1) * 2;
    const idx3 = (i + 1) * 2 + 1;

    // Face 1
    indices.push(idx0, idx2, idx1);
    indices.push(idx1, idx2, idx3);

    // Face 2 (backside for rendering without backface culling issues)
    indices.push(idx0, idx1, idx2);
    indices.push(idx1, idx3, idx2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  return geometry;
}

// Dynamically generate the flat arrow ribbon mesh geometry for the Beta-Sheet (residues 13 to 24)
export function getBetaSheetRibbon(residues: THREE.Vector3[], progress: number): THREE.BufferGeometry {
  const numResidues = 12;
  const startIdx = 13;
  
  // Create spline through beta-hairpin residues
  const curvePoints = residues.slice(startIdx, startIdx + numResidues);
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  
  const divisions = 60;
  const splinePoints = curve.getPoints(divisions);
  const tangents = splinePoints.map((_, idx) => curve.getTangentAt(idx / divisions));

  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const baseWidth = 0.5 * progress;
  let binormal = new THREE.Vector3();
  let normal = new THREE.Vector3();
  const up = new THREE.Vector3(0, 0, 1);

  // Generate flat ribbon vertices
  for (let i = 0; i <= divisions; i++) {
    const p = splinePoints[i];
    const t = tangents[i];
    const tRatio = i / divisions;

    // Reference frame perpendiculars
    binormal.crossVectors(t, up).normalize();
    if (binormal.lengthSq() < 0.001) {
      binormal.set(1, 0, 0).cross(t).normalize();
    }
    normal.crossVectors(binormal, t).normalize();

    // Create an arrowhead effect at the very end of the beta sheet (tRatio > 0.85)
    let width = baseWidth;
    if (tRatio > 0.82 && tRatio <= 0.90) {
      // Flares out wide to form arrow ears
      const flareRatio = (tRatio - 0.82) / 0.08;
      width = baseWidth * (1.0 + flareRatio * 0.45);
    } else if (tRatio > 0.90) {
      // Tapers to a point at the end
      const taperRatio = (1.0 - tRatio) / 0.10;
      width = baseWidth * 1.45 * taperRatio;
    }

    const leftVertex = p.clone().addScaledVector(binormal, width / 2);
    const rightVertex = p.clone().addScaledVector(binormal, -width / 2);

    vertices.push(leftVertex.x, leftVertex.y, leftVertex.z);
    vertices.push(rightVertex.x, rightVertex.y, rightVertex.z);

    // Normal faces flat upward relative to sheet path
    normals.push(normal.x, normal.y, normal.z);
    normals.push(normal.x, normal.y, normal.z);

    uvs.push(tRatio, 0);
    uvs.push(tRatio, 1);
  }

  // Connect face indices
  for (let i = 0; i < divisions; i++) {
    const idx0 = i * 2;
    const idx1 = i * 2 + 1;
    const idx2 = (i + 1) * 2;
    const idx3 = (i + 1) * 2 + 1;

    // Face 1
    indices.push(idx0, idx2, idx1);
    indices.push(idx1, idx2, idx3);

    // Face 2 (backside)
    indices.push(idx0, idx1, idx2);
    indices.push(idx1, idx3, idx2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  return geometry;
}
