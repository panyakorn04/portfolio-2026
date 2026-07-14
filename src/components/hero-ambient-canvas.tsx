"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroAmbientCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const host = container;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const clock = new THREE.Clock();

    const ringGeometry = new THREE.TorusGeometry(1.75, 0.04, 18, 120);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x86ffd0,
      transparent: true,
      opacity: 0.42,
      wireframe: true,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.7;
    ring.position.set(0.12, -0.04, 0);
    sceneGroup.add(ring);

    const orbitGeometry = new THREE.BufferGeometry();
    const orbitCount = 72;
    const orbitPositions = new Float32Array(orbitCount * 3);

    for (let index = 0; index < orbitCount; index += 1) {
      const angle = (index / orbitCount) * Math.PI * 2;
      const radius = 2.2 + Math.sin(angle * 3) * 0.2;

      orbitPositions[index * 3] = Math.cos(angle) * radius;
      orbitPositions[index * 3 + 1] = Math.sin(angle) * radius * 0.55;
      orbitPositions[index * 3 + 2] = (Math.sin(angle * 2) + 1) * 0.2 - 0.2;
    }

    orbitGeometry.setAttribute("position", new THREE.BufferAttribute(orbitPositions, 3));

    const orbitMaterial = new THREE.PointsMaterial({
      color: 0x8eefff,
      size: 0.065,
      transparent: true,
      opacity: 0.9,
    });
    const orbitPoints = new THREE.Points(orbitGeometry, orbitMaterial);
    sceneGroup.add(orbitPoints);

    const coreGeometry = new THREE.IcosahedronGeometry(0.72, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x6ff7a6,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.set(0.08, 0.02, 0);
    sceneGroup.add(core);

    const glowGeometry = new THREE.SphereGeometry(1.15, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x72ffd7,
      transparent: true,
      opacity: 0.08,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sceneGroup.add(glow);

    function resize() {
      const width = host.clientWidth;
      const height = host.clientHeight;
      const isCompact = width < 768;
      const pixelRatioCap = isCompact ? 1.25 : 1.5;
      const horizontalBias = isCompact ? 1.38 : 1.1;
      const verticalBias = isCompact ? 0.78 : 0;
      const sceneScale = isCompact ? 1.46 : 1;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap));
      camera.fov = isCompact ? 43 : 34;
      camera.aspect = width / Math.max(height, 1);
      camera.position.set(0, 0, isCompact ? 8.9 : 7.5);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);

      sceneGroup.position.set(horizontalBias, verticalBias, 0);
      sceneGroup.scale.setScalar(sceneScale);
      sceneGroup.rotation.z = isCompact ? -0.14 : -0.06;

      ringMaterial.opacity = isCompact ? 0.6 : 0.42;
      coreMaterial.opacity = isCompact ? 0.4 : 0.22;
      glowMaterial.opacity = isCompact ? 0.16 : 0.08;
      orbitMaterial.size = isCompact ? 0.084 : 0.065;
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(host);
    resize();

    let animationFrame = 0;

    function animate() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const motionScale = mediaQuery.matches ? 0.15 : 1;

      ring.rotation.z += delta * 0.18 * motionScale;
      ring.rotation.x = Math.PI / 2.7 + Math.sin(elapsed * 0.35) * 0.08 * motionScale;

      orbitPoints.rotation.z -= delta * 0.2 * motionScale;
      orbitPoints.rotation.y += delta * 0.08 * motionScale;
      orbitPoints.position.y = Math.sin(elapsed * 0.9) * 0.18 * motionScale;

      core.rotation.x += delta * 0.22 * motionScale;
      core.rotation.y -= delta * 0.3 * motionScale;
      core.position.y = Math.sin(elapsed * 1.3) * 0.12 * motionScale;

      glow.scale.setScalar(1 + Math.sin(elapsed * 1.1) * 0.06 * motionScale);
      glow.position.x = Math.sin(elapsed * 0.6) * 0.08 * motionScale;
      glow.position.y = Math.cos(elapsed * 0.8) * 0.06 * motionScale;

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      ringGeometry.dispose();
      ringMaterial.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 opacity-45 sm:opacity-65 md:opacity-90"
      aria-hidden="true"
    />
  );
}
