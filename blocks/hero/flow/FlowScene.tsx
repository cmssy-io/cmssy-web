"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Camera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";
import { FRAGMENT, VERTEX } from "./shaders";

const LAGS = 16;
const MAX_DPR = 1.5;
const PARKED = new Vector2(0, -5);
/** 30 fps: the drift reads the same, at half the GPU (and CPU) per second. */
const FRAME_MS = 1000 / 30;
/** Time the still frame is drawn at, when the scene does not animate. */
const STILL_TIME = 9;

/**
 * A rasteriser on the CPU (SwiftShader, llvmpipe, WARP): every frame of 20k
 * additive points lands on the main thread. Lighthouse runs this way, so do
 * machines with GPU acceleration off - they get the still frame.
 */
function isSoftwareRenderer(renderer: WebGLRenderer): boolean {
  const gl = renderer.getContext();
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = String(
    gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "",
  );
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
}

function seeds(count: number): BufferGeometry {
  const seed = new Float32Array(count * LAGS * 3);
  const lag = new Float32Array(count * LAGS);
  for (let i = 0; i < count; i++) {
    const sx = Math.random();
    const sy = Math.random();
    const sz = Math.random() ** 1.6;
    for (let l = 0; l < LAGS; l++) {
      const k = i * LAGS + l;
      seed.set([sx, sy, sz], k * 3);
      lag[k] = l;
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(seed, 3));
  geometry.setAttribute("aLag", new BufferAttribute(lag, 1));
  return geometry;
}

export function FlowScene({ mobile }: { mobile: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    const section = canvas.closest("section");
    if (!host || !section) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);

    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      isSoftwareRenderer(renderer);

    const uniforms = {
      uTime: { value: reduced ? STILL_TIME : 0 },
      uAspect: { value: 1 },
      uDpr: { value: 1 },
      uScale: { value: 1 },
      uMobile: { value: mobile ? 1 : 0 },
      uMouse: { value: PARKED.clone() },
    };
    const material = new ShaderMaterial({
      uniforms,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const geometry = seeds(mobile ? 500 : 1300);
    const scene = new Scene();
    const points = new Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);
    const camera = new Camera();

    const draw = () => renderer.render(scene, camera);

    const fit = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      uniforms.uAspect.value = width / height;
      uniforms.uDpr.value = dpr;
      uniforms.uScale.value = Math.min(1.8, Math.max(0.9, width / 1600));
      if (reduced) draw();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);

    const target = PARKED.clone();
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        1 - ((e.clientY - r.top) / r.height) * 2,
      );
    };
    const onLeave = () => target.copy(PARKED);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    let frame = 0;
    let last = 0;
    let inView = false;
    const tick = (now: number) => {
      frame = 0;
      if (!inView || document.hidden) return;
      if (last && now - last < FRAME_MS - 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      uniforms.uTime.value += dt;
      // The lerp was tuned per 60 fps frame; keep its speed at 30.
      uniforms.uMouse.value.lerp(target, 1 - (1 - 0.08) ** (dt * 60));
      draw();
      frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (reduced || frame || !inView || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      wake();
    });
    io.observe(host);
    document.addEventListener("visibilitychange", wake);

    if (reduced) draw();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", wake);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [mobile]);

  return <canvas ref={canvasRef} className="hero-flow__canvas" aria-hidden />;
}
