"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, RoundedBox, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { pointer } from "@/lib/pointer";
import { getPalette, subscribePalette } from "@/lib/theme";
import { markReady } from "@/lib/ready";
import { SITE } from "@/lib/content";

const FOV = 35;
const CAM_Z = 10;

/* ---------- Geometry ---------- */

// A faceted lance: long shaft, swelling blade, sharp tip. Six radial segments
// plus flat shading give the crystalline facets.
function useLanceGeometry() {
  return useMemo(() => {
    const pts = [
      [0, -1.7],
      [0.045, -1.6],
      [0.03, -1.35],
      [0.028, 0.1],
      [0.07, 0.28],
      [0.12, 0.6],
      [0.055, 1.2],
      [0, 1.75],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(pts, 6);
    g.computeVertexNormals();
    return g;
  }, []);
}

// An elongated, asymmetric bipyramid shard.
function useShardGeometry() {
  return useMemo(() => {
    const g = new THREE.CylinderGeometry(0, 0.16, 1.8, 4, 1, false);
    g.translate(0, 0.9, 0);
    const bottom = new THREE.CylinderGeometry(0.16, 0, 0.5, 4, 1, false);
    bottom.translate(0, -0.25, 0);
    const merged = mergeGeometries([g, bottom]);
    merged.computeVertexNormals();
    return merged;
  }, []);
}

function mergeGeometries(geos: THREE.BufferGeometry[]) {
  const positions: number[] = [];
  geos.forEach((g) => {
    const ng = g.toNonIndexed();
    positions.push(...(ng.attributes.position.array as Float32Array));
  });
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return out;
}

/* ---------- Field of drifting spears ---------- */

type Seed = {
  base: THREE.Vector3;
  dir: THREE.Vector3;
  speed: number;
  spin: number;
  spinSpeed: number;
  scale: number;
  sway: number;
  phase: number;
};

const UP = new THREE.Vector3(0, 1, 0);

function makeSeeds(count: number, rand: () => number): Seed[] {
  // Shared flight heading (up and to the right) with per-spear variance.
  const heading = new THREE.Vector3(0.55, 0.83, -0.08).normalize();
  return Array.from({ length: count }, () => {
    const dir = heading
      .clone()
      .add(new THREE.Vector3((rand() - 0.5) * 0.5, (rand() - 0.5) * 0.3, (rand() - 0.5) * 0.3))
      .normalize();
    return {
      base: new THREE.Vector3((rand() - 0.5) * 30, (rand() - 0.5) * 20, -16 + rand() * 14),
      dir,
      speed: 0.12 + rand() * 0.35,
      spin: rand() * Math.PI * 2,
      spinSpeed: (rand() - 0.5) * 0.6,
      scale: 0.35 + rand() * 0.55,
      sway: 0.15 + rand() * 0.35,
      phase: rand() * Math.PI * 2,
    };
  });
}

function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function wrap(v: number, min: number, max: number) {
  const span = max - min;
  return ((((v - min) % span) + span) % span) + min;
}

function SpearLayer({
  geometry,
  material,
  seeds,
  reduced,
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  seeds: Seed[];
  reduced: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      spinQ: new THREE.Quaternion(),
      p: new THREE.Vector3(),
      s: new THREE.Vector3(),
    }),
    [],
  );
  const parallax = useRef({ x: 0, y: 0, scroll: 0 });

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime * (reduced ? 0.15 : 1);
    const px = parallax.current;
    px.x += (pointer.nx - px.x) * 0.04;
    px.y += (pointer.ny - px.y) * 0.04;
    px.scroll += (window.scrollY - px.scroll) * 0.12;

    seeds.forEach((sd, i) => {
      // Depth factor: 0 far, 1 near. Near spears move faster for parallax.
      const depth = (sd.base.z + 16) / 14;
      const travel = t * sd.speed;
      tmp.p.copy(sd.base).addScaledVector(sd.dir, travel);
      tmp.p.x += Math.sin(t * 0.3 + sd.phase) * sd.sway;
      tmp.p.y += Math.cos(t * 0.25 + sd.phase) * sd.sway * 0.6;
      tmp.p.y += px.scroll * 0.0025 * (0.4 + depth * 1.6);
      tmp.p.x += px.x * (0.3 + depth * 1.2);
      tmp.p.y += px.y * (0.2 + depth * 0.8);
      tmp.p.x = wrap(tmp.p.x, -16, 16);
      tmp.p.y = wrap(tmp.p.y, -11, 11);

      tmp.q.setFromUnitVectors(UP, sd.dir);
      tmp.spinQ.setFromAxisAngle(UP, sd.spin + t * sd.spinSpeed);
      tmp.q.multiply(tmp.spinQ);
      tmp.s.setScalar(sd.scale);
      tmp.m.compose(tmp.p, tmp.q, tmp.s);
      mesh.setMatrixAt(i, tmp.m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geometry, material, seeds.length]} frustumCulled={false} />;
}

function SpearField({ count, reduced }: { count: number; reduced: boolean }) {
  const lance = useLanceGeometry();
  const shard = useShardGeometry();

  const metal = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#3b4060",
        metalness: 1,
        roughness: 0.2,
        flatShading: true,
        envMapIntensity: 1.4,
        clearcoat: 0.6,
      }),
    [],
  );
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#a5b4fc",
        metalness: 0.2,
        roughness: 0.04,
        flatShading: true,
        transparent: true,
        opacity: 0.42,
        iridescence: 1,
        iridescenceIOR: 1.6,
        clearcoat: 1,
        emissive: new THREE.Color(getPalette().a1),
        emissiveIntensity: 0.35,
        envMapIntensity: 2,
        depthWrite: false,
      }),
    [],
  );

  useEffect(
    () =>
      subscribePalette(() => {
        glass.emissive.set(getPalette().a1);
      }),
    [glass],
  );

  const seeds = useMemo(() => {
    const r = mulberry(7);
    const lances = Math.round(count * 0.65);
    return { lances: makeSeeds(lances, r), shards: makeSeeds(count - lances, r) };
  }, [count]);

  return (
    <>
      <SpearLayer geometry={lance} material={metal} seeds={seeds.lances} reduced={reduced} />
      <SpearLayer geometry={shard} material={glass} seeds={seeds.shards} reduced={reduced} />
    </>
  );
}

/* ---------- Light that follows the cursor ---------- */

function CursorLight() {
  const ref = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();
  useEffect(
    () =>
      subscribePalette(() => {
        ref.current?.color.set(getPalette().a2);
      }),
    [],
  );
  useFrame(() => {
    const l = ref.current;
    if (!l) return;
    const v = viewport;
    l.position.x += (pointer.nx * v.width * 0.5 - l.position.x) * 0.12;
    l.position.y += (pointer.ny * v.height * 0.5 - l.position.y) * 0.12;
  });
  return <pointLight ref={ref} position={[0, 0, 3]} intensity={40} distance={14} decay={1.6} color={getPalette().a2} />;
}

/* ---------- Portrait in a floating glass card ---------- */

const PORTRAIT_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const PORTRAIT_FRAG = `
uniform sampler2D uMap;
uniform float uShift;
uniform float uTime;
uniform vec3 uTint;
uniform vec3 uGlow;
uniform float uAspect;
varying vec2 vUv;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  // Crop the square photo to the card aspect, anchored slightly high.
  vec2 uv = vec2(0.5 + (vUv.x - 0.5) * uAspect, vUv.y);
  vec2 dir = normalize(vec2(uv.x - 0.5, uv.y - 0.5) + 1e-4);
  float r = texture2D(uMap, uv + dir * uShift).r;
  float g = texture2D(uMap, uv).g;
  float b = texture2D(uMap, uv - dir * uShift).b;
  vec3 col = vec3(r, g, b);

  // Cool, slightly darkened grade so the light backdrop sits in the dark scene.
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, vec3(lum), 0.15) * uTint;
  col = mix(col, col * vec3(0.78, 0.8, 0.95), smoothstep(0.75, 1.0, lum));

  // Diagonal glint sweeping across the glass every few seconds.
  float sweep = fract(uTime * 0.12);
  float band = smoothstep(0.06, 0.0, abs((vUv.x + vUv.y) * 0.5 - (sweep * 1.8 - 0.4)));
  col += band * 0.12;

  // Rounded corners with an accent rim (in card space so corners stay circular).
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  float d = roundedBox(p, vec2(0.5 * uAspect, 0.5), 0.04);
  float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
  float rim = smoothstep(-0.018, 0.0, d) * alpha;
  col = mix(col, uGlow, rim * 0.85);

  // Bottom vignette.
  col *= mix(0.55, 1.0, smoothstep(0.0, 0.35, vUv.y));

  gl_FragColor = vec4(col, alpha);
  #include <colorspace_fragment>
}`;

function OrbitSpears({ geometry, reduced }: { geometry: THREE.BufferGeometry; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const orbits = useMemo(
    () => [
      { rx: 0.95, ry: 0.55, tilt: 0.35, roll: 0.2, speed: 0.32, phase: 0, scale: 0.26 },
      { rx: 0.85, ry: 0.7, tilt: -0.5, roll: -0.4, speed: -0.24, phase: 2.1, scale: 0.2 },
      { rx: 1.1, ry: 0.4, tilt: 0.15, roll: 0.9, speed: 0.18, phase: 4.2, scale: 0.3 },
      { rx: 0.75, ry: 0.85, tilt: 0.8, roll: -1.1, speed: -0.38, phase: 1.1, scale: 0.17 },
    ],
    [],
  );
  const metal = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#c7cbe6",
        metalness: 1,
        roughness: 0.16,
        flatShading: true,
        envMapIntensity: 1.8,
      }),
    [],
  );
  const accent = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        metalness: 0.3,
        roughness: 0.05,
        flatShading: true,
        emissive: new THREE.Color(getPalette().a2),
        emissiveIntensity: 1.2,
        iridescence: 1,
      }),
    [],
  );
  useEffect(() => subscribePalette(() => accent.emissive.set(getPalette().a2)), [accent]);

  const tmp = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), e: new THREE.Euler() }), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime * (reduced ? 0.2 : 1);
    g.children.forEach((child, i) => {
      const o = orbits[i];
      const ang = t * o.speed + o.phase;
      const pos = (a: number, out: THREE.Vector3) => {
        out.set(Math.cos(a) * o.rx, Math.sin(a) * o.ry * 0.35, Math.sin(a) * 0.9);
        tmp.e.set(o.tilt, 0, o.roll);
        return out.applyEuler(tmp.e);
      };
      pos(ang, tmp.a);
      pos(ang + Math.sign(o.speed) * 0.05, tmp.b);
      child.position.copy(tmp.a);
      // Point the lance along its direction of travel.
      const dir = tmp.b.sub(tmp.a).normalize();
      child.quaternion.setFromUnitVectors(UP, dir);
    });
  });

  return (
    <group ref={group}>
      {orbits.map((o, i) => (
        <mesh key={i} geometry={geometry} material={i === 1 ? accent : metal} scale={o.scale} />
      ))}
    </group>
  );
}

function PortraitCard({ anchorId, reduced }: { anchorId: string; reduced: boolean }) {
  const texture = useTexture(SITE.portrait);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const lance = useLanceGeometry();
  const group = useRef<THREE.Group>(null);
  const card = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const anchor = useRef<HTMLElement | null>(null);
  const motion = useRef({ rx: 0, ry: 0, vx: 0, hover: 0 });

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uShift: { value: 0.002 },
      uTime: { value: 0 },
      uTint: { value: new THREE.Color("#e6e9ff") },
      uGlow: { value: new THREE.Color(getPalette().a2) },
      uAspect: { value: 0.8 },
    }),
    [texture],
  );
  useEffect(() => subscribePalette(() => uniforms.uGlow.value.set(getPalette().a2)), [uniforms]);

  useEffect(() => {
    // Signal the preloader once the texture is uploaded and a frame is drawn.
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        markReady("scene");
        window.dispatchEvent(new Event("portrait:ready"));
      }),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  useFrame((state) => {
    const g = group.current;
    const c = card.current;
    if (!g || !c) return;
    if (!anchor.current || !anchor.current.isConnected) anchor.current = document.getElementById(anchorId);
    const el = anchor.current;
    if (!el) {
      g.visible = false;
      return;
    }
    const r = el.getBoundingClientRect();
    const vw = size.width;
    const vh = size.height;
    if (r.bottom < -200 || r.top > vh + 200 || r.width === 0) {
      g.visible = false;
      return;
    }
    g.visible = true;

    const persp = camera as THREE.PerspectiveCamera;
    const halfH = Math.tan(THREE.MathUtils.degToRad(persp.fov / 2)) * CAM_Z;
    const halfW = halfH * (vw / vh);
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    g.position.set((cx / vw) * 2 * halfW - halfW, -((cy / vh) * 2 * halfH - halfH), 0);
    const w = (r.width / vw) * 2 * halfW;
    g.scale.setScalar(w);
    uniforms.uAspect.value = r.width / r.height;
    c.scale.set(1, r.height / r.width, 1);

    // Tilt toward the pointer, stronger when hovering the card.
    const m = motion.current;
    const over = pointer.x > r.left && pointer.x < r.right && pointer.y > r.top && pointer.y < r.bottom ? 1 : 0;
    m.hover += (over - m.hover) * 0.08;
    const tx = -pointer.ny * (0.12 + m.hover * 0.12);
    const ty = pointer.nx * (0.22 + m.hover * 0.15) - 0.12;
    const prev = m.ry;
    m.rx += (tx - m.rx) * 0.06;
    m.ry += (ty - m.ry) * 0.06;
    m.vx += (Math.abs(m.ry - prev) * 60 - m.vx) * 0.1;
    const t = state.clock.elapsedTime;
    c.rotation.set(m.rx + Math.sin(t * 0.6) * 0.02, m.ry, Math.sin(t * 0.4) * 0.015);
    c.position.y = reduced ? 0 : Math.sin(t * 0.8) * 0.015;

    uniforms.uTime.value = t;
    uniforms.uShift.value = 0.0015 + m.vx * 0.012 + m.hover * 0.004;
  });

  return (
    <group ref={group}>
      <group ref={card}>
        <RoundedBox args={[1.06, 1.06, 0.05]} radius={0.04} smoothness={4} position={[0, 0, -0.04]}>
          <meshPhysicalMaterial
            color="#0d0f1a"
            metalness={0.4}
            roughness={0.18}
            clearcoat={1}
            iridescence={0.7}
            transparent
            opacity={0.85}
            envMapIntensity={1.5}
          />
        </RoundedBox>
        <mesh>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            vertexShader={PORTRAIT_VERT}
            fragmentShader={PORTRAIT_FRAG}
            uniforms={uniforms}
            transparent
            toneMapped={false}
          />
        </mesh>
      </group>
      <OrbitSpears geometry={lance} reduced={reduced} />
    </group>
  );
}

/* ---------- Canvas ---------- */

function NoWebGL() {
  useEffect(() => markReady("scene"), []);
  return null;
}

export default function Scene() {
  const [dpr, setDpr] = useState(1.5);
  const [env] = useState(() => {
    if (typeof window === "undefined") return { mobile: false, reduced: false };
    return {
      mobile: window.matchMedia("(max-width: 767px)").matches,
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
  });

  return (
    <Canvas
      style={{ position: "fixed", inset: 0, zIndex: 3, pointerEvents: "none" }}
      dpr={dpr}
      camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      fallback={<NoWebGL />}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#c7d2fe" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} color="#6366f1" position={[-6, 3, -4]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#06b6d4" position={[6, -2, -3]} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={2} color="#8b5cf6" position={[0, 6, 2]} scale={[10, 2, 1]} />
        <Lightformer form="ring" intensity={4} color="#ffffff" position={[3, 2, 6]} scale={2} />
      </Environment>
      <CursorLight />
      <SpearField count={env.mobile ? 16 : 38} reduced={env.reduced} />
      <Suspense fallback={null}>
        <PortraitCard anchorId="hero-portrait-anchor" reduced={env.reduced} />
      </Suspense>
    </Canvas>
  );
}
