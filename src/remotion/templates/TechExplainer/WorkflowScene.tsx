import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AnimatedNode } from '../../animations/AnimatedNode';
import { ConnectingLine } from '../../animations/ConnectingLine';
import { UIPanel } from '../../animations/UIPanel';
import { TypingEffect } from '../../animations/TypingEffect';
import { ChartAnimation } from '../../animations/ChartAnimation';

export const WorkflowScene: React.FC = () => {
  return (
    <AbsoluteFill className="bg-neutral-950 text-white overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Connecting Lines */}
      <ConnectingLine startX={400} startY={300} endX={800} endY={300} delay={30} />
      <ConnectingLine startX={800} startY={300} endX={1200} endY={500} delay={90} />
      <ConnectingLine startX={800} startY={300} endX={1200} endY={100} delay={90} />

      {/* Nodes */}
      <div style={{ position: 'absolute', left: 400 - 60, top: 300 - 60 }}>
        <AnimatedNode title="Data Ingestion" iconName="Database" delay={15} color="bg-cyan-600" />
      </div>
      
      <div style={{ position: 'absolute', left: 800 - 60, top: 300 - 60 }}>
        <AnimatedNode title="Neural Network" iconName="Brain" delay={60} color="bg-purple-600" />
      </div>
      
      <div style={{ position: 'absolute', left: 1200 - 60, top: 500 - 60 }}>
        <AnimatedNode title="Inference" iconName="Cpu" delay={120} color="bg-green-600" />
      </div>

      <div style={{ position: 'absolute', left: 1200 - 60, top: 100 - 60 }}>
        <AnimatedNode title="Global API" iconName="Network" delay={130} color="bg-blue-600" />
      </div>

      {/* UI Panels */}
      <UIPanel title="server.py" delay={45} style={{ position: 'absolute', left: 100, top: 600, width: 450, height: 250 }}>
        <TypingEffect text="import torch\nimport numpy as np\n\ndef process_data(tensor):\n    return tensor.to('cuda')" delay={60} charsPerFrame={1} />
      </UIPanel>

      <UIPanel title="Training Metrics" delay={100} style={{ position: 'absolute', left: 1400, top: 600, width: 400, height: 300 }}>
        <ChartAnimation data={[20, 35, 55, 80, 95, 92, 98]} delay={110} color="bg-purple-500" />
      </UIPanel>

    </AbsoluteFill>
  );
};
