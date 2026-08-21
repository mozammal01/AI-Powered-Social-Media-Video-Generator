import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import * as THREE from "three";
import { getInitialFluidState, updateFluidPhysics, getFluidBonds, FluidState } from "./FluidSimulation";
import { getProteinState, getAlphaHelixRibbon, getBetaSheetRibbon, ProteinState } from "./ProteinFolding";
import { getCollisionState, CollisionState } from "./AtomicCollision";

// Create deterministic caches to avoid re-simulating from frame 0 on every render
const fluidCache: { [frame: number]: FluidState } = {};
const proteinCache: { [frame: number]: ProteinState } = {};
const collisionCache: { [frame: number]: CollisionState } = {};

// Helper to retrieve fluid state deterministically with caching
function getCachedFluidState(targetFrame: number): FluidState {
  if (fluidCache[targetFrame]) return fluidCache[targetFrame];

  let startFrame = 0;
  let state = getInitialFluidState();

  // Find latest cached frame
  for (let f = targetFrame - 1; f >= 0; f--) {
    if (fluidCache[f]) {
      startFrame = f;
      state = JSON.parse(JSON.stringify(fluidCache[f]));
      // Re-convert color strings to THREE.Color after JSON parsing
      state.particles.forEach((p: any) => {
        p.color = new THREE.Color(p.color.r, p.color.g, p.color.b);
      });
      break;
    }
  }

  // Simulate forward
  const dt = 1 / 30;
  for (let f = startFrame; f < targetFrame; f++) {
    state = updateFluidPhysics(state, dt);
    fluidCache[f + 1] = JSON.parse(JSON.stringify(state));
  }

  // Ensure colors are reconstructed in the returned state
  const finalState = fluidCache[targetFrame] || state;
  finalState.particles.forEach((p: any) => {
    p.color = new THREE.Color(p.color.r, p.color.g, p.color.b);
  });
  return finalState;
}

// Helper to retrieve protein state (already deterministic, but cache for performance)
function getCachedProteinState(targetFrame: number): ProteinState {
  if (proteinCache[targetFrame]) return proteinCache[targetFrame];
  const state = getProteinState(targetFrame);
  proteinCache[targetFrame] = state;
  return state;
}

// Helper to retrieve collision state (already deterministic, cache for performance)
function getCachedCollisionState(targetFrame: number): CollisionState {
  if (collisionCache[targetFrame]) return collisionCache[targetFrame];
  const state = getCollisionState(targetFrame);
  collisionCache[targetFrame] = state;
  return state;
}

// Helper to create a glowing radial dot texture for points/particles
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.2, "rgba(255, 255, 255, 0.95)");
  grad.addColorStop(0.4, "rgba(0, 242, 254, 0.5)"); // Cyan glow boundary
  grad.addColorStop(0.7, "rgba(0, 114, 255, 0.1)");  // Blue outer halo
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Helper to generate camera shake offset deterministically
function getSeededShake(frame: number, intensity: number): THREE.Vector3 {
  if (intensity <= 0) return new THREE.Vector3(0, 0, 0);
  const x = (Math.sin(frame * 1.6) * 0.6 + Math.sin(frame * 3.4) * 0.4) * intensity;
  const y = (Math.cos(frame * 1.9) * 0.6 + Math.sin(frame * 2.8) * 0.4) * intensity;
  const z = (Math.sin(frame * 2.3) * 0.6 + Math.cos(frame * 4.1) * 0.4) * intensity;
  return new THREE.Vector3(x, y, z);
}

export const MolecularArtComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References to keep Three.js resources persistent across frame updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Scene 1 Objects
  const containerSphereRef = useRef<THREE.Mesh | null>(null);
  const containerGridRef = useRef<THREE.LineSegments | null>(null);
  const fluidInstancedMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const fluidBondsLineRef = useRef<THREE.LineSegments | null>(null);

  // Scene 2 Objects
  const proteinInstancedMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const alphaHelixRibbonRef = useRef<THREE.Mesh | null>(null);
  const betaSheetRibbonRef = useRef<THREE.Mesh | null>(null);
  const loopLineRef = useRef<THREE.LineSegments | null>(null);
  const proteinHBondsLineRef = useRef<THREE.LineSegments | null>(null);

  // Scene 3 Objects
  const collisionInstancedMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const collisionBondsLineRef = useRef<THREE.LineSegments | null>(null);
  const collisionSparksRef = useRef<THREE.Points | null>(null);

  // Transition Flash Light
  const flashOverlayRef = useRef<THREE.Mesh | null>(null);

  // 1. Initialize Three.js Scene and Objects once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;

    // Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 16);
    cameraRef.current = camera;

    // Setup Lighting
    const ambientLight = new THREE.AmbientLight("#0a1530", 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight("#00f2fe", 1.8);
    dirLight1.position.set(10, 12, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight("#ffb300", 1.2);
    dirLight2.position.set(-10, -8, 6);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight("#ffffff", 2.0, 30);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // ==========================================
    // SCENE 1: Fluid Dynamics inside Glass Sphere
    // ==========================================
    
    // Glass sphere container
    const sphereGeo = new THREE.SphereGeometry(8.0, 48, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: "#112244",
      transparent: true,
      opacity: 0.12,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9, // Gives it refraction properties
      ior: 1.15,
      thickness: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const containerSphere = new THREE.Mesh(sphereGeo, glassMat);
    scene.add(containerSphere);
    containerSphereRef.current = containerSphere;

    // Holographic grids wrapping sphere
    const edgeGeo = new THREE.EdgesGeometry(new THREE.SphereGeometry(8.02, 16, 12));
    const gridMat = new THREE.LineBasicMaterial({
      color: "#00f2fe",
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const containerGrid = new THREE.LineSegments(edgeGeo, gridMat);
    scene.add(containerGrid);
    containerGridRef.current = containerGrid;

    // Instanced mesh for fluid particles (165 particles)
    const particleGeo = new THREE.SphereGeometry(1, 10, 8); // radius 1, scaled in instance matrix
    const particleMat = new THREE.MeshStandardMaterial({
      roughness: 0.1,
      metalness: 0.3,
    });
    const fluidInstancedMesh = new THREE.InstancedMesh(particleGeo, particleMat, 165);
    scene.add(fluidInstancedMesh);
    fluidInstancedMeshRef.current = fluidInstancedMesh;

    // Fluid bonds segments (max 165*165 connections, starts empty)
    const fluidBondsGeo = new THREE.BufferGeometry();
    const fluidBondsMat = new THREE.LineBasicMaterial({
      color: "#00f2fe",
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const fluidBondsLine = new THREE.LineSegments(fluidBondsGeo, fluidBondsMat);
    scene.add(fluidBondsLine);
    fluidBondsLineRef.current = fluidBondsLine;

    // ==========================================
    // SCENE 2: Volumetric Protein Folding
    // ==========================================

    // Instanced mesh for protein residues (35 residues)
    const residueGeo = new THREE.SphereGeometry(0.35, 12, 10);
    const residueMat = new THREE.MeshStandardMaterial({
      roughness: 0.2,
      metalness: 0.1,
      emissive: new THREE.Color("#003366"),
      emissiveIntensity: 0.5,
    });
    const proteinInstancedMesh = new THREE.InstancedMesh(residueGeo, residueMat, 35);
    proteinInstancedMesh.visible = false;
    scene.add(proteinInstancedMesh);
    proteinInstancedMeshRef.current = proteinInstancedMesh;

    // Alpha-helix Ribbon Mesh (starts as empty geometry)
    const helixRibbonGeo = new THREE.BufferGeometry();
    const helixRibbonMat = new THREE.MeshStandardMaterial({
      color: "#00f2fe",
      emissive: "#0072ff",
      emissiveIntensity: 0.4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      roughness: 0.2,
      metalness: 0.1,
    });
    const alphaHelixRibbon = new THREE.Mesh(helixRibbonGeo, helixRibbonMat);
    alphaHelixRibbon.visible = false;
    scene.add(alphaHelixRibbon);
    alphaHelixRibbonRef.current = alphaHelixRibbon;

    // Beta-sheet Ribbon Mesh (starts as empty geometry)
    const sheetRibbonGeo = new THREE.BufferGeometry();
    const sheetRibbonMat = new THREE.MeshStandardMaterial({
      color: "#ffb300",
      emissive: "#ff3300",
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      roughness: 0.2,
      metalness: 0.1,
    });
    const betaSheetRibbon = new THREE.Mesh(sheetRibbonGeo, sheetRibbonMat);
    betaSheetRibbon.visible = false;
    scene.add(betaSheetRibbon);
    betaSheetRibbonRef.current = betaSheetRibbon;

    // Random Loop Segment Tube
    const loopGeo = new THREE.BufferGeometry();
    const loopMat = new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.5,
    });
    const loopLine = new THREE.LineSegments(loopGeo, loopMat);
    loopLine.visible = false;
    scene.add(loopLine);
    loopLineRef.current = loopLine;

    // Protein hydrogen bonds line segments
    const proteinHBondsGeo = new THREE.BufferGeometry();
    const proteinHBondsMat = new THREE.LineBasicMaterial({
      color: "#ffff99",
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const proteinHBondsLine = new THREE.LineSegments(proteinHBondsGeo, proteinHBondsMat);
    proteinHBondsLine.visible = false;
    scene.add(proteinHBondsLine);
    proteinHBondsLineRef.current = proteinHBondsLine;

    // ==========================================
    // SCENE 3: Atomic Collision and Sparks
    // ==========================================

    // Instanced mesh for collision reactants (12 atoms: 7 for A, 5 for B)
    const collisionAtomGeo = new THREE.SphereGeometry(1, 16, 12);
    const collisionAtomMat = new THREE.MeshStandardMaterial({
      roughness: 0.1,
      metalness: 0.2,
    });
    const collisionInstancedMesh = new THREE.InstancedMesh(collisionAtomGeo, collisionAtomMat, 12);
    collisionInstancedMesh.visible = false;
    scene.add(collisionInstancedMesh);
    collisionInstancedMeshRef.current = collisionInstancedMesh;

    // Bonds connecting the two reactant molecules
    const collisionBondsGeo = new THREE.BufferGeometry();
    const collisionBondsMat = new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const collisionBondsLine = new THREE.LineSegments(collisionBondsGeo, collisionBondsMat);
    collisionBondsLine.visible = false;
    scene.add(collisionBondsLine);
    collisionBondsLineRef.current = collisionBondsLine;

    // Energy sparks particle system (380 points)
    const sparksGeo = new THREE.BufferGeometry();
    const sparksMat = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: createGlowTexture(),
    });
    const collisionSparks = new THREE.Points(sparksGeo, sparksMat);
    collisionSparks.visible = false;
    scene.add(collisionSparks);
    collisionSparksRef.current = collisionSparks;

    // ==========================================
    // SCREEN GLOW TRANSITIONS OVERLAY
    // ==========================================
    const planeGeo = new THREE.PlaneGeometry(30, 20);
    const planeMat = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
    });
    const flashOverlay = new THREE.Mesh(planeGeo, planeMat);
    flashOverlay.position.set(0, 0, 5); // Put in front of camera
    scene.add(flashOverlay);
    flashOverlayRef.current = flashOverlay;

    return () => {
      // Clean up renderer on unmount
      renderer.dispose();
      sphereGeo.dispose();
      glassMat.dispose();
      edgeGeo.dispose();
      gridMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      fluidBondsGeo.dispose();
      fluidBondsMat.dispose();
      residueGeo.dispose();
      residueMat.dispose();
      helixRibbonGeo.dispose();
      helixRibbonMat.dispose();
      sheetRibbonGeo.dispose();
      sheetRibbonMat.dispose();
      loopGeo.dispose();
      loopMat.dispose();
      proteinHBondsGeo.dispose();
      proteinHBondsMat.dispose();
      collisionAtomGeo.dispose();
      collisionAtomMat.dispose();
      collisionBondsGeo.dispose();
      collisionBondsMat.dispose();
      sparksGeo.dispose();
      sparksMat.dispose();
      planeGeo.dispose();
      planeMat.dispose();
    };
  }, [width, height]);

  // 2. Synchronous update and render when 'frame' shifts (perfect for Remotion renders)
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    if (!scene || !camera || !renderer) return;

    // Define frame thresholds for phases
    // Phase 1 (Fluid): 0 -> 95
    // Phase 2 (Protein): 95 -> 195
    // Phase 3 (Collision): 195 -> 300

    // Transition 1 flash (frames 90 -> 100)
    let transitionFlash1 = 0;
    if (frame >= 90 && frame <= 100) {
      if (frame < 95) {
        transitionFlash1 = (frame - 90) / 5; // ramp up
      } else {
        transitionFlash1 = 1.0 - (frame - 95) / 5; // ramp down
      }
    }

    // Transition 2 flash (frames 190 -> 200)
    let transitionFlash2 = 0;
    if (frame >= 190 && frame <= 200) {
      if (frame < 195) {
        transitionFlash2 = (frame - 190) / 5;
      } else {
        transitionFlash2 = 1.0 - (frame - 195) / 5;
      }
    }

    // Dynamic Visibility based on phase
    const isFluidActive = frame < 98;
    const isProteinActive = frame >= 92 && frame < 198;
    const isCollisionActive = frame >= 192;

    // Apply visibility states
    if (containerSphereRef.current) containerSphereRef.current.visible = isFluidActive;
    if (containerGridRef.current) containerGridRef.current.visible = isFluidActive;
    if (fluidInstancedMeshRef.current) fluidInstancedMeshRef.current.visible = isFluidActive;
    if (fluidBondsLineRef.current) fluidBondsLineRef.current.visible = isFluidActive;

    if (proteinInstancedMeshRef.current) proteinInstancedMeshRef.current.visible = isProteinActive;
    if (alphaHelixRibbonRef.current) alphaHelixRibbonRef.current.visible = isProteinActive;
    if (betaSheetRibbonRef.current) betaSheetRibbonRef.current.visible = isProteinActive;
    if (loopLineRef.current) loopLineRef.current.visible = isProteinActive;
    if (proteinHBondsLineRef.current) proteinHBondsLineRef.current.visible = isProteinActive;

    if (collisionInstancedMeshRef.current) collisionInstancedMeshRef.current.visible = isCollisionActive;
    if (collisionBondsLineRef.current) collisionBondsLineRef.current.visible = isCollisionActive;
    if (collisionSparksRef.current) collisionSparksRef.current.visible = isCollisionActive;

    // ==========================================
    // UPDATE SCENE 1: SPH Fluid Dynamics
    // ==========================================
    if (isFluidActive) {
      const state = getCachedFluidState(frame);
      const instMesh = fluidInstancedMeshRef.current!;
      const dummy = new THREE.Object3D();

      // Update particle spheres inside instanced mesh
      state.particles.forEach((p, idx) => {
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.set(p.radius, p.radius, p.radius);
        dummy.updateMatrix();
        instMesh.setMatrixAt(idx, dummy.matrix);
        instMesh.setColorAt(idx, p.color);
      });
      instMesh.instanceMatrix.needsUpdate = true;
      if (instMesh.instanceColor) instMesh.instanceColor.needsUpdate = true;

      // Update fluid bonds connecting lines
      const bondsArr = getFluidBonds(state);
      const bondsGeo = fluidBondsLineRef.current!.geometry;
      bondsGeo.setAttribute("position", new THREE.Float32BufferAttribute(bondsArr, 3));
      bondsGeo.computeBoundingSphere();
      bondsGeo.computeBoundingBox();

      // Rotate glass grid container container slowly
      if (containerGridRef.current) {
        containerGridRef.current.rotation.y = frame * 0.003;
        containerGridRef.current.rotation.x = frame * 0.001;
      }
    }

    // ==========================================
    // UPDATE SCENE 2: Protein Folding
    // ==========================================
    if (isProteinActive) {
      const state = getCachedProteinState(frame);
      
      // Update protein residue spheres
      const instMesh = proteinInstancedMeshRef.current!;
      const dummy = new THREE.Object3D();
      
      const cyanColor = new THREE.Color("#00f2fe");
      const goldColor = new THREE.Color("#ffb300");
      const whiteColor = new THREE.Color("#ffffff");

      state.residues.forEach((pos, idx) => {
        dummy.position.copy(pos);
        dummy.scale.set(1.0, 1.0, 1.0);
        dummy.updateMatrix();
        instMesh.setMatrixAt(idx, dummy.matrix);

        // Assign colors based on secondary structure division
        if (idx <= 12) {
          instMesh.setColorAt(idx, cyanColor); // Helix
        } else if (idx <= 24) {
          instMesh.setColorAt(idx, goldColor); // Beta Sheet
        } else {
          instMesh.setColorAt(idx, whiteColor); // Random loop
        }
      });
      instMesh.instanceMatrix.needsUpdate = true;
      if (instMesh.instanceColor) instMesh.instanceColor.needsUpdate = true;

      // Update custom secondary structure ribbons
      const alphaRibbon = alphaHelixRibbonRef.current!;
      const betaRibbon = betaSheetRibbonRef.current!;
      const loopLine = loopLineRef.current!;

      // Ribbon geometries must be disposed and re-generated on frame change for real-time deformation
      alphaRibbon.geometry.dispose();
      alphaRibbon.geometry = getAlphaHelixRibbon(state.residues, state.foldingProgress);

      betaRibbon.geometry.dispose();
      betaRibbon.geometry = getBetaSheetRibbon(state.residues, state.foldingProgress);

      // Random loops connection line (residues 25 to 34)
      const loopPoints: number[] = [];
      for (let i = 24; i < state.residues.length - 1; i++) {
        const p1 = state.residues[i];
        const p2 = state.residues[i + 1];
        loopPoints.push(p1.x, p1.y, p1.z);
        loopPoints.push(p2.x, p2.y, p2.z);
      }
      loopLine.geometry.dispose();
      loopLine.geometry = new THREE.BufferGeometry();
      loopLine.geometry.setAttribute("position", new THREE.Float32BufferAttribute(loopPoints, 3));

      // Update hydrogen bonds dashed lines
      const hBondsPoints: number[] = [];
      state.hBonds.forEach(bond => {
        hBondsPoints.push(bond.start.x, bond.start.y, bond.start.z);
        hBondsPoints.push(bond.end.x, bond.end.y, bond.end.z);
      });
      const hBondsGeo = proteinHBondsLineRef.current!.geometry;
      hBondsGeo.setAttribute("position", new THREE.Float32BufferAttribute(hBondsPoints, 3));
      hBondsGeo.computeBoundingSphere();
      hBondsGeo.computeBoundingBox();
    }

    // ==========================================
    // UPDATE SCENE 3: Atomic Collision
    // ==========================================
    let impactIntensity = 0;
    if (isCollisionActive) {
      const state = getCachedCollisionState(frame);

      // Update collision atoms
      const instMesh = collisionInstancedMeshRef.current!;
      const dummy = new THREE.Object3D();
      state.atoms.forEach((atom, idx) => {
        dummy.position.copy(atom.position);
        dummy.scale.set(atom.radius, atom.radius, atom.radius);
        dummy.updateMatrix();
        instMesh.setMatrixAt(idx, dummy.matrix);
        instMesh.setColorAt(idx, atom.color);
      });
      instMesh.instanceMatrix.needsUpdate = true;
      if (instMesh.instanceColor) instMesh.instanceColor.needsUpdate = true;

      // Update collision chemical bonds (pre-collision or breaking)
      const bondsPoints: number[] = [];
      state.bonds.forEach(bond => {
        if (bond.active) {
          const start = state.atoms[bond.startIdx].position;
          const end = state.atoms[bond.endIdx].position;
          
          if (bond.stretch === 1.0) {
            bondsPoints.push(start.x, start.y, start.z);
            bondsPoints.push(end.x, end.y, end.z);
          } else {
            // Render stretching bonds vibrating outwards before breaking
            const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            
            // Draw half segments with gap to represent breaking tension
            const leftEnd = new THREE.Vector3().lerpVectors(center, start, 0.25 / bond.stretch);
            const rightEnd = new THREE.Vector3().lerpVectors(center, end, 0.25 / bond.stretch);
            
            bondsPoints.push(start.x, start.y, start.z);
            bondsPoints.push(leftEnd.x, leftEnd.y, leftEnd.z);

            bondsPoints.push(end.x, end.y, end.z);
            bondsPoints.push(rightEnd.x, rightEnd.y, rightEnd.z);
          }
        }
      });
      const collisionBondsGeo = collisionBondsLineRef.current!.geometry;
      collisionBondsGeo.setAttribute("position", new THREE.Float32BufferAttribute(bondsPoints, 3));
      collisionBondsGeo.computeBoundingSphere();
      collisionBondsGeo.computeBoundingBox();

      // Update energy sparks point particles
      if (state.sparks.length > 0) {
        const sparksArr: number[] = [];
        const colorsArr: number[] = [];
        const sizesArr: number[] = [];

        state.sparks.forEach(s => {
          sparksArr.push(s.position.x, s.position.y, s.position.z);
          colorsArr.push(s.color.r, s.color.g, s.color.b);
          sizesArr.push(s.size);
        });

        const sparksGeo = collisionSparksRef.current!.geometry;
        sparksGeo.setAttribute("position", new THREE.Float32BufferAttribute(sparksArr, 3));
        sparksGeo.setAttribute("color", new THREE.Float32BufferAttribute(colorsArr, 3));
        sparksGeo.computeBoundingSphere();
        sparksGeo.computeBoundingBox();

        // Dynamically adjust PointsMaterial size based on frame decay
        const tPost = (frame - 225) / 30;
        const mat = collisionSparksRef.current!.material as THREE.PointsMaterial;
        mat.size = 0.52 * Math.exp(-tPost * 0.9);
        mat.opacity = Math.max(0, 1.0 - tPost / 2.3);
      }

      impactIntensity = state.flashIntensity;
    }

    // ==========================================
    // CAMERAS AND TRANSITIONS FLOW
    // ==========================================
    let cameraPos = new THREE.Vector3(0, 0, 16);
    let cameraLookAt = new THREE.Vector3(0, 0, 0);

    if (frame < 95) {
      // Scene 1 Camera: Orbiting and zooming in
      const theta = frame * 0.018;
      // Normal distance is 15, zoom in starting at frame 70
      let dist = 16.0;
      if (frame >= 70) {
        const zoomProgress = (frame - 70) / 25; // 0 to 1
        dist = 16.0 - zoomProgress * 12.5; // fly deep in!
      }
      cameraPos.set(
        Math.cos(theta) * dist,
        2.5 + Math.sin(theta * 1.5) * 1.5,
        Math.sin(theta) * dist
      );
      cameraLookAt.set(0, 0.5, 0);
    } else if (frame < 195) {
      // Scene 2 Camera: Smooth structural orbit
      const phi = (frame - 95) * 0.012;
      // Zoom out from deep plunge to comfortable overview distance 12.0
      let dist = 11.5;
      if (frame < 120) {
        const zoomOutProgress = (frame - 95) / 25; // 0 to 1
        dist = 3.5 + zoomOutProgress * 8.0;
      }
      cameraPos.set(
        Math.cos(phi) * dist,
        1.5 + Math.sin(phi * 0.8) * 1.2,
        Math.sin(phi) * dist
      );
      // Pan camera slightly to center the protein molecule (centered around x=-1.0, y=-0.5)
      cameraLookAt.set(-0.8, -0.2, -0.2);
    } else {
      // Scene 3 Camera: Frontal collision view with heavy shake
      let dist = 11.0;
      const tCol = frame - 200;
      if (tCol < 25) {
        // Slow zoom in pre-collision (frames 200 to 225)
        const progress = tCol / 25;
        dist = 11.0 - progress * 1.5;
      } else {
        // Drifts back out slowly after impact (frames 225 to 300)
        const progress = (tCol - 25) / 75;
        dist = 9.5 + progress * 4.5;
      }

      // Base orbital pan after collision to show explosion in 3D
      let panX = 0;
      let panY = 0;
      let panZ = dist;
      if (frame > 225) {
        const angle = (frame - 225) * 0.007;
        panX = Math.sin(angle) * dist;
        panZ = Math.cos(angle) * dist;
        panY = angle * 2.0;
      }

      cameraPos.set(panX, panY, panZ);
      cameraLookAt.set(0, 0, 0);

      // Apply collision impact camera shake
      const shakeAmp = getCachedCollisionState(frame).cameraShake;
      const shakeOffset = getSeededShake(frame, shakeAmp);
      cameraPos.add(shakeOffset);
    }

    // Set camera transform
    camera.position.copy(cameraPos);
    camera.lookAt(cameraLookAt);

    // ==========================================
    // APPLY TRANSITIONS GLOW OVERLAYS
    // ==========================================
    const totalGlow = Math.max(transitionFlash1, transitionFlash2, impactIntensity);
    
    // Position glow plane directly in front of the camera, perpendicular to view vector
    if (flashOverlayRef.current) {
      const overlay = flashOverlayRef.current;
      
      // Calculate a point slightly in front of camera
      const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      overlay.position.copy(camera.position).addScaledVector(dir, 1.2);
      overlay.quaternion.copy(camera.quaternion);
      
      const mat = overlay.material as THREE.MeshBasicMaterial;
      mat.opacity = totalGlow;

      // Adjust color depending on transition
      if (impactIntensity > 0) {
        // Explosion flash: starts white-hot, fading into orange-red
        const postSec = (frame - 225) / 30;
        const color = new THREE.Color().lerpColors(
          new THREE.Color("#ffffff"),
          new THREE.Color("#ff5500"),
          Math.min(1.0, postSec * 3.5)
        );
        mat.color.copy(color);
      } else if (transitionFlash2 > 0) {
        // Transition 2: golden burst
        mat.color.set("#ffb300");
      } else {
        // Transition 1: cyan burst
        mat.color.set("#00f2fe");
      }
    }

    // Render Scene
    renderer.render(scene, camera);
  }, [frame, width, height]);

  // ==========================================
  // HUD TELEMETRY DATA CALCULATION FOR CURRENT FRAME
  // ==========================================
  const formatTimecode = (f: number) => {
    const sec = Math.floor(f / 30);
    const ms = Math.floor((f % 30) * 3.33);
    return `00:${sec.toString().padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
  };

  // Generate dynamic SVG chart paths based on current frame
  const getFluidChartPath = () => {
    let pts = "";
    for (let x = 0; x <= 100; x++) {
      const fEquivalent = (frame + x - 100);
      let val = 45; // default center line
      if (fEquivalent >= 0 && fEquivalent < 100) {
        // Splashing pressure waves
        val = 45 + Math.sin(fEquivalent * 0.15) * 15 + Math.cos(fEquivalent * 0.35) * 6;
        if (fEquivalent < 25) val += (25 - fEquivalent) * 1.2; // initial drop pressure peak
      }
      const y = val;
      pts += `${x === 0 ? "M" : "L"} ${x * 2.2} ${y}`;
    }
    return pts;
  };

  const getProteinChartPath = () => {
    let pts = "";
    for (let x = 0; x <= 100; x++) {
      const fEquivalent = (frame + x - 100);
      let yVal = 10; // high potential energy unfolded
      if (fEquivalent >= 110) {
        if (fEquivalent <= 180) {
          // Drops during folding
          const progress = (fEquivalent - 110) / 70;
          const eased = (1 - Math.cos(progress * Math.PI)) / 2;
          yVal = 10 + eased * 65;
        } else {
          yVal = 75; // stabilized folded state
        }
      }
      // Add slight wiggles for thermal noise
      if (fEquivalent >= 0) {
        yVal += Math.sin(fEquivalent * 0.4) * 1.5;
      }
      pts += `${x === 0 ? "M" : "L"} ${x * 2.2} ${yVal}`;
    }
    return pts;
  };

  const getCollisionChartPath = () => {
    let pts = "";
    for (let x = 0; x <= 100; x++) {
      const fEquivalent = (frame + x - 100);
      let yVal = 80; // baseline energy
      if (fEquivalent >= 225) {
        // Massive energy spike on collision
        const tPost = fEquivalent - 225;
        yVal = 80 - Math.exp(-tPost * 0.08) * 75;
      }
      pts += `${x === 0 ? "M" : "L"} ${x * 2.2} ${yVal}`;
    }
    return pts;
  };

  // Determine active UI details based on phase
  let phaseTitle = "PHASE 01: FLUID DYNAMICS";
  let activeTelemetry = {
    title: "SPH MULTI-FLUID SIMULATOR",
    labels: ["PARTICLE COUNT", "TARGET VOL", "VISCOSITY", "SURFACE TENSION", "TEMP COEFFICIENT"],
    values: ["165 atoms", "523.6 nm³", "4.5 mPa·s", "28.4 mN/m", "0.082 K⁻¹"],
    colorTheme: "text-[#00f2fe]",
    borderTheme: "border-[#00f2fe]/30",
    bgTheme: "bg-[#00f2fe]/5",
  };

  if (frame >= 98 && frame < 198) {
    phaseTitle = "PHASE 02: VOLUMETRIC FOLDING";
    activeTelemetry = {
      title: "DE NOVO RIBBON SEQUENCE",
      labels: ["CHAIN RESIDUES", "SECONDARY ALPHA", "SECONDARY BETA", "STABILIZATION", "FREE ENERGY"],
      values: ["35 amino acids", "34.2 % (Helix)", "31.4 % (Sheet)", `${Math.min(100, Math.max(0, ((frame - 110) / 70) * 100)).toFixed(1)} %`, `-${(Math.min(1.0, Math.max(0, (frame - 110) / 70)) * 412.5).toFixed(1)} kJ/mol`],
      colorTheme: "text-[#ffb300]",
      borderTheme: "border-[#ffb300]/30",
      bgTheme: "bg-[#ffb300]/5",
    };
  } else if (frame >= 198) {
    phaseTitle = "PHASE 03: ATOMIC COLLISION";
    const postCol = frame >= 225;
    activeTelemetry = {
      title: "HIGH-ENERGY MOLECULAR COLLIDER",
      labels: ["TARGET STATE", "COLLISION VELOCITY", "BOND BREAK THRESH", "IMPACT EXCESS", "PARTICLE SPARK COUNT"],
      values: [postCol ? "DISSOCIATED FRAGMENTS" : "REACTANTS APPROACHING", "Mach 14.5 (4.8 km/s)", "2.4 eV", postCol ? `${(Math.exp(-(frame - 225) * 0.1) * 8.4).toFixed(2)} GeV` : "0.00 GeV", postCol ? "380 glowing sparks" : "0 sparks"],
      colorTheme: "text-red-500",
      borderTheme: "border-red-500/30",
      bgTheme: "bg-red-500/5",
    };
  }

  return (
    <AbsoluteFill className="bg-[#02050e] overflow-hidden select-none font-mono">
      {/* 3D Canvas element */}
      <canvas ref={canvasRef} style={{ width, height }} className="absolute inset-0" />

      {/* ====================================================================== */}
      {/* HUD OVERLAY LAYOUT                                                     */}
      {/* ====================================================================== */}
      
      {/* Subtle Sci-Fi gridlines on screen */}
      <div className="absolute inset-0 border-[16px] border-double border-white/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* 1. TOP BAR PANEL */}
      <div className="absolute top-8 left-10 right-10 flex justify-between items-center text-white/70 text-xs border-b border-white/10 pb-3">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          <span className="font-bold tracking-widest text-[#00f2fe] drop-shadow-[0_0_8px_rgba(0,242,254,0.4)]">
            NEO-BIOLOGY SIMULATOR
          </span>
          <span className="text-white/30">|</span>
          <span>GPU ENGINE V2.0</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-white/40">TIMECODE:</span>
            <span className="text-[#00f2fe] font-bold tracking-wider">{formatTimecode(frame)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/40">FRAME:</span>
            <span className="font-bold">{frame} / 300</span>
          </div>
        </div>
      </div>

      {/* 2. LEFT TELEMETRY PANEL */}
      <div className={`absolute top-24 left-10 w-72 backdrop-blur-md border ${activeTelemetry.borderTheme} ${activeTelemetry.bgTheme} p-4 rounded-md transition-all duration-300`}>
        <div className={`text-xs font-bold ${activeTelemetry.colorTheme} mb-3 border-b ${activeTelemetry.borderTheme} pb-1.5 tracking-wider`}>
          {activeTelemetry.title}
        </div>
        <div className="space-y-3">
          {activeTelemetry.labels.map((lbl, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-[10px] text-white/40 tracking-wide uppercase">{lbl}</span>
              <span className="text-xs text-white/95 font-semibold mt-0.5 tracking-wider">
                {activeTelemetry.values[idx]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. RIGHT PANEL (Dynamic SVG Charts) */}
      <div className="absolute top-24 right-10 w-72 flex flex-col gap-4">
        {/* Chart 1: SPH Hydrodynamics pressure */}
        <div className={`backdrop-blur-md border border-white/10 bg-black/40 p-4 rounded-md transition-all duration-500 ${frame < 98 ? "opacity-100 scale-100" : "opacity-30 scale-95"}`}>
          <div className="flex justify-between items-center text-[10px] text-white/50 mb-1">
            <span className="font-bold tracking-wider text-[#00f2fe]">SPH LIQUID FLOW RATE</span>
            <span>FLUCTUATING</span>
          </div>
          <div className="h-16 border border-white/5 bg-[#030816]/60 relative rounded overflow-hidden">
            <svg className="w-full h-full">
              <path
                d={getFluidChartPath()}
                fill="none"
                stroke="#00f2fe"
                strokeWidth="1.5"
                className="drop-shadow-[0_0_4px_rgba(0,242,254,0.6)]"
              />
            </svg>
            <div className="absolute right-2 bottom-1 text-[8px] text-white/30">0.0 - 8.0 R</div>
          </div>
        </div>

        {/* Chart 2: Folding free energy */}
        <div className={`backdrop-blur-md border border-white/10 bg-black/40 p-4 rounded-md transition-all duration-500 ${frame >= 92 && frame < 198 ? "opacity-100 scale-100" : "opacity-30 scale-95"}`}>
          <div className="flex justify-between items-center text-[10px] text-white/50 mb-1">
            <span className="font-bold tracking-wider text-[#ffb300]">FREE ENERGY DECAY</span>
            <span>STABILIZING</span>
          </div>
          <div className="h-16 border border-white/5 bg-[#030816]/60 relative rounded overflow-hidden">
            <svg className="w-full h-full">
              <path
                d={getProteinChartPath()}
                fill="none"
                stroke="#ffb300"
                strokeWidth="1.5"
                className="drop-shadow-[0_0_4px_rgba(255,179,0,0.6)]"
              />
            </svg>
            <div className="absolute right-2 bottom-1 text-[8px] text-white/30">dG (kJ/mol)</div>
          </div>
        </div>

        {/* Chart 3: Collision energy output */}
        <div className={`backdrop-blur-md border border-white/10 bg-black/40 p-4 rounded-md transition-all duration-500 ${frame >= 192 ? "opacity-100 scale-100" : "opacity-30 scale-95"}`}>
          <div className="flex justify-between items-center text-[10px] text-white/50 mb-1">
            <span className="font-bold tracking-wider text-red-500">KINETIC ENERGY DISPERSION</span>
            <span>{frame >= 225 ? "EXPLOSION STAGE" : "PRE-IMPACT"}</span>
          </div>
          <div className="h-16 border border-white/5 bg-[#030816]/60 relative rounded overflow-hidden">
            <svg className="w-full h-full">
              <path
                d={getCollisionChartPath()}
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.5"
                className="drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]"
              />
            </svg>
            <div className="absolute right-2 bottom-1 text-[8px] text-white/30">E_rad (MeV)</div>
          </div>
        </div>
      </div>

      {/* 4. CENTRAL TARGET CROSSHAIR */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        {/* Large outer circular reticle */}
        <div className="w-96 h-96 border border-dashed border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
        
        {/* Corner brackets centering the composition */}
        <div className="absolute w-[800px] h-[450px] flex justify-between items-between">
          <div className="flex flex-col justify-between w-full h-full">
            <div className="flex justify-between">
              <div className="w-4 h-4 border-t-2 border-l-2 border-white/10" />
              <div className="w-4 h-4 border-t-2 border-r-2 border-white/10" />
            </div>
            <div className="flex justify-between">
              <div className="w-4 h-4 border-b-2 border-l-2 border-white/10" />
              <div className="w-4 h-4 border-b-2 border-r-2 border-white/10" />
            </div>
          </div>
        </div>

        {/* Small sci-fi targeting overlay in the center during collision approach */}
        {frame >= 200 && frame < 227 && (
          <div className="absolute flex flex-col items-center gap-1.5 transition-all duration-200">
            <div className="w-16 h-16 border-2 border-red-500/40 rounded-full animate-ping" />
            <div className="absolute text-[8px] text-red-500 font-bold bg-black/60 px-1 border border-red-500/30 uppercase tracking-widest mt-10">
              {frame >= 225 ? "COLLISION COLLAPSE" : "LOCKING TARGET"}
            </div>
          </div>
        )}
      </div>

      {/* 5. BOTTOM TIMELINE AND PHASE CONTROL */}
      <div className="absolute bottom-8 left-10 right-10 flex flex-col gap-2">
        <div className="flex justify-between text-[10px] text-white/40 px-1">
          <span className="font-bold tracking-wider text-[#00f2fe]">SEQUENCE TIMELINE (10.0S)</span>
          <span className="font-semibold text-white/70">{phaseTitle}</span>
        </div>
        
        {/* Dynamic timeline bar */}
        <div className="h-6 w-full border border-white/10 bg-[#04091a]/80 flex rounded relative overflow-hidden">
          {/* Phase 1 section */}
          <div className={`w-[32%] h-full flex items-center justify-center text-[9px] border-r border-white/10 transition-colors ${frame < 95 ? "bg-[#00f2fe]/10 text-[#00f2fe] font-bold" : "text-white/30"}`}>
            01. FLUID DYNAMICS (SPH)
          </div>
          {/* Phase 2 section */}
          <div className={`w-[34%] h-full flex items-center justify-center text-[9px] border-r border-white/10 transition-colors ${frame >= 95 && frame < 195 ? "bg-[#ffb300]/10 text-[#ffb300] font-bold" : "text-white/30"}`}>
            02. PROTEIN FOLDING (RIB)
          </div>
          {/* Phase 3 section */}
          <div className={`w-[34%] h-full flex items-center justify-center text-[9px] transition-colors ${frame >= 195 ? "bg-red-500/10 text-red-500 font-bold" : "text-white/30"}`}>
            03. ATOMIC COLLISION (COL)
          </div>

          {/* Sliding timeline pointer representing the current frame */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white drop-shadow-[0_0_6px_#fff]"
            style={{ left: `${(frame / 300) * 100}%` }}
          />
          <div
            className="absolute -top-1 w-2.5 h-1.5 bg-white rounded-b drop-shadow-[0_0_6px_#fff]"
            style={{ left: `calc(${(frame / 300) * 100}% - 4px)` }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
