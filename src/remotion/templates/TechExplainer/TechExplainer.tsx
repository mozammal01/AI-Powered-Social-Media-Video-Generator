import React from 'react';
import { AbsoluteFill } from 'remotion';
import { WorkflowScene } from './WorkflowScene';
import { CameraMovement, CameraStop } from '../../animations/CameraMovement';

// Sample camera path through the workflow
const cameraStops: CameraStop[] = [
  { frame: 0, x: 200, y: 150, scale: 1.5 },   // Zoomed in on first node
  { frame: 60, x: 600, y: 150, scale: 1.2 },  // Pan to middle node
  { frame: 130, x: 400, y: 0, scale: 0.8 },   // Zoom out to see everything
  { frame: 200, x: 1300, y: 500, scale: 1.5 },// Zoom in on UI Panel
  { frame: 260, x: 0, y: 0, scale: 1 },       // Reset
];

export const TechExplainer: React.FC = () => {
  return (
    <AbsoluteFill className="bg-black">
      <CameraMovement stops={cameraStops}>
        <WorkflowScene />
      </CameraMovement>
    </AbsoluteFill>
  );
};
