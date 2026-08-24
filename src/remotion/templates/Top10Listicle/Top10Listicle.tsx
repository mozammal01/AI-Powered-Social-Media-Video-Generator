import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { ListItem, ListItemData } from './ListItem';
import { ProgressBar } from '../../animations/ProgressBar';

export const Top10Listicle: React.FC<{
  items: ListItemData[];
  itemDurationInFrames?: number;
}> = ({ items, itemDurationInFrames = 90 }) => {
  return (
    <AbsoluteFill className="bg-neutral-900">
      {items.map((item, index) => {
        const startFrame = index * itemDurationInFrames;
        
        return (
          <Sequence
            key={item.rank}
            from={startFrame}
            durationInFrames={itemDurationInFrames + 10} // overlapping slightly for transitions
          >
            <ListItem
              item={item}
              durationInFrames={itemDurationInFrames + 10}
            />
          </Sequence>
        );
      })}

      <ProgressBar color="bg-red-500" height={16} />
    </AbsoluteFill>
  );
};
