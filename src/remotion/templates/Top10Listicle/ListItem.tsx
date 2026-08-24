import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SplitImageReveal } from '../../animations/SplitImageReveal';
import { RankingCounter } from '../../animations/RankingCounter';
import { KineticText } from '../../animations/KineticText';
import { SwipeTransition } from '../../animations/SwipeTransition';

export interface ListItemData {
  rank: number;
  title: string;
  imageSrc: string;
}

export const ListItem: React.FC<{
  item: ListItemData;
  durationInFrames: number;
}> = ({ item, durationInFrames }) => {
  return (
    <AbsoluteFill className="bg-black">
      <Sequence durationInFrames={durationInFrames}>
        <SwipeTransition type="in" direction="left">
          <AbsoluteFill>
            <SplitImageReveal src={item.imageSrc} />
            <AbsoluteFill className="bg-black/40" />
            
            <AbsoluteFill className="flex flex-col justify-end p-10 pb-20">
              <div className="mb-4">
                <RankingCounter rank={item.rank} />
              </div>
              <KineticText 
                text={item.title} 
                delay={15} 
                className="text-6xl font-black text-white uppercase drop-shadow-lg" 
              />
            </AbsoluteFill>
          </AbsoluteFill>
        </SwipeTransition>
      </Sequence>
    </AbsoluteFill>
  );
};
