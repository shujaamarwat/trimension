import React, { useState, useEffect } from "react";
import { useEditor } from "@/lib/stores/useEditor";
import { useScene } from "@/lib/stores/useScene";

const StatusBar: React.FC = () => {
  const { selectedObjects, snapToGrid } = useEditor();
  const { currentScene } = useScene();
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const calculateFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(calculateFPS);
    };
    
    requestAnimationFrame(calculateFPS);
  }, []);

  const getHint = () => {
    if (selectedObjects.length === 0) {
      return "Click on objects to select them, or drag from the asset library";
    }
    if (selectedObjects.length === 1) {
      return "Use transform tools to move, rotate, or scale the selected object";
    }
    return `${selectedObjects.length} objects selected`;
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-card text-sm text-muted-foreground">
      <div className="flex items-center space-x-4">
        <span>FPS: {fps}</span>
        <span>Objects: {currentScene.objects.length}</span>
        <span>Selected: {selectedObjects.length}</span>
        {snapToGrid && <span className="text-green-600">Grid Snap: ON</span>}
      </div>
      
      <div className="text-right">
        {getHint()}
      </div>
    </div>
  );
};

export default StatusBar;
