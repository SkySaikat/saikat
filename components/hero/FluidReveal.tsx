"use client";

import { useEffect, useRef } from "react";
import { pointer } from "@/lib/pointer";
import { getPalette, hexToRgb, subscribePalette } from "@/lib/theme";

/*
  Ink-mask reveal for the hero.

  A small float texture stores ink density (r) and velocity (g, b). The pointer
  injects ink along the segment it travelled this frame, a step pass advects and
  diffuses it with a noise-warped kernel so edges grow organic tendrils, then the
  display pass paints the page background colour everywhere the ink is thin and
  a glowing accent rim where it thins out. Whatever sits under the canvas shows
  through the holes.
*/

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const NOISE = `
float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return s;
}`;

// Ink is injected along a capsule from the previous to the current pointer
// position, so fast strokes stay continuous without looping many splats.
const SPLAT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uField;
uniform vec2 uA;
uniform vec2 uB;
uniform float uAspect;
uniform float uRadius;
uniform vec2 uVel;
uniform float uInk;
float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}
void main() {
  vec4 f = texture(uField, vUv);
  vec2 asp = vec2(uAspect, 1.0);
  float d = segDist(vUv * asp, uA * asp, uB * asp);
  float g = exp(-d * d / uRadius);
  o = vec4(f.r + g * uInk, mix(f.gb, uVel, clamp(g * 1.5, 0.0, 1.0)), 1.0);
}`;

const STEP = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uField;
uniform vec2 uTexel;
uniform float uDt;
uniform float uTime;
uniform float uDecay;
uniform float uSpread;
uniform float uFriction;
${NOISE}
void main() {
  vec2 vel = texture(uField, vUv).gb;
  vec2 src = vUv - vel * uDt;
  float t = uTime * 0.25;
  vec2 w = (vec2(fbm(vUv * 9.0 + t), fbm(vUv * 9.0 - t + 17.3)) - 0.5) * 5.0 * uTexel;
  vec4 c = texture(uField, src);
  vec4 l = texture(uField, src - vec2(uTexel.x, 0.0) + w);
  vec4 r = texture(uField, src + vec2(uTexel.x, 0.0) + w);
  vec4 u = texture(uField, src + vec2(0.0, uTexel.y) + w);
  vec4 b = texture(uField, src - vec2(0.0, uTexel.y) + w);
  float dens = mix(c.r, (l.r + r.r + u.r + b.r) * 0.25, uSpread);
  vec2 v = mix(c.gb, (l.gb + r.gb + u.gb + b.gb) * 0.25, uSpread * 0.5);
  float n = fbm(vUv * 14.0 + t * 0.7);
  dens /= 1.0 + uDecay * (1.0 + (n - 0.5) * 1.4) * uDt;
  v /= 1.0 + uFriction * uDt;
  o = vec4(max(dens, 0.0), v, 1.0);
}`;

const DISPLAY = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uField;
uniform vec3 uCover;
uniform vec3 uRimA;
uniform vec3 uRimB;
uniform float uTime;
uniform vec2 uEdge;
${NOISE}
void main() {
  float d = texture(uField, vUv).r;
  float fade = smoothstep(0.0, 0.2 * (0.4 + fbm(vec2(vUv.x * 7.0, uTime * 0.2))), vUv.y);
  d *= fade;
  float m = smoothstep(uEdge.x, uEdge.y, d);
  float rim = pow(clamp(4.0 * m * (1.0 - m), 0.0, 1.0), 2.0);
  vec3 rimCol = mix(uRimA, uRimB, fbm(vUv * 6.0 + uTime * 0.3));
  vec3 col = mix(uCover, rimCol, rim);
  float a = max(1.0 - m, rim * 0.9);
  o = vec4(col * a, a);
}`;

type Program = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
type Target = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number };

export default function FluidReveal({
  onReady,
  reducedMotion,
}: {
  onReady?: (ok: boolean) => void;
  reducedMotion?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) {
      onReady?.(false);
      return;
    }
    const linear = gl.getExtension("OES_texture_float_linear") ? gl.LINEAR : gl.NEAREST;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const vert = compile(gl.VERTEX_SHADER, VERT);
    const program = (frag: string): Program => {
      const p = gl.createProgram()!;
      gl.attachShader(p, vert);
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, frag));
      gl.bindAttribLocation(p, 0, "aPos");
      gl.linkProgram(p);
      const u: Program["u"] = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < n; i++) {
        const name = gl.getActiveUniform(p, i)!.name;
        u[name] = gl.getUniformLocation(p, name);
      }
      return { p, u };
    };
    const splatP = program(SPLAT);
    const stepP = program(STEP);
    const displayP = program(DISPLAY);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const makeTarget = (w: number, h: number): Target => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linear);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex, fbo, w, h };
    };
    const freeTarget = (t: Target) => {
      gl.deleteTexture(t.tex);
      gl.deleteFramebuffer(t.fbo);
    };

    const isSmall = window.matchMedia("(max-width: 767px)").matches;
    const SIM = isSmall ? 220 : 380;
    let read: Target | null = null;
    let write: Target | null = null;
    let texel = [1 / SIM, 1 / SIM];

    const draw = (target: Target | null) => {
      if (target) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        gl.viewport(0, 0, target.w, target.h);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const swap = () => {
      const t = read;
      read = write;
      write = t;
    };
    const bindField = (prog: Program) => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, read!.tex);
      gl.uniform1i(prog.u.uField, 0);
    };

    let rect = canvas.getBoundingClientRect();
    const resize = () => {
      rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      const aspect = rect.width / Math.max(rect.height, 1);
      const w = aspect >= 1 ? Math.round(SIM * aspect) : SIM;
      const h = aspect >= 1 ? SIM : Math.round(SIM / aspect);
      if (!read || read.w !== w || read.h !== h) {
        if (read) freeTarget(read);
        if (write) freeTarget(write);
        read = makeTarget(w, h);
        write = makeTarget(w, h);
        texel = [1 / w, 1 / h];
      }
    };
    resize();

    // Colours
    const colors = { cover: [0, 0, 0], a: [0, 0, 0], b: [0, 0, 0] };
    const readColors = () => {
      const p = getPalette();
      colors.cover = hexToRgb("#050508").map((v) => v / 255);
      colors.a = hexToRgb(p.a2).map((v) => v / 255);
      colors.b = hexToRgb(p.a3).map((v) => v / 255);
    };
    readColors();
    const unsubPalette = subscribePalette(readColors);

    // Pointer tracking in canvas UV space
    const s = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, init: false, lastSeen: 0 };
    let lastT = performance.now();
    const start = performance.now();
    let raf: number | null = null;

    const inject = (ax: number, ay: number, bx: number, by: number, vx: number, vy: number, ink: number, radius: number) => {
      gl.useProgram(splatP.p);
      bindField(splatP);
      gl.uniform2f(splatP.u.uA, ax, ay);
      gl.uniform2f(splatP.u.uB, bx, by);
      gl.uniform1f(splatP.u.uAspect, rect.width / Math.max(rect.height, 1));
      gl.uniform1f(splatP.u.uRadius, radius);
      gl.uniform2f(splatP.u.uVel, vx, vy);
      gl.uniform1f(splatP.u.uInk, ink);
      draw(write);
      swap();
    };

    // Ghost stroke: a slow figure eight that hints at the interaction after the
    // intro, and whenever the visitor has been still for a while.
    const ghost = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, on: false };
    let introAt = Number.POSITIVE_INFINITY;
    const onIntro = () => {
      introAt = performance.now();
    };
    window.addEventListener("app:intro", onIntro);
    if ((window as unknown as { __introDone?: boolean }).__introDone) introAt = performance.now();

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 1 / 30);
      lastT = now;
      const time = (now - start) / 1000;

      // Real pointer
      const inside =
        pointer.active &&
        pointer.x >= rect.left &&
        pointer.x <= rect.right &&
        pointer.y >= rect.top &&
        pointer.y <= rect.bottom;
      if (inside) {
        const x = (pointer.x - rect.left) / rect.width;
        const y = 1 - (pointer.y - rect.top) / rect.height;
        if (!s.init) {
          s.px = s.x = x;
          s.py = s.y = y;
          s.init = true;
        } else {
          s.px = s.x;
          s.py = s.y;
          s.x = x;
          s.y = y;
        }
        const moved = Math.hypot(s.x - s.px, s.y - s.py);
        if (moved > 0.0005) {
          const vx = Math.max(-3, Math.min(3, (s.x - s.px) / dt)) * 0.9;
          const vy = Math.max(-3, Math.min(3, (s.y - s.py) / dt)) * 0.9;
          inject(s.px, s.py, s.x, s.y, vx, vy, 2.6, 0.0026);
          s.lastSeen = now;
        }
      } else {
        s.init = false;
      }

      // Ghost
      const sinceIntro = now - introAt;
      const idle = now - Math.max(s.lastSeen, pointer.lastMove) > 4200;
      const introSweep = sinceIntro > 300 && sinceIntro < 3800;
      if (!reducedMotion && (introSweep || (idle && sinceIntro > 3800))) {
        const k = time * 0.42;
        const gx = 0.5 + Math.sin(k) * 0.32;
        const gy = 0.55 + Math.sin(k * 2.0) * 0.16;
        if (!ghost.on) {
          ghost.x = gx;
          ghost.y = gy;
          ghost.on = true;
        }
        ghost.px = ghost.x;
        ghost.py = ghost.y;
        ghost.x = gx;
        ghost.y = gy;
        const vx = (ghost.x - ghost.px) / dt;
        const vy = (ghost.y - ghost.py) / dt;
        inject(ghost.px, ghost.py, ghost.x, ghost.y, vx * 0.6, vy * 0.6, introSweep ? 1.9 : 1.2, 0.0018);
      } else {
        ghost.on = false;
      }

      // Step
      gl.useProgram(stepP.p);
      bindField(stepP);
      gl.uniform2f(stepP.u.uTexel, texel[0], texel[1]);
      gl.uniform1f(stepP.u.uDt, dt);
      gl.uniform1f(stepP.u.uTime, time);
      gl.uniform1f(stepP.u.uDecay, 1.35);
      gl.uniform1f(stepP.u.uSpread, 0.72);
      gl.uniform1f(stepP.u.uFriction, 2.8);
      draw(write);
      swap();

      // Display
      gl.useProgram(displayP.p);
      bindField(displayP);
      gl.uniform3f(displayP.u.uCover, colors.cover[0], colors.cover[1], colors.cover[2]);
      gl.uniform3f(displayP.u.uRimA, colors.a[0], colors.a[1], colors.a[2]);
      gl.uniform3f(displayP.u.uRimB, colors.b[0], colors.b[1], colors.b[2]);
      gl.uniform1f(displayP.u.uTime, time);
      gl.uniform2f(displayP.u.uEdge, 0.32, 0.44);
      draw(null);
    };

    const startLoop = () => {
      if (raf === null) {
        lastT = performance.now();
        rect = canvas.getBoundingClientRect();
        frame();
      }
    };
    const stopLoop = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? startLoop() : stopLoop()), { threshold: 0 });
    io.observe(canvas);
    const onScroll = () => {
      rect = canvas.getBoundingClientRect();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const onVis = () => (document.hidden ? stopLoop() : startLoop());
    document.addEventListener("visibilitychange", onVis);

    // Paint the opaque cover once before reporting ready, so the underlay never flashes.
    gl.useProgram(displayP.p);
    bindField(displayP);
    gl.uniform3f(displayP.u.uCover, colors.cover[0], colors.cover[1], colors.cover[2]);
    gl.uniform3f(displayP.u.uRimA, colors.a[0], colors.a[1], colors.a[2]);
    gl.uniform3f(displayP.u.uRimB, colors.b[0], colors.b[1], colors.b[2]);
    gl.uniform1f(displayP.u.uTime, 0);
    gl.uniform2f(displayP.u.uEdge, 0.32, 0.44);
    draw(null);
    onReady?.(true);

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      unsubPalette();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("app:intro", onIntro);
      document.removeEventListener("visibilitychange", onVis);
      if (read) freeTarget(read);
      if (write) freeTarget(write);
    };
  }, [onReady, reducedMotion]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
