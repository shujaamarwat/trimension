import { Button } from "./ui/button";
import { useEditor } from "../lib/stores/useEditor";
import { useScene } from "../lib/stores/useScene";
import { SceneObject } from "../lib/types";
import { RotateCcw, RotateCw } from "lucide-react";

export function RotateToolbar() {
  const { tool, selectedObjects } = useEditor();
  const { updateObject, currentScene } = useScene();

  const handleRotate = (amount: number) => {
    selectedObjects.forEach((id) => {
      const object = currentScene.objects.find((o) => o.id === id);
      if (object) {
        const newRotation: [number, number, number] = [...object.transform.rotation];
        newRotation[1] += amount;

        updateObject(id, { transform: { ...(object as SceneObject).transform, rotation: newRotation } });
      }
    });
  };

  if (tool !== 'rotate' || selectedObjects.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-lg p-2 flex gap-2">
      <Button size="sm" onClick={() => handleRotate(Math.PI / 12)}>
        <RotateCcw className="h-4 w-4" />
        <span className="ml-2">Anticlockwise</span>
      </Button>
      <Button size="sm" onClick={() => handleRotate(-Math.PI / 12)}>
        <RotateCw className="h-4 w-4" />
        <span className="ml-2">Clockwise</span>
      </Button>
    </div>
  );
}
