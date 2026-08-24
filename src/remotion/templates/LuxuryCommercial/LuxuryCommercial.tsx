import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CinematicCamera } from '../../animations/CinematicCamera';
import { FloatingParticles } from '../../animations/FloatingParticles';
import { GlassPanel } from '../../animations/GlassPanel';
import { ElegantTypography } from '../../animations/ElegantTypography';
import { ObjectReveal } from '../../animations/ObjectReveal';

const PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'; // High-end watch

export const LuxuryCommercial: React.FC = () => {
  return (
    <AbsoluteFill className="bg-neutral-950 overflow-hidden">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(30,30,40,1) 0%, rgba(5,5,10,1) 100%)'
        }}
      />
      
      <CinematicCamera>
        <FloatingParticles count={80} color="rgba(255, 230, 150, 0.3)" />
        
        {/* SCENE 1: The Tease (0 - 3s) */}
        <Sequence from={0} durationInFrames={90}>
          <AbsoluteFill className="items-center justify-center">
            <ElegantTypography text="E L E V A T E" delay={10} className="text-6xl text-amber-100/80 font-light" />
            <ElegantTypography text="Y O U R   S E N S E S" type="subtitle" delay={45} className="text-xl text-neutral-400 mt-4 tracking-[0.5em]" />
          </AbsoluteFill>
        </Sequence>

        {/* SCENE 2: The Reveal (3s - 13s) */}
        <Sequence from={90} durationInFrames={300}>
          <AbsoluteFill className="items-center justify-center">
            <ObjectReveal 
              src={PRODUCT_IMAGE} 
              delay={15} 
              style={{ width: '60%', height: '80%', zIndex: 5 }} 
            />
            
            {/* Background glowing orb behind product */}
            <div className="absolute w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </AbsoluteFill>
        </Sequence>

        {/* SCENE 3: The Details / Glassmorphism (13s - 18s) */}
        <Sequence from={390} durationInFrames={150}>
          <AbsoluteFill className="items-center justify-center">
             <ObjectReveal 
              src={PRODUCT_IMAGE} 
              delay={0} 
              style={{ width: '80%', height: '100%', zIndex: 1, filter: 'blur(10px) brightness(0.4)' }} 
            />
            <GlassPanel intensity={20} style={{ width: '600px', height: '300px', zIndex: 10, borderRadius: '20px' }}>
              <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                <ElegantTypography text="T H E   C R O W N" delay={20} className="text-4xl text-white font-medium" />
                <div className="w-12 h-px bg-amber-500/50 my-6" />
                <ElegantTypography text="PRECISION ENGINEERING. TIMELESS DESIGN." type="subtitle" delay={60} className="text-sm text-neutral-300 leading-loose" />
              </div>
            </GlassPanel>
          </AbsoluteFill>
        </Sequence>

        {/* SCENE 4: Outro (18s - 20s) */}
        <Sequence from={540} durationInFrames={60}>
          <AbsoluteFill className="items-center justify-center bg-black">
            <ElegantTypography text="A U R U M" delay={5} className="text-5xl text-amber-500 font-bold tracking-widest" />
          </AbsoluteFill>
        </Sequence>

      </CinematicCamera>
    </AbsoluteFill>
  );
};
