"use client";

import dynamic from "next/dynamic";

const HeroAmbientCanvas = dynamic(() => import("./hero-ambient-canvas"), {
  ssr: false,
});

export default function HeroAmbientCanvasLoader() {
  return <HeroAmbientCanvas />;
}
