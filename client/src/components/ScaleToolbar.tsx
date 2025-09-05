import { Button } from "./ui/button";
import { useEditor } from "../lib/stores/useEditor";
import { useScene } from "../lib/stores/useScene";
import { SceneObject } from "../lib/types";
import { ZoomIn, ZoomOut } from "lucide-react";

export function ScaleToolbar() {
  const { tool, selectedObjects } = useEditor();
  const { updateObject, currentScene } = useScene();

  const handleScale = (amount: number) => {
    selectedObjects.forEach((id) => {
      const object = currentScene.objects.find((o) => o.id === id);
      if (object) {
        const newScale: [number, number, number] = [...object.transform.scale];
        newScale[0] += amount;
        newScale[1] += amount;
        newScale[2] += amount;

        updateObject(id, { transform: { ...(object as SceneObject).transform, scale: newScale } });
      }
    });
  };

  if (tool !== 'scale' || selectedObjects.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-lg p-2 flex gap-2">
      <Button size="sm" onClick={() => handleScale(0.1)}>
        <ZoomIn className="h-4 w-4" />
        <span className="ml-2">Scale Up</span>
      </Button>
      <Button size="sm" onClick={() => handleScale(-0.1)}>
        <ZoomOut className="h-4 w-4" />
        <span className="ml-2">Scale Down</span>
      </Button>
    </div>
  );
}
