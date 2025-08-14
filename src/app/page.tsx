"use client";
import React from "react";
import SplitText from "@/components/ui/split-text";

export default function BackgroundBeamsDemo() {

  const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};
  return (
    <div>
      <SplitText
  text="Hello, GSAP!"
  className="text-2xl font-semibold text-center"
  delay={100}
  duration={0.6}
  ease="power3.out"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"
  onLetterAnimationComplete={handleAnimationComplete}
/>
    </div>
  );
}
