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

const LAGS = 12;
const MAX_DPR = 1.5;
const PARKED = new Vector2(0, -5);

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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setClearColor(0x000000, 0);

    const uniforms = {
      uTime: { value: reduced ? 9 : 0 },
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
    const geometry = seeds(mobile ? 700 : 2200);
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
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      uniforms.uTime.value += dt;
      uniforms.uMouse.value.lerp(target, 0.08);
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

  return <canvas ref={canvasRef} className="hero-transport__flow-canvas" aria-hidden />;
}
