import React from 'react';
import { AbsoluteFill, Sequence, Img } from 'remotion';
import { HeadlineReveal } from '../../animations/HeadlineReveal';
import { LowerThird } from '../../animations/LowerThird';
import { SplitScreenTransition } from '../../animations/SplitScreenTransition';
import { AnimatedWorldMap } from '../../animations/AnimatedWorldMap';
import { BroadcastTimeline } from '../../animations/BroadcastTimeline';
import { ChartAnimation } from '../../animations/ChartAnimation';

export const NewsScene: React.FC = () => {
  return (
    <AbsoluteFill className="bg-neutral-900">
      <Sequence from={0} durationInFrames={120}>
        <AbsoluteFill className="items-center justify-center bg-blue-950">
          <AnimatedWorldMap />
          <HeadlineReveal text="GLOBAL CRISIS" delay={15} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={120} durationInFrames={240}>
        <SplitScreenTransition 
          delay={0}
          leftContent={
            <div className="w-full h-full relative">
              <Img src="https://images.unsplash.com/photo-1541888078875-019623e10bd1?auto=format&fit=crop&w=1080&q=80" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-blue-900/30" />
              <BroadcastTimeline 
                delay={20}
                events={[
                  { time: '08:00', desc: 'Initial Reports' },
                  { time: '10:30', desc: 'Emergency Declared' },
                  { time: '12:00', desc: 'Evacuation Orders' },
                ]}
              />
            </div>
          }
          rightContent={
            <div className="w-full h-full bg-neutral-900 p-24 pt-48 flex flex-col">
              <h2 className="text-white text-3xl font-bold mb-12 uppercase tracking-widest text-center">Market Impact</h2>
              <div className="flex-1">
                <ChartAnimation data={[80, 65, 45, 30, 20, 15, 5]} delay={45} color="bg-red-500" />
              </div>
            </div>
          }
        />
        <LowerThird headline="MARKETS PLUMMET" subheadline="DOW drops 1000 points following emergency declaration" delay={60} />
      </Sequence>
    </AbsoluteFill>
  );
};
